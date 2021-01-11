const { Command } = require("discord.js-commando");
const { sendMessage } = require(`../../modules/modules.js`);

module.exports = class githubCommand extends Command {
  constructor(client) {
    super(client, {
      name: "github",
      group: "utility",
      memberName: "github",
      description: "Get a user's GitHub profile!",
      throttling: {
        usages: 2,
        duration: 5,
      },
      args: [
        {
          key: "username",
          prompt: "Enter a username to lookup",
          type: "string",
        },
      ],
    });
  }

  async run(client, message, { username }) {

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
                profileEmbed.setColor(this.client.config.school_color)
                profileEmbed.setURL(data.html_url)

                message.channel.send(profileEmbed);
        } catch(err) {
            sendMessage(client, client.config.channels.auditlogs, {embed: {description: `The following user - ${username} - does not exist.`, color: this.client.config.school_color}})
            console.log(err => `Error: ${err}`)
        }
    }
}