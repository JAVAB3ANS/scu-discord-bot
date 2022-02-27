const { Command } = require("discord.js-commando"); 
import { Client } from "../../functions/courseavail.js";
const client = new Client(); 
 
module.exports = class coursesCommand extends Command {
    constructor(client) {
        super(client, {
            name: "courses",  
            group: "practicality",
            memberName: "courses",
            description: "Generates all possible CourseAvail schedules given the classes a student wants.",  
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                  key: "courseName",
                  prompt: "Enter a course name to lookup",
                  type: "string"
                },
                {
                  key: "quarter",
                  prompt: "Enter quarter and year to lookup",
                  type: "string",
                  oneOf: ["Fall 2022", "Winter 2022", "Spring 2022"]
                }
              ],
        });
    }

    // ADAPTED INTO SCU DISCORD BOT WITH PERMISSION FROM ALEXANDER KENNEDY, COEN MAJOR CLASS OF 2021
 
    async run ( message, courseName, quarter ) {
      client.search(courseName, quarter)
        .then(results => {
          console.log(results);
          message.channel.send(results);
        })
      }
}