/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const sendMessages = require("./src/sendMessages");
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "bot-zdg" }),
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


fastify.get("/qr", async function (request, reply) {
  const headers = {
'Content-Type': 'text/event-stream',
Connection: 'keep-alive',
'Cache-Control': 'no-cache'
};
reply.raw.writeHead(200, headers);
  

  try {
    let qr = await new Promise((resolve, reject) => {
      client.once("qr", (qr) => {
        resolve(qr);
        console.log("qr created: " + qr);
      });

      setTimeout(() => {
        reject(new Error("QR event wasn't emitted in 60 seconds."));
      }, 60000);
    });
    reply.raw.write(`data: ${JSON.stringify({ type: 'qr', qrCode: qr })}\n\n`);
  } catch (err) {
    reply.send(err.message);
  }
  client.on("ready", () => {
    console.log("client is ready!!")
    reply.raw.write(`data: ${JSON.stringify({ type: 'ready' })}\n\n`);
  });
})


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
