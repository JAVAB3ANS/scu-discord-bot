const { MessageEmbed } = require("discord.js"); 
const { log } = require("../functions/log.js");

module.exports = async (client, member) => { 
  const guild = client.guilds.cache.get(client.config.verification.guildID);

  if(member.user.bot || !guild)  {
	return this.client.error("Ignore members who are bot users and ignores messages not in this guild!", message);    
  } else {
let role = member.guild.roles.cache.find((role) => role.id === client.config.serverRoles.unverifiedStudent);
  await member.roles.add(role);

  log(client, client.config.channels.auditlogs, { embed: { title: "NEW JOIN ROLE ADDED!", description: `The **Unverified** role has been given to **<@${member.user.id}>** by **<@${client.user.id}>**!`, color: "GREEN"}});
  
  const welcomeEmbed1 = new MessageEmbed() // triggers when new users joins to specific channel in server
  .setTitle(`Welcome to the **${guild.name}**!`) // Calling method setTitle on constructor.
  .setDescription("We're glad to have you here! Follow instructions in your DM's and Go Broncos!") //Setting embed description
  .setThumbnail("https://JAVA9620.github.io/scu-discord-bot/assets/logo-pic.png")
  .setTimestamp() // Sets a timestamp at the end of the embed
  .attachFiles(["./assets/scu_banner.png"])
  .setImage("attachment://scu_banner.png")
  .setColor(client.config.school_color)
  .setFooter("Brought to you by the creators of this Discord server.");

  await guild.systemChannel.send(`<@${member.user.id}>`, { embed: welcomeEmbed1 });

  const welcomeEmbed2 = new MessageEmbed() //personal message to new user
    .setTitle("Invent the life you want to lead at Santa Clara University.")
    .setDescription(
      ":one:  If you are new to Discord, this short [tutorial](https://youtu.be/rnYGrq95ezA) can help you get started! \n\n" +
      `:two: __**Please*s*__ fill out the Google Form :clipboard: in the <#${client.config.channels.roles}> to __**immediately**__ verify yourself and get roles in the SCU server! It'll only take a couple seconds! Note: If you're a **Guest** or **Prospective Student**, you are exempted from this requirement. \n\n` +
      `:three: Read the <#${client.config.channels.info}> channel and introduce yourself :wave: in the <#${client.config.channels.intros}> channel! \n\n` +
      `:four: Check out SCU updates :mega: in <#${client.config.channels.updates}> and keep your eyes peeled for cool servers :cool: in <#${client.config.channels.promos}>! \n\n` +
      ":five: If you have any technical issues :computer:, feel free to contact **ADMIN** or **MOD** for help!\n\n" +
      "Thank you for your cooperation and Go Broncos! :racehorse:"
    )
    .attachFiles(["./assets/logo-pic.png"])
    .setThumbnail("attachment://logo-pic.png")
    .setTimestamp() // Sets a timestamp at the end of the embed
    .setColor(client.config.school_color)
    .setFooter("Brought to you by the creators of this Discord server.");

  await member.send(welcomeEmbed2);
  
  log(client, client.config.channels.auditlogs, { embed: { title: "NEW JOIN DM SENT!", description: `:white_check_mark: Private DM has been sent to new user: <@${member.user.id}>`, color: "GREEN"}}); //send private DM to new user
  }
  
};
