const {  MessageEmbed } = require(`discord.js`); //for embed functionality
const fetch = require('node-fetch');

module.exports = {
	name: 'pokedex',
    description: 'Get Pokemon statistics!',
    args: true,
    usage: `[Pokemon name]`,
    category: 'Fun',
	async execute(client, message, args) {

        const BASE_URL = client.config.api.pokemon;

		async function getPokemon(pokemon) {
			let response = await fetch(`${BASE_URL}/${pokemon}`);
			return await response.json();
		}
	
		const pokemon = message.content.toLowerCase().split(" ")[1];
        try {
            const pokeData = await getPokemon(pokemon);
            const { 
                sprites, 
                stats, 
                weight, 
                height,
                name, 
                id, 
                base_experience,
                types
            } = pokeData;
            const embed = new MessageEmbed();
                embed.setTitle(`__**${name.toUpperCase()}**__ __**#${id}**__`)
                embed.setThumbnail(`${sprites.front_default}`);
                stats.forEach(stat => embed.addField(`__**${stat.stat.name.toUpperCase()}**__`, stat.base_stat, true));
                types.forEach(type => embed.addField('__**Type**__', type.type.name, true));
                embed.addField('__**Weight**__', `${weight} lbs`, true);
                embed.addField('__**Height**__', `${height} ft`, true);
                embed.addField('__**Base Experience**__', `${base_experience} XP`, true);
                embed.setColor(client.config.school_color);
            message.channel.send(embed).catch(err => `Error: ${err}`)
        }
        catch(err) {
			message.channel.send({embed: {description: `Pokemon __**${pokemon}**__ does not exist.`, color: client.config.school_color}})
			.then(msg => msg.delete({timeout: 5000}))
			.catch(err => `Error: ${err}`)
        }
    }
}