const { Command } = require(`discord.js-commando`);

module.exports = class restartCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            memberName: 'restart',
            description: 'Restart the bot!',
            group: 'admins',  
            throttling: {
                usages: 2,
                duration: 5,
            },
        });
    }

	async run (client, message) {   
            try {
                const frames = ['□', '□□□□ 25%', '□□□□□□□□ 50', '□□□□□□□□□□□□ 75%', '□□□□□□□□□□□□□□□□ 100%'];

                const msg = await message.channel.send(`Restarting the bot...`);
                
                for (const frame of frames) {
                    setTimeout(() => {}, 4000);
                    await msg.edit({ embed: { description: frame, color: this.client.config.school_color}});
		        }
            } catch (err) {
                console.log(err.message);
            } finally {
                process.exit();
            } 
    }
} 
