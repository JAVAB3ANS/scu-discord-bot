const fetch = require(`node-fetch`); 
const sendMessage = require(`./sendMessage.js`);

module.exports.run = async (client) => {
    const url = client.config.verification.verifyURL;

    function checkStatus(res) {
        if (res.ok) { // res.status >= 200 && res.status < 300
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Verification Working :white_check_mark:`, description: `[${res.statusText}](${url})`, color: `GREEN`}});
        } else {
            sendMessage(client, client.config.channels.auditlogs, { embed: { title: `Verification Error :x:`, description: `Go to [PiTunnel](https://pitunnel.com) and reset using the following commands: \`\`\`${client.config.verification.mappingRule}\`\`\``, color: client.config.school_color}});
        }
    }
     
    fetch(url).then(checkStatus);
    
    setInterval(function() {
        fetch(url).then(checkStatus);
    }, 600000); //check server status every 5 minutes!
}