const { MessageEmbed } = require(`discord.js`); //for embed functionality

module.exports = {
    name: 'random-color', //forked from Raptor SA
    description: 'Generate a random color!', //here is a change in the file
    category: 'Utility',
    async execute (client, message, args) {
    
        const randomNumber = Math.floor(Math.random()*16777215).toString(16);

        function hexToDec(randomNumber){
            return parseInt(randomNumber, 16);
        }

        const randomNumberEmbed = new MessageEmbed()
        .setColor(randomNumber)
        .setTitle(`Here's your random color!`)
        .setDescription(`- Hexadecimal Value: #${randomNumber}\n` + "- Decimal Value: " + hexToDec(randomNumber))
        .setFooter(`Brought to you by the server lords!`)
        .setTimestamp()

        await message.channel.send(randomNumberEmbed).catch(err => `Error: ${err}`)
        }
}