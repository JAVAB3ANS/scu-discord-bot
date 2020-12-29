module.exports =  { 
	name: 'ping',
	description: 'Get the bot\'s ping latency and response!',
	cooldown: 5,
	category: 'Utility',
	async execute(client, message, args) {
		
		const msg = await message.channel.send(`Pinging...`)
		const latency = msg.createdTimestamp - message.createdTimestamp;
		const choices = ['Is this really my ping?', 'Is it ok, I can\'t look!', 'I hope it isn\'t bad!'];
		const response = choices[Math.floor(Math.random() * choices.length)];

		msg.edit({embed: {description: `**Response:** ${response}\n**Ping Latency:** ${latency}ms`, color: client.config.school_color}})
    }
} 