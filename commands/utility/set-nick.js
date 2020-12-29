module.exports = { 
    name: 'set-nick',
    description: 'Set nickname!',
    args: true,
    usage: `[@user mention] ~ [new nickname]`, 
    category: 'Utility',
	async execute(client, message, args) {
        try {

            const prompt = args.join(" ").trim().split(" ~ ");
            let member = message.mentions.members.first();
            
            member = await member.setNickname(`${prompt[1]}`);

            const nicknameEmbed = { 
                title: `__**Nickname Changed!**__`,
                description: `${member.displayName} is <@${member.user.id}>'s new nickname!`, 
                color: client.config.school_color
            };

            message.channel.send({ embed: nicknameEmbed});
        } catch (err) {
            console.log(err);
        }
    }
}