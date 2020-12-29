const fetch = require(`node-fetch`);
const { MessageEmbed } = require(`discord.js`);
let sendMessage = require(`../../modules/sendMessage.js`);

module.exports = {
    name: "github",
    description: "Get someone's GitHub profile information!",
    args: true,
    usage: `[username]`,
    category: 'Utility',
    async execute (client, message, args) {

        try {
            const username = args[0].toLowerCase().split(" ");
            let response = await fetch(`https://api.github.com/users/${username}`);
            let data = await response.json();

            if (data.name == null) return; //returns on invalid usernames

            const profileEmbed = new MessageEmbed()
                profileEmbed.setTitle(`__**${data.name}'s GitHub Profile**__`)
                profileEmbed.setDescription(`${data.bio || 'none'}`)
                profileEmbed.setThumbnail(`https://avatars3.githubusercontent.com/u/${data.id}?v=4`)
                profileEmbed.addField(`Username`, data.login, true)
                profileEmbed.addField(`Company`, data.company || 'none', true)
                profileEmbed.addField(`Blog`, `[${data.name}](${data.blog})` || 'none', true)
                profileEmbed.addField(`Location`, data.location|| 'none', true)
                profileEmbed.addField(`Public Repos`, data.public_repos || 'none', true)
                profileEmbed.addField(`Public Gists`, data.public_gists || 'none', true)
                profileEmbed.addField(`Followers`, data.followers || 'none', true)
                profileEmbed.addField(`Following`, data.following || 'none', true)
                profileEmbed.addField(`\u200B`, `\u200B`, true)
                profileEmbed.setColor(client.config.school_color)
                profileEmbed.setURL(data.html_url)

            message.channel.send(profileEmbed);
        } catch(err) {
            sendMessage(client, client.config.channels.auditlogs, {embed: {description: `The following user - ${username} - does not exist.`, color: client.config.school_color}})
            console.log(err => `Error: ${err}`)
        }
    }
}