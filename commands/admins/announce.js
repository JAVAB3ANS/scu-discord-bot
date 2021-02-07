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
      description: "Make a formatted announcement using Embed data",
      // format: "announce [#channel] [message goes here]\nannounce edit [message id] [new message]\nannounce append [message id] [text to append\nannounce embed [embed JSON]",
      // examples: [""],
      args: [
        {
          key: "option",
          prompt: "Please choose a valid option \`msg, embed, append, edit\`",
          type: "string",
          oneOf: ["edit", "append", "embed", "msg"],
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
          key: "body",
          prompt: "Please provide some body text (embed format)",
          type: "string",
        },
      ],
    });
  }

  async run(message, { option, id, body }) {
    const announceChannel = this.client.channels.cache.get(`${id.replace(/</g, "").replace(/>/g, "").replace(/#/g, "")}`);
    switch (option) {
      case "edit": 
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: {
                description: body, 
              },
            });
          }); 
        break;
      case "append": 
          message.channel.messages.fetch(id).then((m) => {
            m.edit({
              embed: {
                description: m.embeds[0].description + " " + body, 
              },
            });
          }); 
        break;
      case "embed":  
          announceChannel.send({ embed: JSON.parse(body)}); 
          break;
      case "msg": 
          announceChannel.send(body);
 
          break;
    } 
  } 
}; 
