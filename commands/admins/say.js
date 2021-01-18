const { Command } = require("discord.js-commando"); 
const { log } = require("../../functions/log.js");

module.exports = class sayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "say",
      group: "admins",
      memberName: "say",
      guildOnly: true,
      description: "Repeats what the user said.",
      examples: ["say Hello world"],
    });
  }

  async run(message) {
    message.delete();
    log(this.client,this. client.config.channel.auditlogs, { embed: { title: "Say Command", description: `Channel: <#${message.channel.id}>\nContent: \`\`\`\n${message.content.substring(this.client.options.commandPrefix.length + 3, message.content.length)}\`\`\``, color: 6233209}});
    return message.say(message.content.substring(this.client.options.commandPrefix.length + 3, message.content.length));
  }
};
