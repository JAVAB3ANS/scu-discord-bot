const { MessageEmbed, Collection } = require(`discord.js`); //requires Discord.js integration package
const db = require(`quick.db`);
const fs = require(`fs`);
const cooldowns = new Collection();  
const sendMessage = require(`../modules/sendMessage.js`);
const jsdom = require(`jsdom`);
const { JSDOM } = jsdom;
const dom = new JSDOM();
const document = dom.window.document;

module.exports = async (client, message) => { 
  // Checks if the Author is a Bot, or the message isn`t from the guild, ignore it.
  if (!message.content.startsWith(client.config.prefix) && message.channel.type != "dm" || message.author.bot) return; 

/*
===============================================   
 |  \/  |         | |               (_) | 
 | \  / | ___   __| |_ __ ___   __ _ _| | 
 | |\/| |/ _ \ / _` | `_ ` _ \ / _` | | | 
 | |  | | (_) | (_| | | | | | | (_| | | | 
 |_|  |_|\___/ \__,_|_| |_| |_|\__,_|_|_| 
=============================================== 
*/

  const messageReception = new MessageEmbed().setColor(client.config.school_color)
  .setAuthor(message.author.tag, message.author.displayAvatarURL())
  
  const nickname = client.guilds.cache.get(client.config.verification.guildID).member(message.author).displayName; 	
  const guildRole = client.config.serverRoles;

    //Check if message is in a direct message and mentions bot
    if (message.channel.type === "dm" && message.mentions.has(client.user)) {   
      const userTicketContent = message.content.split(` `).slice(1).join(` `); 
      if (userTicketContent.length > 1) {
        let user = await db.get(`suspended${message.author.id}`);
        if (user === true || user === "true") return await message.channel.send({ embed: { description: `Your ticket has been paused!`, color: client.config.school_color}});

        let active = await db.fetch(`support_${message.author.id}`);
        let guild = client.guilds.cache.get(client.config.verification.guildID);
        let channel, found = true; 
  
        try { 
          if (active) client.channels.cache.get(active.channelID).guild;
        } catch (e) {
          found = false;
        }
  
        if (!active || !found) { //create support channel for new respondee  
          try {
            active = {};
            channel = await guild.channels.create(`${message.author.username}-${message.author.discriminator}`);     
            channel.setParent(client.config.channels.supportTicketsCategory); //sync text channel to category permissions
            channel.setTopic(`Use **${client.config.prefix}cmds** to utilize the Ticket | ModMail commands on behalf of <@${message.author.id}>`);

            let perms = [{ id: guildRole.everyone, deny: ["VIEW_CHANNEL"]}];
            let permissionFlags = [`VIEW_CHANNEL`, `SEND_MESSAGES`, `ADD_REACTIONS`, `READ_MESSAGE_HISTORY`, `MANAGE_CHANNELS`, `MANAGE_MESSAGES`, `ADD_REACTIONS`, `USE_EXTERNAL_EMOJIS`]

            guildRole.modRoles.forEach(role => {
              perms.push({id: role, allow: permissionFlags });
            });

            channel.overwritePermissions(perms);
          } catch (err) {
              if (err == "TypeError [INVALID_TYPE]: Supplied parameter is not a User nor a Role.") return;
          }
          
          messageReception.setTitle(`ModMail Ticket Created`).setThumbnail(`attachment://verified.gif`) 
          .setDescription(`Hello, I've opened up a new ticket for you! Our staff members ` +
          `will respond shortly. If you need to add to your ticket, plug away again!`)
          .setFooter(`ModMail Ticket Created -- ${message.author.tag}`) 
          .attachFiles([`./assets/verified.gif`])
          
          await message.author.send({ embed: messageReception });
          
          // Update Active Data
          active.channelID = channel.id;
          active.targetID = message.author.id;
        }
  
        channel = client.channels.cache.get(active.channelID); 
  
        messageReception .setTitle(`Modmail Ticket Sent!`).setDescription(`Your new content was sent!`).setFooter(`ModMail Ticket Received -- ${message.author.tag}`)
        await message.author.send({ embed: messageReception }); 
  
        db.set(`support_${message.author.id}`, active);
        db.set(`supportChannel_${channel.id}`, message.author.id);
        
        return await channel.send(messageReception.setDescription(`> ${userTicketContent}`).setImage(message.attachments.first() ? message.attachments.first().url : ""));
     
      } 
    } else if (message.channel.type === "dm" && (!message.mentions.has(client.user) || message.attachments.size > 0)) { 
        return await message.reply({ embed: { description: `To open a ticket, mention <@${client.user.id}> and type your message and/or send an attachment!`, color: client.config.school_color}});
    }  

  let support = await db.fetch(`supportChannel_${message.channel.id}`);
  if (support) {
    support = await db.fetch(`support_${support}`);
    const supportUser = client.users.cache.get(support.targetID);
    if (!supportUser) return message.channel.delete(); 

    function modmailCommands() {
      const commands = [  
        { cmd: "complete", desc: "✅ Close a ticket channel and logs the support channel`s content!" },   
        { cmd: "continue", desc: "▶️ Continue the modmail session!"},   
        { cmd: "pause", desc: "⏸️ Pause the modmail session!" }, 
        { cmd: "reply", desc: "💬 DM the user who sent the modmail ticket!"},
      ];
      let str = "```\n";
      for (let i in commands) {
        str += `${client.config.prefix}${commands[i].cmd} - ${commands[i].desc}\n`;
      }
      return str + "\n```";
    }
     
    messageReception.setAuthor(supportUser.tag, supportUser.displayAvatarURL()).setTimestamp()
 
    const isPause = await db.get(`suspended${support.targetID}`);
    const modmailArgs = message.content.split(" ").slice(1);  

    if (guildRole.modRoles.forEach(modRole => !(message.member.roles.cache.has(modRole)))) {
        await message.delete(); 
        await message.channel.send(`<@${message.author.id}>`, { embed: { description: `You don't have one of the following roles: \`OWNER\`, \`ADMIN\`, \`MOD\``, color: client.config.school_color}});
        return false;
    }

    switch (message.content.split(" ")[0].slice(1).toLowerCase()) { //if message content in the support user channel is a modmail command, execute the results...
      case "cmds": //on default, give list of modmail sub-commands :)
        messageReception.setTitle(`**📩  MODMAIL COMMANDS!**`).setColor(client.config.school_color).setDescription(modmailCommands())
        await message.channel.send(messageReception);
        break; 

      case "complete": //close the user`s ticket after they`re done and log it!
        if(isPause === true || isPause === "true") return await message.channel.send({ embed: { description: "Continue the support user's thread before completing the ticket!", color: client.config.school_color}})

        messageReception.setTitle(`ModMail Ticket Resolved`).setFooter(`ModMail Ticket Closed -- ${supportUser.tag}`)
        .setDescription(`✅ *Your ModMail has been marked as **complete** and has been logged by the admins/mods. If you wish to create a new one, please send a message to the bot.*`) 
        
        await supportUser.send(`<@${supportUser.id}>`, { embed: messageReception });;

        let messageCollection = new Collection();
        let channelMessages = await message.channel.messages.fetch({ limit: 100 });

        messageCollection = messageCollection.concat(channelMessages);

        while(channelMessages.size === 100) {
          let lastMessageId = channelMessages.lastKey();
          channelMessages = await message.channel.messages.fetch({ limit: 100, before: lastMessageId });
          if(channelMessages) {
            messageCollection = messageCollection.concat(channelMessages);
          }
        }

        /*this section of the code is for creating a transcript for a channel created by my bot's ticketing 
        implementation, which normally wouldn't have much messages anyways unless someone were to spam haha */         

        let msgs = messageCollection.array().reverse();
        fs.readFile(`./assets/modmailTemplate/template.html`, `utf8`, function (err, data) {  //goes into my directory for create the log's HTML/CSS template
          const filePath = `./events/modmailLogs/index_${supportUser.tag}.html`; 
          //names file after user's Discord tag and saves to my modmail file logs on my Raspberry Pi
          fs.writeFile(filePath, data, function (err, data) {
            if (err) console.log(`error`, err);

            let guildElement = document.createElement(`div`);
            guildElement.className = "img-container";

            //creates first image which is the SCU banner :)

            let guildBannerImg = document.createElement(`img`);
            guildBannerImg.setAttribute(`src`, `${client.config.verification.githubLink}blob/master/assets/scu_banner.png?raw=true`);
            guildBannerImg.setAttribute(`width`, `500`);
            guildElement.appendChild(guildBannerImg);

            let guildBreak = document.createElement(`br`); //creates break element between these two images
            guildElement.appendChild(guildBreak);

            // creates second image which says "Modmail Ticket!"

            let guildTicketImg = document.createElement(`img`);
            guildTicketImg.setAttribute(`src`, `${client.config.verification.githubLink}blob/master/assets/scu_modmail_ticket.png?raw=true`);
            guildTicketImg.setAttribute(`width`, `500`);
            guildElement.appendChild(guildTicketImg);

            fs.appendFile(filePath, guildElement.outerHTML, function (err) {
              if (err)
                console.log(`error`, err);
            });

            //for each normal user message sent in the ticketing channel, put them in a div and nest elements in their respective places
            msgs.forEach(async (msg) => {
              let parentContainer = document.createElement("div");
              parentContainer.className = "parent-container";

              let avatarDiv = document.createElement("div");
              avatarDiv.className = "avatar-container";

              let img = document.createElement(`img`);
              img.setAttribute(`src`, msg.author.displayAvatarURL());
              img.className = "avatar";
              avatarDiv.appendChild(img);
              parentContainer.appendChild(avatarDiv);

              const messageContainer = document.createElement(`div`);
              messageContainer.className = "message-container";

              const spanElement = document.createElement("span");
              const codeNode = document.createElement("code");

              let nameElement = document.createElement("span");
              let name = document.createTextNode(`[${msg.author.tag}] [${msg.createdAt.toDateString()}] [${msg.createdAt.toLocaleTimeString()} PST]`); 
              //gets time of message, the message author's tag, and the date it was sent and puts it in a span element in HTML
              nameElement.appendChild(name);
              messageContainer.append(nameElement);

              //for each embed message sent from the bot, iterate through all of them and create paragraph element for each one
              //then apply span element to each to divide up the title, description, and footer into viewable sections

              for (const embed of msg.embeds) {
                const embedElements = [`Title: ${embed.title}`, `Description: ${embed.description}`, `Footer: ${embed.footer.text}`];
              
                for (const element of embedElements) {
                  const paragraph = document.createElement("p");
                  paragraph.appendChild(document.createTextNode(element)); 
                  const embedSpan = document.createElement("span");
                  embedSpan.append(paragraph); 
                  messageContainer.appendChild(embedSpan);
                }                  
                } 

              // messages with code backticks will be rendered as code element in HTML
              if (msg.content.startsWith("```")) {
                codeNode.appendChild(document.createTextNode(msg.content.replace(/```/g, "")));
                messageContainer.appendChild(codeNode);
              } else if (msg.content) {  //normal messages will be put into a span element in HTML
                spanElement.append(document.createTextNode(msg.content));
                messageContainer.appendChild(spanElement);
              }

              parentContainer.appendChild(messageContainer); 

              fs.appendFile(filePath, parentContainer.outerHTML, function (err) {
                if (err)
                  console.log(`error`, err);
              });
            });
            messageReception.attachFiles(filePath);
            sendMessage(client, client.config.channels.auditlogs, messageReception);
          });
        });

        await message.channel.delete();
        db.delete(`support_${support.targetID}`);
        break; 
      
      case "continue": // continue a thread
        if(isPause === false || isPause === "false") return await message.channel.send({ embed: { description: "This ticket was not paused.", color: client.config.school_color}});
        
        await db.delete(`suspended${support.targetID}`);
        
        messageReception.setTitle(`Modmail Ticket Continued!`).setDescription(`▶️ <@${supportUser.id}>, your thread has **continued**! We're ready to continue!`).setColor("BLUE") 
        .attachFiles([`./assets/continued.gif`]).setThumbnail(`attachment://continued.gif`).setFooter(`ModMail Ticket Continued -- ${supportUser.tag}`) 
        
        await supportUser.send(messageReception);
        await message.channel.send(messageReception);
        break;
        
      case "pause":  // pause a thread 
        if(isPause === true || isPause === "true") return await message.channel.send({ embed: { description: "This ticket already paused. Unpause it to continue.", color: client.config.school_color}});
        
        await db.set(`suspended${support.targetID}`, true);
        
        messageReception.setTitle(`Modmail Ticket Paused!`).setDescription(`⏸️ <@${supportUser.id}>, your thread has been **paused**!`).setColor("YELLOW")
        .attachFiles([`./assets/paused.gif`]).setThumbnail(`attachment://paused.gif`).setFooter(`ModMail Ticket Paused -- ${supportUser.tag}`) 
  
        await supportUser.send(messageReception);
        
        messageReception.setDescription(`Admin/mod, please use \`${client.config.prefix}continue\` to cancel.`);
        await message.channel.send(messageReception);
        break;

      case "reply": // reply to user 
        await message.delete();
        if(isPause === true || isPause === "true") return await message.channel.send({ embed: { description: "This ticket is already paused. Unpause it to continue.", color: client.config.school_color}})

        let msg = modmailArgs.join(" "); 
        if (!msg) return message.channel.send({ embed: { description: `Please enter a message for the support ticket user!`, color: client.config.school_color}});
        
        messageReception.setTitle(`**💬 Admin/mod replied to you!**`).setFooter(`ModMail Ticket Replied -- ${supportUser.tag}`)
        .setDescription(`> ${msg}`).attachFiles([`./assets/reply.gif`]).setThumbnail(`attachment://reply.gif`)
        .setImage(message.attachments.first() ? message.attachments.first().url : "") 
        
        await supportUser.send(messageReception);
        await message.channel.send(messageReception);
        break; 

      default:
        await message.react("❌");
        await message.delete({ timeout: 3000 });
        break;
      }
    }
       
/*
==================================================================================
  __  __                                  _    _                 _ _           
 |  \/  |                                | |  | |               | | |          
 | \  / | ___  ___ ___  __ _  __ _  ___  | |__| | __ _ _ __   __| | | ___ _ __ 
 | |\/| |/ _ \/ __/ __|/ _` |/ _` |/ _ \ |  __  |/ _` | `_ \ / _` | |/ _ \ `__|
 | |  | |  __/\__ \__ \ (_| | (_| |  __/ | |  | | (_| | | | | (_| | |  __/ |   
 |_|  |_|\___||___/___/\__,_|\__, |\___| |_|  |_|\__,_|_| |_|\__,_|_|\___|_|   
                              __/ |                                            
                             |___/                                             
==================================================================================
*/

  // Our standard argument/command name definition.
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();
 
  const command = client.commands.get(commandName); 
  if (!command) return;

  if (command.args && !args.length) {
    let reply = new MessageEmbed()
    .setTitle("Uh-oh not enough arguments! :x:").setColor(client.config.school_color)
    .setDescription(`<@${message.author.id}>!, the proper usage would be: \`${client.config.prefix}${command.name} ${command.usage}\``)
    
    return await message.channel.send(reply);
  }
	
  if (command.category === "Admin" && (guildRole.modRoles.forEach(modRole => !(message.member.roles.cache.has(modRole))) || message.author.id !== guildRole.botOwner)) {
      await message.delete(); 
      await message.channel.send(`<@${message.author.id}>`, { embed: { description: `You don't have one of the following roles: \`OWNER\`, \`ADMIN\`, \`MOD\``, color: client.config.school_color}});
      return false;
  }
	
/*
=======================================================
  / ____|          | |   | |                        
 | |     ___   ___ | | __| | _____      ___ __  ___ 
 | |    / _ \ / _ \| |/ _` |/ _ \ \ /\ / / `_ \/ __|
 | |___| (_) | (_) | | (_| | (_) \ V  V /| | | \__ \
  \_____\___/ \___/|_|\__,_|\___/ \_/\_/ |_| |_|___/
=======================================================
*/                                                    
                                                     
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000; //make cooldown default to 3 if there are no presets for cooldown in the command
  
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply({ embed: { description: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, color: client.config.school_color}});
    }
  }
  
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  
  try {
    // Run the command as long as it has these three parameters
    command.execute(client, message, args);
  } catch(err) {
      sendMessage(client, client.config.channels.auditlogs, { embed: { description: `There was an error trying to run ${command.name} due the error: ${err.message}`}});
      return console.log(err.stack || err);
  } 
}
