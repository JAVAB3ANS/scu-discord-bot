const { MessageEmbed } = require("discord.js"); //for embed functionality 
const { Command } = require("discord.js-commando");

module.exports = class randomColorCommand extends Command {
  constructor(client) {
    super(client, {
        name: "random-color",  
        description: "Generate a random color!",  
        group: "utility",
        memberName: "random-color",
        throttling: {
            usages: 2,
            duration: 5,
        },
    });
  }
    async run ( message) {
    
        const randomNumber = Math.floor(Math.random()*16777215).toString(16);

        function hexToDec(randomNumber){
            return parseInt(randomNumber, 16);
        }

        const randomNumberEmbed = new MessageEmbed()
        .setColor(randomNumber)
        .setTitle("Here's your random color!")
        .setDescription(`- Hexadecimal Value: #${randomNumber}\n` + "- Decimal Value: " + hexToDec(randomNumber));


        message.channel.send(randomNumberEmbed);
        }
};