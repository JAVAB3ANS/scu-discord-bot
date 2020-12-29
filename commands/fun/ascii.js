const figlet = require('figlet');

module.exports = {
    name: "ascii",
    description: "Converts text to ascii",
    category: "Fun",
    args: true,
    usage: "<insert text>",
    async execute (client, message, args){

        const msg = args.join(" ");

        figlet.text(msg, function (err, data){
            if(err){
                console.log('Something went wrong');
                console.dir(err);
            }
            
            if(data.length > 2000) return message.channel.send({ embed: { description: `Please provide text shorter than 2000 characters`, color: client.config.school_color}});
         
            message.channel.send({ embed: { description: `\`\`\`${data}\`\`\` `, color: client.config.school_color}});
        })
    }
}
