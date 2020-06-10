const Discord = require(`discord.js`); //requires Discord.js integration package
const { Client, MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../emoji-characters`); //for emojis

module.exports = async (message) => { 
    if (message.member.hasPermission("KICK_MEMBERS")) {
        const admin_embed = new MessageEmbed()
        .setColor(10231598)
        .setTitle(`Admin Commands`)
        .setDescription("`ban`, `kick`, `rules`, `server-info`")
        .setFooter("Use `>` before each command!")
        message.channel.send(admin_embed)
    } else {
        const permission_embed = new MessageEmbed()
        .setColor(10231598)
        .setTitle(`Oops, an error happened...`)
        .setDescription(`You don't have permission to perform this command!`)
        .setImage(`https://media1.tenor.com/images/9277c9be9e3d7a953bb19bfacf8c1abf/tenor.gif?itemid=12620128`)
        message.channel.send(permission_embed)
        .then(msg => {
            msg.delete({ timeout: 5000 })
          })
        .catch(err => console.log(`Error: ${err}`));
    } 
}