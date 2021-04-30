const { Command } = require("discord.js-commando");
const childProc = require ("child_process");

module.exports = class botoptionsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "botoptions",
            memberName: "botoptions",
            description: "Restart, shutdown, or git-pull the bot!",
            group: "admins",
            guildOnly: true,  
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: "option",
                    prompt: "Please choose a valid option \`restart, shutdown, git-pull\`",
                    type: "string",
                    oneOf: ["restart", "shutdown", "git-pull"],
                }
            ]
        });
    }

	async run ( message, { option }) {   
        if (option === "restart") {
            process.exit(); 
        } else if (option === "shutdown") {
            this.client.destroy;
        } else if (option === "git-pull") {
            childProc.exec("git pull origin master");
        } else {
            this.client.error("Please enter either \`restart\`, \`git-pull\`, or \`shutdown\`!");
        }
                     
        const frames = ["□", "□□□□ 25%", "□□□□□□□□ 50", "□□□□□□□□□□□□ 75%", "□□□□□□□□□□□□□□□□ 100%"];

        const msg = await message.channel.send(`${option}ing the bot...`);
        
        for (const frame of frames) {
            setTimeout(() => {}, 4000);
            await msg.edit({ embed: { description: frame, color: this.client.config.school_color}});
        } 
    }
}; 
