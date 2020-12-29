/*
============================================================================================================================
  _____ _                _____ _____    _____ ____          ____  _____     _______     _______ _______ ______ __  __ _ 
 / ____| |        /\    / ____/ ____|  / ____/ __ \        / __ \|  __ \   / ____\ \   / / ____|__   __|  ____|  \/  | |
| |    | |       /  \  | (___| (___   | |   | |  | |______| |  | | |__) | | (___  \ \_/ / (___    | |  | |__  | \  / | |
| |    | |      / /\ \  \___ \\___ \  | |   | |  | |______| |  | |  ___/   \___ \  \   / \___ \   | |  |  __| | |\/| | |
| |____| |____ / ____ \ ____) |___) | | |___| |__| |      | |__| | |       ____) |  | |  ____) |  | |  | |____| |  | |_|
 \_____|______/_/    \_\_____/_____/   \_____\____/        \____/|_|      |_____/   |_| |_____/   |_|  |______|_|  |_(_)
============================================================================================================================
/*

/*
- Give them base class co-op role
- Loop thru the courses they ticked in the form and give them those roles, otherwise create new ones if they hadn't already existed
- Every role created from the form will have the following permissions stated in lines 110-111
- For each new channel, iterate thru all of them to create text channels with the specific course names
- Set text and voice to sync with the category permissions (so basically all students with base "class co-op" role will only see the channels)
- send them confirmation -> the end lol
*/

module.exports.run = (client, config) => {
  const express = require("express");
  const cors = require("cors");
  const helmet = require("helmet");
  var app = express();
  const sendMessage = require(`./sendMessage.js`);

  /* ADD THIS OBJECT TO YOUR CONFIG FILE (or move the properties somewhere else)
    {
        verification: {
            "guildID": "string of guild enabled in",
            "key": "string for basically a password to authenticate requests", //get a random string of some sort?
        }
    }
    INCOMING OBJECT FROM GOOGLE FORMS
    {
        "name": "First name",
        "courses": "List of general ED courses", 
        "discord": "Discord Username with Tag"
    }
  */

  //define guild from ID in config
  const guild = client.guilds.cache.get(config.verification.guildID);
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  //This will start on port 2000, if this collides with another service you may change it
  const sysMsg = {
    title: `✅ ${guild.name} EXPRESS.JS CLASS CO-OP SERVER`,
    description: `Verification listening at port 2000 [here](${config.verification.inputURL})! ✅`,
    color: "GREEN", 
    timestamp: new Date()
  }
  app.listen(2000, () => {
    console.log(sysMsg.description);
    sendMessage(client, config.channels.auditlogs, { embed: sysMsg});
  });
  app.all("/", (req, res) => {
    res.status(200).send(`${sysMsg.title} was deployed on ${sysMsg.timestamp}`);
  });
  app.post("/getCourse", (req, res) => {
    //some basic auth
    if (req.headers["key"] != config.verification.key) {
      //api key checker
      res.status(401).send({ error: "❌ Invalid API Key " });
      //data in body checker
    } else if (Object.keys(req.body).length > 0) { //if member enters something, then fire this else block
      res.status(200).send({ status: "Successful" });
      //find member in guild
      let member = guild.members.cache.find((member) => member.user.tag === req.body.discord);
      //if the member isn't in the guild return an error in console
      if (member === null) {
        sendMessage(client, config.channels.auditlogs, { embed: { title: `__**❌ ${guild.name} Class Co-op**__`, description: `> **${req.body.name}** returned **${req.body.discord}**, which is **${member}** in the server!\n> Please remove their response from the [form](https://docs.google.com/forms/d/1UVrIzT88ux6ZOgakUfiLQuSYvbS60MtNnuoI6i02MO8/edit)!`, color: config.school_color, timestamp: new Date()}});
      } else if (member.roles.cache.has(guild.roles.cache.find((role) => role.id === config.serverRoles.classCoop))) {
        //if the member already has the join role that means they are already verified so.. tell them that someone is about to hack them!!
          member.send({
            embed: {
              description: `❌ Someone tried to obtain a **Class Co-op** role on their Discord account as you! If this was you, you may ignore this message. If this was not you, please immediately inform an **ADMIN** or **MOD** immediately!`,
              color: config.school_color,
              footer: { text: `${guild.name} Class Co-op`, },
              author: { name: "Alert Notice", icon_url: client.user.avatarURL(), },
              timestamp: new Date()
            },
          });
      } else {
        sendMessage(client, config.channels.auditlogs, { embed: { title: `__**✅ New Class Co-op Alert!**__`, description: `New data from **${req.body.discord}** (**${req.body.name}**)`, color: config.school_color, timestamp: new Date()}}); //will display new verification message if member tag matches input in Google form
        //when user fills in the checkbox options, it will give them roles for their selected courses

        //give member their base Class Co-op role
        member.roles.add(guild.roles.cache.find((role) => role.id === config.serverRoles.classCoop));

        const random_hex_color_code = () => { //random hex generator to keep role colors interesting
          let n = (Math.random() * 0xfffff * 1000000).toString(16);
          return '#' + n.slice(0, 6);
        };

        //give member their specific course role and assign it to them
        //if not, then create new role then assign it to them
        req.body.courses.forEach(course => {
          let role = guild.roles.cache.find(ch => ch.name === course);
        
          if(role) {
            member.roles.add(role.id);
          } else {
            guild.roles.create({
              data: {
                name: course, 
                color: random_hex_color_code(), //generates random hex color for roles
                permissions: ['ADD_REACTIONS', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', //Give them these following permissions 
                'READ_MESSAGE_HISTORY', 'USE_EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'USE_VAD', 'CHANGE_NICKNAME']
              }
            }).then(r => { member.roles.add(r.id)});
          }
        });
        
        //send them a confirmation
        const courseConfirmation = new MessageEmbed()
          .setTitle(`__**Successful Courses Added**__`)
          .setDescription(`✅ You have filled out the class co-op form successfully in the **${guild.name}** server! Here is your information for confirmation. If anything is inputted incorrectly, please tell contact **ADMIN** or **MOD** to quickly adjust your roles! Remember to read <#${config.channels.info}> for more information!`)
          .setColor(config.school_color)
          .setFooter(`${guild.name} Class Co-op Confirmation`)
          .setAuthor("Class Co-op Confirmation", client.user.avatarURL())
          .attachFiles([`./assets/verified.gif`])
           .setThumbnail(`attachment://verified.gif`)
          .setTimestamp()
          .addFields(
            { name: "First Name", value: req.body.name },
            { name: "Courses", value: req.body.courses },
            { name: "Discord Tag <-- (DiscordName#0000)", value: req.body.discord }
          )
        member.send(`**<@${member.user.id}>**`, { embed: courseConfirmation});
 
        let verificationChannel = guild.channels.cache.get(config.channels.verificationlogs);
        verificationChannel.send(`**<@${member.user.id}>**`, { embed: courseConfirmation}).then(m => m.react('👍'));
      
        const classCoopEmbed = { title: `__**✅ WELCOME NEW CLASS CO-OP MEMBER!**__`, description: `Everyone please welcome **${req.body.name}** to the <#${config.channels.classCoop}> channel!`, color: config.school_color, timestamp: new Date()};
        let classCoopChannel = guild.channels.cache.get(config.channels.classCoop);
        classCoopChannel.send(`**<@${member.user.id}>**`, { embed: classCoopEmbed}).then(m => m.react('👋'));
      }
    } else {
        //if no body.. return this
        res.status(401).send({ error: "No data found" });
    }
  });
};
