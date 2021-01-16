<<<<<<< HEAD
module.exports = async function log(client, channel, content) { 
    client.guilds.cache.map((g) => { 
        try {
            g.channels.cache
            .find((ch) => ch.id === channel || ch.name === channel)
            .send({  
                embed: {
                    description: content,
                    color: "GREEN",
=======
module.exports = async function log(client, title, content, color) { 
    client.guilds.cache.map((g) => { 
        try {
            g.channels.cache
            .find((ch) => ch.id === client.config.channels.auditlogs || ch.name === client.config.channels.auditlogs)
            .send({  
                embed: {
                    description: content,
                    color: color,
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef
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