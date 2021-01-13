const { CommandoClient } = require("discord.js-commando");  
const path = require("path");   
const fs = require("fs");  
const { sendMessage } = require("./modules/sendMessage.js");

const client = new CommandoClient({
  commandPrefix: `${require("./config.json").prefix}`,
  owner: `${require("./config.json").serverRoles.owner}`,
});

client.config = require("./config.json"); 

client.registry
  .registerDefaultTypes()
  .registerGroups([  
    ["admins", "Admin"],
    ["utility", "Utility"],
    ["fun", "Fun"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
    prefix: false, 
  })
  .registerCommandsIn(path.join(__dirname, "commands")); 

client.dispatcher.addInhibitor( (client, msg) => {
  try { 
    switch (msg.command.group.name) {
      case "Admin":
        if (!client.config.serverRoles.modRoles.forEach((modRole) => msg.member.roles.cache.has(modRole)) || !msg.author.id === client.config.serverRoles.owner) {
          msg.channel.send({ embed: { title: "❌ ERROR ❌", description: `***<@${msg.author.id}>, You don't have permission to use this command***`, color: client.config.school_color}});
          msg.delete();
          return false
        }
        break;
      default:
        return true; 
    } 
  } catch(err) {
      if (err === "TypeError: Inhibitor \"\" had an invalid result; must be a string or an Inhibition object.") {
        return;
      }
  }
});

client.once("ready", () => { 
		client.user.setPresence({activity: { name: `${client.config.prefix}help || DM me for help! 📩` }, status: "online"}); 

    fs.readdir("./modules", (err, files) => {
      sendMessage(client, client.config.channels.auditlogs, { embed: { title: "Services", description: `Found  ${Object.keys(client.config.services).length} services`, color: "GREEN"}});
      files.forEach((file) => {
        if (!file.includes("js") || file === "sendMessage.js") { return; }
        let eventFunction = require(`./modules/${file}`);
        let eventName = file.split(".")[0];
        if (client.config.services[eventName]) {
          eventFunction.run(client);
          sendMessage(client, client.config.channels.auditlogs, { embed: { title: "Service started! :white_check_mark:", description: `Started ${eventName} service`, color: "GREEN"}});
        } 
      });
    });

		sendMessage(client, client.config.channels.auditlogs, { embed: { title: "Hooray!", description: "All commands and events work! :white_check_mark:", color: "GREEN", timestamp: new Date()}});
});

client
    .on("message", (message) => require("./events/message")(client, message))
    .on("guildMemberAdd", (member) => require("./events/guildMemberAdd")(client, member))
    .on("guildMemberRemove", (member) => require("./events/guildMemberRemove")(client, member));

client.login(client.config.token);