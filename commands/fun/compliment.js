const { MessageEmbed } = require(`discord.js`); //for embed functionality
const COMPLIMENTS = require(`./compliments.json`);
const compliments_list = COMPLIMENTS.compliments;

module.exports = {
	name: 'compliment',
    description: 'Complient another user in the server!',
    usage: `[@user mention]`,
    category: 'Fun',
    async execute(client, message, args) { 
        let user = message.mentions.users.first();
        if (user === message.author) return message.channel.send({ embed: { description: 'You can not compliment yourself!', color: client.config.school_color}});
        if (message.mentions.users.size < 1) return message.channel.send({ embed: { description: 'You must mention someone to compliment them.', color: client.config.school_color}});
    
        const compliments = compliments_list[Math.floor(Math.random() * compliments_list.length)];

        const complimentEmbed = new MessageEmbed()
        .setTitle("Here's your compliment!")
        .setColor(client.config.school_color)
        .setDescription(`<@${message.author.id}> said this:\n\n<@${user.id}>, ${compliments}`);
            
        message.channel.send(complimentEmbed);
    }
}