module.exports = async function log(client, channel, content) { 
    client.guilds.cache.map((g) => { 
        try {
            g.channels.cache
            .find((ch) => ch.id === channel || ch.name === channel)
            .send({  
                embed: {
                    description: content,
                    color: "GREEN",
                    timestamp: Date.now(),
                    footer: {  text: `${client.user.username} - Logs`, },
                    author: { name: title, icon_url: client.user.displayAvatarURL(), },
                },
            });
        } catch (err) {
            return;
        }
    });
};