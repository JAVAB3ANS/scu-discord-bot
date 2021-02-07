const { MessageEmbed } = require("discord.js");
const nodemailer = require("nodemailer");
const dot = require("dot");
const fs = require("fs");  
const _ = require("lodash");
const { Command } = require("discord.js-commando"); 
const paginationEmbed = require("discord.js-pagination"); 
const uniqueID = new Set();

module.exports = class verifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "verify",
            memberName: "verify",
            description: "Verify yourself as a student!", 
			group: "utility",
			guildOnly: true,
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                    key: "firstName",
                    prompt: "Please enter your first name!",
                    type: "string",
                    oneOf: ["Bucky"],
                    validate: (firstName) => {
                        if (/[A-Z][a-z]\S*$/.test(firstName)) {
                            return true;
                        } else {
                            return "Please enter first name only!";
                        }
                    }
                },
                {
                    key: "majorName",
                    prompt: "Please enter your major/program of study!",
                    type: "string",
                    oneOf: ["NEURO SCI"],
                    validate: (majorName) => {
                        const major = this.client.config.serverRoles.majors[0]; 
                        //majorName = majorName.split(" ").slice(1).join(" ");  
                        if (majorName.includes(Object.values(major.Arts[0])) || majorName.includes(Object.values(major.Business[0])) || majorName.includes(Object.values(major.Engineering[0]))) { // Correct major/program of study
                            return true;
                        } else {
                            return "Please enter a valid major/program of study!";
                        } 
                    }
                },
                {
                    key: "statusName",
                    prompt: "Please enter your SCU status!",
                    type: "string",
                    oneOf: ["Alumni"],
                    validate: (statusName) => {
                        //statusName = statusName.split(" ").slice(1).join(" ");
                        for (let i = 0; i < (this.client.config.serverRoles.statuses).length; i++) {
                            if (statusName.includes(this.client.config.serverRoles.statuses[i])) { // Correct major/program of study
                                return true;
                            } else {
                                return "Please enter a valid status!";
                            }
                        } 
                    }
                },
                {
                    key: "emailAddress",
                    prompt: "Please enter your SCU email!",
                    type: "string",
                    oneOf: ["bbronco@scu.edu"],
                    validate: (emailAddress) => {
                        if (/\w+@scu.edu$/.test(emailAddress)) { // Correct email
                            return true;
                        } else {
                            return "Please enter a valid email address!";
                        } 
                    }
                }, 
            ]
        });
    }

    async run ( message ) {
        
        const guild = this.client.guilds.cache.get(this.client.config.verification.guildID);

        if (message.channel.id !== this.client.config.channels.roles) {
            return this.client.error(`This can only be used in the <#${this.client.config.channels.roles}> channel!`, message);
        } 

        if (message.member.roles.cache.has(this.client.config.serverRoles.unverifiedStudent)) {  

            if (!uniqueID.has(message.author.id)) {
                uniqueID.add(message.author.id);
            }

            const verifyMSG = new MessageEmbed()
            .setDescription(`Please give the following as separate messages and you've be verified shortly:`)
            .setTitle(`${message.guild.name} Verification!`)
            .setColor(this.client.config.school_color)

            const majorEmbed = new MessageEmbed()
            .setTitle(`List of ${message.guild.name}'s Undergraduate Major Roles!`)
            .addField(`\`\`\`${Object.keys(this.client.config.serverRoles.majors[0].Arts[0].join("\n"))}\`\`\``, `\`\`\`${Object.values(this.client.config.serverRoles.majors[0].Arts).join("\n")}\`\`\``, true)
            .addField(`\`\`\`${Object.keys(this.client.config.serverRoles.majors[0].Business[0].join("\n"))}\`\`\``, `\`\`\`${Object.values(this.client.config.serverRoles.majors[0].Business).join("\n")}\`\`\``, true)
            .addField(`\`\`\`${Object.keys(this.client.config.serverRoles.majors[0].Engineering[0].join("\n"))}\`\`\``, `\`\`\`${Object.values(this.client.config.serverRoles.majors[0].Engineerings).join("\n")}\`\`\``, true)
            .setColor(this.client.config.school_color)  

            const statusEmbed = new MessageEmbed()
            .setTitle(`List of ${message.guild.name}'s Status Roles`)
            .setDescription(`\`\`\`${Object.values(this.client.config.serverRoles.statuses).join("\n")}\`\`\``)
            .setColor(this.client.config.school_color)

            const pages = [verifyMSG, majorEmbed, statusEmbed];
            const emojiList = ["⏪", "⏩"]; 
            await paginationEmbed(message, pages, emojiList);    
        
            const transporter = nodemailer.createTransport({
                service: "gmail",  
                auth: {
                    user: this.client.config.email.username,
                    pass: this.client.config.email.password,
                }, 
            });  
            
            const rawHTML = await fs.readFileSync("./assets/templateFiles/email.html"); 
            const tempFn = dot.template(rawHTML);
            const keycode = [0, 0, 0, 0].map(() => _.random(0, 9)).join("");
            const result = tempFn({ keycode }); 
        
            const mailOptions = {
                from: `${message.guild.name} <${this.client.config.email.username}>`,
                to: `${firstName} <${emailAddress}>`,
                subject: `${message.guild.name} Verification`,
                html: result,
                text: `${firstName}, thank you for verifying yourself in the server!\nVerification Code: ${keycode}\nTo verify yourself as a student, please respond back to the bot in a private message with the verification code above. This step will only be available for a short time. If you fail to verify your account, you will need to restart this process.\nIf you are not the intended recipient of this email, please contact ${this.client.config.email.username}.`,
            };
        
            transporter.sendMail(mailOptions, async (error) => {
                if (error) {
                    return this.client.error("Error occurred while sending email. Please redo the command.", error.message);
                } else { 
                    await message.author.send({ embed: { title: `Email sent successfully!`, description: `Email sent to **${emailAddress}**. Check your school email for your verification code, then type in the keycode here right away!`, color: this.client.config.school_color}});
                    const keycodeFilter = (m) => { // Give the user some feedback
                        if (m.author.bot) { // Don't listen to bot messages
                            return false;
                        }
                        if (m.toString() === keycode) { // Correct keycode
                            return true;
                        }
                        this.client.error("Invalid keycode. Please try again.", m); // Incorrect keycode
                        return false;
                    }; 
                
                    await message.channel.awaitMessages(keycodeFilter, { max: 1, time: 600000, errors: ["time"] }); // about 10 minutes 
                    await message.member.roles.remove(guild.roles.cache.find((role) =>  role.id === this.client.config.serverRoles.unverifiedStudent));

                    if (statusRole === "SCU Faculty/Staff") {
                        await message.member.roles.add(guild.roles.cache.find((role) => role.id === this.client.config.serverRoles.verifiedPersonnel)); //the SCU Faculty/Staff role
                        await message.member.setNickname(`${firstName}`);
                    } else {
                        await message.member.setNickname(`${firstName} || ${majorName}`);
                        await message.member.roles.add(guild.roles.cache.find((role) => role.id === this.client.config.serverRoles.verifiedStudent)).then(() => {
                            message.author.send(`<@${message.author.id}> , You have been given the **<@&${this.client.config.serverRoles.verifiedStudent}>** role!`);
                        });
                        await message.member.roles.add(guild.roles.cache.find((role) => role.id === majorName.id)).then(() => {
                            message.author.send(`<@${message.author.id}> , You have been given the **<@&${majorName}>** role!`);
                        }); 
                    }  

                    await message.member.roles.add(guild.roles.cache.find((role) => role.id === statusRole.id)).then(() => {
                        message.author.send(`<@${message.author.id}> , You have been given the **<@&${statusRole}>** role!`);
                    });
                }
            });
 
            uniqueID.delete(message.author.id); 
        }
    }
}