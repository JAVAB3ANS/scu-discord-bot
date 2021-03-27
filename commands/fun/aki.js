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
const { Command } = require("discord.js-commando");

module.exports = class akiCommand extends Command {
    constructor(client) {
      super(client, {
        name: "aki",
        group: "fun",
        memberName: "aki",
        description: "Play with the akinator!",
        throttling: {
          usages: 2,
          duration: 5,
        }
      });
    }
    
    async run ( message) {
        new Client({messageCacheMaxSize: 50})
 
        if(!Started.has(message.author.id)) { Started.add(message.author.id) }
        else { return message.channel.send(new MessageEmbed() 
         .setDescription("**:x: | The game already started.. :flushed:**")
         .setColor("RANDOM")
        ); }

        const aki = new Aki("en"); // Full languages list at: https://github.com/jgoralcz/aki-api
        await aki.start();

        const msg = await message.channel.send(new MessageEmbed()
       .setTitle(`Question ${aki.currentStep + 1}`)
       .setColor("RANDOM")
       .setDescription(`**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`));

        for (let emoji of emojis) { await msg.react(emoji) }
        const collector = msg.createReactionCollector((reaction, user) => emojis.includes(reaction.emoji.name) && user.id === message.author.id,{ time: 60000 * 6 });
              collector.on("collect", async (reaction, user) => {
                reaction.users.remove(user);
                if(reaction.emoji.name === "❌") { return collector.stop(); }

                await aki.step(emojis.indexOf(reaction.emoji.name));
                if (aki.progress >= 70 || aki.currentStep >= 78) {
                  await aki.win();
                  collector.stop();
                  await message.channel.send(new MessageEmbed()
                  .setTitle(`**Is this this your character? :thinking:**`)
                  .setDescription(`**${aki.answers[0].name}**\n${aki.answers[0].description}\nRanking as **#${aki.answers[0].ranking}**\n\n[yes (**y**) / no (**n**)]`)
                  .setImage(aki.answers[0].absolute_picture_path)
                  .setColor("RANDOM"));
                  await message.channel.awaitMessages((response) => ["yes","y","no","n"].includes(response.content.trim().toLowerCase()) &&
                    response.author.id === message.author.id, { max: 1, time: 30000, errors: ["time"] })
                      .then((collected) => {
                         const content = collected.first().content.trim().toLowerCase();
                            if (content === "y" || content === "yes") {
                                return message.channel.send(new MessageEmbed()
                                  .setColor("RANDOM")
                                  .setTitle("**Great! I guessed right one more time. :smiley:**")
                                  .setDescription(`<@${message.author.id}>, I love playing with you!`));
                            } else  {
                                return message.channel.send(new MessageEmbed()
                                  .setColor("RANDOM")
                                  .setTitle(`**You're the winner! :relieved:**`)
                                  .setDescription(`<@${message.author.id}>, I love playing with you!`));
                            }
                          });
                        return;
                      }
                      msg.edit(new MessageEmbed()
                  .setTitle(`**Question ${aki.currentStep + 1}`)
                  .setColor("RANDOM")
                  .setDescription(`**${aki.question}**\n${aki.answers.map((x, i) => `${x} | ${emojis[i]}`).join("\n")}`));
           });

        collector.on("end",() => { 
          Started.delete(message.author.id);
          msg.delete({ timeout: 1000 }).catch(() => {});
        });
      }
    }; 