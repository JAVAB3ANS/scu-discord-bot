  const { CommandoClient } = require("discord.js-commando");  
const path = require(`path`);  

const client = new CommandoClient({
  commandPrefix: `${require("./config.json").prefix}`,
  owner: `${require("./config.json").serverRoles.owner}`,
});

client.config = require(`./config.json`); 

client.registry
  .registerDefaultTypes()
  .registerGroups([  
    ["admins", "Admin"],
    ["utility", "Utility"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
    prefix: false, 
  })
  .registerCommandsIn(path.join(__dirname, "commands")); 

client.dispatcher.addInhibitor((msg) => {
  switch (msg.command.group.name) {
    case "Admin":
      if (!checkPermission(client)) return noPermissionMessage(client, message); 
      break;
    default:
      return false; 
  }
});

client
    .on('ready', () => require('./events/ready')(client))
    .on('message', (message) => require('./events/message')(client, message))

client.login(client.config.token);