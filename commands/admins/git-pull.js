const child_proc = require('child_process');
const { Command } = require(`discord.js-commando`);

module.exports = class gitPullCommand extends Command {
    constructor(client) {
        super(client, {
            name: "git-pull",
            memberName: "git-pull",
            description: "Git pulls from my repo!", 
            group: "admins",
            throttling: {
                usages: 2,
                duration: 5,
	    },
        });
    }

    async run ( message) {
        try {
            const frames = [`□`, `□□□□ 25%`, `□□□□□□□□ 50%`, `□□□□□□□□□□□□ 75%`, `□□□□□□□□□□□□□□□□ 100%`, `Finished pulling from [scu-discord-bot](https://github.com/jasonanhvu/scu-discord-bot)!`];
            const msg = await message.channel.send("Pulling...");
        
            child_proc.exec("git pull origin master");
        
            for (const frame of frames) {
                setTimeout(() => {}, 4000);
                await msg.edit({ embed: { description: frame, color: this.client.config.school_color}});
            }
        } catch (err) {
            console.log(err.message);
        }
    }
} 
