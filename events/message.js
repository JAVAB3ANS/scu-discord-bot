const { MessageEmbed, Collection } = require(`discord.js`); //requires Discord.js integration package 
const sendMessage = require(`../modules/sendMessage.js`);
const { modmail } = require(`../modules/modmail.js`);
const { checkPermission } = require(`../modules/permissions.js`); 
const cooldowns = new Collection(); 

module.exports = async (client, message) => { 
  modmail(client, message); 
       
/*
==================================================================================
  __  __                                  _    _                 _ _           
 |  \/  |                                | |  | |               | | |          
 | \  / | ___  ___ ___  __ _  __ _  ___  | |__| | __ _ _ __   __| | | ___ _ __ 
 | |\/| |/ _ \/ __/ __|/ _` |/ _` |/ _ \ |  __  |/ _` | `_ \ / _` | |/ _ \ `__|
 | |  | |  __/\__ \__ \ (_| | (_| |  __/ | |  | | (_| | | | | (_| | |  __/ |   
 |_|  |_|\___||___/___/\__,_|\__, |\___| |_|  |_|\__,_|_| |_|\__,_|_|\___|_|   
                              __/ |                                            
                             |___/                                             
==================================================================================
*/

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
 
  const command = client.commands.get(commandName); 
  if (!command) return;

  if (command.args && !args.length) {
    let reply = new MessageEmbed()
    .setTitle("Uh-oh not enough arguments! :x:").setColor(client.config.school_color)
    .setDescription(`<@${message.author.id}>!, the proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``)
    
    return await message.channel.send(reply);
  }
	
  if((!checkPermission(client,message)) && command.category === "Admin") return noPermissionMessage(client, message);
  
  /*
  =======================================================
  / ____|          | |   | |                        
  | |     ___   ___ | | __| | _____      ___ __  ___ 
  | |    / _ \ / _ \| |/ _` |/ _ \ \ /\ / / `_ \/ __|
  | |___| (_) | (_) | | (_| | (_) \ V  V /| | | \__ \
  \_____\___/ \___/|_|\__,_|\___/ \_/\_/ |_| |_|___/
  =======================================================
  */                                                    

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000; //make cooldown default to 3 if there are no presets for cooldown in the command
  
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply({ embed: { description: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, color: client.config.school_color}});
    }
  }
  
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 

  try {
    // Run the command as long as it has these three parameters
    command.execute(client, message, args);
  } catch(err) {
      sendMessage(client, client.config.channels.auditlogs, { embed: { description: `There was an error trying to run ${command.name} due the error: ${err.message}`}});
      return console.log(err.stack || err);
  } 
}
