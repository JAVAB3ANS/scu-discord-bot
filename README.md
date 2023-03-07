<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_banner.png?raw=true">
</p>

# SCU DISCORD NETWORK
[![Discord](https://img.shields.io/discord/709118412542050364.svg?color=768AD4&label=discord&logo=https%3A%2F%2Fdiscordapp.com%2Fassets%2F8c9701b98ad4372b58f13fd9f65f966e.svg)](https://discordapp.com/channels/709434647779606561/)
![Forks](https://img.shields.io/github/forks/JAVAB3ANS/scu-discord-bot)
![Stars](https://img.shields.io/github/stars/JAVAB3ANS/scu-discord-bot)
![License](https://img.shields.io/github/license/JAVAB3ANS/scu-discord-bot)
![GitHub package.json version](https://img.shields.io/github/package-json/v/JAVAB3ANS/scu-discord-bot)
![GitHub repo size](https://img.shields.io/github/repo-size/JAVAB3ANS/scu-discord-bot)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/JAVAB3ANS/scu-discord-bot/discord.js)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c619058a31b4c7cb4c5390a670a505b)](https://www.codacy.com/gh/jasonanhvu/scu-discord-bot/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jasonanhvu/scu-discord-bot&amp;utm_campaign=Badge_Grade)

- This is a 24/7 bot that created for the **Santa Clara University Discord Network** to provide a comprehensive social media platform for Santa Clara University students to hang out and build community.

- Made use of the Node.js environment and the Node module Discord.js to create a bot that greets/sends direct messages, interacts with over 1200 students, and performs a variety of automated tasks to improve the server experience.

- Student-run online network is currently publicly searchable as part of **Discord's Server Discovery** .

## Server Logo
<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/logo-pic.png?raw=true">
</p>

## Main Commands
- Here are all of the bot's commands:
  - [Admins category!](https://github.com/JAVAB3ANS/scu-discord-bot/tree/master/commands/admins)
  - [Utility category!](https://github.com/JAVAB3ANS/scu-discord-bot/tree/master/commands/utility)
  - [Fun category!](https://github.com/JAVAB3ANS/scu-discord-bot/tree/master/commands/fun)

## Implementation
- Node JS and the Discord JS library are used to build the Discord bot. The library provides a simple way to interact with the Discord API. Node.js was chosen because various npm libraries proved to be extremely useful.

- The following section will go over each feature, their implementation options, and any mistakes or learning points that could be improved.

## Bot Interaction
- The bot's purpose is to respond to chat messages. Messages to the bot are prefixed with ```&```, which precedes any given command the user would like to use, to distinguish when the bot should respond. For example, to find out the current ping and latency of the bot's API, type ```&ping```.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_ping.png?raw=true">
</p>

## Server Verification System
<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/login.png?raw=true">
</p>

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/dashboard.png?raw=true">
</p>

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu-discord-verify-process.gif?raw=true">
</p>

- To verify themselves in the server, students would type `&verify [their SCU email]` in a dedicated roles channel to have the bot direct-message them a confirmation message then promptly send them a unique keycode in their email. They would enter that keycode within 5 minutes to be properly granted a **Student** role and would be encouraged to add additional roles in my accompanied [OAuth roles system](https://github.com/JAVAB3ANS/discord-oauth-verification-system/).

- Certain voice and text channels on the server are restricted to those with specific roles. Without roles, anyone can set up an account and send spam messages, which the verification system effectively prevents. Unlike many servers with role-react systems, which give users access to a message with the click of an emoji, my method is effective and secure on multiple levels. In short, the only users who may have access to the server are current students, faculty/staff, and alumni who enter their correct email credentials against the university's domain. 

## Server Modmail Ticketing System

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu-help.png?raw=true">
</p>

- The modmail ticketing system is essentially an open forum with the college server's admins/mods. Users will be able to communicate with the moderators on demand if they direct message the bot with or without a message attachment/URL. This ensures complete trust and transparency between the server leaders and its members, whether it's suggesting new ideas or inquiring about how the server works.

- Not to mention that this works for prospective students who want to ask for server roles just to get a sense of the school's relative student body (around 11-12% here) and how university life was in general before lockdown.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu-modmail-process.gif?raw=true">
</p>

## Zoom REST API Status Scraper
- Zoom's REST API endpoint is used by the command ```zoom.js``` to compile all of Zoom's technical services onto one embed and determine whether they are fully operational, as indicated by a ✅. Given that we as students use Zoom as the lifeline of our virtual education, knowing that the digital platform is in good IT hands is relieving and therapeutic in itself.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_zoom.png?raw=true">
</p>

## School COVID-19 Dashboard Scraper
- The command ```covid19.js``` is used to access the school's COVID-19 testing dashboard and print its contents, which include the date, tests, positive tests, and positivity rate. Because these health and wellness tests are usually administered at my school on a weekly basis, a node-schedule job was set up to output the COVID-19 data on Friday mornings. Because the website lacks an API for accessing its information, data scraping is used to retrieve the information. To access and scrape data via HTML, the Cheerio library was used. 

- Dealing with the formatting was one of the most difficult aspects of scraping the data. Normally, the information would be presented in the same format. A different format was used temporarily at one point, which broke the bot because no data was retrieved due to different HTML tags. The function was temporarily modified to work with the temporary format as a workaround. Another difficult aspect was the message length restrictions. Because each message on Discord is limited to 2000 characters, particularly long menus would not fit within a single message. If a message was too long, a link to the website would be placed in the body of the message as a design choice. Multiple messages would have been sent ideally to break up the menu into sendable parts, but this was never implemented due to time constraints and readability issues. To enhance this functionality, the bot should be able to detect where and when to divide a message into digestible chunks.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_covid.png?raw=true">
</p>

## Server-Wide Announcements
- The Discord server was created with the intention of utilizing the various text channels and dedicating each one to a specific topic. To take advantage of the Discord channels without sacrificing the ability to make large public posts like Facebook, the bot is designed to make an announcement to all users, which is generated by an admin/mod using the `&announce` command in a hidden channel to properly format the embed for quality view.

- I learned here to be polite on the internet and to avoid mentioning everyone on the server, which may come across as unwelcome and unsettling. Instead of mentioning 900+ students, the channel will only light up to indicate an unread message.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_announcement.png?raw=true">
</p>

## Final Thoughts
- This was an impromptu project for fun that grew into quite a big deal (well, at least for me). The Discord community's ability to listen to its user base is remarkable, both technically and socially. The developers are always responsive and willing to help, whether it is listening to user-experience suggestions or bug fixes for the app's online client. By also giving users access to the Discord Developer portal to create automation tools, many users are instilled with a do-it-yourself attitude in their control, which very few applications can encourage for an audience that is primarily comprised of end-users. Having said that, the platform is as useful to the average user as it is to those who want to work behind the scenes.

- Within the scope of this college server bot, I recently made my code more efficient by utilizing the Discord JS Commando framework, which employs a much more object-oriented programming approach. Looking back, this was a significant improvement over simply using if, else if, and else statements to have the bot scan for specific strings and prefixes and output whatever result the users desired.

- Personally, I've been using the app for about three years to communicate with my colleagues and friends about anything, whether it's homework, programming, or making life decisions. People go out of their way to hang out in multiple chats and servers, so it's a great place to just hang out. The app's methods of personalizing human interaction as much as possible online are completely analogous to real life: a direct message is similar to a one-on-one interaction with another person, whereas a group server is similar to a community living room where several people do whatever they want. Furthermore, the servers' ability to handle an infinite number of messages and pictures without automatic deletion is quite impressive in its scope, just as you are not restricted in real life from discussing your beliefs and opinions. It's fascinating to examine the history of previous conversations, which is similar to how our minds can recall topics and conjure them back to memory for the sake of discussion.

- Many people will find Discord's features aligning to mirror aspects of the corporeal world where people want to talk if they understand its contemporary impact on modern communities. Its anti-superficial appeal, lack of predetermined content, and extremely responsive community all add up to one thing: a place where people can truly be themselves in a safe, constructive environment. Furthermore, the versatility of its parts — text, voice, reaction emojis, and a plethora of other ways of expression — promotes a definitive online experience in the midst of this time. Not only have I used the app, but my Discord server-building experience has truly overcome the burden of proof for allowing people from all social backgrounds to converse in a close-knit environment. Given the server's longevity and my time as an undergraduate student, my work with this bot is obviously a work-in-progress that is always looking for better things to come my way!


## Creator(s), Contributor(s), and Special Thanks
- Made by [JAVAB3ANS](https://github.com/JAVAB3ANS) with guidance from other cool developers:
  - From SCU: [Saamstep](https://github.com/Saamstep), [501A-Designs](https://github.com/501A-Designs), [themexpride](https://github.com/themexpride), and [markrizko](https://github.com/markrizko)
  - From GitHub: [NightZan999](https://github.com/NightZan999), [TheMaestro0](https://github.com/TheMaestro0), [thesportstacker](https://github.com/thesportstacker), [Cyanic76](https://github.com/Cyanic76), and [Cramenorn](https://github.com/Cramenorn)
  - Discord Servers: [Code Ring](https://discord.gg/9XC9v7nfuB), [Plexi Development](https://discord.gg/plexidev), [The Coding Den](https://discord.gg/code), [JS Programming Language Community](https://disboard.org/server/join/779474636780863488), [Discord API](https://discord.gg/discord-api), [The Programmer's Hangout](https://discord.gg/programming), [Discord.js Official](https://discord.com/invite/bRCvFy9), [Discord Bots]( https://discord.gg/0cDvIgU2voWn4BaD), [JavaScript Universe](https://discord.gg/cf25CQKc4v), [/r/Discord_Bots](https://discord.gg/xRFmHYQ), [Programming Discussions](http://invite.progdisc.club/)
