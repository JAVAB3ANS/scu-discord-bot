const { Command } = require("discord.js-commando");

module.exports = class rpsCommand extends Command {
	constructor(client) {
        super(client, {
          name: "rps",
          group: "fun",
          memberName: "rps",
          description: "Play rock, paper, scissors with the bot!",
          throttling: {
            usages: 2,
            duration: 5,
          }, args: [
			{
			  key: "user",
			  prompt: "Enter an option: `rock`, `paper`, or `scissors`!",
			  type: "string",
			  oneOf: ["rock", "paper", "scissors"],
			},
		  ], 
        });
      }
       
    async run ( message, { user }) {
        let choices = ["rock", "paper", "scissors"];  
        let computer = choices[Math.floor(Math.random() * 3 + 1) - 1]; 
		
        function calculate(user, computer) {
            if (user === "rock" && computer === "scissors" || user === "paper" && computer === "rock" || user === "scissors" && computer === "paper") {
                return `**${message.author}** wins this round!`;
            } else if (computer === "rock" && user === "scissors" || computer === "paper" && user === "rock" || computer === "scissors" && user === "paper") {
                return `**<@${this.client.user.id}>** wins this round!`;
            } else {
                return "It's a tie!";
            }
        }
		
        const rpsEmbed = {
            description: calculate(user, computer),
            title: "__**Your Results**__",
            fields: [ { name: "User Choice", value: user, }, { name: "Computer Choice", value: computer, }, ],
            color: this.client.config.school_color
        };
        message.channel.send({ embed: rpsEmbed });
    }
};
