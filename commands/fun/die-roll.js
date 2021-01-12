const { MessageEmbed } = require("discord.js"); //for embed functionality
const { Command } = require("discord.js-commando");

module.exports = class dieRollCommand extends Command {
    constructor(client) {
        super(client, {
          name: "die-roll",
          group: "fun",
          memberName: "die-roll",
          description: "Roll two dice to attempt to get snake eyes!",
          throttling: {
            usages: 2,
            duration: 5,
          }
        });
      } 

    async run( message) {  

        const dice = [1, 2, 3, 4, 5, 6];
        const firstDie = dice[Math.floor(Math.random()*dice.length)];
        const secondDie = dice[Math.floor(Math.random()*dice.length)];

        const embed = new MessageEmbed()  
        .setColor(this.client.config.school_color) 
        .setFooter("Created by the server lords!")
        .setTimestamp()

        if (firstDie === 1 && secondDie === 1) {
            embed
            .setTitle("__**SNAKE EYES**__") 
            .setDescription("YOU GOT SNAKE EYES!")
            .attachFiles(["./assets/snakeeyes.jpg"])
            .setImage("attachments://snakeeyes.jpg"); 
        } else {
            embed
            .setTitle("Here's your roll!") 
            .addField("__**First Die**__", firstDie, true)
            .addField("__**Second Die**__", secondDie, true);  
        }
        message.channel.send(embed);
    }
};