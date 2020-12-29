const { MessageEmbed } = require(`discord.js`); 
const overwatch = require(`overwatch-api`);
const {stripIndents} = require(`common-tags`);

module.exports = { 
    name: 'overwatch', //here is a change in the file
    description: 'Get your Overwatch statistics!',   
    args: true,
    usage: `[username] [pc / xb1 / psn]`,
    category: 'Fun',
    async execute(client, message, args) {
        
        args = args.join(" ").split(" ");

        if(args[0].includes("#")) args[0] = args[0].replace(/#/g, "-");

            overwatch.getProfile(args[1], "global", args[0], (err, json) => {
                if(err) return message.channel.send({embed: {title: `Overwatch Command`, description: "Unable to find a player with that username!", color: client.config.school_color, timestamp: new Date()}})
                message.channel.send(`Generating user stats...`).then(msg => msg.delete({timeout: 2000}).catch(err => `ERROR: ${err}`))
                const { games, level, portrait, username, playtime: {competitive, quickplay }, private } = json;
                const { sportsmanship, shotcaller, teammate } = json.endorsement;
                const { won, draw, played, lost, win_rate } = json.games.competitive;
            
            if(private) return message.channel.send({embed: {
                title: `Overwatch Command`, 
                description: "The user's stats and can't be obtained via this command.", 
                color: client.config.school_color, 
                timestamp: new Date(),
                footer: `Brought to you by the server lords!`
            }}).catch(err => `Error: ${err}`)

            const embed = new MessageEmbed() 
            .setColor(client.config.school_color)
            .setAuthor(`Overwatch | ${username}`, portrait)
            .setThumbnail(portrait)
            .addField("General:", stripIndents` 
            **Level:** ${shotcaller.rate || 0} / 100
            **Sportsmanship:** ${sportsmanship.rate || 0} / 100
            **Teammate:** ${teammate.rate || 0} / 100`, true)
            .addField("Competitive", stripIndents`
            **Played:** ${played || 0}
            **Won:** ${won || 0}
            **Draw:** ${draw || 0}
            **Lost:** ${lost || 0}
            **Win Rate:** ${win_rate || 0}
            **Playtime:** ${games.quickplay.played || "N/A"}
            **Won:** ${games.quickplay.won || 0}
            **Playtime:** ${quickplay || 0}`, true)
            .setFooter(`Brought to you by the server lords!`)
            .setTimestamp()

            message.channel.send(embed);
        })
    }
}