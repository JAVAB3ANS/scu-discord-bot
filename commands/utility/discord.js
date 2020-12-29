const fetch = require(`node-fetch`);

module.exports  = {
    name: 'discord',
    description: 'Checks app statuses of school platforms!',
    category: 'Utility', 
    async execute(client, message, args) {

        //STATUS CHECKERS  
        const response = await fetch(`https://status.discord.com/api/v2/status.json`);  
        
        const body = await response.json();

        if (!response.ok) {
            throw Error("Error! Please tell the bot author.");
        }

        if (body.status.description === "All Systems Operational") {
            message.channel.send({ embed: { title: `:white_check_mark: ${body.status.description}`, description: `Check the status [here](https://status.discord.com/api/v2/status.json)! :white_check_mark:`, color: "GREEN", timestamp: new Date()}});
        } else {
            message.channel.send({ embed: { title: `:x: ${body.status.description}`, description: `There seems to be an error with some of the servers. Double check [here](https://status.discord.com/api/v2/status.json)! :x:`, color: "RED", timestamp: new Date()}});
        } 
    }
}
