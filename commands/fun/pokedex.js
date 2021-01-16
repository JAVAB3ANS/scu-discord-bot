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
          },
        ], 
    });
  }

    async run( message, { pokemon }) {
 
      async function getPokemon(pokemon) {
        let response = await fetch(`${this.client.config.api.pokemon}/${pokemon}`);
        return await response.json();
      }
	  
      const pokeData = await getPokemon(pokemon);
      const { 
          sprites, 
          stats, 
          weight, 
          height,
          name, 
          id, 
          baseExperience,
          types
      } = pokeData;
      const embed = new MessageEmbed()
          .setTitle(`__**${name.toUpperCase()}**__ __**#${id}**__`)
          .setThumbnail(`${sprites.front_default}`)
        stats.forEach((stat) => embed.addField(`__**${stat.stat.name.toUpperCase()}**__`, stat.base_stat, true))
        types.forEach((type) => embed.addField('__**Type**__', type.type.name, true))
          .addField("__**Weight**__", `${weight} lbs`, true)
          .addField("__**Height**__", `${height} ft`, true)
          .addField("__**Base Experience**__", `${baseExperience} XP`, true)
          .setColor(this.client.config.school_color);
          
          message.channel.send(embed);
        } 
};