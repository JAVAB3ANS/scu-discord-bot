const { MessageEmbed } = require(`discord.js`);
const quotes = require(`inspirational-quotes`); //for quotes

module.exports = {
	name: 'quote',
	description: 'Get random quotes!',
	category: 'Fun',
	async execute(client, message, args) {
        
		const quoteEmbed = new MessageEmbed()
		.setTitle(`Here's your quote!`)
		.setColor(client.config.school_color)	
		.setDescription(quotes.getRandomQuote())
		.setTimestamp()
		.setFooter("Use `&` before each command!")
		message.channel.send(`<@${message.author.id}>`, { embed: quoteEmbed});
	}
}