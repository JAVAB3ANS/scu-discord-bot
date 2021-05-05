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
            if(id.match(/^[0-9]*$/)) {
              return true;
            } else {
                return "Please enter a proper snowflake!"
            }
          }
        },
        {
          key: "title",
          prompt: "Please provide some title text.",
          type: "string",
        },

        {
          key: "body",
          prompt: "Please provide some body text.",
          type: "string",
        },
        {
          key: "color",
          prompt: "Please provide some color.",
          type: "string",
        },
        {
  	  key: "image",
  	  prompt: "Please provide an image URL.",
	  type: "string",
        },
        {
          key: "footer",
          prompt: "Please provide some footer text.",
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
		footer: footer,
		image: image
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
          announceChannel.send({ embed: { title: title, description: body, footer: footer, image: image, color: color } });
        } catch (e) {
          return this.client.error(e, message);
        }
        break;
    }
    message.delete();
  }
}; 
