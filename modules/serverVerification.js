/*
=============================================================================================
__      ________ _____  _____ ________     __   _______     _______ _______ ______ __  __ _ 
\ \    / /  ____|  __ \|_   _|  ____\ \   / /  / ____\ \   / / ____|__   __|  ____|  \/  | |
 \ \  / /| |__  | |__) | | | | |__   \ \_/ /  | (___  \ \_/ / (___    | |  | |__  | \  / | |
  \ \/ / |  __| |  _  /  | | |  __|   \   /    \___ \  \   / \___ \   | |  |  __| | |\/| | |
   \  /  | |____| | \ \ _| |_| |       | |     ____) |  | |  ____) |  | |  | |____| |  | |_|
    \/   |______|_|  \_\_____|_|       |_|    |_____/   |_| |_____/   |_|  |______|_|  |_(_)
=============================================================================================
*/
const { MessageEmbed } = require(`discord.js`);

module.exports.run = async (client) => {
  const express = require("express");
  const cors = require("cors");
  const helmet = require("helmet");
  var app = express();
  const sendMessage = require(`./sendMessage.js`);

  /* ADD THIS OBJECT TO YOUR client.config FILE (or move the properties somewhere else)
    {
        verification: {
            "guildID": "string of guild enabled in",
            "key": "string for basically a password to authenticate requests", //basically a string of some sort?
        }
    }
    INCOMING OBJECT FROM GOOGLE FORMS
    {
        "name": "First Name",
        "major": "Current Major", //defaults to 'none' for SCU Faculty
        "status": "Member Status",
        "discord": "Discord Username with Tag"
    }
  */

  //define guild from ID in client.config
  const guild = client.guilds.cache.get(client.config.verification.guildID);
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  //This will start on port 2000, if this collides with another service you may change it
  const verifyMSG = {
    title: "VERIFICATION SERVER",
    description: `Verification listening at port 5354 [here](${client.config.verification.verifyURL})! ✅`,
    color: "GREEN", 
    timestamp: new Date()
  }
  app.listen(2000, () => {
    console.log(verifyMSG.description);
    sendMessage(client, client.config.channels.auditlogs, { embed: verifyMSG});
  });
  app.all("/", (req, res) => {
    res.status(200).send(`${verifyMSG.title} was deployed on ${verifyMSG.timestamp} ✅`);
  });
  app.post("/verify", (req, res) => {
    //some basic auth
    if (req.headers["key"] != client.config.verification.key) {
      //api key checker
      res.status(401).send({ error: "❌ Invalid API Key " });
      //data in body checker
    } else if (Object.keys(req.body).length > 0) { //if member enters something, then fire this else block
      res.status(200).send({ status: "Successful" });
      //find member in guild
      let member = guild.members.cache.find((member) => member.user.tag == req.body.discord);
      //if the member isn't in the guild return an error in console 
      if (member === null) { 
        sendMessage(client, client.config.channels.auditlogs, { embed: { title: `__**❌ ${guild.name} Verification**__`, description: `> **${req.body.name}** returned **${req.body.discord}**, which is **${member}** in the server!\n> Please remove their response from the [form](https://docs.google.com/forms/d/1O4iazeB8sDlTPYLLgTF9IhndV0ZJv-ulvFJyqFkTMO4/edit)!`, color: client.config.school_color, timestamp: new Date()}});
      } else if (member.roles.cache.has(guild.roles.cache.find((role) => role.id === client.config.serverRoles.verifiedStudent))) {
          //if the member already has the join role that means they are already verified so.. tell them that someone is about to hack them!!
          const dangerEmbed = {
              title: `__**DANGER ALERT!**__`,
              description: `❌ Someone tried to verify their Discord account as you! If this was you, you may ignore this message. If this was not you, please immediately inform an **ADMIN** or **MOD** immediately!`,
              color: client.config.school_color,
              footer: { text: `${guild.name} Verification`, },
              author: { name: "Verification Notice", icon_url: client.user.avatarURL(), },
              timestamp: new Date()
          };
          member.send(`<@${member.user.id}>`, {embed: dangerEmbed});
          sendMessage(client, client.config.channels.auditlogs, `<@${member.user.id}>`, { embed: dangerEmbed});
      } else {
          sendMessage(client, client.config.channels.auditlogs, { embed: { title: `__**✅ Verification Alert!**__`, description: `New data from **${req.body.discord}** (**${req.body.name}**)`, color: client.config.school_color, timestamp: new Date()}}); //will display new verification message if member tag matches input in Google form
          if (req.body.status === "SCU Faculty/Staff") {
            //changes nickname and grants verified personnel role but skips onwards to remove Unverified role, but won't receive major and verified Student roles
            member.setNickname(req.body.name);
            member.roles.add(guild.roles.cache.find((role) => role.id === client.config.serverRoles.verifiedPersonnel)); //the SCU Faculty/Staff role
          } else {
              //gives member the verified student role
              
              member.roles.add(guild.roles.cache.find((role) => role.id === client.config.serverRoles.verifiedStudent)); //the Student role

              if (req.body.major != null) {
                req.body.major.forEach(major => {
                  //loops thru members' inputted major role(s) from the checklist 
                  // works for double and triple majors and also for one major [given that they're honest :) ]
                  let majorRole = guild.roles.cache.find(ch => ch.name === major);
                  member.roles.add(majorRole);
                });
              }
              
              member.roles.add(guild.roles.cache.find((role) => role.name === req.body.status));
          
              //set their nickname like this: [First Name] || [Major]
              //also, if nickname is over 32 characters, catch error and log it in #audit-logs so we could manually adjust it
             
              const nickname = `${req.body.name} || ${req.body.major}`; 
              
              if (nickname.length > 32) {
                const nicknameError = { 
                  title: `__**❌ ${req.body.name}'s nickname is over 32 characters!**__`, 
                  description: `> <@${member.user.id}> returned **${nickname}**\n>`, 
                  color: client.config.school_color, 
                  timestamp: new Date()
                }
                sendMessage(client, client.config.channels.auditlogs, { embed: nicknameError});
              }
              
              member.setNickname(nickname);
        }       
          //remove Unverified role from member in all conditions
          member.roles.remove(guild.roles.cache.find((role) => role.id === client.config.serverRoles.unverifiedStudent));

          //send them a confirmation
          const verifyConfirmation = new MessageEmbed()
            .setTitle(`__**Successful Verification**__`)
            .setDescription(`You have been verified successfully in the **${guild.name}**! Here is your information for confirmation. If anything is inputted incorrectly, please tell contact **ADMIN** or **MOD** to quickly adjust your roles! Remember to read <#${client.config.channels.info}> for more information!`)
            .setColor(client.config.school_color)
            .setFooter(`${guild.name} Verification`)
            .setAuthor("Verification Confirmation", client.user.avatarURL())
            .attachFiles([`./assets/verified.gif`])
            .setThumbnail(`attachment://verified.gif`)
            .setTimestamp()
            .addFields(
              { name: "First Name", value: req.body.name, },
              { name: "Current Major(s)", value: (req.body.major || 'none'), }, //will output none if no major is inputted
              { name: "Member Status", value: req.body.status, },
              { name: "Discord Tag <-- (DiscordName#0000)", value: req.body.discord, },
            )
          member.send(`**<@${member.user.id}>**`, { embed: verifyConfirmation});
          const verifyEmbed = { title: `__**✅ NEW VERIFIED MEMBER!**__`, description: `You are now verified! Everyone please welcome **${req.body.name}** to the server!`, color: client.config.school_color, timestamp: new Date()};
          
          guild.channels.cache.get(client.config.channels.verifylogs).send(`**<@${member.user.id}>**`, { embed: verifyConfirmation}).then(m => m.react('👍'));
            
          guild.channels.cache.get(client.config.channels.welcome).send(`**<@${member.user.id}>**`, { embed: verifyEmbed}).then(m => m.react('👋'));
                  
          let verifiedCount = guild.members.cache.filter(member => member.roles.cache.find(role => role.id === client.config.serverRoles.verifiedStudent)).size
          let studentCount = guild.channels.cache.find(channel => channel.id === client.config.channels.verifiedCount);
          studentCount.setName(`🐎 ${verifiedCount} Bucking Broncos`);
      }
    } else {
        //if no body.. return this
        res.status(401).send({ error: "No data found" });
    }
  });
};
