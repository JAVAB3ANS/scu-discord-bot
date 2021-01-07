const { MessageEmbed } = require(`discord.js`); //for embed functionality
const emojiCharacters = require(`../../modules/emoji-characters`); //for emojis 

module.exports = {
    name: 'rules',
    description: 'Here are the server rules!', 
    category: 'Admin',  
    async execute(client, message, args) {   
            const rules_embed = new MessageEmbed() 
            .setColor(client.config.school_color)
            .setTitle("Server Rules:")
            .setDescription(
            `${emojiCharacters.one} No harassment, sexual or otherwise, towards other members. Excessive use of @ mentions falls under the category of harassment.\n\n` +
            `${emojiCharacters.two} Be respectful to your fellow members of the server.\n\n` +
            `${emojiCharacters.three} No spamming or flooding of text messages, emoji, attachments, or links. Excessive use or otherwise spamming of bot commands is punishable at moderator's discretion.\n\n` +			 
            `${emojiCharacters.four} No usage of hate speech, slurs, death threats, racism, or derogatory terms.\n\n` +
            `${emojiCharacters.five} Personal information is given at users' own discretion. No doxxing/harassing people for their private info.\n\n` +
            `${emojiCharacters.six} No porn, graphic/nsfw images, or otherwise sexually explicit content is to be posted. No political discussion may be had within any channel of this server.\n\n` +
            `${emojiCharacters.seven} No impersonation of other server members at any time.\n\n` +
            `${emojiCharacters.eight} No encouragement/boasting of unethical behavior in academics.\n\n` +
            `${emojiCharacters.nine} No refusing to comply with the instructions of a moderator or negotiating other members' terms of punishment. If you have any qualms with your own punishment, please calmly discuss it through PM with a staff member.\n\n` +
            `${emojiCharacters.ten} No usage of any usernames/nicknames that violate the aforementioned rules. Moderators reserve the right to change nicknames without warning if they are in violation of the rules, or if they are not easily pingable with an @ mention.\n\n` +
            `${emojiCharacters.one}${emojiCharacters.one} Dispersing misinformation and trolling is not allowed. Anyone suspected of trolling or abetting the efforts of a troll will be punished.\n\n` +
            `${emojiCharacters.one}${emojiCharacters.two} Please keep discussion to English.\n\n` +
            `${emojiCharacters.one}${emojiCharacters.three} Contact an <@&${client.config.serverRoles.admin}> or <@&${client.config.serverRoles.mod}> before advertising anything.\n\n` +
            `${emojiCharacters.one}${emojiCharacters.four} Do not ping any roles unnecessarily for strange reasons.`)
            .attachFiles([`./assets/scu-background.png`])
            .setImage(`attachment://scu-background.png`)
            .setTimestamp()
            .setFooter("Brought to you by the creators of this Discord server.")
            message.channel.send(rules_embed);
        }
    } 
