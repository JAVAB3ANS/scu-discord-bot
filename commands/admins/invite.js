const { Command } = require("discord.js-commando"); 
const { log } = require("../../functions/log.js");

module.exports = class inviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      group: "admins",
      memberName: "invite",
      description: "Create an invite to a specified channel",
      examples: ["invite #general"],
      clientPermissions: ["CREATE_INSTANT_INVITE"],
      guildOnly: true,
      throttling: {
        usages: 2,
        duration: 5,
      },
      args: [
        {
          key: "channel",
          prompt: "Enter the channel to create an invite for.",
          type: "channel",
        },
      ],
    });
  }

  async run(message, { channel }) {
    channel
      .createInvite(
        {
          maxAge: 0,
        },
        "Bot 'makeinv' command"
      )
      .then((inv) => {
        message.channel.send(`> Your new invite bound to channel **#${channel.name}** has been created! https://discord.gg/${inv.code}`);
        log(this.client, this.client.config.channel.auditlogs, { embed: { title: "Invite created!", description: `Made invite code \`${inv.code}\` for ${channel}`, color: 1231238}});
      });
  }
};
