const { MessageEmbed } = require(`discord.js`); //for embed functionality 
const { Command } = require(`discord.js-commando`);

module.exports = class serverStatsCommand extends Command {
    constructor(client) {
        super(client, {
			name: 'server-stats',
			memberName: 'server-stats',
			description: 'Get general server statistics!',
			group: "admins",
            throttling: {
                usages: 2,
                duration: 5,
			},
		});
	}
	
    async run (client, message) {
			function checkBots(guild) {
				let botCount = 0;
				guild.members.cache.forEach(member => {
				if(member.user.bot) botCount++;
				});
				return botCount;
			}

			function checkMembers(guild) {
				let memberCount = 0;
				guild.members.cache.forEach(member => {
					if(!member.user.bot) memberCount++;
				});
				return memberCount;
			}

			let serverembed = new MessageEmbed()
			.setDescription(`__**${this.message.guild.name} - Statistics**__`)
			.setColor(this.client.config.school_color)
			.addField('Server Owner', `<@${this.message.guild.owner}>`, true)
			.addField('Server Region', this.message.guild.region, true) 
			.addField("Server Name", this.message.guild.name, true)
			.addField('Verification level', this.message.guild.verificationLevel, true)
			.addField('Channel Count', this.message.guild.channels.cache.size, true)
			.addField('Total Member Count', this.message.guild.memberCount, true)
			.addField('Humans', checkMembers(this.message.guild), true)
			.addField('Bots', checkBots(this.message.guild), true)
			.addField('Guild Created At:', this.message.guild.createdAt, true)
			.setTimestamp() 

			message.channel.send(serverembed); 
	} 
} 
