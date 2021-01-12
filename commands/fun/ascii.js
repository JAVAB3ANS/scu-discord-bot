const figlet = require("figlet");
const { Command } = require("discord.js-commando");

module.exports = class asciiCommand extends Command {
    constructor(client) {
		super(client, {
		  name: "ascii",
		  group: "fun",
		  memberName: "ascii",
		  description: "Converts text to ascii!",
		  throttling: {
			usages: 2,
			duration: 5,
		  },
		  args: [
			{
			  key: "text",
			  prompt: "Enter string!",
			  type: "string",
			  validate: (text) => {
				  if(text.length > 2000) {
					  return "Enter string below 2000 characters!"; 
				  }
			  }
			},
		  ],
		});
	  }

    async run ( message, { text }){

        text = message.content.join(" ");

        figlet.text(text, function (err, data) {  
            message.channel.send({ embed: { description: `\`\`\`${data}\`\`\` `, color: this.client.config.school_color}});
        });
    }
};
