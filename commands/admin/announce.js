let sendMessage = require(`../../modules/sendMessage.js`);

module.exports = { 
    name: 'announce',
    description: 'Announce to server members!',
    args: true,
    usage: `[channel id] ~ [@role mention] ~ [title] ~ [description] ~ [image url]`,  
    category: 'Admin',  
    async execute(client, message, args) {
            const prompt = args.join(' ').split(' ~ ');

            let channelID = `${prompt[0]}`;
            let targetChannel = message.guild.channels.cache.get(channelID);
            if(targetChannel) targetChannel.send(`${prompt[1]}`,{embed : {color: client.config.school_color, title: `${prompt[2]}`, description: `${prompt[3]}`, image: { url: `${prompt[4]} || ''`}}});

            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `__**Server Announcement Made!**__`, description: `<@${message.author.id}> just made a Discord server announcement!`, color: school_color}});
    }
}
