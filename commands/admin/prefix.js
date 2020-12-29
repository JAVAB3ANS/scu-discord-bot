 let fs = require(`fs`);  

module.exports = { 
    name: 'prefix',
    description: 'Change the bot\'s prefix!',
    args: true,
    cooldown: 10,
    usage: `[enter prefix]`,
    category: 'Admin',  
    async execute(client, message, args) { 
          let defaultPrefix = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Read File
            
          if(defaultPrefix != null) {  
            defaultPrefix.prefix = args[0]; //Let the file be read and let prefix = argument 1
          }
      
          if (args[1] || args[0].length > 1) {
            return message.channel.send({ embed: { description: `:x: You can't set a double-argument prefix or one that's greater than one character!`, color: `RED`}});
          } else if (args[0] == client.config.prefix) { //detects if input resembles the default value in the config.json
            return message.channel.send({ embed: { description: `:x: You can't set the prefix equal to its default value!`, color: `RED`}});
          } else if (args[0].match(/^[a-zA-Z]+$/)) { //detects if character is from alphabet, in either lowercase/uppercase form, will return nothing
            return message.channel.send({ embed: { description: `:x: You can't use any letters in the alphabet!`, color: `RED`}});
          }
            
          fs.writeFile("./config.json", JSON.stringify(defaultPrefix), (err) => { //Write File
            if(err) console.log(err); //If there's an error, log error to the console
          })

          const msg = await message.channel.send({ embed: { description: `Set the bot prefix to \`${args[0]}\`!`, color: client.config.school_color}});
          await msg.edit({ embed: { description: `Please wait a couple of seconds while I readjust!`, color: client.config.school_color}});
  
          delete require.cache[require.resolve(`../../index.js`)]; 
        }
    }