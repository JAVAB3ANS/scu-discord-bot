const {
    Command
} = require("discord.js-commando");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const dot = require("dot");
const fs = require("fs-extra");
const uniqueID = new Set();

// Metadata
module.exports = class verifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: "verify",
            group: "practicality",
            memberName: "verify",
            description: "Verify yourself as a student.",
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [{
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
            }, ]
        })
    }

    async run(message, { emailAddress }) {
        message.delete();

        const guild = this.client.guilds.cache.get(this.client.config.guildID);

        if (message.member.roles.cache.some((role) => role.name === "student")) {
            return this.client.error(`This user is already verified!`, message);
        }

        if (message.channel.id !== this.client.config.channels.access) {
            return this.client.error(`This can only be used in the <#${this.client.config.channels.access}> channel!`, message);
        } 

        if (!uniqueID.has(message.author.id)) {
            uniqueID.add(message.author.id);
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use SSL
            auth: {
                user: this.client.config.email.username,
                pass: this.client.config.email.password,
            },
        });

        const rawHTML = await fs.readFile(`./assets/templateFiles/email.html`, "utf8");
        const tempFn = dot.template(rawHTML);
        const keycode = [0, 0, 0, 0].map(() => _.random(0, 9)).join("");
        const result = tempFn({
            keycode
        });

        const mailOptions = {
            from: `${message.guild.name} <${this.client.config.email.username}>`,
            to: `${emailAddress}`,
            subject: `${message.guild.name} Verification`,
            html: result,
            text: `Thank you for verifying yourself in the server!\nVerification Code: ${keycode}\nTo verify yourself as a student, please respond back to the bot in a private message with the verification code above. This step will only be available for a short time. If you fail to verify your account, you will need to restart this process.\nIf you are not the intended recipient of this email, please contact ${this.client.config.email.username}.`,
        };

        await transporter.sendMail(mailOptions, async (error) => {
            if (error) {
                return console.log(error);
            } else {
                await message.author.send({
                    embed: {
                        title: `Email sent successfully!`,
                        description: `Email sent to **${emailAddress}**. Check your school email for your verification code, then type the keycode in the <#${this.client.config.channels.access}> channel!`,
                        color: this.client.config.school_color
                    }
                });
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

                await message.channel.awaitMessages(keycodeFilter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"]
                }).then(collected => collected.first().delete()) // about 60 seconds

                await message.member.roles.add(guild.roles.cache.find((role) => role.name === "student")).then(() => {
                    message.author.send(`<@${message.author.id}>`, { embed: {
                            title: `Welcome to the Santa Clara University Discord Network!`,
                            description: `You have been given the **Student** role! You can now access the rest of the server and select your roles in the <#${this.client.config.channels.roles}> channel!`,
                            color: this.client.config.school_color
                    }})
                });
            }
        });
        
        uniqueID.delete(message.author.id); // Remove the user from the set
    };
};