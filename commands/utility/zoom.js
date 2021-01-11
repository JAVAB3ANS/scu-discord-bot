const { Command } = require(`discord.js-commando`);
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
        try {
            const response = await fetch("https://14qjgk812kgk.statuspage.io/api/v2/components.json");
            const data = await response.json();
            
            for (const i of data.components) {
                let connected = data.components[i].status == "operational";
                chunk += `**${data.components[i].name}** ${connected ? ":white_check_mark:\n" : ":x:\n"}`;
            }

            message.channel.send({ embed: { title: `Zoom Meetings Status`, description: chunk, color: this.client.config.school_color}});
        } catch (e) {
            console.log(e, "error", "zoom");
        }
    }
  }; 