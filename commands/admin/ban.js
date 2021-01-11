const { MessageEmbed } = require(`discord.js`); //for embed functionality
let { sendMessage } = require(`../../modules/modules.js`); 
const { Command } = require(`discord.js-commando`);

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

    async run (client, message, { member, reason}) {
            member = message.mentions.members.first();

            if(!member.bannable) 
                return message.channel.send({embed: {
                    description: "I can't ban this user!",
                    color: this.client.config.school_color
                }
            });

            if(member.user.id === this.client.config.serverRoles.owner) 
                return message.channel.send({embed: {
                    description: "I can't ban my owner!",
                    color: this.client.config.school_color
                }
            }); 

            if(member.user.id === message.author.id) 
		        return message.channel.send({embed: {
                    description: `You can't ban yourself!`,
                    color: this.client.config.school_color
                }
            });

            if(!reason) {
                message.channel.send({ embed: { description: `You must provide a reason to ban the user!, color: client.config.school_color`}});
            } else {
               await member.ban(reason);
   
               const ban_card = new MessageEmbed()
                   .setColor(this.client.config.school_color)
                   .setTitle(`Ban | ${member.user.tag}`)
                   .addField("User", member, true)
                   .addField("Moderator", `<@${message.author.id}>`, true)
                   .addField("Reason", reason, true)
                   .setTimestamp()
   
               sendMessage(client, client.config.channels.auditlogs, ban_card);
            }
    }
}
