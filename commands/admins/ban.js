const { Command } = require("discord.js-commando");
const { log } = require("../../functions/log.js");

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
                    key: "person",
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

     async run ( message, { person, reason}) {
 
            
           if ((person.id === this.client.config.serverRoles.owner) || (!this.client.config.serverRoles.modRoles.forEach(modRole => message.member.roles.cache.has(modRole)))) 
	            return message.channel.send({
                    embed: {
                        description: "I can't ban my owner or mods!",
                        color: this.client.config.school_color
                    }
	        });
 
            if(person.id === message.author.id) {
                return message.channel.send({embed: {
                    description: "You can't ban yourself!",
                    color: this.client.config.school_color
                }});
            }

	    if(person.roles.highest.position <= message.member.roles.highest.position) {
                return message.channel.send({ embed: {
                    description: `They have more power than you!`,
 
                    color: this.client.config.school_color
    		}});
            }
 
        if(!reason) {
            this.client.error("You must provide a reason to ban the user!", message);
        } 

        await person.ban(reason);

        log(this.client, this.client.config.channels.auditlogs, { embed: { title: `User Banned!`, description: `- Moderator: <@${message.author.id}>\n- User: <@${person.id}>\n- Reason: \`\`\`${reason}\`\`\``, color: "RED"}});
    }
}; 