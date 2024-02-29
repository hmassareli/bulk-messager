import makeWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  ConnectionState,
  delay,
  S_WHATSAPP_NET,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import MAIN_LOGGER from "@whiskeysockets/baileys/lib/Utils/logger";
import WebSocket from "ws";
import fs from "fs";
import path from "path";
import { Boom } from "@hapi/boom";

const logger = MAIN_LOGGER.child({});
logger.level = "trace";

interface BulkMessage {
  to: string[];
  message: string;
}

interface BaileysConfig {
  sessionId: string;
  wsClient: WebSocket;
  onQR: (qr: string) => void;
  onConnected: () => void;
  onSocketDisconnect: () => void;
  onSocketBulkRequest: (bulkMessage: BulkMessage) => void;
}

type MakeWASocketReturn = ReturnType<typeof makeWASocket>;

export const wrapBaileysSocket = async () => {
  let waSock: MakeWASocketReturn;

  const createBaileys = async ({
    sessionId,
    wsClient,
    onQR,
    onConnected,
    onSocketDisconnect,
    onSocketBulkRequest,
  }: BaileysConfig): Promise<MakeWASocketReturn> => {
    const authFolder = `baileys_auth_info/${sessionId}`;
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);

    // SERVER
    wsClient.onclose = () => {
      try {
        fs.rmSync(path.join("baileys_auth_info", sessionId), {
          recursive: true,
          force: true,
        });
      } catch (err) {
        console.log(err);
      }
    };

    wsClient.onmessage = async (e) => {
      const event = JSON.parse(e.data.toString());
      const type = event.type;
      const data = event.data;

      if (type === "SEND_BULK") {
        const bulkData = data as BulkMessage;
        await sendMessageWTyping(waSock, bulkData.to, bulkData.message);
        onSocketBulkRequest(bulkData);
      }
    };

    // BAILEYS
    waSock = makeWASocket({
      printQRInTerminal: false,
      syncFullHistory: false,
      shouldSyncHistoryMessage: () => false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
    });

    waSock.ev.on("creds.update", async () => await saveCreds());

    const listener = async (update: Partial<ConnectionState>) => {
      const { connection, lastDisconnect, qr } = update;

      console.log("===== CONNECTION UPDATE =====");
      const jsonUpdate = JSON.stringify(update);
      const logMessage = `${jsonUpdate} connection update: ${connection} ${lastDisconnect}`;
      console.log(logMessage);

      if (qr) {
        console.log("===== QR CODE =====");
        console.log(qr);
        onQR(qr);
      }

      if (connection === "open") onConnected();

      if (connection === "close") {
        const error = lastDisconnect?.error;
        const shouldReconnect =
          (error as Boom)?.output.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          const newBaileys = await createBaileys({
            sessionId,
            wsClient: wsClient,
            onQR,
            onConnected,
            onSocketDisconnect,
            onSocketBulkRequest,
          });

          waSock = newBaileys;

          waSock.ev.off("connection.update", listener);
          return newBaileys;
        } else {
          waSock.ev.off("connection.update", listener);
          throw error;
        }
      }
    };

    waSock.ev.on("connection.update", listener);

    return waSock;
  };

  return createBaileys;
};

const sendMessageWTyping = async (
  waSock: MakeWASocketReturn,
  to: string[],
  message: string
) => {
  console.log("===== SENDING MESSAGE =====");
  console.log(`To: ${to}`);
  console.log(`Message: ${message}`);
  console.log("===========================");
  for (const jid of to) {
    const waJid = jid + S_WHATSAPP_NET;

    await waSock.presenceSubscribe(waJid);
    await delay(500);

    await waSock.sendPresenceUpdate("composing", waJid);
    await delay(2000);

    await waSock.sendPresenceUpdate("paused", waJid);

    await waSock.sendMessage(waJid, { text: message });
  }
};
