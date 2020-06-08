const Discord = require(`discord.js`); //requires Discord.js integration package
const { Client, MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../emoji-characters`); //for emojis

module.exports = (message) => { 
    const embed = new MessageEmbed()
    .setTitle(`Info Commands`)
    .setColor(10231593)
    .setDescription("`server-info`, `user-info`")
    .setFooter("Use `>` before each command!")
    message.channel.send(embed);
}