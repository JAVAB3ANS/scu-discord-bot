const Discord = require(`discord.js`); //requires Discord.js integration package
const { Client, MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../emoji-characters`); //for emojis

module.exports = {
	name: 'rules',
    description: 'rules!',
		execute(message, args) { 
            if ((message.member.roles.cache.some(role => role.name == ['Admin' || 'Mod']))) {
                rules_embed = new Discord.MessageEmbed() 
                .setColor(10231598)
                .setTitle("Server Rules:")
                .setDescription(
               `${emojiCharacters.one} No harassment, sexual or otherwise, towards other members. Excessive use of @ mentions falls under the category of harassment.\n
                ${emojiCharacters.two} Be respectful to your fellow members of the server.\n
                ${emojiCharacters.three} No spamming or flooding of text messages, emoji, attachments, or links. Excessive use or otherwise spamming of bot commands is punishable at moderator's discretion.\n			
                ${emojiCharacters.four} No usage of hate speech, slurs, death threats, racism, or derogatory terms. Additionally, any use of offensive or derogatory bot commands (such as the pasta command) is subject to punishment.\n
                ${emojiCharacters.five} Personal information is given at users' own discretion. No doxxing/harassing people for their private info.\n
                ${emojiCharacters.six} No porn, graphic/nsfw images, or otherwise sexually explicit content is to be posted. No political discussion may be had within any channel of this server.\n
                ${emojiCharacters.seven} No impersonation of other server members at any time.\n
                ${emojiCharacters.eight} No encouragement/boasting of unethical behavior in academics.\n
                ${emojiCharacters.nine} No refusing to comply with the instructions of a moderator or negotiating other members' terms of punishment. If you have any qualms with your own punishment, please calmly discuss it through PM with a staff member.\n
                ${emojiCharacters.ten} No usage of any usernames/nicknames that violate the aforementioned rules. Moderators reserve the right to change nicknames without warning if they are in violation of the rules, or if they are not easily pingable with an @ mention.\n
                ${emojiCharacters.one}${emojiCharacters.one} Dispersing misinformation and trolling is not allowed. Anyone suspected of trolling or abetting the efforts of a troll will be punished.\n
                ${emojiCharacters.one}${emojiCharacters.two} Please keep discussion to English.\n
                ${emojiCharacters.one}${emojiCharacters.three} Contact an Admin or Moderator before advertising anything.\n
                ${emojiCharacters.one}${emojiCharacters.four} Do not ping @ Admin or @ Moderator for strange reasons.`)
                .attachFiles([`./assets/scu-background.png`])
                .setImage(`attachment://scu-background.png`)
                .setTimestamp()
                .setFooter("Brought to you by the creators of this Discord server.", 'https://jasonanhvu.github.io/scu-discord-bot/')
                message.channel.send(rules_embed);
            } else {
                const embed = new Discord.MessageEmbed()
                .setColor(10231598)
                .setTitle(`Oops, an error happened...`)
                .setDescription(`You don't have permission to perform this command!`)
                .attachFiles([`./assets/no-perm.gif`])
                .setImage(`attachment://no-perm.gif`)
                .setTimestamp()
                message.channel.send(embed)
                .then(msg => {
                    msg.delete({ timeout: 2000 })
                })
                .catch(err => console.log(`Error: ${err}`));
            }
        }
}