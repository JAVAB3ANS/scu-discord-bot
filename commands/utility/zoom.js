const { Command } = require("discord.js-commando");
const fetch = require("node-fetch");

module.exports = class ZoomCommand extends Command {
    constructor(client) {
        super(client, {
            name: "zoom",
            description: "Get Zoom Meetings status!",
            group: "utility",
            memberName: "zoom",
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

    async run ( message) {
        let chunk = "";
         const response = await fetch(this.client.config.api.zoom);
        const data = await response.json();
        
        for (const i in data.components) { 
            chunk += `**${data.components[i].name}** ${data.components[i].status === "operational" ? ":white_check_mark:\n" : ":x:\n"}`;
        }

        message.channel.send({ embed: { title: "Zoom Meetings Status", description: chunk, color: this.client.config.school_color}});
        
    }
  }; 