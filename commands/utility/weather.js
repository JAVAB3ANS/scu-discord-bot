const fetch = require("node-fetch");
const toTitleCase = require("to-title-case");
const moment = require("moment"); //here is a change in the file
const { MessageEmbed } = require("discord.js"); 
const { Command } = require("discord.js-commando");

module.exports = class weatherCommand extends Command {
    constructor(client) {
		super(client, {
		  name: "weather",
		  group: "utility",
		  memberName: "weather",
		  description: "Check the weather based on your zip code location!",
		  throttling: {
			usages: 2,
			duration: 5,
		  },
		  args: [
			{
			  key: "zipCode",
			  prompt: "Enter a zip code to lookup",
			  type: "string",
			},
		  ],
		});
	  }


	async run( message, { zipCode }) {  
	    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${this.client.config.api.weather}`);
    	const body = await response.json();

		if (body.cod && body.cod === 404) { 
			this.client.error("Zip code not found!", message); 
		}

        if (body.wind.deg) {
			let angle = body.wind.deg;
			if (body.wind.deg <= 22.5) { angle = "North"; }
			else if (body.wind.deg <= 67.5) { angle = "Northeast"; }
			else if (body.wind.deg <= 112.5) { angle = "East"; }
			else if (body.wind.deg <= 157.5) { angle = "Southeast"; }
			else if (body.wind.deg <= 202.5) { angle = "South"; }
			else if (body.wind.deg <= 247.5) { angle = "Southwest"; }
			else if (body.wind.deg <= 292.5) { angle = "West"; }
			else if (body.wind.deg <= 337.5) { angle = "Northwest"; }
			else if (body.wind.deg <= 360.1) { angle = "North"; }

			body.wind.speed += `m/s ${angle}`;
		} else {
			body.wind.speed += "m/s";
		}

	    let weatherEmbed = new MessageEmbed()
		.setColor(this.client.config.school_color)
		.setTitle(`:flag_${body.sys.country.toLowerCase()}: ${body.name}, ${body.sys.country}`)
		.setURL(`https://openweathermap.org/city/${body.id}`)
		.setThumbnail(`https://openweathermap.org/img/w/${body.weather[0].icon}.png`)
		.addField("Temperature", `Main: ${Math.round((body.main.temp - 273.15) * 9/5 + 32)}°F\n Feels Like: ${Math.round((body.main.feels_like - 273.15) * 9/5 + 32)}°F\n (Min: ${Math.round((body.main.temp_min - 273.15) * 9/5 + 32)}°F | Max: ${Math.round((body.main.temp_max - 273.15) * 9/5 + 32)}°F )`, true)
		.addField("Weather", toTitleCase(`${body.weather[0].description}`), true)
		.addField("Wind", `${body.wind.speed}`, true)
		.addField("Humidity",`${body.main.humidity}%`, true)
		.addField("Pressure", `${body.main.pressure} hpa`, true)
		.addField("Cloudiness", `${body.clouds.all}%`, true)
		.addField("Latitude", `${body.coord.lat}`, true)
		.addField("Longitude", `${body.coord.lon}`, true)
		.addField("\u200B", "\u200B", true)
		.addField("Sunrise", moment.unix(body.sys.sunrise).format("MM-DD-YYYY, (h:mm A) "), true)
		.addField("Sunset", moment.unix(body.sys.sunset).format("MM-DD-YYYY, (h:mm A) "), true)
		.setFooter("Created by the server lords!")
		.setTimestamp();

	    message.channel.send(weatherEmbed);
    }
};