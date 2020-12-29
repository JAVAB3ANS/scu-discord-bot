/*
==============================================================
     _    _    _             _               ____        _   
    / \  | | _(_)_ __   __ _| |_ ___  _ __  | __ )  ___ | |_ 
   / _ \ | |/ / | '_ \ / _` | __/ _ \| '__| |  _ \ / _ \| __|
  / ___ \|   <| | | | | (_| | || (_) | |    | |_) | (_) | |_ 
 /_/   \_\_|\_\_|_| |_|\__,_|\__\___/|_|    |____/ \___/ \__|
                                                             
==============================================================
*/

const { Client, MessageEmbed } = require("discord.js");
const { Aki } = require("aki-api");
const emojis = ["👍", "👎", "❔", "🤔", "🙄", "❌"];
const Started = new Set();

//FORKED FROM https://github.com/TheMaestro0/Akinator-Bot

module.exports = {
    name: 'aki',
    description: 'Play with the Akinator!',
    category: 'Fun',
    cooldown: 60,
    async execute(client, message, args) {  
        new Client({messageCacheMaxSize: 50})

        const nickname = client.guilds.cache.get(client.config.verification.guildID).member(message.author).displayName;

        if(!Started.has(message.author.id)) Started.add(message.author.id);
        else return message.channel.send(new MessageEmbed() 
         .setDescription(`**:x: | The game already started.. :flushed:**`)
         .setColor("RANDOM")
        );

        const aki = new Aki("en"); // Full languages list at: https://github.com/jgoralcz/aki-api
        await aki.start();

        const msg = await message.channel.send(new MessageEmbed()
       .setTitle(`**${nickname}**, Question ${aki.currentStep + 1}`)
       .setColor("RANDOM")
       .setDescription(`**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`));

        for (let emoji of emojis) await msg.react(emoji).catch(console.error);
        const collector = msg.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,{ time: 60000 * 6 });
              collector.on("collect", async (reaction, user) => {
                reaction.users.remove(user).catch(console.error);
                if(reaction.emoji.name == "❌") return collector.stop();

                await aki.step(emojis.indexOf(reaction.emoji.name));
                if (aki.progress >= 70 || aki.currentStep >= 78) {
                  await aki.win();
                  collector.stop();
                  await message.channel.send(new MessageEmbed()
                  .setTitle(`**${nickname}, is this this your character? :thinking:**`)
                  .setDescription(`**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking as **#${aki.answers[0].ranking}**\n\n[yes (**y**) / no (**n**)]`)
                  .setImage(aki.answers[0].absolute_picture_path)
                  .setColor("RANDOM"));
                  await message.channel.awaitMessages(response => ["yes","y","no","n"].includes(response.content.trim().toLowerCase()) &&
                    response.author.id == message.author.id, { max: 1, time: 30000, errors: ["time"] })
                      .then(collected => {
                         const content = collected.first().content.trim().toLowerCase();
                            if (content == "y" || content == "yes")
                                return message.channel.send(new MessageEmbed()
                                  .setColor("RANDOM")
                                  .setTitle(`**Great! I guessed right one more time. :smiley:**`)
                                  .setDescription(`<@${message.author.id}>, I love playing with you!`));
                            else 
                                return message.channel.send(new MessageEmbed()
                                  .setColor("RANDOM")
                                  .setTitle(`**${nickname}, you're the winner! :relieved:**`)
                                  .setDescription(`<@${message.author.id}>, I love playing with you!`));
                          });
                        return;
                      }
                 msg.edit(new MessageEmbed()
                  .setTitle(`**${nickname}**, Question ${aki.currentStep + 1}`)
                  .setColor("RANDOM")
                  .setDescription(`**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`));
           });

        collector.on("end",()=> { 
          Started.delete(message.author.id);
          msg.delete({ timeout: 1000 }).catch(()=>{});
        });
      }
}
