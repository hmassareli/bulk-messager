const makeWASocket = require("@whiskeysockets/baileys").default;
const crypto = require("crypto");
const {
  DisconnectReason,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
} = require("@whiskeysockets/baileys");
const MAIN_LOGGER = require("@whiskeysockets/baileys/lib/Utils/logger").default;
const fs = require("fs");
const path = require("path");

const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Connects to WhatsApp by creating a socket connection.
 *
 * @param {() => string} onConnect - Callback for when connected
 * @param {(qr: string) => string} onQR - Callback for scanning QR code
 */
async function connectToWhatsApp({
  uuid,
  onQR,
  onConnect,
  onRequestClose,
  request,
}) {
  const { state, saveCreds } = await useMultiFileAuthState(
    "baileys_auth_info/" + uuid
  );

  request.raw.on("close", onRequestClose);

  const sock = makeWASocket({
    printQRInTerminal: false,
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false,
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
    console.log(
      JSON.stringify(update) +
        "connection update:" +
        connection +
        " " +
        lastDisconnect
    );
    if (qr) onQR(qr);
    if (connection === "open") {
      onConnect();
    }
  });

  return new Promise((resolve, reject) => {
    const listener = (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === "open") {
        resolve(sock);
        sock.ev.off("connection.update", listener);
      }

      if (connection === "close") {
        const error = lastDisconnect?.error;
        const shouldReconnect =
          error?.output.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          resolve(connectToWhatsApp({ uuid, onQR, onConnect }));
          sock.ev.off("connection.update", listener);
        } else {
          reject(error);
          sock.ev.off("connection.update", listener);
        }
      }
    };

    sock.ev.on("connection.update", listener);
  });
}

module.exports = connectToWhatsApp;
