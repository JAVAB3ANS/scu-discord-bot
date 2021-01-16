const fetch = require("node-fetch");   

module.exports.run = async (client) => { 
    function checkVerifyServerStatus(res) {
        if (res.ok) { // res.status >= 200 && res.status < 300
            client.log(client, `Verification Working`, `:white_check_mark: [${res.statusText}](${client.config.verification.verifyURL})`, "GREEN");
        } else {
            client.log(client, `Verification Error`, `:x: Go to [PiTunnel](https://pitunnel.com) and reset using the following commands: \`\`\`${client.config.verification.mappingRule}\`\`\``, "red");
        }
    }
  
    setInterval(async function() {
        await fetch(client.config.verification.verifyURL).then(checkVerifyServerStatus);
        
        const response = await fetch(client.config.api.discord);
		const body = await response.json();
        if (body.status.description === "All Systems Operational") {
            client.log(client, `${body.status.description}`, "Check the status [here](https://discordstatus.com/)! :white_check_mark:", "GREEN");
        } else {
            client.log(client, `${body.status.description}`, "There seems to be an error with some of the Discord servers. Double check [here](https://status.discordapp.com/)! :x:", "RED");
        }
    }, 300000); //check server status every 5 minutes!
}