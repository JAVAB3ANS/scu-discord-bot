const fetch = require("node-fetch");  
const { sendMessage } = require("./sendMessage.js"); 

module.exports.run = async (client) => { 
    function checkVerifyServerStatus(res) {
        if (res.ok) { // res.status >= 200 && res.status < 300
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Verification Working`, description: `:white_check_mark: [${res.statusText}](${client.config.verification.verifyURL})`, color: "GREEN"}});
        } else {
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Verification Error`, description: `:x: Go to [PiTunnel](https://pitunnel.com) and reset using the following commands: \`\`\`${client.config.verification.mappingRule}\`\`\``, color: "red"}});
        }
    }
  
    setInterval(async function() {
        await fetch(client.config.verification.verifyURL).then(checkVerifyServerStatus);
        
        const response = await fetch(client.config.api.discord);
		const body = await response.json();
        if (body.status.description === "All Systems Operational") {
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `${body.status.description}`, description: "Check the status [here](https://discordstatus.com/)! :white_check_mark:", color: "GREEN"}});
        } else {
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `${body.status.description}`, description: "There seems to be an error with some of the Discord servers. Double check [here](https://status.discordapp.com/)! :x:", color: "RED"}});
        }
    }, 300000); //check server status every 5 minutes!
}