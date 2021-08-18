const { Command } = require("discord.js-commando");

module.exports = class announceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "announce",
      group: "admins",
      memberName: "announce", 
      throttling: {
          usages: 2,
          duration: 5,
			},
      description: "Make a formatted announcement using embed data", 
      args: [
        {
          key: "option",
          prompt: "Please choose a valid option \`edit, append, embed\`",
          type: "string",
          oneOf: ["edit", "append", "embed"],
        },
        {
          key: "id",
          prompt: "Please provide a message id to edit or mention a channel to send this message to",
          type: "string",
          validate: (id) => {
            if(id.match(/^[0-9]*$/) && id.length === 18) {
              return true;
            } else {
                return "Please enter a proper snowflake!"
            }
          }
        }, 
        {
          key: "body",
          prompt: "Please provide some body text.",
          type: "string",
          validate: (body) => {
            if (body.length < 2048) {
              return true;
            } else {
                return "Please enter embed description under 2048 characters!";
            }
          } 
        }, 
      ],
    });
  }

  async run(message, { option, id, body }) {
    switch (option) {
      case "edit":
        try {
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: JSON.parse(body) 
            });
          });
        } catch (e) {
            if (e === "DiscordAPIError: Unknown Message") {
              return this.client.error(e, message);
            }
        }
        break;
      case "append":
        try {
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: {
                description: m.embeds[0].description + " " + body,
              },
            });
          });
        } catch (e) {
            return this.client.error(e, message);
        }
        break; 
      case "embed":
        try {
          let announceChannel = this.client.channels.cache.get(`${id.replace(/</g, "").replace(/>/g, "").replace(/#/g, "")}`);
          announceChannel.send({
            embed: JSON.parse(body),
          });
        } catch (e) {
            if (e === "RangeError [COLOR_RANGE]: Color must be within the range 0 - 16777215 (0xFFFFFF).") {
              return this.client.error(e, message);
            };
        }
        break;    
    }
    message.delete();
  }
}; 