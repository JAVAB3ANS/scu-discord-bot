let chrono = require("chrono-node");
const moment = require('moment');

module.exports = {
	name: 'remind',
    description: 'Set reminders!',
    args: true,
    usage: `[interval in ms]`, 
    category: 'Utility',
    async execute (client, message, args) {
        
        let messagez = args.join(' ');
        if (messagez.length < 1) return message.channel.send({ embed: { description: 'Incorrect format. !reminder <minutes> <message>', color: client.config.school_color}});
        return new Promise((resolve) => {
            if (!isNaN(messagez[0])) {
            const time = parseInt(messagez[0]);
            if (time > 2880 || isNaN(time)) return message.channel.send({embed: { description: 'Maximum time is 2 days (2880 minutes)', color: client.config.school_color}});
            if (time < 1) return message.channel.send({embed: { description: 'Time must be at least 1 minute.', color: client.config.school_color}});
            setTimeout(() => {
                message.channel.send({ embed: { description: `Remember: ${messagez.split(' ').slice(1).join(' ')}!`, color: client.config.school_color}});
            }, time * 60000);
            const minutemessage = time === 1 ? 'minute' : 'minutes';
            return message.channel.send({embed: { description: `Reminding you in ${time} ${minutemessage}.`, color: client.config.school_color}});
            }

            const results = chrono.parse(messagez);
            if (results.length === 0) return message.channel.send({ embed: { description: 'Error parsing date. Try using format: >remind <minutes> <message>', color: client.config.school_color}});

            let endTime = moment(results[0].start.date());
            const currentTime = new moment();
            let duration = moment.duration(endTime.diff(currentTime));
            let minutes = Math.round(duration.asMinutes());

            if (minutes < 1) { //here is a change in the file
            if (results[0].end) {
                endTime = results[0].end.date();
                duration = moment.duration(endTime.diff(currentTime));
                minutes = duration.asMinutes();
            }
            if (minutes < 1) {
                return message.channel.send({embed: {description: 'Time must be at least 1 minute.', color: client.config.school_color}})
            }
            }
            if (minutes > 2880) return message.channel.send({embed: { description: 'Maximum time is 2 days (2880 minutes)', color: client.config.school_color}});

            setTimeout(() => {
            message.channel.send({embed: { description: `Remember: "${messagez}"!`, color: client.config.school_color}});
            }, minutes * 60000);
            const minutemessage = minutes === 1 ? 'minute' : 'minutes';
            return message.channel.send({embed: { description: `Reminding you in ${minutes} ${minutemessage} for ${messagez}.`, color: client.config.school_color}});
        });
    }
}