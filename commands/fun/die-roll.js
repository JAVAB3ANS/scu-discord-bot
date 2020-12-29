const { MessageEmbed } = require(`discord.js`); //for embed functionality

module.exports = {
	name: 'die-roll',
    description: 'Roll two dice to attempt to get snake eyes!',
    category: 'Fun',
    async execute(client, message, args) {  

        const dice = [1, 2, 3, 4, 5, 6];
        const first_die = dice[Math.floor(Math.random()*dice.length)];
        const second_die = dice[Math.floor(Math.random()*dice.length)];

        if (first_die == 1 && second_die == 1) {
            const embed = new MessageEmbed()
            .setTitle(`__**SNAKE EYES**__`)
            .setColor(client.config.school_color)
            .setDescription(`YOU GOT SNAKE EYES!`)
            .attachFiles([`./assets/snakeeyes.jpg`])
            .setImage(`attachments://snakeeyes.jpg`)
            .setTimestamp()
            .setFooter(`Created by the server lords!`)

            return message.channel.send(embed)
            .catch(err => `Error: ${err}`) 

        } else {
            const embed = new MessageEmbed()
            .setTitle(`Here's your roll!`)
            .setColor(client.config.school_color)
            .addField("__**First Die**__", first_die, true)
            .addField("__**Second Die**__", second_die, true)
            .setTimestamp()
            .setFooter(`Created by the server lords!`)

            return message.channel.send(embed)
            .catch(err => `Error: ${err}`)  
        }
    }
}