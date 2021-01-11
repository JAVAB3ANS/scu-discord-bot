const { MessageEmbed } = require(`discord.js`); 

module.exports.sendMessage = async (client, channel, content) => {
  client.guilds.cache.map((g) => {
    try { //get channel either by ID or name and send the content! 
      g.channels.cache.find((ch) => ch.id == channel || ch.name == channel).send(content);
    } catch (e) {
      return;
    }
  });
}
 
module.exports.getUserPermissionLevel = async (client) => {
  if (client.config.serverRoles.modRoles.forEach(modRole => message.member.roles.cache.has(modRole))) return 1;
    else return 0;
}

module.exports.checkPermission = async (client) => {
    let flag = (this.getUserPermissionLevel(client) > 0);
    return flag;
}

module.exports.noPermissionMessage = async (client, message) => {
    let embed = new MessageEmbed();
    embed.setTitle('❌ ERROR ❌').setDescription(`***<@${message.author.id}>, You don't have permission to use this command***`).setColor(client.config.school_color);
    await message.channel.send(embed);
    await message.delete();
}  