const { Command } = require("discord.js-commando");

module.exports = class shutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shutdown",
            description: "Shut down the bot!",
            group: "admins",  
            memberName: "shutdown",
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }
            
    async run ( message) {  
        const frames = ["□", "□□□□ 25%", "□□□□□□□□ 50", "□□□□□□□□□□□□ 75%", "□□□□□□□□□□□□□□□□ 100%"];

        const msg = await message.channel.send("Shutting down the bot...");
        
        for (const frame of frames) {
            setTimeout(() => {}, 4000);
            await msg.edit({ embed: { description: frame, color: this.client.config.school_color}});
        }

        this.client.destroy(err => { ; 
            console.log(err);
        }); 
    }
}
