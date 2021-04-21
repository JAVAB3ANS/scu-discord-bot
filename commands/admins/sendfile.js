const { Command } = require("discord.js-commando"); 
const { log } = require("../../functions/log.js"); 

module.exports = class sendFileCommand extends Command {
  constructor(client) {
    super(client, {
      name: "sendfile",
      group: "admins",
      memberName: "sendfile",
      guildOnly: true,
      description: "Send a file as the bot (SVG files are NOT supported!)",
      oneOf: ["sendfile i.imgur.com/abcdef", "sendfile i.imgur.com/abcdef,i.imgur.com/ghijk,i.imgur.com/lmnop"],
      args: [
        {
          key: "file",
          prompt: "Enter the URL(s) of the file to send. You can send multiple files using a , in between each file URL.",
          type: "string",
        },
      ],
    });
  }

  async run(message, { file }) {
    message.delete({ timeout: 1000 });
    message.channel.send("", {
      files: file.split(","),
    });
    log(this.client, this.client.config.channels.auditlogs, { embed: { title: "Sent file!", description: `Sent filestring ${file} in ${message.channel}`, color: 1231238}});
  }
};
