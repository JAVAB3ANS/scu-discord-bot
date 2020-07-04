const request = require(`request`)
const Discord = require(`discord.js`)
const client = new Discord.Client();
const toTitleCase = require(`to-title-case`);
const moment = require('moment'); //here is a change in the file

module.exports = {
	name: 'weather', //project adapted from https://github.com/ShadeBot/ShadeBot-Discord-Bot/blob/master/commands/weather.js
	description: 'weather api',
	async execute(message, args) {
        if(!args[0]) return message.channel.send({embed: {description: "Please enter a name of a city like this: `>weather [city], [country]`", color: 10231598}});
        
        let location = args.join('%20');
        request(`http://api.openweathermap.org/data/2.5/weather?appid=83a6f430e7eaf7703e2f97127dd4d729&q=${location}`, (error, response, body) => {
            const json = JSON.parse(body);

            if (json.cod && json.cod == 404) return message.channel.send({embed: {description: "City not found!", color: 10231598}})
            
            if (json.wind.deg) {
                let angle = json.wind.deg
                if (json.wind.deg <= 22.5) angle = "North";
                else if (json.wind.deg <= 67.5) angle = "Northeast";
                else if (json.wind.deg <= 112.5) angle = "East";
                else if (json.wind.deg <= 157.5) angle = "Southeast";
                else if (json.wind.deg <= 202.5) angle = "South";
                else if (json.wind.deg <= 247.5) angle = "Southwest";
                else if (json.wind.deg <= 292.5) angle = "West";
                else if (json.wind.deg <= 337.5) angle = "Northwest";
                else if (json.wind.deg <= 360.1) angle = "North";

                json.wind.speed += `m/s ${angle}`;
            } 
            else json.wind.speed += "m/s";

            let weatherEmbed = new Discord.MessageEmbed()
                .setColor(10231598)
                .setTitle(`:flag_${json.sys.country.toLowerCase()}: ${json.name}, ${json.sys.country}`)
                .setURL(`https://openweathermap.org/city/${json.id}`)
                .setThumbnail(`https://openweathermap.org/img/w/${json.weather[0].icon}.png`)
                .addField(`Temperature`, `Main: ${Math.round((json.main.temp - 273.15) * 9/5 + 32)}°F\n Feels Like: ${Math.round((json.main.feels_like - 273.15) * 9/5 + 32)}°F\n (Min: ${Math.round((json.main.temp_min - 273.15) * 9/5 + 32)}°F | Max: ${Math.round((json.main.temp_max - 273.15) * 9/5 + 32)}°F )`, true)
                .addField('Weather', toTitleCase(`${json.weather[0].description}`), true)
                .addField(`Wind`, `${json.wind.speed}`, true)
                .addField(`Humidity`,`${json.main.humidity}%`, true)
                .addField(`Pressure`, `${json.main.pressure} hpa`, true)
                .addField('Cloudiness', `${json.clouds.all}%`, true)
                .addField('Latitude', `${json.coord.lat}`, true)
                .addField('Longitude', `${json.coord.lon}`, true)
                .addField(`\u200B`, `\u200B`, true)
                .addField(`Sunrise`, moment.unix(json.sys.sunrise).format('MM-DD-YYYY, (h:mm A) '), true)
                .addField(`Sunset`, moment.unix(json.sys.sunset).format('MM-DD-YYYY, (h:mm A) '), true)
                .setFooter(`Created by the server lords!`)
                .setTimestamp();

            message.channel.send(weatherEmbed)
        });
    }
}
