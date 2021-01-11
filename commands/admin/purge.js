const { Command } = require(`discord.js-commando`);

module.exports = class purgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: "purge",
            memberName: "purge",
            description: "Purge 'x' amount of messages!", 
            group: "admins",
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: "number",
                    prompt: "Please mention a user!",
                    type: "string",
                    validate: number => {
                        if(!number.includes(`/^([^0-9]*)$/`) || number < 101) return 'Enter amount less than 101!' 
                    }
                },
            ],
        });
    }   

    async run(client, message, { numberMessages }) { 
        try {
            const deleteCount = parseInt(numberMessages, 10);
   
            await message.channel.bulkDelete(deleteCount + 1)
        } catch(e) {
            console.log(e);
        } 
    }
} 