const { Command } = require("discord.js-commando");
const fs = require("fs");
const { log } = require("../../functions/log.js");

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
          validate: (type) => {
            if(!type.match(/^[a-zA-Z]+$/)) {
              return "Please enter a proper channel key name!";
            }
          }
        },
        {
          key: "channel",
          prompt: "What channel would you like to set this key to?",
          type: "channel",
          oneOf: ["#welcome", "#server-info"]
        },
      ],
    });
  }

  async run(message, { type, channel }) {
    if (this.client.config.channels.hasOwnProperty(type)) {
      let localConf = this.client.config;
      localConf.channels[type] = channel.id;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) { throw err; }
      });
        log(this.client, { embed: { title: "Channel Updated", description: `${type} => #${channel.name}`, color: "GREEN"}});
    } else {
        this.client.error("Could not find that channel key", message);
    }
  }
};