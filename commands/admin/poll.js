const { MessageEmbed } = require(`discord.js`); 

module.exports = {
    name: 'poll',
    description: 'Make a poll with results!',
    category: 'Admin',  
	    async execute(client, message, args) {  
				const pollArgs = message.content.match(/(?:("|')[^("|')]*("|')|^[^("|')]*$)/g);
				const options = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
				const pollQuestion = pollArgs.shift();
				let pollString = '';
					
				if (pollArgs.length === 0) {
					message.reply({ embed: { description: `Please format like this: \`"question" "choice 1" "choice 2" ...\``, color: client.config.school_color}});
					return;
				} else if (pollArgs.length > 10) {
					message.reply({ embed: { description: `You've added too many choices - the limit is 10!`, color: client.config.school_color}});
					return;
				} 
				pollArgs.forEach((choice, index) => {
					pollString += `${options[index]}: ${choice}\n\n`;
				});

				const embed = new MessageEmbed()
				.setTitle(pollQuestion.replace(/['"]+/g, ''))
				.setDescription(pollString.replace(/['"]+/g, ''))
				.setColor(client.config.school_color)
				
				message.channel.send(embed).then(r => {
					for (let i = 0; i < pollArgs.length; i++) {
						r.react(options[i]);
					}
				}); 
        }
}
