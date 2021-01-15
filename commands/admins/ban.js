const { Command } = require("discord.js-commando");

module.exports = class banCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            memberName: "ban",
            description: "Ban members!", 
            group: "admins",
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: "member",
                    prompt: "Please mention a user!",
                    type: "user",
                },
                {
                    key: "reason",
                    prompt: "Please enter a reason for why the user was banned!",
                    type: "string"
                }
            ],
        });
    }

    async run ( message, { member, reason}) {
            member = message.mentions.members.first(); 

            if(member.user.id === this.client.config.serverRoles.owner || !this.client.config.serverRoles.modRoles.forEach((modRole) => message.member.cache.has(modRole))) {
                return message.channel.send({embed: {
                    description: "I can't ban my owner or mods!",
                    color: this.client.config.school_color
                }});
            } 

            if(member.user.id === message.author.id) {
		        return message.channel.send({embed: {
                    description: "You can't ban yourself!",
                    color: this.client.config.school_color
                }});
            }

            if(!reason) {
                client.error("You must provide a reason to ban the user!", message);
            } else {
                await member.ban(reason);

                client.log(client, `User [${member.user.tag}] Banned!`, `Reason: ${reason}`, "RED", message);
	        }
    }
};