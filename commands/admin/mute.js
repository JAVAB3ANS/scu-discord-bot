const { MessageEmbed } = require(`discord.js`); //for embed functionality
const ms = require('ms');
let sendMessage = require(`../../modules/sendMessage.js`); 

module.exports = {
    name: 'mute',
    description: 'Mute members!',
    usage: `[@user] | [insert time/reason]`,
    args: true, 
    category: 'Admin',  
    async execute(client, message, args) {   
            let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

            let Time = args.slice(1).join(" ");
            if (!Time) Reason = "No time given!";
    
            let muterole = message.guild.roles.cache.find(x => x.name === "Muted");
            if(!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                        data: {
                            name: "Muted",
                            color: "#514f48",
                            permissions: []
                        }
                    });
                    message.guild.channels.cache.forEach(async (channel, id) => {
                        await channel.updateOverwrite(muterole, {
                          SEND_MESSAGES: false,
                          ADD_REACTIONS: false
                        });
                    });
                } catch(e) {
                    sendMessage(client, client.config.channels.auditlogs, e.stack);
                }
            }
            
            let time = args[1];
            if(!time) {
                if (user.roles.cache.has(muterole.id)) return message.channel.send({embed: { description: "The user id still muted.", color: client.config.school_color}})
                await (user.roles.add(muterole.id).catch(err => console.log(`Error: ${err}`)))
                //return message.channel.send(`${user.user.tag} is now muted.`);
                const muteEmbed = new MessageEmbed()
                .setTitle(`You have muted the user ${user.user.username}!`)
                sendMessage(client, client.config.channels.auditlogs, muteEmbed);
    
            } else {
                if (user.roles.cache.has(muterole.id)) return message.channel.send({embed: {description: `${user.user.username} still muted.`, color: client.config.school_color}})
                await (user.roles.add(muterole.id));
    
                let timer = setTimeout(function() {
                    user.roles.remove(muterole.id);
                    const unmuteEmbed = new MessageEmbed()
                    .setTitle(`${user.user.username} is now unmuted!`)
                    sendMessage(client, client.config.channels.auditlogs, unmuteEmbed);
                }, ms(time))
    
                client.mute.set(message.author.id, timer);
                const auditEmbed = new MessageEmbed()
                .setTitle(`You have muted the user ${user.user.username}!`)
                .setDescription(`Time: ${ms(ms(time), {long: true})}`)
                sendMessage(client, client.config.channels.auditlogs, auditEmbed);   
            }
    }
}
