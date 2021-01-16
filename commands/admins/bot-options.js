const { Command } = require("discord.js-commando");

module.exports = class botoptionsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "botoptions",
            memberName: "botoptions",
            description: "Restart or shutdown the bot!",
            group: "admins",
            guildOnly: true,  
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: "option",
                    prompt: "Please choose a valid option \`restart, shutdown\`",
                    type: "string",
                    oneOf: ["restart", "shutdown"],
                }
            ]
        });
    }

	async run ( message, { option }) {   
        if (option === "restart") {
            process.exit(); 
        } else if (option === "shutdown") {
            this.client.destroy;
        } else {
            this.client.error("Please enter either \`restart\` or \`shutdown\`!");
        }
                     
        const frames = ["□", "□□□□ 25%", "□□□□□□□□ 50", "□□□□□□□□□□□□ 75%", "□□□□□□□□□□□□□□□□ 100%"];

        const msg = await message.channel.send("Restarting the bot...");
        
        for (const frame of frames) {
            setTimeout(() => {}, 4000);
            await msg.edit({ embed: { description: frame, color: this.client.config.school_color}});
        } 
    }
}; 
