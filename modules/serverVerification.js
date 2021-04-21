const { log } = require("../functions/log.js"); 
const nodemailer = require("nodemailer"); 
const fs = require("fs");

module.exports.run = async (client) => { 
    
    function sendAuthEmail(email, name, discorduser) { 
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: client.config.email.username,
                pass: client.config.email.password
            }
        });
         
        fs.readFile("./assets/templateFiles/email.html", "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
            const result = data.replace(/NAME/g, name).replace(/DISCORDUSER/g, discorduser);
        
            const mailOptions = {
                from: `${message.guild.name} <${this.client.config.email.username}>`,
                to: `<email>`,
                subject: `${message.guild.name} Verification`,
                html: result,
                text: `${firstName}, thank you for verifying yourself in the server!\nIf you are not the intended recipient of this email, please contact ${this.client.config.email.username}.`,
            };
        
            // finally sends the email to the user with the code so they know what it is!
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    client.console(error);
                } else {
                    client.console("Email sent: " + info.response);
                    log(
                        `${client.config.channels.auditlogs}`,
                        `Email sent to ${name} (${discorduser}) with the email adress ${email} for server verification.`
                    );
                }
            });
        });
    }
    
    //TypeForm Responses Webhook server
    function typeFormServer() {
        const http = require("http");
        const options = {
        key: fs.readFileSync("./https/key.pem"),
        cert: fs.readFileSync("./https/cert.pem"),
        method: "POST",
        path: "/typeform"
        };
        client.console("HTTP Server | Listening for requests".red);
        http
        .createServer(options, function(req, res) {
            let body = "";
            req.setEncoding("utf8");
            req.on("data", function(chunk) {
            body += chunk;
        });

        req.on("end", function() {
            if (body) {
                client.console("Crypto | Verified");
                let data = JSON.parse(body);
                console.log(data);
    
                let discorduser = data[2].answer; //discord username
                let discordid = client.users.cache.find(user => user.tag === `${discorduser}`);
    
                let email = data[1].answer; //email
                let name = data[0].answer; //name
                veriEnmap.defer.then(() => {
                sendAuthEmail(email, name, discorduser);
                client.console(`Auth email sent to ${email}`);
                veriEnmap.defer.then(() => {
                        veriEnmap.set(`${discordid.id}`, {
                        name: `${name}`,
                        email: `${email}`,
                        class: `${data[3].answer}`,
                        roles: data[4].answer
                    });
    
                    discordid.send(
                        `You have been sucessfully verified in the Discord server. If you believe this was an error email us at vchsesports@gmail.com\n\nConfirmation Info:\n\`\`\`Discord: ${discorduser}\nEmail: ${veriEnmap.get(
                            discordid.id,
                            "email"
                        )}\`\`\``
                    );
                    let guild = client.guilds.cache.get(`${client.config.verification.guildID}`);
                    let join = guild.channels.cache.find(jn => jn.name === `${client.config.channels.welcome}`);
                    join.send(`✅ **${discordid.username}** has been verified, welcome ${name}.`);
                    console.log(
                    `set enmap data\n${name}\n${email}\n${discordid.username}\nwith given username: ${discorduser}`
                    );
                    let addRole = guild.roles.cache.find(r => r.name === `${client.config.serverRoles.verifiedStudent}`);

                    // add the roles
                    guild.members
                        .get(discordid.id)
                        .addRole(addRole)
                        .catch(console.error);
                    // set nickname
                    guild.members
                        .get(discordid.id)
                        .setNickname(
                        `${discordid.username} (${veriEnmap.get(`${discordid.id}`, "name")})`,
                        "Joined server."
                        );
                    client.console("Updated user: " + discorduser);
                    veriEnmap.get(discordid.id, "roles").forEach(function(choice) {
                        let role = guild.roles.cache.find(r => r.name === `${choice}`);
                        guild.members.cache.get(discordid.id).addRole(role);
                    });
                    //set class (freshman, sophomore, junior, senior, etc)
                    let collegeClass = guild.roles.cache.find(r => r.name === `${veriEnmap.get(discordid.id, "class")}`);
                    guild.members.cache.get(discordid.id).addRole(collegeClass);
                });
                });
                res.end("<h1>Complete</h1>");
            } else {
                client.console("Crypto | Invalid Signature");
                return res.end("<h1>Error</h1>");
            }
            });
        })
        .listen(4000);
    }
    typeFormServer(); 
};