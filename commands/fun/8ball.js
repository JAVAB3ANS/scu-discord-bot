const { MessageEmbed } = require(`discord.js`); //for embed functionality

module.exports = {
	name: '8ball',
    description: 'Please enter a full question with 3 or more words to get an 8-ball answer!',
    args: true, 
    usage: `[question?]`,
    category: 'utility',
		async execute(client, message, args) { 
        
            const prompt = args.join(' ');
            if (!prompt.endsWith("?")) return message.channel.send(`<@${message.author.id}>`, { embed: { description: "Enter a question like this: `This is a question?`", color: client.config.school_color}});
            
            const replies = ["It is certain.", "It is decidedly so.", "Without a doubt", "Yes-definitely.",
            "You may rely on it", "As I see it, yes.", "Most likely.", "Outlook good", "Yes", "Signs point to yes",
            "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", 
            "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", 
            "Outlook not so good.", "Very doubtful."];

            const result = Math.floor((Math.random() * replies.length));

            const ballEmbed = new MessageEmbed()
            .setTitle(`__**Your 8-ball results!**__`)
            .setColor(client.config.school_color)
            .setDescription(`**Question:** ${prompt}\n**Answer:** ${replies[result]}`)
            .setFooter(`Created by the server lords!`)
            .setTimestamp()
            message.channel.send(ballEmbed);
        }
    }