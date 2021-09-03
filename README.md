<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_banner.png?raw=true">
</p>

# SCU DISCORD NETWORK
![Forks](https://img.shields.io/github/forks/JAVAB3ANS/scu-discord-bot)
![Stars](https://img.shields.io/github/stars/JAVAB3ANS/scu-discord-bot)
![License](https://img.shields.io/github/license/JAVAB3ANS/scu-discord-bot)
![GitHub package.json version](https://img.shields.io/github/package-json/v/JAVAB3ANS/scu-discord-bot)
![GitHub repo size](https://img.shields.io/github/repo-size/JAVAB3ANS/scu-discord-bot)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/JAVAB3ANS/scu-discord-bot/discord.js)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/JAVAB3ANS/scu-discord-bot/pm2)
![Discord Support](https://img.shields.io/discord/754545426958385213?label=Discord%20Support&labelColor=FFFFF&style=plastic&logo=Discord&link=https://discord.gg/hEVJZsSWcX&link=https://discord.gg/hEVJZsSWcX)
[![Known Vulnerabilities](https://snyk.io/test/github/JAVAB3ANS/scu-discord-bot/badge.svg)](https://snyk.io/test/github/JAVAB3ANS/scu-discord-bot)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/5c619058a31b4c7cb4c5390a670a505b)](https://www.codacy.com/gh/jasonanhvu/scu-discord-bot/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jasonanhvu/scu-discord-bot&amp;utm_campaign=Badge_Grade)

- This is a 24/7 bot that I created for my **SCU Discord Network** to provide a comprehensive and effective social media platform for Santa Clara University students to use, particularly in the midst of the global COVID-19 pandemic.

- Made use of the Node.js environment and the Node module Discord.js to create a bot that greets/sends direct messages, interacts with over 900 students, and performs a variety of automated tasks to improve the server experience.

- Very eager to promote this student-run online network and to apply for [Discord's Partner Program](https://discord.com/partners).

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
- Node.js and the discord.js library are used to build the Discord bot. The library provides a simple way to interact with the Discord API. Node.js was chosen because various npm libraries proved to be extremely useful.

- The following section will go over each feature, their implementation options, and any mistakes or learning points that could be improved.

## Bot Interaction
- The bot's purpose is to respond to chat messages. Messages to the bot are prefixed with ```&```, which precedes any given command the user would like to use, to distinguish when the bot should respond. For example, to find out the current ping and latency of the bot's API, type ```&ping```.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_ping.png?raw=true">
</p>

## Server Verification System
- An Express.js server was created for a guild verification system that automatically assigns SCU students' graduating year, college major, and verified roles upon submission of their unique Google Form responses. Setting permissions via roles is the standard method of managing a Discord server that does not require manual content filtering.

- Certain voice and text channels on the server are restricted to those with specific roles. Without roles, anyone can set up an account and send spam messages, which the verification system effectively prevents. Unlike many servers with role-react systems, which give users access to a message with the click of an emoji, my method is effective and secure on multiple levels. In short, the only users who may have access to the server are current students and alumni who enter their correct credentials within the university's domain.

- A text pattern is used to assign roles to each user: ```<first name> || <current college major(s)>```. The server is divided into three types of roles, one for each major and one for each graduating year. This also accommodates students who are double and triple majors on the Google form, which is permitted by the Discord API as long as the user's nickname is less than 32 characters.

- Detecting whether a user's response in the Google form was invalid posed a challenge. I used regex (regular expressions) to ensure that the numbers spelled their names correctly, starting with the first uppercase letter and so on. Furthermore, if users did not enter their correct Discord tag in the specific form input section, the bot would send an error message, forcing me to delete the user's response manually. They could then redo the form and receive Discord roles automatically via the Express.js server in response to a request from the Google forms/scripts API.

<p align="center">
  <img src="https://github.com/JAVAB3ANS/scu-discord-bot/blob/master/assets/scu_verification_process.gif?raw=true">
</p>

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

## Final Thoughts:
- This was an impromptu project for fun that grew into quite a big deal (well, at least for me). The Discord community's ability to listen to its user base is remarkable, both technically and socially. The developers are always responsive and willing to help, whether it is listening to user-experience suggestions or bug fixes for the app's online client. By also giving users access to the Discord Developer portal to create automation tools, many users are instilled with a do-it-yourself attitude in their control, which very few applications can encourage for an audience that is primarily comprised of end-users. Having said that, the platform is just as useful to the average person. Having said that, the platform is as useful to the average user as it is to those who want to work behind the scenes.

- Within the scope of this college server bot, I recently made my code more efficient by utilizing the Discord.js Commando framework, which employs a much more object-oriented programming approach. Looking back, this was a significant improvement over simply using if, else if, and else statements to have the bot scan for specific strings and prefixes and output whatever result the users desired.

- Personally, I've been using the app for about three years to communicate with my colleagues and friends about anything, whether it's homework, programming, or making life decisions. People go out of their way to hang out in multiple chats and servers, so it's a great place to just hang out. The app's methods of personalizing human interaction as much as possible online are completely analogous to real life: a direct message is similar to a one-on-one interaction with another person, whereas a group server is similar to a community living room where several people do whatever they want. Furthermore, the servers' ability to handle an infinite number of messages and pictures without automatic deletion is quite impressive in its scope, just as you are not restricted in real life from discussing your beliefs and opinions. It's fascinating to examine the history of previous conversations, which is similar to how our minds can recall topics and conjure them back to memory for the sake of discussion.

- Many people will find Discord's features aligning to mirror aspects of the corporeal world where people want to talk if they understand its contemporary impact on modern communities. Its anti-superficial appeal, lack of predetermined content, and extremely responsive community all add up to one thing: a place where people can truly be themselves in a safe, constructive environment. Furthermore, the versatility of its parts — text, voice, reaction emojis, and a plethora of other ways of expression — promotes a definitive online experience in the midst of this time. Not only have I used the app, but my Discord server-building experience has truly overcome the burden of proof for allowing people from all social backgrounds to converse in a close-knit environment. Given the server's longevity and my current status as an undergraduate freshman studying CS, my work with this bot is obviously a work-in-progress that is always looking for better things to come my way!


## Creator(s), Contributor(s), and Special Thanks
- Made by [JAVAB3ANS](https://github.com/JAVAB3ANS) with guidance from other cool developers:
  - From SCU: [Saamstep](https://github.com/Saamstep), [kairanaquazi](https://github.com/kairanaquazi), and [markrizko](https://github.com/markrizko)
  - From GitHub: [NightZan999](https://github.com/NightZan999), [TheMaestro0](https://github.com/TheMaestro0), [thesportstacker](https://github.com/thesportstacker), [Cyanic76](https://github.com/Cyanic76), and [Cramenorn](https://github.com/Cramenorn)
  - Discord Servers: [Code Ring](https://discord.gg/9XC9v7nfuB), [Plexi Development](https://discord.gg/plexidev), [The Coding Den](https://discord.gg/code), [JS Programming Language Community](https://disboard.org/server/join/779474636780863488), [Discord API](https://discord.gg/discord-api), [The Programmer's Hangout](https://discord.gg/programming), [Discord.js Official](https://discord.com/invite/bRCvFy9), [Discord Bots]( https://discord.gg/0cDvIgU2voWn4BaD), [JavaScript Universe](https://discord.gg/cf25CQKc4v), [/r/Discord_Bots](https://discord.gg/xRFmHYQ), [Programming Discussions](http://invite.progdisc.club/)
