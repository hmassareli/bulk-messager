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
async function connectToWhatsApp({ uuid, onConnect, onQR }) {
  const { state, saveCreds } = await useMultiFileAuthState(
    "baileys_auth_info/" + uuid
  );

  const sock = makeWASocket({
    printQRInTerminal: false,
    syncFullHistory: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
  });

  const sendMessageWTyping = async (msg, jid) => {
    await sock.presenceSubscribe(jid);
    await delay(500);

    await sock.sendPresenceUpdate("composing", jid);
    await delay(2000);

    await sock.sendPresenceUpdate("paused", jid);

    await sock.sendMessage(jid, msg);
  };

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
        connectToWhatsApp({ uuid, onConnect, onQR });
      } else {
        onClose();
      }
    }

    if (connection === "open") {
      console.log("opened connection");
      onConnect();
      sendMessageWTyping(
        { text: "Hello, World!" },
        "5512991944059@s.whatsapp.net"
      );
    }
  });

  return {
    sock,
    // sendMessage: (jid, message) => {
    //   const msg = {
    //     text: message,
    //   };
    //   sock.sendMessage(jid, msg);
    //   // sendMessageWTyping(
    //   //   { text: "Deu certo dessa vez..." },
    //   //   "5512991944059@s.whatsapp.net"
    //   // );
    //   console.log(
    //     "jid: " +
    //       jid +
    //       " message: " +
    //       message +
    //       "chamou o sendMessage corretamente eu acho"
    //   );
    //   // try {
    //   //   sendMessageWTyping({ text: message }, jid);
    //   // } catch (error) {
    //   //   console.log(error);
    //   // }
    // },
    // close: () => {
    //   // remove the folder with the uuid
    //   fs.rmSync(path.join("baileys_auth_info", uuid), {
    //     recursive: true,
    //     force: true,
    //   });
    //   // sock.close();
    // },
  };
}

module.exports = connectToWhatsApp;
