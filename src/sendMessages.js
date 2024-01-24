const sendMessages = (userMessage, client) => {
  let failedToAnswer = 0;
  let step = 0;
  let destinations;
  client.sendMessage(
    userMessage.from,
    "Por favor, insira o(s) número(s) de telefone que deseja enviar mensagens (somente números, e deve incluir 55 e código de área"
  );

  client.on("message", (message) => {
    let text = message.body.toLowerCase();
    if (text.includes("55") && message.from === userMessage.from) {
      step++;

      text = text.replace(/ /g, "");
      destinations = text.split("\n");
      client.sendMessage(
        userMessage.from,
        "Por favor, insira a mensagem que deseja enviar a esses números"
      );
    } else {
      if (step === 1 && message.from === userMessage.from) {
        step++;
        let textToSend = message.body;
        client.sendMessage(
          userMessage.from,
          "Entendido, enviando:\n\n" +
            text +
            "\n\n para\n" +
            destinations.toString()
        );
        const getRandomNumber = () => Math.floor(Math.random() * 15000);
        let randomNumber = 0;
        // let secondRandomNumber = Math.floor(Math.random() * 2000 + 1000);
        function sendMessages(line, randomInt) {
          setTimeout(() => {
            client.sendMessage(line + "@c.us", textToSend);
          }, randomInt);
        }
        destinations.map((line) => {
          sendMessages(line, randomNumber);
          randomNumber += getRandomNumber();
        });
      }
      failedToAnswer++;
    }
  });
};
module.exports = sendMessages;
