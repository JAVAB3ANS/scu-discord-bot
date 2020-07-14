const Discord = require(`discord.js`); //requires Discord.js integration package
const { Client, MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../emoji-characters`); //for emojis

module.exports = {
	name: 'motto',
	description: 'motto!',
		execute(message, args) { 
            const embed = new MessageEmbed()
            .setColor(10231598)
            .setTitle(`SCU Motto`)
            .setDescription(`Ad Majorem Dei Gloriam - For the Greater Glory of God`)
            .attachFiles([`./assets/scu-mission.png`])
            .setImage(`attachment://scu-mission.png`)
            message.channel.send(embed);
        }
}