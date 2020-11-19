let isAdmin = require(`../../modules/isAdmin.js`);
let db = require(`quick.db`); 

module.exports = { 
    name: 'prefix',
    description: 'Change the bot\'s prefix!',
    args: true,
    usage: `[enter prefix]`,
    category: 'Admin',  
    async execute(client, message, args) {
        if(isAdmin(client, message)) {
          if (args[0] === db.get(`guild_${message.guild.id}_prefix`)) {
            return message.channel.send({ embed: { description: `\`${args[0]}\` is already your current prefix!`, color: client.config.school_color}});
          }
            
          if (args[1] || args[0].length > 1) {
            return await message.channel.send({ embed: { description: `You can't set a double-argument prefix or one that's over 1 character!`, color: client.config.school_color}});
          }
            
          db.delete(`guild_${message.guild.id}_prefix`);
          db.set(`guild_${message.guild.id}_prefix`, args[0]);

          await message.channel.send({ embed: { description: `Set the bot prefix to ${args[0]}!`, color: client.config.school_color}});
        }
    }
}
