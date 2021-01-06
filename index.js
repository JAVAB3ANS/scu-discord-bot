// ASSIGN VARIABLES
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], autoConnect: true } );
const Enmap = require("enmap");
const fs = require("fs");  

// Need to make sure the config is attached to the CLIENT so it's accessible everywhere!
client.config = require(`./config.json`);

client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));
client.on("error", console.error);       

client.login(client.config.token)

try { 
  /*
  ====================================================================
  ______               _     _    _                 _ _           
  |  ____|             | |   | |  | |               | | |          
  | |____   _____ _ __ | |_  | |__| | __ _ _ __   __| | | ___ _ __ 
  |  __\ \ / / _ \ '_ \| __| |  __  |/ _` | '_ \ / _` | |/ _ \ '__|
  | |___\ V /  __/ | | | |_  | |  | | (_| | | | | (_| | |  __/ |   
  |______\_/ \___|_| |_|\__| |_|  |_|\__,_|_| |_|\__,_|_|\___|_|   
  ====================================================================
  */    
  
  fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${file}`)];
    }) 
  });
  
  /*
  ==============================================================================================
     _____                                          _   _    _                 _ _           
    / ____|                                        | | | |  | |               | | |          
   | |     ___  _ __ ___  _ __ ___   __ _ _ __   __| | | |__| | __ _ _ __   __| | | ___ _ __ 
   | |    / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` | |  __  |/ _` | '_ \ / _` | |/ _ \ '__|
   | |___| (_) | | | | | | | | | | | (_| | | | | (_| | | |  | | (_| | | | | (_| | |  __/ |   
    \_____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_| |_|  |_|\__,_|_| |_|\__,_|_|\___|_|   
  ==============================================================================================
  */

  /*loops and reads through my subdirectories - admin, fun, and utility - 
  and iterates thru individual command files in them*/

  client.commands = new Enmap();

  fs.readdir("./commands/", (err, subdirs) => { 
    subdirs.forEach(subdir => {
      fs.readdir(`./commands/${subdir}/`, (err, files) => { 
        files.forEach(file => { 
          if (!file.endsWith('.js')) return;
          let props = require(`./commands/${subdir}/${file}`);
          let commandName = file.split(".")[0];
          client.commands.set(commandName, props);
        });
      });
    });
  }); 
} catch (err) {
    console.log(err);
} finally { 
    console.log("All commands and events work! :white_check_mark:");
}