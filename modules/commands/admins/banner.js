const { MessageEmbed } = require("discord.js"); //for embed functionality 
const { Command } = require("discord.js-commando");

module.exports = class bannerCommand extends Command {
    constructor(client) {
        super(client, {
            name: "banner",
            memberName: "banner",
            description: "Create an image banner from the images in my folder!", 
            group: "admins",
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: "fileName",
                    prompt: "Please provide a proper file name!",
                    type: "string",
                    validate: fileName => {
                        if(!fileName.match(/[a-zA-Z0-9\s_\\.\-\(\):])+(.jfif|.jpeg|.png|.gif|.jpg)$/)) {
                            return "Please enter a proper file type!";
                        }
                    }
                },
            ],
        });
    }   

    async run ( message, { fileName }) {
            try {
                const imageEmbed = new MessageEmbed()
                .attachFiles([`./assets/${fileName}`])
                .setImage(`attachment://${fileName}`)
                .setColor(this.client.config.school_color);

                message.channel.send(imageEmbed);
            } catch (err) {
                if (err) throw err;
            }
    }
}
