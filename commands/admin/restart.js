 module.exports =  {  
	name: 'restart',
	description: 'Restart the bot!',
	cooldown: 15,
	category: 'Admin',  
	async execute(client, message, args) {   
            try {
                const frames = ['□', '□□□□ 25%', '□□□□□□□□ 50', '□□□□□□□□□□□□ 75%', '□□□□□□□□□□□□□□□□ 100%'];

                const msg = await message.channel.send(`Restarting the bot...`);
                
                for (const frame of frames) {
                    setTimeout(() => {}, 4000);
                    await msg.edit({ embed: { description: frame, color: client.config.school_color}});
		        }
            } catch (err) {
                console.log(err.message);
            } finally {
                process.exit();
            } 
    }
} 
