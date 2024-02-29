const connectToWhatsApp = require("./src/baileys");
const jidWADomain = require("@whiskeysockets/baileys").S_WHATSAPP_NET;
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const fastify = require("fastify")({ logger: false });

const sendMessageWTyping = async (msg, jid) => {
  await sock.presenceSubscribe(jid);
  await delay(500);

  await sock.sendPresenceUpdate("composing", jid);
  await delay(2000);

  await sock.sendPresenceUpdate("paused", jid);

  await sock.sendMessage(jid, msg);
};
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

fastify.register(require("@fastify/formbody"));

const clientQueue = {};

const bulkMessagesJsonSchema = {
  type: "object",
  required: ["numbers", "message", "clientId"],
  properties: {
    numbers: {
      type: "array",
      items: { type: "integer" },
    },
    message: { type: "string" },
  },
};

const schema = {
  body: bulkMessagesJsonSchema,
};
fastify.post("/bulk-messages", schema, async function (request, reply) {
  if (request.body) {
    const { numbers, message, clientId } = request.body;
    console.log(clientId, clientQueue);
    const client = clientQueue[clientId];
    client.sendMessage(numbers[0] + jidWADomain, { text: message });

    // client.sendMessage(numbers[0] + jidWADomain, message);
    reply.send({ data: "Opa deu certo!" });
  }
});

fastify.get("/qr", async function (request, reply) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  reply.raw.writeHead(200, headers);

  console.log("---------------------------");
  const clientUuid = crypto.randomUUID();
  console.log(crypto.randomUUID);
  console.log(clientUuid);
  const config = {
    request,
    uuid: clientUuid,
    onConnect: () => {
      console.log("Client is authenticated");
      reply.raw.write(
        `data: ${JSON.stringify({ type: "ready", id: clientUuid })}\n\n`
      );
    },
    onQR: (qr) => {
      reply.raw.write(
        `data: ${JSON.stringify({ type: "qr", qrCode: qr })}\n\n`
      );
      console.log("qr created: " + qr);
    },
    onClose: () => {
      reply.raw.write(`data: ${JSON.stringify({ type: "close" })}\n\n`);
    },
    onRequestClose: () => {
      console.log("Connection closed");
      try {
        fs.rmSync(path.join("baileys_auth_info", clientUuid), {
          recursive: true,
          force: true,
        });
        delete clientQueue[clientUuid];
      } catch (err) {
        console.log(err);
      }
    },
  };
  console.log(config);
  console.log("---------------------------");

  clientQueue[clientUuid] = await connectToWhatsApp(config);
  console.log(JSON.stringify(clientQueue) + " ---_______________------ ");

  try {
  } catch (err) {
    reply.raw.write(`data: ${JSON.stringify({ type: "error" })}\n\n`);
  }
});

// Run the server and report out to the logs
fastify.listen({ port: 3000, host: "0.0.0.0" }, function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Your app is listening on ${address}`);
});
