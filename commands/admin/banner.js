const { MessageEmbed } = require(`discord.js`); //for embed functionality

module.exports = {
    name: 'banner',
    description: 'Create a cool embed banner with images in my folder!',
    args: true,
    usage: `[file name and extension]`, 
    category: 'Admin',  
    async execute (client, message, args) {

        let isAdmin = require(`../../modules/isAdmin.js`);
        
        if(isAdmin(message, false)) {
            message.delete();

            try {
                const input = args[0];

                const imageEmbed = new MessageEmbed()
                .attachFiles([`./assets/${input}`])
                .setImage(`attachment://${input}`)
                .setColor(client.config.school_color)

                message.channel.send(imageEmbed);
            } catch (err) {
                console.log(err);
            }
        }
    }
}