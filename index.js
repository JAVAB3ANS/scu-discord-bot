// ASSIGN VARIABLES
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], autoConnect: true } );
const Enmap = require("enmap");
const fs = require("fs");
const { readdirSync } = require("fs");
const { join } = require("path");

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = require(`./config.json`);

client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = new Enmap();

try {
  readdirSync(join(__dirname, "..")).forEach(f => {
    const files = readdirSync(join(__dirname, "..", f));
    if (files.includes(`${commandName}.js`)) {
      const file = `./commands/${f}/${commandName}.js`;
      client.commands.set(commandName, file);
    }
  });
} catch (err) {
     console.log(err);
}

// BOT TOKEN
client.login(client.config.token);
