const { MessageEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");
const cheerio = require("cheerio"); 
  
module.exports = class covid19Command extends Command {
    constructor(client) {
        super(client, {
            name: "covid19",  
            description: "Get daily and instant COVID-19 data at SCU here...",  
            group: "utility",
            memberName: "covid19",
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run ( message) {  
        const response = await fetch("https://www.scu.edu/preparedscu/covid-19/confirmed-cases/");
        const body = await response.text();
        
        if(response.ok) {
          const scuEmbed = new MessageEmbed()
          .setColor(this.client.config.school_color)
          .setAuthor("SCU On-Campus Testing Dashboard", this.client.user.displayAvatarURL()) 
          .setDescription(" Test Date | Number of Tests | *Number of Positive Tests | Positivity Rate")
          .setTitle("The following information reflects results from tests conducted each week on SCU's campus. Find more details on the Testing Protocol website.")
          .setURL("https://www.scu.edu/preparedscu/health-and-safety/testing-protocol/")
          .setFooter("*Includes students, faculty, and staff. Includes some individuals tested multiple times.", this.client.user.avatarURL()); 

          const $ = cheerio.load(body); 

          $("table[class=\"fixed_header\"] > tbody > tr").each(function() {
              let stats = $(this).text(); 
              scuEmbed.addField("\u200B", stats, true);
          });  

          message.channel.send(scuEmbed);
        } 
    }
};
