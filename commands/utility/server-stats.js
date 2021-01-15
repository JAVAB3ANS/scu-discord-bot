const { MessageEmbed } = require("discord.js"); //for embed functionality 
const { Command } = require("discord.js-commando");

module.exports = class serverStatsCommand extends Command {
    constructor(client) {
        super(client, {
			name: "server-stats",
			memberName: "server-stats",
			description: "Get general server statistics!",
			group: "utility",
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
				if(member.user.bot) botCount++;
				});
				return botCount;
			}

			function checkMembers(guild) {
				let memberCount = 0;
				guild.members.cache.forEach((member) => {
					if(!member.user.bot) memberCount++;
				});
				return memberCount;
			}

			let serverembed = new MessageEmbed()
			.setDescription(`__**${message.guild.name} - Statistics**__`)
			.setColor(this.client.config.school_color)
			.addField("Server Owner", `<@${message.guild.owner}>`, true)
			.addField("Server Region", message.guild.region, true) 
			.addField("Server Name", message.guild.name, true)
			.addField("Verification level", message.guild.verificationLevel, true)
			.addField("Channel Count", message.guild.channels.cache.size, true)
			.addField("Total Member Count", message.guild.memberCount, true)
			.addField("Humans", checkMembers(message.guild), true)
			.addField("Bots", checkBots(message.guild), true)
			.addField("Guild Created At:", message.guild.createdAt, true)
			.setTimestamp();

			message.channel.send(serverembed); 
	} 
}; 
