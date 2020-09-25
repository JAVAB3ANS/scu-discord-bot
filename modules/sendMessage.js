/*
========================================================================================
  _____ ______ _   _ _____      __  __ ______  _____ _____         _____ ______ 
 / ____|  ____| \ | |  __ \    |  \/  |  ____|/ ____/ ____|  /\   / ____|  ____|
| (___ | |__  |  \| | |  | |   | \  / | |__  | (___| (___   /  \ | |  __| |__   
 \___ \|  __| | . ` | |  | |   | |\/| |  __|  \___ \\___ \ / /\ \| | |_ |  __|  
 ____) | |____| |\  | |__| |   | |  | | |____ ____) |___) / ____ \ |__| | |____ 
|_____/|______|_| \_|_____/    |_|  |_|______|_____/_____/_/    \_\_____|______|
========================================================================================
*/

module.exports = function sendMessage(client, channel, content) {
    client.guilds.cache.map((g) => {
      try {
        g.channels.cache.find((ch) => ch.id == channel).send(content);
      } catch (e) {
          return;
      }
    });
}