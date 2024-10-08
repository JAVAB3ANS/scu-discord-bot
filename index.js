const { CommandoClient } = require("discord.js-commando");  
const path = require("path");   
const fs = require("fs");   

const client = new CommandoClient({
  commandPrefix: `${require("./config.json").prefix}`,
  owner: `${require("./config.json").serverRoles.owner}`,
});

client.config = require("./config.json"); 
client.error = require("./functions/error.js");
const { log } = require("./functions/log.js");

client.registry
  .registerDefaultTypes()
  .registerGroups([  
    ["practicality", "Practicality"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
    prefix: false, 
  })
  .registerCommandsIn(path.join(__dirname, "commands"));  

client.once("ready", () => {
  client.user.setPresence({activity: { name: `${client.config.prefix}help || DM me for help!` }, status: "online"});  

  log(client, client.config.channels.auditlogs, { embed: { title: "Hooray!", description: "All commands and events work! :white_check_mark:", color: "GREEN"}});
});

client 
    .on("message", (message) => require("./events/message")(client, message))
    .on("guildMemberAdd", (member) => require("./events/guildMemberAdd")(client, member));
 
client.login(client.config.token); 
