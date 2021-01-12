const {  MessageEmbed } = require("discord.js"); //for embed functionality
const fetch = require("node-fetch");
const { Command } = require("discord.js-commando");

module.exports = class pokedexCommand extends Command {
	constructor(client) {
        super(client, {
          name: "pokedex",
          group: "fun",
          memberName: "pokedex",
          description: "Search up your favorite pokemon!",
          throttling: {
            usages: 2,
            duration: 5,
          }, args: [
			{
			  key: "pokemon",
			  prompt: "Enter a pokemon name!",
			  type: "string",
			  validate: pokemon => {
				  if(pokemon.match(/^([^0-9]*)$/)) {
            return "Enter an actual pokemon name!";
          }
			  }
			},
		  ], 
        });
      }

    async run( message, { pokemon }) {

        const BASE_URL = this.client.config.api.pokemon;

		async function getPokemon(pokemon) {
			let response = await fetch(`${BASE_URL}/${pokemon}`);
			return await response.json();
		}
	 
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
                embed.addField("__**Weight**__", `${weight} lbs`, true);
                embed.addField("__**Height**__", `${height} ft`, true);
                embed.addField("__**Base Experience**__", `${base_experience} XP`, true);
                embed.setColor(this.client.config.school_color);
                message.channel.send(embed);
        }
        catch(err) {
          message.channel.send({embed: {description: `Pokemon __**${pokemon}**__ does not exist.`, color: this.client.config.school_color}})
          .then(msg => msg.delete({timeout: 5000})) 
        }
    }
}