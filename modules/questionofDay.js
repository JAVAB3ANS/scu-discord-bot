module.exports.run = async (client) => {
  const { MessageEmbed } = require(`discord.js`);
  const request = require('request');
  const sendMessage = require(`../modules/sendMessage.js`);
  const botReady = true; 
  
  const questionMSG = {
    title: "Question of the Day Ready!",
    description: `[Question of the Day](${client.config.api.questionofDay}) works! ✅`,
    color: "GREEN", 
    timestamp: new Date()
  }
  
  console.log(questionMSG.title);
  sendMessage(client, client.config.channels.auditlogs, { embed: questionMSG});

  setInterval(() => {
    if (botReady) {
      request({
        url: client.config.api.questionofDay,
        json: true,
      }, (error, response, body) => {
        if (!error && response.statusCode === 200) { 
            const options = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
            let questionString = "";
            body.results[0].incorrect_answers.forEach((choice, index) => {
              questionString += `${options[index]}: ${choice}\n\n`;
            });  
            
            questionString += `${options[3]}: ${body.results[0].correct_answer}`

            const questionPost = new MessageEmbed()
            .setColor(client.config.school_color)
            .setAuthor(`Question of the Day`, client.user.displayAvatarURL())
            .setTitle(body.results[0].question) 
            .setDescription(questionString)
            .setFooter(`From the Open Trivia Database!`)
            .setTimestamp(new Date())
        
            sendMessage(client, client.config.channels.questionofDay, questionPost);
        } else {
          sendMessage(client, client.config.channels.auditlogs, { embed: { description: `Request failed. Will continue.`, color: client.config.school_color}});
        }
      });
    }
  }, 54000 * 1000);  
}
