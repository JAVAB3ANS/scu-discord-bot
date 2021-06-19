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
		});
	  }

    async run ( message ) {

        let text = message.content.split(" ").slice(1).join(" ");

	if (!text || text.length > 13) return message.channel.send("You didn't say any text or the given text wasn't within 12 characters!");

        figlet.text(text, function (err, data) {  
            message.channel.send({ embed: { description: `\`\`\`${data}\`\`\` `}});
        });
    }
};
