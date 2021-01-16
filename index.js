const { CommandoClient } = require("discord.js-commando");  
const path = require("path");   
const fs = require("fs");  
const message = require("./events/message");

const client = new CommandoClient({
  commandPrefix: `${require("./config.json").prefix}`,
  owner: `${require("./config.json").serverRoles.owner}`,
});

client.config = require("./config.json"); 
client.error = require("./modules/error.js");
client.log = require("./modules/log.js");

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
          client.error(`***<@${msg.author.id}>, You don't have permission to use this command***`, msg);
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
      client.log(client, "Services", `Found  ${Object.keys(client.config.services).length} services :white_check_mark:`, "GREEN", message);
      files.forEach((file) => {
        if (!file.includes("js") || !file.startsWith("server")) { return; }
        let eventFunction = require(`./modules/${file}`);
        let eventName = file.split(".")[0];
        if (client.config.services[eventName]) {
          eventFunction.run(client);
          client.log(client, "Service started!", `Started ${eventName} service :white_check_mark:`, "GREEN");
        } 
      });
    });

    client.log(client, "Hooray!", "All commands and events work! :white_check_mark:", "GREEN", message);
});

client 
    .on("message", (message) => require("./events/message")(client, message))
    .on("guildMemberAdd", (member) => require("./events/guildMemberAdd")(client, member))

client.login(client.config.token);