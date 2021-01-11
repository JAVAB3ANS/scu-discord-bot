const { CommandoClient } = require("discord.js-commando");  
const path = require(`path`);  
const { checkPermission, noPermissionMessage } = require(`./modules/modules.js`);

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
    ["fun", "Fun"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: true,
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
    .on('guildMemberAdd', (member) => require('./events/guildMemberAdd')(client, member))
    .on('guildMemberRemove', (member) => require('./events/guildMemberRemove')(client, member))

client.login(client.config.token);