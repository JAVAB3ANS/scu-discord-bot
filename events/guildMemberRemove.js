const { MessageEmbed } = require(`discord.js`);

let sendMessage = require(`../modules/sendMessage.js`);

module.exports = async (client, member) => {
	if(member.user.bot) return; //ignore members who are bot users
	
	const guild = client.guilds.cache.get(`${client.config.verification.guildID}`);
	let memberCount = guild.members.cache.filter(member => !member.user.bot).size;	
	let liveCount = guild.channels.cache.find(channel => channel.id === client.config.channels.memberCount);
	liveCount.setName(`👥 ${memberCount} Members`);
	
	let leaveEmbed = new MessageEmbed() // Creating instance of Discord.MessageEmbed()
	.setDescription(`<@${member.user.id}> has left **${guild.name}** which now has ${memberCount} members!`) //Setting embed description
	.setTimestamp() // Sets a timestamp at the end of the embed
	.setColor(client.config.school_color)

	sendMessage(client, client.config.channels.auditlogs, leaveEmbed);
}
