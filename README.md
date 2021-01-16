![SCU Discord Network Banner](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu_banner.png?raw=true)
 
# SCU DISCORD NETWORK  

<<<<<<< HEAD
# SCU DISCORD NETWORK 
=======
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/29d042e9f2af40d1bf53590dd3a36be3)](https://app.codacy.com/gh/jasonanhvu/scu-discord-bot?utm_source=github.com&utm_medium=referral&utm_content=jasonanhvu/scu-discord-bot&utm_campaign=Badge_Grade)
 
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef
![Forks](https://img.shields.io/github/forks/jasonanhvu/scu-discord-bot)
![Stars](https://img.shields.io/github/stars/jasonanhvu/scu-discord-bot)
![License](https://img.shields.io/github/license/jasonanhvu/scu-discord-bot)
![GitHub package.json version](https://img.shields.io/github/package-json/v/jasonanhvu/scu-discord-bot)
![GitHub repo size](https://img.shields.io/github/repo-size/jasonanhvu/scu-discord-bot)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/jasonanhvu/scu-discord-bot/discord.js)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/jasonanhvu/scu-discord-bot/pm2)
![Discord Support](https://img.shields.io/discord/754545426958385213?label=Discord%20Support&labelColor=FFFFF&style=plastic&logo=Discord&link=https://discord.gg/hEVJZsSWcX&link=https://discord.gg/hEVJZsSWcX)

<<<<<<< HEAD
  - This is a 24/7 bot that I made for my [**SCU Discord Network**](https://invite.gg/gobroncos) to provide a comprehensive and effective social media platform for Santa Clara University students to utilize especially in the midst of the worldwide COVID-19 pandemic.

  - Utilized the Node.js environment and Node module Discord.js to deploy a bot that greets/sends direct messages, interacts with over 600 students, and performs an assortment of automated tasks to better the server experience. 
=======
## Problem:
- Over the course of  the coronavirus pandemic, shutting down many social and advancement opportunities for many adults and students alike, college students are known to experience heavy feelings of disappointment, loneliness, and decline in mental health throughout the world. With students pursuing what we know as "Zoom University," a lot of fear and fatigue gets manifested as they often might sleep in too late and face the drag of Zoom fatigue and even social anxiety and withdrawal by feeling like they can't rest and be themselves outside.

## Solution: 
- Here is my solution to the online situation that is in the midst of many students, not just SCU students' lives. This bot serves as a framework that many academic  communities could utilize to their advantage in these times online. Bots play a key role in the overall Discord experience as they allow users to pursue moderation efforts along with a plethora of features
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef

- I'm planning to add more features in the feature such as Google integration for my school's calendar events and possibly machine learning for auto moderation that  allows for randomized responses to replace the blacklisted word/phrase , encouraging a healthy environment that reflects real life. 

## Server Logo:
![SCU Discord Network Logo](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/logo-pic.png?raw=true)

## Main Commands:
- Here are all of the bot's commands:
  - [Admins category!](https://github.com/jasonanhvu/scu-discord-bot/tree/master/commands/admins)
  - [Utility category!](https://github.com/jasonanhvu/scu-discord-bot/tree/master/commands/utility)
  - [Fun category!](https://github.com/jasonanhvu/scu-discord-bot/tree/master/commands/fun)

<<<<<<< HEAD
## Implementation
The Discord bot is implemented using Node.js and the discord.js library. The library provides a very accessible method of interacting with the Discord API. Node.js was chosen as various npm libraries became very useful.

The next section will discuss each feature, their implementation choices, and any mistakes/learning points that could be improved on.

## Bot Interaction
The bot is designed to respond to chat messages. To distinguish when the bot should respond, messages towards the bot are prefixed with ```&```. which precedes any given command the user would like to use. For example, to inquire about the current ping and latency of the bot's API, one would use ```&ping`.
=======
## Implementation:
- The Discord bot is implemented using Node.js and the discord.js library and hosted on my Raspberry Pi 4 Model B 24/7. The Discord.js library module provides a very accessible method of interacting with the Discord API. Node.js was chosen as various npm libraries became very useful.

- The next section will discuss each feature, their implementation choices, and any mistakes/learning points that could be improved on.

## Bot Interaction:
- The bot is designed to respond to chat messages. To distinguish when the bot should respond, messages towards the bot are prefixed with ```&```. which precedes any given command the user would like to use. For example, to inquire about the current ping and latency of the bot's API, one would use `&ping`.
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef

![ping](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu_ping.png)

## Server Verification System:
- An Express.js server was programmed for a guild verification system which automatically gives graduating year, college major, and verified roles to SCU students on submitting their unique Google Form responses. Setting permissions through roles is the standard way of managing a Discord server without manual content filtering. 

- The server is designed such that only those with certain roles can access certain voice and text channels. Without roles, anyone can create an account and spam messages, which the verify system effectively mitigates. Unlike many servers with role-react systems which give users on the click of an emoji on a message, my method proves effective and secure on many levels. In short, the only users who could have access to the server are current students and alumni given that they fill everything out with their correct credentials within the university's domain. 

- Assigning roles to each user is done though a text pattern: `<first name> <current college major>`. The server consists of 3 main types of roles, one that distinguishes which major they are in and their graduating year. On the Google form, this also accommodates for students who are double and triple majors, which is permitted through the Discord API as long as the user's nickname is below 32 characters.

<<<<<<< HEAD
- A challenge was detecting whether the user's response in the Google form was invalid. I used regex (regular expressions) to validate whether the number put their names properly with the first uppercase letter and such. On top of that, when users didn't put in their correct Discord tag in the specific form input section, the bot would send an error message so I would have to manually delete the user's response so they could redo the form and automatically get Discord roles through the Express.js server receiving a request from Google forms/scripts api.
=======
- A challenge was detecting whether the user's response in the Google form was invalid. I used regex (regular expressions) to validate whether the number put their names properly with the first uppercase letter and such. On top of that, when users didn't put in their correct Discord tag in the specific form input section, the bot would send an error message. Then, I would have to manually delete the user's response so they could redo the form and automatically get Discord roles through the Express.js server receiving a request from my Google Scripts API code on form submit.
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef

![serverVerification](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu_verification_process.gif)

## Server Modmail Ticketing System:

![modmail](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu-help.png)

- The modmail ticketing system is basically an open forum with the admin/mods of the college server. When users direct message the bot with or without an message attachment/URL, they wil be able to communicate with the moderators on demand. Whether it be suggesting new ideas or asking about how the 
server operates, this ensures 100% trust and transparency between the server leaders and its members.

- Not to mention that this also works for prospective students who want to ask for roles in the server just so they could get a feel of the school's relative student body (around 11-12% here) and how the university life was like in general before lockdown.

![modmail](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu-modmail-process.gif)

## Zoom REST API Status Scraper
- The command `zoom.js` uses Zoom's REST API endpoint to compile all of Zoom's technical services onto one embed and see if they are fully operational as indicated by a ✅. Given that we as students use Zoom as the lifeline of our virtual education, knowing that the digital platform is in good IT hands is relieving and therapeutic in itself.

![zoom](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu_zoom.png)

<<<<<<< HEAD
## School COVID-19 Dashboard Scraper
=======
## School COVID-19 Dashboard Scraper:
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef
- The command `covid19.js` is used to access the school's COVID-19 testing dashboard and print out its contents: `date, tests, positive tests, and positivity rate`. Since these health and wellness tests are usually conducted at my school weekly, a node-schedule job was scheduled to output the COVID-19 data weekly on Friday mornings. Since the website does not have an API to access its information, retrieving the information is performed through data scraping. Cheerio library was used to access and scrape data through HTML. 

- The challenging areas of scraping the data was dealing with the formatting. Normally, the data would be presented in the same exact format. At a period of time, a different format was used temporarily, which broke the bot as no data was retrieved due to differing HTML tags. As a temporary fix, the function was adjusted to work with the temporary format. Another challenging portion was message length limits. Discord has a 2000 character limit on each message, so particularly long menus would not fit within a single message. As a design choice, if any message was too long, a link to the website would be in the body of the message instead. Ideally, multiple messages would be sent to break up the menu into sendable parts, but due to time constraints and readability issues, this was never implemented. To further improve this functionality, the bot should be able to detect where and when to break up a message into digestable parts.

![zoom](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu_covid.png)

<<<<<<< HEAD
## Server-Wide Announcements
=======
## Server-Wide Announcements:
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef
- The idea of the Discord server was to take advantage of the various text channels and dedicate each one to a specific topic. As of time of writing, communications throughout the community exist through various Facebook, Instagram, Reddit groups dedicated to community events/announcements. 

- To take advantage of the Discord channels without losing the functionality of making big public posts like Facebook, the bot is designed to make an announcment to all users, which is generated from an admin/mod using the `&announce` command in a hidden channel to properly format the embed for quality view.

- I learned here to exercise internet etiquette and to not mention everyone in the server. Instead, the channel will only light up to indicate an unread message opposed to mentioning 600+ students which may come off as unsolicited and unsettling.

![announcement](https://github.com/jasonanhvu/scu-discord-bot/blob/master/assets/scu_announcement.png)

<<<<<<< HEAD
4) Final Thoughts:
=======
## Final Thoughts:
>>>>>>> 3ff16413f885c11c854b4426c69563c0618903ef
- This was an impromptu project for fun that eventually turned into a pretty big deal well at least for me. The Discord community’s ability to listen to its audience base is profound, both technically and socially. Whether it is listening to user-experience suggestions or bug fixes for the app’s online client, the developers are always responsive and willing to help. By also allowing users access to the Discord Developer portal to create automation tools, many users are instilled with a do-it-yourself attitude in their control, something that very few applications can encourage for an audience with a primarily end-user base. That being stated, the platform is as meaningful to the average user as it is to individuals who want to dabble behind the scenes.

- Recently, I made my code more efficient by utilizing Discord.js Commando framework which employs a much more object-oriented programming approach within the scope of this college server bot. Looking back, this was a huge upgrade compared to me simply using `if, else if, and else` statements to have the bot scan for certain strings and prefixes to output any desired result the users want.

- Personally, I've been using the app for around 2 years to talk with my colleagues and friends about just anything, whether it be homework, programming, or making choices in life. Being in multiple chats and servers makes for great places to simply hang out as people go out of their way to do so. The app’s ways of personalizing human interaction as much as possible online is completely analogous to concrete life: a direct message is akin to a 1-on-1 interaction with another person while a group server is just like a community living room where several people do whatever they please. Plus, the capacity for the servers to handle a limitless number of messages and pictures without automatic deletion is quite impressive in its scope, just like how you’re not restricted to talk about your beliefs and opinions in real life. It’s awesome to look at the past conversations history, which is similar to how our minds could recall topics and conjure them back to memory for the sake of discussion.

- By understanding Discord’s contemporary impact on modern communities, many people will find its features aligning to mirror aspects of the corporeal world where people want to talk. Its anti-superficial appeal, lack of predetermined content, and super responsive community all add to one thing: a place where people can genuinely be themselves in a secure, constructive space. On top of that, the versatility of the sum of its parts — text, voice, reaction emojis, and a plethora of other ways of expression — indeed promotes a definitive online experience in the midst of this time. Not only have I engaged in simply using the app, but my  Discord server-building experience has truly overcome the burden of proof for allowing people from all social areas to converse in a tight-knitted space. Given the longevity of the server and my current status as an undergraduate freshman studying CS, my work with this bot is obviously work-in-progress and is always keeping an eye out for the better things to come my way!


## Creator(s), Contributor(s), and Special Thanks: 
- Made by [jasonanhvu](https://github.com/jasonanhvu) with guidance from other cool developers:
  - From SCU: [Saamstep](https://github.com/Saamstep), [kairanaqua](https://github.com/kairanaquazi), and [markrizko](https://github.com/markrizko)
  - From GitHub: [NightZan999](https://github.com/NightZan999), [TheMaestro0](https://github.com/TheMaestro0), [thesportstacker](https://github.com/thesportstacker), [Cyanic76](https://github.com/Cyanic76), and [Cramenorn](https://github.com/Cramenorn)
  - Discord Servers: [Code Ring](https://discord.gg/9XC9v7nfuB), [Plexi Development](https://discord.gg/plexidev), [The Coding Den](https://discord.gg/code), [JS Programming Language Community](https://disboard.org/server/join/779474636780863488), [Discord API](https://discord.gg/discord-api), [The Programmer's Hangout](https://discord.gg/programming), [Discord.js Official](https://discord.com/invite/bRCvFy9), [Discord Bots]( https://discord.gg/0cDvIgU2voWn4BaD), [JavaScript Universe](https://discord.gg/cf25CQKc4v), [/r/Discord_Bots](https://discord.gg/xRFmHYQ), [Programming Discussions](http://invite.progdisc.club/)
