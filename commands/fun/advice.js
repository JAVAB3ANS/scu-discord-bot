const snekfetch = require("snekfetch");

module.exports = {
	name: 'advice',
    description: 'Get advice here!',
    category: 'Fun',
    async execute(client, message, args) { 
        try {
            const { body } = await snekfetch.get('http://api.adviceslip.com/advice');
            message.channel.send(`<@${message.author.id}>`, {embed: {title: `Here's your advice`, description: JSON.parse(body.toString()).slip.advice, color: client.config.school_color}});
        } catch (err) {
            message.channel.send(`An error occurred: \`${err.message}\`. Try again later!`);
        }
    }
}