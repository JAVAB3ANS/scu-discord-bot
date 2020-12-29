const frames = [
	'(-°□°)-  ┬─┬',
	'(╯°□°)╯    ]',
	'(╯°□°)╯  ︵  ┻━┻',
	'(╯°□°)╯       [',
    '(╯°□°)╯           ┬─┬',
];

module.exports = {
	name: 'tableflip',
    description: 'For flipping tables!',
    category: 'Fun',
    async execute(client, message, args) { 
        
        const msg = await message.channel.send('(\\\\°□°)\\\\  ┬─┬');
        for (const frame of frames) {
            setTimeout(() => {}, 5000);
            await msg.edit(frame);
        }
    }
}