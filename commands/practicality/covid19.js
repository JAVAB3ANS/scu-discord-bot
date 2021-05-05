const { MessageEmbed } = require("discord.js");
const { Command } = require("discord.js-commando"); 
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const paginationEmbed = require('discord.js-pagination');
const QuickChart = require(`quickchart-js`); 
const chart = new QuickChart();
 
module.exports = class covid19Command extends Command {
    constructor(client) {
        super(client, {
            name: "covid19",  
            group: "practicality",
            memberName: "covid19",
            description: "Get daily and instant COVID-19 data at SCU here...",  
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }
 
    async run ( message ) {  
      const response = await fetch("https://www.scu.edu/preparedscu/covid-19/confirmed-cases/");
      const body = await response.text();

      const frames = ["□", "□□□□ 25%", "□□□□□□□□ 50", "□□□□□□□□□□□□ 75%", "□□□□□□□□□□□□□□□□ 100%"];

      const msg = await message.channel.send(`Generating COVID-19 data from the SCU On-Campus Testing Dashboard...`);
      
      for (const frame of frames) {
          setTimeout(() => {}, 4000);
          await msg.edit({ embed: { description: frame, color: this.client.config.school_color}});
      } 

      await msg.delete();
      
      if(response.ok) { 
          const $ = cheerio.load(body);    

          const selector = $("table[class=\"fixed_header\"] > tbody > tr");

          const newStuff = new MessageEmbed() 
              .setAuthor("SCU On-Campus Testing Dashboard", this.client.user.displayAvatarURL())
              .setURL("https://www.scu.edu/preparedscu/health-and-safety/testing-protocol/") 
              .setTitle("The following information reflects results from tests conducted each week on SCU's campus. Find more details on the Testing Protocol website.")
              .setColor("RED")
          
          selector.each(async function() {
              let tdStuff = $(this).text(); 

              newStuff  
              .addField(`Week ${selector.length-- }`, `\`\`\`${tdStuff}\`\`\``, true)
              .setDescription("```- Test Date\n- Number of Tests\n- *Number of Positive Tests\n- Positivity Rate```")
          });  

          chart.setWidth(500)
          chart.setHeight(300);
 
          chart.setConfig(
            {
              "type": "bar",
              "data": {
                "labels": [
                  'April 24', 'April 17', 'April 9', 'April 1'
                ],
                "datasets": [
                  {
                    "type": "line",
                    "label": "Positivity Rate",
                    "borderColor": "rgb(54, 162, 235)",
                    "borderWidth": 2,
                    "fill": false,
                    "data": [
                      0.1, 0.6, 3.2, 0.5
                    ]
                  },
                  {
                    "type": "bar",
                    "label": "Number of Tests Given",
                    "backgroundColor": "rgb(255, 99, 132)",
                    "data": [
                      2169, 2651, 3182, 2368
                    ],
                    "borderColor": "white",
                    "borderWidth": 2
                  },
                  {
                    "type": "bar",
                    "label": "Number of Positive Tests",
                    "backgroundColor": "rgb(75, 192, 192)",
                    "data": [
                      3, 17, 104, 13
                    ]
                  }
                ]
              },
              "options": {
                "responsive": true,
                "title": {
                  "display": true,
                  "text": "SCU On-Campus Testing Dashboard"
                },
                "tooltips": {
                  "mode": "index",
                  "intersect": true
                }
              }
            });  

            const chartData = new MessageEmbed()
            .setAuthor("SCU On-Campus Testing Dashboard", this.client.user.displayAvatarURL())
            .setURL("https://www.scu.edu/preparedscu/health-and-safety/testing-protocol/") 
            .setTitle("The following information reflects results from tests conducted each week on SCU's campus. Find more details on the Testing Protocol website.")
            .setColor("RED")
            .setImage(chart.getUrl()) 

            const pages = [newStuff, chartData];
            const emojiList = ["◀️", "▶️"];
  
          paginationEmbed(message, pages, emojiList); 
        }
    }
}