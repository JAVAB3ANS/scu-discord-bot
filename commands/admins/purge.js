const { Command } = require("discord.js-commando");

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
                    prompt: "Please specify a number below 101!",
                    type: "integer",
                    validate: (numberMessages) => {
                        if(numberMessages > 101 || numberMessages < 0) {
                            return "Enter amount less than 101!";
                        }
                    }
                },
            ],
        });
    }   

    async run( message, { numberMessages }) {  
        const deleteCount = parseInt(numberMessages, 10);

        await message.channel.bulkDelete(deleteCount + 2); //includes bot message afterwards as well
        
    }
}; 