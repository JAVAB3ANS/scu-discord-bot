//ADAPTED INTO SCU DISCORD BOT WITH PERMISSION FROM ALEXANDER KENNEDY, COEN MAJOR CLASS OF 2021

class getClassLogistics {

    constructor (name, startTime, endTime, courseNum, days, seats) {
        this.name = name;
        this.startTime = getClassLogistics.convertStartTime(startTime);
        this.endTime = getClassLogistics.convertEndTime(endTime);
        this.courseNum = courseNum;
        this.days = days;
        this.seats = parseInt(seats);
    }

    static convertStartTime (timeStr) {
        let timeNum;
        //Splits string into the time and the period element
        let tokens = timeStr.split(" ");
        //Stores the two time numbers into numbers and the period into periods
        let nums = tokens[0].split(":");
        let period = tokens[1];
        //Parses the values from strings into ints
        nums[0] = parseInt(nums[0], 10);
        nums[1] = parseInt(nums[1], 10);

        //Checks for the special case of the hour being 12
        let isTwelve = (nums[0] === 12) ? true : false;

        //Checks what period it is and if hour is 12 and calculates timeNum accordingly
        if (period.toLowerCase() === "am") {
            if (isTwelve) 
                timeNum = nums[1];
            else 
                timeNum = (100 * nums[0]) + nums[1];
        } else if (period.toLowerCase() === "pm") {
            if (isTwelve) 
                timeNum = 1200 + nums[1];
            else 
                timeNum = (100 * nums[0]) + nums[1] + 1200;
        } else {
            this.client.error("You have invalid output!", message);
        }

        return timeNum;
    }

    static ConvertEndTkime (endTime) {
        let numStr;
        let period;
        let nums;
        let timeNum;

        //Since no space between time and period, uses substrings to separate
        if (endTime.includes("am")) {
            numStr = endTime.substring(0, endTime.indexOf("a"));
            period = endTime.substring(endTime.indexOf("a"), endTime.length);
        } else if (endTime.includes("pm")) {
            numStr = endTime.substring(0, endTime.indexOf("p"));
            period = endTime.substring(endTime.indexOf("p"));
        } else {
            this.client.error("You have invalid input!", message);
        }

        nums = numStr.split(":");

        //Parses hours and minutes into nums
        nums[0] = parseInt(nums[0]);
        nums[1] = parseInt(nums[1]);

        //Sometimes they don't give minutes if it's on the hour
        if (isNaN(nums[1])) nums[1] = 0;

        //Checks if the hour is 12
        let isTwelve = (nums[0] === 12) ? true : false;

        //Checks what period it is and if hour is 12 and calculates timeNum accordingly
        if (period.toLowerCase() === "am") {
            if (isTwelve)
                timeNum = nums[1];
            else 
                timeNum = (100 * nums[0]) + nums[1];
        } else if (period.toLowerCase() === "pm") {
            if (isTwelve) 
                timeNum = 1200 + nums[1];
            else 
                timeNum = (100 * nums[0]) + nums[1] + 1200;
        }

        return timeNum;
    }
}

module.exports = getClassLogistics;