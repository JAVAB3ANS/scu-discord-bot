const { Command } = require("discord.js-commando");

const frames = [
	"(-°□°)-  ┬─┬",
	"(╯°□°)╯    ]",
	"(╯°□°)╯  ︵  ┻━┻",
	"(╯°□°)╯       [",
  "(╯°□°)╯           ┬─┬",
];

module.exports = class tableFlipCommand extends Command {
    constructor(client) {
        super(client, {
          name: "tableflip",
          group: "fun",
          memberName: "tableflip",
          description: "For flipping tables!",
          throttling: {
            usages: 2,
            duration: 5,
          }
        });
      } 

    async run( message) { 
        
        const msg = await message.channel.send("(\\\\°□°)\\\\  ┬─┬");
        for (const frame of frames) {
            setTimeout(() => {}, 5000);
            await msg.edit(frame);
        }
    }
};