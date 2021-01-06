const { MessageEmbed } = require(`discord.js`);

module.exports.getUserPermissionLevel = async (client, message) => {
    if (client.config.serverRoles.modRoles.forEach(modRole => message.member.roles.cache.has(modRole))) return 1;
    else return 0;
}

module.exports.checkPermission = async (client, message) => {
    let flag = (this.getUserPermissionLevel(client,message) > 0);
    return flag;
}

module.exports.noPermissionMessage = async (client, message) => {
    let embed = new MessageEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription("***You don't have permission to use this command***").setColor(client.config.school_color);
    message.channel.send(embed);
}; 