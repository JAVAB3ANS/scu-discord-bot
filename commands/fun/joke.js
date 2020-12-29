const { MessageEmbed } = require(`discord.js`); //for embed functionality
const JOKES = require(`./jokes.json`); //for jokes
const jokes_list = JOKES.jokes;

module.exports = {
    name: 'joke',
    description: 'Get a random joke here!',
    category: 'Fun',
    async execute(client, message, args) { 

        function randomJoke() {
            return jokes_list[Math.floor(Math.random() * jokes_list.length)];
        }
        
        const jokeEmbed = new MessageEmbed()
            .setTitle("Joke!")
            .setColor(client.config.school_color)
            .setDescription(randomJoke())
            .setTimestamp()
            .setFooter("Created by the server lords!")
        message.channel.send(`<@${message.author.id}>`, { embed: jokeEmbed })
    }
}