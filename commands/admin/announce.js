module.exports = { 
    name: 'announce',
    description: 'Announce to server members!',
    args: true,
    usage: `[edit] <content> / [append] <content> / [embed] <content>`,  
    category: 'Admin',  
    async execute(client, message, args) {
        switch (args[0]) {
            case "edit":
              try {
                await message.channel.messages.fetch(`${args[1]}`).then(m => {
                  m.edit({
                    embed: {
                      description: args
                        .join(" ")
                        .replace(args[0], "")
                        .replace(args[1], "")
                    }
                  });
                });
              } catch (e) {
                console.log("Channel not found, you must run in same channel as message!", e);
              }
              break;
            case "append":
              try {
                await message.channel.messages.fetch(`${args[1]}`).then(m => {
                  m.edit({
                    embed: {
                      description:
                        m.embeds[0].description +
                        " " +
                        args
                          .join(" ")
                          .replace(args[0], "")
                          .replace(args[1], "")
                    }
                  });
                });
              } catch (e) {
                    console.log("Channel not found, you must run in same channel as message!", e);
              }
              break;
            case "embed":
              try {
                let announceChannel = client.channels.get(
                  `${args[1]
                    .replace(/</g, "")
                    .replace(/>/g, "")
                    .replace(/#/g, "")}`
                );
                let json = args.join(" ").substring(args[0].length + args[1].length + 2, args.join().length);
                await announceChannel.send({
                  embed: JSON.parse(json)
                });
              } catch (e) {
                    console.log (e);
              }
              break;
            default:
              try {
                let announceChannel = client.channels.get(
                  `${args[0]
                    .replace(/</g, "")
                    .replace(/>/g, "")
                    .replace(/#/g, "")}`
                );
                await announceChannel.send({ embed: { description: args.join(" ").replace(args[0], "") } });
              } catch (e) {
                    return await message.channel.send({ embed: { description: `\`\`\`${client.config.prefix}announce [#channel] [message goes here]\nannounce edit [message id] [new message]\nannounce append [message id] [text to append\nannounce embed [embed JSON]\`\`\``, color: client.config.school_color}});
              }
          }
          await message.delete(0);
        }
      };