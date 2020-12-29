const fetch = require(`node-fetch`); 
const sendMessage = require(`./sendMessage.js`);

module.exports.run = async (client) => {
    const url = client.config.verification.verifyURL;
    const status = await fetch(url);
    const getStatus = await status.text();
    
    setInterval(() => {
        if (!status.ok) {
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Verification Error :x:`, description: `Go to [PiTunnel](https://pitunnel.com) and reset using the following commands: \`\`\`${client.config.verification.mappingRule}\`\`\``, color: client.config.school_color}});
        } else {
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Verification Server Up!`, description: `${getStatus} - Check the status [here](${url})!`, color: client.config.school_color}});
        } 
    }, 54000 * 1000); //check server status every 15 hours
}