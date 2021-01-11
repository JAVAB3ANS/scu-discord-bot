const { Command } = require("discord.js-commando");
const fs = require("fs");
let { sendMessage } = require(`../../modules/sendMessage.js`); 

module.exports = class setChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setchannel",
      group: "admins",
      memberName: "setchannel",
      description: "Update channel key values", 
      args: [
        {
          key: "type",
          prompt: "What channel key would you like to modify?",
          type: "string",
        },
        {
          key: "channel",
          prompt: "What channel would you like to set this key to?",
          type: "channel",
        },
      ],
    });
  }

  async run(message, { type, channel }) {
    if (this.client.config.channels.hasOwnProperty(type)) {
      let localConf = this.client.config;
      localConf.channels[type] = channels.id;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) throw err;
        message.say("Successfully updated channel value!");
      });
      sendMessage(this.client, this.client.config.channels.auditlogs, { embed: { title: `Channel Updated`, description: `${type} => #${channel.name}`, color: this.client.config.school_color }});
    } else {
        sendMessage(this.client, this.client.config.channels.auditlogs, { embed: { title: "Could not find that channel key", description: message, color: "RED"}});
    }
  }
};