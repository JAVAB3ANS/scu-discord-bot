const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");

module.exports = class discordCommand extends Command {
    constructor(client) {
        super(client, {
            name: "discord",
            description: "Checks Discord status!",
            group: "utility",  
            memberName: "discord",
            throttling: {
                usages: 2,
                duration: 5,
            },
        })
    }

    async run  (message) {

        //STATUS CHECKERS  
        const response = await fetch("https://srhpyqt94yxb.statuspage.io/api/v2/status.json");  
        
        const body = await response.json();

        if (!response.ok) {
            throw Error("Error! Please tell the bot author.");
        }

        if (body.status.description === "All Systems Operational") {
            message.channel.send({ embed: { title: `:white_check_mark: ${body.status.description}`, description: `Check the status [here](https://status.discord.com/api/v2/status.json)! :white_check_mark:`, color: "GREEN", timestamp: new Date()}});
        } else {
            message.channel.send({ embed: { title: `:x: ${body.status.description}`, description: `There seems to be an error with some of the servers. Double check [here](https://status.discord.com/api/v2/status.json)! :x:`, color: "RED", timestamp: new Date()}});
        } 
    }
}
