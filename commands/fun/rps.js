module.exports =  {  
    name: 'rps',
    description: 'Play rock, paper, scissors!',
    args: true,
    usage: `[Choose rock, paper, or scissors]`, 
    category: 'Fun',
	async execute(client, message, args) {
        
        let choices = ["rock", "paper", "scissors"]; 
		
        let computer = choices[Math.floor(Math.random() * 3 + 1) - 1];
        let user = args[0];
		
        function calculate(user, computer) {
            if (user == "rock" && computer == "scissors" || user == "paper" && computer == "rock" || user == "scissors" && computer == "paper") {
                return `**${message.author}** wins this round!`;
            } else if (computer == "rock" && user == "scissors" || computer == "paper" && user == "rock" || computer == "scissors" && user == "paper") {
                return `**<@${client.user.id}>** wins this round!`;
            } else {
                return `It's a tie!`;
            }
        }
		
        const rpsEmbed = {
            description: calculate(user, computer),
            title: `__**Your Results**__`,
            fields: [ { name: "User Choice", value: user, }, { name: "Computer Choice", value: computer, }, ],
            color: client.config.school_color
        };
        message.channel.send({ embed: rpsEmbed });
    }
}
