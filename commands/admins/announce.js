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
          key: "title",
          prompt: "Please provide some title text.",
          type: "string",
          validate: (title) => {
            if (title.length < 256) {
              return true;
            } else {
                return "Please enter embed title under 256 characters!"
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
        {
          key: "color",
          prompt: "Please provide some color.",
          type: "string",
        },
        {
          key: "image",
          prompt: "Please provide an image URL.",
          type: "string",
          validate: (image) => {
            if (image.match(/([a-z\-_0-9\/\:\.]*\.(jpg|jpeg|png|gif))/i)) {
              return true;
            } else {
                return "Please enter a proper image URL with the listed extensions!";
            }
          }
        },
        {
          key: "footer",
          prompt: "Please provide some footer text.",
          type: "string",
          validate: (footer) => {
            if (footer.length < 2048) {
              return true;
            } else {
                return "Please enter embed footer under 2048 characters!";
            }
          }
        },
 
      ],
    });
  }

  async run(message, { option, id, title, body, color, image, footer }) {
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
          announceChannel.send({ embed: { title: title, description: body, image: { url: image }, footer: { text: footer }, color: color } });
        } catch (e) {
          return this.client.error(e, message);
        }
        break;    }
    message.delete();
  }
};