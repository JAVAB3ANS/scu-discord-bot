const { MessageEmbed } = require(`discord.js`); //for embed functionality 
let sendMessage = require(`../../modules/sendMessage.js`);

module.exports = {
    name: 'server-stats',
    description: 'Get general server statistics!',
    category: 'Admin',  
    async execute(client, message, args) { 
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

			let sicon = message.guild.iconURL();
			let serverembed = new MessageEmbed()
			.setDescription(`__**${message.guild.name} - Statistics**__`)
			.setColor(client.config.school_color)
			.addField('Server Owner', `<@${client.config.serverRoles.owner}>`, true)
			.addField('Server Region', message.guild.region, true) 
			.addField("Server Name", message.guild.name, true)
			.addField('Verification level', message.guild.verificationLevel, true)
			.addField('Channel Count', message.guild.channels.cache.size, true)
			.addField('Total Member Count', message.guild.memberCount, true)
			.addField('Humans', checkMembers(message.guild), true)
			.addField('Bots', checkBots(message.guild), true)
			.addField('Guild Created At:', message.guild.createdAt, true)
			.setTimestamp() 

			sendMessage(client, client.config.channels.auditlogs, serverembed); 
	} 
} 
