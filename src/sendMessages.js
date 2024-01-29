const sendMessages = async (destinations, message, client, callback) => {
  client.on("message", async (message) => {
    const getRandomNumber = () => Math.floor(Math.random() * 15000);
    let randomNumber = 0;
    // let secondRandomNumber = Math.floor(Math.random() * 2000 + 1000);
    async function sendMessage(line, randomInt) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          await client.sendMessage(line + "@c.us", message);
          resolve();
        }, randomInt);
      });
    }
    for (const line of destinations) {
      await sendMessage(line, randomNumber);
      randomNumber += getRandomNumber();
    }

    callback(true);
  });
};
module.exports = sendMessages;
