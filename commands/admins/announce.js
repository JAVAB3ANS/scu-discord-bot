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
      // format: "announce [#channel] [message goes here]\nannounce edit [message id] [new message]\nannounce append [message id] [text to append\nannounce embed [embed JSON]",
      // examples: [""],
      args: [
        {
          key: "option",
          prompt: "Please choose a valid option \`msg, embed, edit\`",
          type: "string",
          oneOf: ["edit", "append", "embed"],
        },
        {
          key: "id",
          prompt: "Please provide a message id to edit or mention a channel to send this message to",
          type: "string",
          validate: (id) => {
            if(id.match(/^[0-9]*$/)) {
              return true;
            } else {
                return "Please enter a proper snowflake!"
            }
          }
        },
        {
          key: "title",
          prompt: "Please provide some title text (embed format)",
          type: "string",
        },

        {
          key: "body",
          prompt: "Please provide some body text (embed format)",
          type: "string",
        },
        {
          key: "color",
          prompt: "Please provide some color text (embed format)",
          type: "string",
        },
        {
          key: "footer",
          prompt: "Please provide some body footer (embed format)",
          type: "string",
        },
 
      ],
    });
  }

  async run(message, { option, id, title, body, color, footer }) {
    switch (option) {
      case "edit":
        try {
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: {
		title: title,
                description: body,
		color: color,
		footer: footer
              },
            });
          });
        } catch (e) {
          return this.client.error(e + "Channel not found, you must run in same channel as message!", message);
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
          return this.client.error("Channel not found, you must run in same channel as message!", message);
        }
        break; 
      case "embed":
        try {
          let announceChannel = this.client.channels.cache.get(`${id.replace(/</g, "").replace(/>/g, "").replace(/#/g, "")}`);
          announceChannel.send({ embed: { title: title, description: body, footer: footer, color: color } });
        } catch (e) {
          return this.client.error(e, message);
        }
        break;
    }
    message.delete();
  }
}; 
