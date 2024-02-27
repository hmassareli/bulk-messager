const makeWASocket = require("@whiskeysockets/baileys").default;
const crypto = require("crypto");
const {
  DisconnectReason,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const MAIN_LOGGER = require("@whiskeysockets/baileys/lib/Utils/logger");
const fs = require("fs");
const path = require("path");

const logger = MAIN_LOGGER;
logger.level = "trace";

const sendMessageWTyping = async (msg, jid) => {
  await sock.presenceSubscribe(jid);
  await delay(500);

  await sock.sendPresenceUpdate("composing", jid);
  await delay(2000);

  await sock.sendPresenceUpdate("paused", jid);

  await sock.sendMessage(jid, msg);
};

/**
 * Connects to WhatsApp by creating a socket connection.
 *
 * @param {() => string} onConnect - Callback for when connected
 * @param {(qr: string) => string} onQR - Callback for scanning QR code
 */
async function connectToWhatsApp({ uuid, onConnect, onQR }) {
  const { state, saveCreds } = await useMultiFileAuthState(
    "baileys_auth_info/" + uuid
  );

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
  });

  sock.ev.on("creds.update", async (update) => {
    await saveCreds();
  });

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) onQR(qr);

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log(
        "connection closed due to ",
        lastDisconnect.error,
        ", reconnecting ",
        shouldReconnect
      );

      if (shouldReconnect) {
        connectToWhatsApp();
      } else {
        onClose();
      }
    }

    if (connection === "open") {
      console.log("opened connection");
      onConnect();
    }
  });

  return {
    sendMessage: (jid, message) => {
      sendMessageWTyping(message, jid);
    },
    close: () => {
      // remove the folder with the uuid
      fs.rmSync(path.join("baileys_auth_info", uuid), {
        recursive: true,
        force: true,
      });
      // sock.close();
    },
  };
}

module.exports = connectToWhatsApp;
