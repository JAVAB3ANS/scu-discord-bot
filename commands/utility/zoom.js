module.exports = {
    name: `zoom`,
    description: `Get Zoom Meetings statsu!`,
    category: `Utility`,
    cooldown: `5`,
    async execute (client, message, args) {
        const fetch = require("node-fetch");
        let chunk = "";
        try {
            const response = await fetch(client.config.api.zoom);
            const data = await response.json();
            
            for (i in data.components) {
                let connected = data.components[i].status == "operational";
                chunk += `**${data.components[i].name}** ${connected ? ":white_check_mark:\n" : ":x:\n"}`;
            }

            message.channel.send({ embed: { title: `Zoom Meetings Status`, description: chunk, color: client.config.school_color}});
        } catch (e) {
         console.log(e, "error", "zoom");
        }
    }
  };