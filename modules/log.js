module.exports = async function log(client, title, content, color) { 
    client.guilds.cache.map((g) => { 
        try {
            g.channels.cache
            .find((ch) => ch.id === client.config.channels.auditlogs || ch.name === client.config.channels.auditlogs)
            .send({  
                embed: {
                    description: content,
                    color: color,
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