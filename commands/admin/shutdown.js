module.exports =  {  
    name: 'shutdown',
    description: 'Shut down the bot!',
    category: 'Admin',  
    async execute(client, message, args) { 
            try {
                const frames = ['□', '□□□□ 25%', '□□□□□□□□ 50', '□□□□□□□□□□□□ 75%', '□□□□□□□□□□□□□□□□ 100%'];

                const msg = await message.channel.send(`Shutting down the bot...`);
                
                for (const frame of frames) {
                    setTimeout(() => {}, 4000);
                    await msg.edit({ embed: { description: frame, color: client.config.school_color}});
                }

                return message;

            } catch (err) {
                console.log(err.message);
            } finally {
                client.destroy(err => {
                    console.log("====================");
                    console.log("Command: [!@shutdown] run by " + message.author.username);
                    console.log("====================");
                    console.log(err);
                });
            } 
    }
}
