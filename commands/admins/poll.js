const { MessageEmbed } = require("discord.js"); 
const { Command } = require("discord.js-commando");

module.exports = class pollCommand extends Command {
    constructor(client) {
        super(client, {
            name: "poll",
	    group: "admins",
            memberName: "poll",
            description: "Create a poll with reactions!!",   
	    	guildOnly: true, 
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
	}   
	
	async run( message ) {  
		try {
			const options = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
			const pollArgs = message.content.match(/\[.*?\]/g);
			const pollQuestion = pollArgs.shift();
			let pollString = "";
				
			if (pollArgs.length === 0) {
				return message.reply({ embed: { description: "Please format like this: \`\`\`[question] [choice 1] [choice 2] [choice ...]\`\`\``", color: this.client.config.school_color}});
			} else if (pollArgs.length > 10) {
				return message.reply({ embed: { description: "You've added too many choices - the limit is 10!", color: this.client.config.school_color}});
			} 

			pollArgs.forEach((choice, index) => {
				pollString += `${options[index]}: ${choice}\n\n`;
			});

			const embed = new MessageEmbed()
			.setTitle(pollQuestion.replace(/[\[\]']+/g, ''))
			.setDescription(pollString.replace(/[\[\]']+/g, ''))		
			.setColor(this.client.config.school_color);
			
			message.channel.send(embed).then((r) => {
				for (let i = 0; i < pollArgs.length; i++) {
					r.react(options[i]);
				}
			}); 
		} catch (err) {
			if (err) return this.client.error("Enter like this: \`\`\`[question] [choice 1] [choice 2] [choice n...]\`\`\`", message);
		}
	}	
};
