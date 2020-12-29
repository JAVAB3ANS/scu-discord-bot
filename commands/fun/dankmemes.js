const { MessageEmbed } = require(`discord.js`); //for embed functionality
const memes = require(`random-puppy`); //for memes

module.exports = { 
    name: 'dankmemes',
    description: 'Get dank memes from subreddits!',
    cooldown: 10,
    category: 'Fun',
	async execute(client, message, args) {
        
	let reddit = ["meme", "memes", "dankmemes", "dankchristianmemes", "funny", "pewdiepiesubmissions"];
	let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

	message.channel.startTyping();

	await message.channel.send({embed: {
		color: client.config.school_color,
		description: `**Generating meme...**`
		} 
	}).then(msg => msg.delete({timeout: 1000}))

	memes(subreddit).then (async url => {
		await message.channel.send(`<@${message.author.id}>`, {embed: {
			color: client.config.school_color,
			description: `**Here's your meme!**`,
			footer: {
				text: "Created by the server lords!"
			},
			image: {
				url: "attachment://meme.jpg"
			},
			timestamp: new Date()
			},
			files: [{ attachment: url, name: 'meme.jpg' }]  
			}).then(() => message.channel.stopTyping(true));
		}) 
	}
}
