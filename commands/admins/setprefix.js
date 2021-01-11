const { Command } = require("discord.js-commando");
const fs = require("fs");
let { sendMessage } = require(`../../modules/sendMessage.js`); 

module.exports = class setPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setprefix",
      group: "admins",
      memberName: "setprefix",
      description: "Change the server prefix (mention will always work)",
      guildOnly: true,
      args: [
        {
          key: "newPrefix",
          prompt: "Please choose the new prefix you want to set.",
          type: "string",
        },
      ],
    });
  }

  async run(message, { newPrefix }) {
    if (this.client.config.prefix !== newPrefix) {
      let localConf = this.client.config;
      localConf.prefix = newPrefix;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) throw err;
        sendMessage(this.client, this.client.config.channels.auditlogs, { embed: { description: `Successfully updated prefix to \`${newPrefix}\``, color: this.client.config.school_color}});
      });
       
    } else {
        sendMessage(this.client, this.client.config.channels.auditlogs, { embed: { title: "That already is the current prefix!", description: message, color: "RED"}});
    }
  }
};