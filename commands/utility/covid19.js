const { MessageEmbed } = require("discord.js");
const { Command } = require("discord.js-commando");
const paginationEmbed = require("discord.js-pagination");
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
 
    async run ( msg) {  
        const response = await fetch("https://www.scu.edu/preparedscu/covid-19/confirmed-cases/");
        const body = await response.text();
 
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

            const tierDashboard = new MessageEmbed()
                .setAuthor("SCU On-Campus Testing Dashboard", this.client.user.displayAvatarURL())
                .setURL("https://www.scu.edu/preparedscu/health-and-safety/testing-protocol/") 
                .setTitle($("div[id=\"content-640516\"] > div > h2 > span").text())
                .setColor("RED")

            $("div[id=\"content-640516\"] > div > p").each(async function() {
                let tierStuff1 = $(this).text(); 
                tierDashboard.setDescription(tierStuff1)
            });

            $("div[id=\"content-640516\"] > div > ul > li").each(async function() {
                let tierStuff2 = $(this).text(); 
                tierDashboard.addField(`\u200B`, `\`\`\`${tierStuff2}\`\`\``, false)
            }); 

            const privacyReminder = new MessageEmbed()
                .setAuthor("SCU On-Campus Testing Dashboard", this.client.user.displayAvatarURL())
                .setURL("https://www.scu.edu/preparedscu/health-and-safety/testing-protocol/") 
                .setTitle($("div[id=\"content-640502\"] > h2").text())
                .setDescription($("div[id=\"content-640502\"] > p > span").text())
                .setColor("RED")
            
            $("div[id=\"content-640502\"] > ul > li").each(async function() {
                let privacyStuff = $(this).text();
                privacyReminder.addField(`\u200B`, `\`\`\`${privacyStuff}\`\`\``, false) 
            });
        
            const pages = [newStuff, tierDashboard, privacyReminder];
            const emojiList = ["⏪", "⏩"];
 
          paginationEmbed(msg, pages, emojiList);
        } 
    }
};