const Discord = require(`discord.js`); //requires Discord.js integration package
const { Client, MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../emoji-characters`); //for emojis

module.exports = {
	name: 'act-of-contrition',
	description: 'act-of-contrition!',
		execute(message, args) { 
    const embed = new MessageEmbed()
            .setTitle(`Act of Contrition`)
            .setColor(10231598)
            .attachFiles(`./assets/act-of-contrition.jpg`)
            .setImage(`attachment://act-of-contrition.jpg`)
            .setDescription('O my God, I am heartily sorry for having offended You. I detest all my sins because of your just punishments, but most of all because they offend you, My ' +
                            'God, who are all good and worthy of all my love. I firmly resolve, with the help of Your grace, to sin no more and to avoid the near occasions of sin. Amen.')
            message.channel.send(embed);
        }
}