module.exports  = {
    name: 'dm',
    description: 'Direct message!',   
    args: true,
    usage: `[@user]`, 
    category: 'Admin',  
    async execute(client, message, args) {

        let isAdmin = require(`../../modules/isAdmin.js`);
        
        if(isAdmin(message, false)) {
            if (args[0] == null) {
                return message.channel.send({ embed: { title: `Here's an example:`, description: `${client.config.prefix}dm [@user] [message]`, color: client.config.school_color}});
              } else {
                try {
                    let member = message.guild.member(message.mentions.users.first());
                    let msgSender = args.join(" ").replace(`${member}`, "\n");
                    member.send(msgSender);
                    message.channel.stopTyping(true);
                } catch (e) {
                    error("There was an error sending that DM", message);
                }
            }
        }  
    }
}