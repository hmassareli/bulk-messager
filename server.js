const connectToWhatsApp = require("./src/baileys");
const jidWADomain = require("@whiskeysockets/baileys").S_WHATSAPP_NET;

const path = require("path");

const fastify = require("fastify")({ logger: false });

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
    // sendMessages(numbers, message, clientQueue[clientId], (res) => {
    //   if (res) reply.send({ data: "Opa deu certo!" });
    // });
    clientQueue[clientId].sendMessage(numbers[0] + jidWADomain, message);
  }
});

fastify.get("/qr", async function (request, reply) {
  const clientUuid = crypto.randomUUID();

  clientQueue[clientUuid] = connectToWhatsApp({
    onConnect: () => {
      console.log("Client is authenticated");
      reply.raw.write(`data: ${JSON.stringify({ type: "authenticated" })}\n\n`);
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
  });

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  reply.raw.writeHead(200, headers);

  reply.raw.on("close", () => {
    console.log("Connection closed");
    clientQueue[clientUuid].close();
    delete clientQueue[clientUuid];
  });

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
