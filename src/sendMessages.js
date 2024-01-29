const sendMessages = async (destinations, message, client) => {
  client.on("message", (message) => {
    const getRandomNumber = () => Math.floor(Math.random() * 15000);
    let randomNumber = 0;
    // let secondRandomNumber = Math.floor(Math.random() * 2000 + 1000);
    async function sendMessages(line, randomInt) {
      setTimeout(() => {
        client.sendMessage(line + "@c.us", message);
      }, randomInt);
    }
    destinations.map((line) => {
      await sendMessages(line, randomNumber);
      randomNumber += getRandomNumber();
    });
    
    return 
  });
};
module.exports = sendMessages;
