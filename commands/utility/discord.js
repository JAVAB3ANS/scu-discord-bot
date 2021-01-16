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
        });
    }

    async run  (message) {

        //STATUS CHECKERS  
        const response = await fetch(this.client.config.api.discord);   
        const body = await response.json();
 
        if (body.status.description === "All Systems Operational") {
            message.channel.send({ embed: { title: `:white_check_mark: ${body.status.description}`, description: `Check the status [here](https://status.discord.com/api/v2/status.json)! :white_check_mark:`, color: "GREEN", timestamp: new Date()}});
        } else {
            client.error(`:x: ${body.status.description}`, msg);
        } 
    }
};
