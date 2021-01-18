const { Command } = require("discord.js-commando");
const fs = require("fs"); 
const { log } = require("../../functions/log.js");

module.exports = class setRole extends Command {
  constructor(client) {
    super(client, {
      name: "setrole",
      group: "admins",
      memberName: "setrole",
      description: "Update role key values",
      guildOnly: true,
      args: [
        {
          key: "type",
          prompt: "What role key would you like to modify?",
          type: "string",
          validate: (type) => {
            if(!type.match(/^[a-zA-Z]+$/)) {
              return "Please enter a proper role key name!";
            }
          }
        },
        {
          key: "role",
          prompt: "What role would you like to set this key to?",
          type: "role",
          examples: ["@Student", "@Moderator"]
        },
      ],
    });
  }

  async run(message, { type, role }) {
    if (this.client.config.role.hasOwnProperty(type)) {
      let localConf = this.client.config;
      localConf.role[type] = role.id;
      fs.writeFile("./config.json", JSON.stringify(localConf, null, 3), (err) => {
        if (err) throw err;
        message.say("Successfully updated role value!");
      });
      log(this.client, this.client.config.channel.auditlogs, { embed: { title: `Role Updated`, description: `${type} => @${role.name}`, color: 323295}});
    } else {
      this.client.error("Could not find that role key", message);
    }
  }
};
