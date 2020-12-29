const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List of all of my commands or info about a specific command.',
	usage: `[command name]  **OR** &help`,
	category: 'Utility',
	async execute(client, message, args) {
		
		const { commands } = message.client;

		if (args[0]) {
			const commandName = args[0];
			const command = commands.get(commandName);
			
			if (!command) return message.reply({ embed: { description: `That\'s not a valid command!`, color: client.config.school_color}});
			 
  			const guildRole = client.config.serverRoles;
			
			if (command.category === "Admin" && guildRole.modRoles.forEach(modRole => !(message.member.roles.cache.has(modRole)))) {
				await message.delete(); 
				await message.channel.send(`<@${message.author.id}>`, { embed: { description: `You don't have one of the following roles: \`OWNER\`, \`ADMIN\`, \`MOD\``, color: client.config.school_color}});
				return false;
			} 
			
			const secHelpEmbed = new MessageEmbed()
			.setTitle(`${command.name.toUpperCase()} Command`)
			.addFields(
				{ name: `**❯ Category:**`, value: `${command.category}`},
				{ name: `**❯ Description:**`, value: `${command.description}`},
				{ name: `**❯ Usage:**`, value: `${client.config.prefix}${command.name} ${command.usage || ''}`},
				{ name: `**❯ Cooldown:**`, value: `${command.cooldown || 3} seconds`},
			)
			.setColor(client.config.school_color)
			.setThumbnail(client.config.verification.thumbnailLink)
			.setFooter(`Use ${client.config.prefix}help [command name] to get specific commmand info!`) 
			
			return message.channel.send(secHelpEmbed);
		}

		const mainHelpEmbed = new MessageEmbed()
		.setTitle(`**SCU BOT COMMANDS**`)
		.setDescription(`<@${client.user.id}> is the **SCU Discord Network**'s very own bot! :robot:\n\n` +
		 `**Commands**\nA full list of commands is available [here](${client.config.verification.githubLink}tree/master/commands) or use \`${client.config.prefix}help [command name]\` to get specific command info!\n\n` +
		 `**Support**\n[Click here](${client.config.verification.githubLink}pulls) to talk to our support team and/or suggest new ideas!`)
		.setFooter(`Brought to you by the server lords!`)
		.setColor(client.config.school_color)
		.attachFiles([`./assets/logo-pic.png`])
		.setThumbnail(`attachment://logo-pic.png`)
		.setURL(`${client.config.verification.githubLink}tree/master/commands`)
		.setTimestamp()

		message.channel.send(mainHelpEmbed);
	}
}