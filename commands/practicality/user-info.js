const { Command } = require("discord.js-commando");

module.exports = class userInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "user-info",
      group: "practicality",
      memberName: "user-info",
      description: "Get general user info",
      throttling: {
        usages: 2,
        duration: 5,
      },
      args: [
        {
          key: "user",
          prompt: "Enter a user to lookup",
          type: "member",
        },
      ],
    });
  }

  async run( message, { user }) {
    message.channel.send({
      embed: {
        title: `${user.user.tag}`,
        thumbnail: {
          url: `${user.user.displayAvatarURL()}`,
        },
        timestamp: Date.now(),
        color: this.client.config.school_color,
        footer: {
          text: `${this.client.config.prefix}user command`,
        },
        fields: [
          { name: "Nickname", value: `${user.nickname || "N/A"}`, inline: true },
          { name: "Bot Account", value: `${user.user.bot || "No"}`, inline: true },
          { name: "Highest Role", value: `${user.roles.highest.name}`, inline: true },
          { name: `Joined ${user.guild.name.split(0, 15)}`, value: `${user.joinedAt}`, inline: false },
          { name: "Account Created", value: `${user.user.createdAt}`, inline: false },
        ],
      },
    });
  }
};