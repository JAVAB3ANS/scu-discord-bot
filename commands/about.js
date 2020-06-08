const Discord = require(`discord.js`); //requires Discord.js integration package
const { Client, MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../emoji-characters`); //for emojis

module.exports = (message) => { 
    const embed = new MessageEmbed()
    .setColor(10231598)
    .setTitle(`About Commands`)
    .setDescription("`mission`, `values`, `motto`, `vision`")
    .setFooter("Use `>` before each command!")
    message.channel.send(embed)
}