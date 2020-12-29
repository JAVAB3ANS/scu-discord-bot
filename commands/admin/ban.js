const { MessageEmbed } = require(`discord.js`); //for embed functionality
let sendMessage = require(`../../modules/sendMessage.js`); 

module.exports = {
	name: 'ban',
    description: 'Ban a member!',
    args: true,
    usage: `[@user mention] [reason]`, 
    category: 'Admin',  
	async execute(client, message, args) {   
            const member = message.mentions.members.first();

            if(!member.bannable) 
                return message.channel.send({embed: {
                    description: "I can't ban this user!",
                    color: client.config.school_color
                }
            });

            if(member.user.id === client.config.serverRoles.owner) 
                return message.channel.send({embed: {
                    description: "I can't ban my owner!",
                    color: client.config.school_color
                }
            }); 

            if(member.user.id === message.author.id) 
		        return message.channel.send({embed: {
                    description: `You can't ban yourself!`,
                    color: client.config.school_color
                }
            });

            const reason = args.slice(1).join(" ");

            if(!reason) {
                message.channel.send({ embed: { description: `You must provide a reason to ban the user!, color: client.config.school_color`}});
            } else {
               await member.ban(reason);
   
               const ban_card = new MessageEmbed()
                   .setColor(client.config.school_color)
                   .setTitle(`Ban | ${member.user.tag}`)
                   .addField("User", member, true)
                   .addField("Moderator", `<@${message.author.id}>`, true)
                   .addField("Reason", reason, true)
                   .setTimestamp()
   
               sendMessage(client, client.config.channels.auditlogs, ban_card);
            }
    }
}
