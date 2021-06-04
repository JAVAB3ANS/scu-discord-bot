const { MessageEmbed } = require("discord.js");
const { Command } = require("discord.js-commando"); 
const getClassLogistics = require("../functions/getClassLogistics.js");
const request = require("request"); 
 
module.exports = class scheduleCommand extends Command {
    constructor(client) {
        super(client, {
            name: "schedule",  
            group: "practicality",
            memberName: "schedule",
            description: "Generates all possibly schedules given the classes a student wants. Will provide real-time suggestions as sections run out of seats.",  
            throttling: {
                usages: 2,
                duration: 5,
            },
            args: [
                {
                  key: "courseName",
                  prompt: "Enter a course name to lookup",
                  type: "string",
                  oneOf: ["MATH 13", "ARTS 74", "ARTH 11", "ENGR 110", "COEN 60"]
                },
              ],
        });
    }

    //ADAPTED INTO SCU DISCORD BOT WITH PERMISSION FROM ALEXANDER KENNEDY, COEN MAJOR CLASS OF 2021
 
    async run ( message, courseName ) {  
        const options = {
            method: "POST",
            url: "https://www.scu.edu/apps/ws/courseavail/search/4020/ugrad",
            form: {
                maxRes: 400,
                q: "Class name"
            }
        }

        /* 
            const allClasses = [];

            This classes' array is a stack array that stores course objects with the following parameters:

                - courseTitle, className, subject, term, catalog_nbr, course_nbr, startTime, endTime, location, instructor, seatsLeft
        */

        function getData (course, options2, request) {
            const classes = [];
            options2.form.q = course;

            //Function to request data and call back to return said data
            request (options2, function (error, response, body) {
                if (error) throw new  Error(error);

                //Parse body string into a readable JSON format
                parsedBody = JSON.parse(response.body);

                //Create an array with data of section and add it to the big array of classes

                arr = parsedBody.results;

                for (const i = 0; i < arr.length; i++) {
                    const section = new getClassLogistics (
                        //Uses subject and catalog_nbr to make name (instead of requestBody)
                        arr[i].subject.concact(" ", arr[i].catalog_nbr),
                        arr[i].mtg_time_beg_1,
                        arr[i].mtg_time_end_1,
                        arr[i].class_nbr,
                        arr[i].mtg_days_1,
                        arr[i].seats_remaining
                    );

                    //Push section object on the classes stack
                    classes.push(section);
                }
                    console.log(classes);
            });
        }

        //Requests and prints requested data in a stack array
        //Change course name to get different results

        //could be anything like MATH 13, ARTH 11, COEN 60, ENGR 110, ARTS 74

        const courseEmbed = new MessageEmbed()
        .setColor(this.client.config.school_color)
        .setTitle(`**RESULTS FOR ${courseName}:`)
        .setDescription(getData(courseName, options, request))
 
        message.channel.send(courseEmbed);
    }
}
