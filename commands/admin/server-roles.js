const { MessageEmbed } = require(`discord.js`); //for embed functionality 

module.exports = {
    name: 'server-roles',
    description: 'Get the server-roles embed!',
    category: 'Admin',  
	async execute (client, message, args) { 
		const serverRolesEmbed = new MessageEmbed()
		.setTitle("__**SERVER ROLES FORM!**__")
		.setColor(client.config.school_color)
		.setDescription(
		`Please fill out this super-duper quick little [**form**](${client.config.verification.googleFormLink}) with your SCU email to instantly get the __**Student**__, graduating year, and major/program of study roles! All data is anonymous!\n\n` +
		`**NOTE**: If you are a <@&${client.config.serverRoles.prospectiveStudent}>, please DM the <@${client.config.serverRoles.bot}> to alert mods to give you your role as the form is for SCU domain users! Thank you for your cooperation! 😊`
		)
		.attachFiles([`./assets/bronco_statue.jpg`])
		.setImage(`attachment://bronco_statue.jpg`)

		message.channel.send(serverRolesEmbed); 
    	}   
}
