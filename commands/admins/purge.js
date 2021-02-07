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
                    key: "numberMessages",
                    prompt: "Please specify a number between 2 and 101!",
                    type: "string", 
                    validate: ((numberMessages) => {
                        if (numberMessages.match(/^[0-9]*$/)) {
                            return true;
                        } else {
                            return "Please enter a number between 1 and 101!"
                        }
                    })
                },
            ],
        });
    }   

    async run( message, { numberMessages }) {  
        let number = Number(numberMessages);
        number = parseInt(number);

        if (number < 1 || number > 101) {
            return this.client.error("Please enter a number between 1 and 101!");
        }

        await message.channel.bulkDelete(number + 1, true);
    }
}