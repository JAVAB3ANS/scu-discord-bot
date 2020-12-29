/*
==========================================================================================
  _      ____   _____ _____ _   _ 
 | |    / __ \ / ____|_   _| \ | |
 | |   | |  | | |  __  | | |  \| |
 | |   | |  | | | |_ | | | | . ` |
 | |___| |__| | |__| |_| |_| |\  |
 |______\____/ \_____|_____|_| \_|
==========================================================================================                                    
*/

let sendMessage = require(`../modules/sendMessage.js`);
const fetch = require(`node-fetch`);

module.exports = async (client) => {
	try {
		client.user.setPresence({activity: { name: `${client.config.prefix}help || DM me for help! 📩` }, status: 'online'}) 

		require("../modules/serverVerification.js").run(client); //start server verification module in ready event 
		require("../modules/serverStatus.js").run(client); //start verification server checker module in ready event
		require("../modules/questionofDay.js").run(client); //start question module in ready event 

		/* DISCORD STATUS CHECKER */
		const url = client.config.verification.status;
		const response = await fetch(url);
		const body = await response.json();

		if (!response.ok) {
			throw Error("Error: DISCORD_STATUS_REQUEST. Please tell the bot author.");
		}

		if (body.status.description === "All Systems Operational") {
			sendMessage(client, client.config.channels.auditlogs, { embed: { title: `${body.status.description}`, description: "Check the status [here](https://discordstatus.com/)! :white_check_mark:", color: "GREEN", timestamp: new Date()}});
		} else {
			sendMessage(client, client.config.channels.auditlogs, { embed: { title: `:x: ${body.status.description}`, description: "There seems to be an error with some of the Discord servers. Double check [here](https://status.discordapp.com/)! :x:", color: "RED", timestamp: new Date()}});
		}

		sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Hooray!`, description: "All commands and events work! :white_check_mark:", color: "GREEN", timestamp: new Date()}});
	} catch (err) {
		console.log(err);
	}
}
