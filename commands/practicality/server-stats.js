const { MessageEmbed } = require("discord.js"); //for embed functionality 
const { Command } = require("discord.js-commando");

module.exports = class serverStatsCommand extends Command {
    constructor(client) {
        super(client, {
			name: "server-stats",
			group: "practicality",
			memberName: "server-stats",
			description: "Get general server statistics!",
			guildOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
			},
		});
	}
	
    async run ( message) {
			function checkBots(guild) {
				let botCount = 0;
				guild.members.cache.forEach((member) => {
				if(member.user.bot) { botCount++; }
				});
				return botCount;
			}

			function checkMembers(guild) {
				let memberCount = 0;
				guild.members.cache.forEach((member) => {
					if(!member.user.bot) { memberCount++; }
				});
				return memberCount;
			}

			let serverEmbed = new MessageEmbed()
			.setDescription(`__**${message.guild.name} - Statistics**__`)
			.setColor(this.client.config.school_color)
			.addField("Server Region", message.guild.preferredLocale, true) 
			.addField("Server Name", message.guild.name, true)
			.addField("Verification level", message.guild.verificationLevel, true)
			.addField("Channel Count", message.guild.channels.cache.size, true)
			.addField("Total Member Count", message.guild.memberCount, true)
			.addField("Humans", checkMembers(message.guild), true)
			.addField("Bots", checkBots(message.guild), true)
			.addField("Guild Created At:", message.guild.createdAt, true)
			.addField("Total Amount of Roles", message.guild.roles.cache.size, true)
			.setTimestamp();
 
			message.channel.send(serverEmbed); 
	} 
}; 
