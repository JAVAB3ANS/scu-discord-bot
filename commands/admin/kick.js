const { MessageEmbed } = require(`discord.js`); //for embed functionality
let sendMessage = require(`../../modules/sendMessage.js`);

module.exports = {
	name: 'kick',
    description: 'Kick a member!',
    guildOnly: true,
    args: true,
    usage: `[@user mention] [reason]`,
    category: 'Admin',  
	async execute(client, message, args) {    
            const member = message.mentions.members.first();

            if(!member.kickable) return message.channel.send({embed: {
                description: "I can't kick this user!",
                color: client.config.school_color
                }
            })
            
            if(member.user.id === client.config.serverRoles.owner) 
                return message.channel.send({embed: {
                    description: "I can't kick my owner!",
                    color: client.config.school_color
                }
            })

            if(member.user.id === message.author.id) return message.channel.send({embed: {
                description: `You can't kick yourself!`,
                color: client.config.school_color
                }
            })

            const reason = args.slice(1).join(" ");

            if(!reason) {
                message.channel.send({ embed: { description: `You must provide a reason to kick the user!`, color: client.config.school_color}});
            } else {
                await member.kick(reason);
		
                const kick_card = new MessageEmbed()
                .setColor(client.config.school_color)
                .setTitle(`Kick | ${member.user.tag}`)
                .addField("User", member, true)
                .addField("Moderator", `<@${message.author.id}>`, true)
                .addField("Reason", reason, true)
                .setTimestamp()

                sendMessage(client, client.config.channels.auditlogs, kick_card);
	        }
    }
}
