/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const sendMessages = require("./src/sendMessages");
const client = new Client({
  puppeteer: {
    headless: true,
    args: ["--no-sandbox"],
  },
});

const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // Set this to true for detailed logging:
  logger: false,
});

// ADD FAVORITES ARRAY VARIABLE FROM TODO HERE

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

// Formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

const bulkMessagesJsonSchema = {
  type: 'object',
  required: ['numbers', 'message'],
  properties: {
    numbers: {
      type: 'array',
      items: { type: 'integer' },
    },
    message: { type: 'string' },
  },
};

const schema = {
    body: bulkMessagesJsonSchema,
  }
fastify.post("/bulk-messages", schema, async function (request, reply){
  
  reply.send({data: "resposta"})
  
})

fastify.get("/qr", async function (request, reply) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  reply.raw.writeHead(200, headers);

  try {
      

      client.on("qr", (qr) => {
        reply.raw.write(
          `data: ${JSON.stringify({ type: "qr", qrCode: qr })}\n\n`
        );

        console.log("qr created: " + qr);

      });
  } catch (err) {
    reply.raw.write(`data: ${JSON.stringify({ type: "error" })}\n\n`);
  }
  
  client.on("authenticated", () => {
    console.log("Client is authenticated");
    reply.raw.write(`data: ${JSON.stringify({ type: "anthenticated" })}\n\n`);
  });
  
  client.on("ready", () => {
    console.log("client is ready!!");
    reply.raw.write(`data: ${JSON.stringify({ type: "ready" })}\n\n`);
  });
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);

client.initialize();
