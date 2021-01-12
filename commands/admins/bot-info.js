const { Command } = require("discord.js-commando");
const info = require("../../package.json");

module.exports = class botInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: "bot-info",
            memberName: "bot-info",
            description: "Get bot info!",
            group: "admins",  
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run( message) {
      const botInfo = {
        color: this.client.config.school_color,
        author: {
          name: message.guild.name,
          icon_url: this.client.user.displayAvatarURL()
        },
        url: `${info.homepage}`,
        title: "Bot Information",
        description: `${info.description}`,
        fields: [
          {
            name: "Prefix",
            value: `\`${this.client.config.prefix}\``,
            inline: true
          },
          {
            name: "Version",
            value: `\`${info.version}\``,
            inline: true
          },
          {
            name: "License",
            value: `\`${info.license}\``,
            inline: true
          },
          {
            name: "Dependencies Used",
            value: `${Object.entries(info.dependencies).join(", ")}`,
            inline: false
          },
        ],
        };
        message.channel.send({embed: botInfo});
      }
  };
