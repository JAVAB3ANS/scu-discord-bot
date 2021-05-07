const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = class githubCommand extends Command {
  constructor(client) {
    super(client, {
      name: "github",
      group: "practicality",
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

  async run( message, { username }) {
  
    let response = await fetch(`https://api.github.com/users/${username}`);
    
    if (response.status === 200) {
      let data = await response.json();

      const profileEmbed = new MessageEmbed()
          .setTitle(`__**${data.name}'s GitHub Profile**__`)
          .setDescription(`${data.bio || "none"}`)
          .setThumbnail(`https://avatars3.githubusercontent.com/u/${data.id}?v=4`)
          .addField("Username", data.login, true)
          .addField("Company", data.company || "none", true)
          .addField("Blog", `[${data.name}](${data.blog})` || "none", true)
          .addField("Location", data.location || "none", true)
          .addField("Public Repos", data.public_repos || "none", true)
          .addField("Public Gists", data.public_gists || "none", true)
          .addField("Followers", data.followers || "none", true)
          .addField("Following", data.following || "none", true)
          .addField("\u200B", "\u200B", true)
          .setColor(this.client.config.school_color)
          .setURL(data.html_url);

          message.channel.send(profileEmbed);
    } else {
        this.client.error("Unable to find the mentioned repository. Please make sure you have entered the correct user!", message); 
    }
  }
};
