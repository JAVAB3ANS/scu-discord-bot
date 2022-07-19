/*

1. We open the Google Form we want to use.
2. We get the latest response from the form.
3. We get the responses from the latest response.
4. We loop through the responses and get the item responses.
5. We loop through the item responses and get the title of the item.
6. We check if the title of the item is "First Name".
7. If the title of the item is "First Name", we set the name variable to the response of the item.
8. We check if the title of the item is "Current Major(s)/Minor(s)".
9. If the title of the item is "Current Major(s)/Minor(s)", we set the major variable to the response of the item.
10. We check if the title of the item is "Member Status".
11. If the title of the item is "Member Status", we set the status variable to the response of the item.
12. We check if the title of the item is "Discord Tag <-- (DiscordName#0000)".
13. If the title of the item is "Discord Tag <-- (DiscordName#0000)", we set the discord variable to the response of the item.
14. We log the items to the console.
15. We convert the items to a JSON string.
16. We set the options for the URL fetch.
17. We fetch the URL.
18. We log the response to the console.
19. We return the response.

*/

var POST_URL = "[INSERT POST URL HERE]";

function onSubmit(e) {
  var form = FormApp.openById("[INSERT GOOGLE FORM ID HERE");
  var responses = form.getResponses();
  var latestResponse = responses[responses.length - 1];
  var response = latestResponse.getItemResponses();
    var items = {};
    for (i in response){   
      if (response[i].getItem().getTitle() == "First Name") {
        items['name'] = response[i].getResponse()
      }
      if (response[i].getItem().getTitle() == "Current Major(s)/Minor(s)") {
        items['major'] = response[i].getResponse()
      }
      if (response[i].getItem().getTitle() == "Member Status") {
        items['status'] = response[i].getResponse()
      }
      if (response[i].getItem().getTitle() == "Discord Tag <-- (DiscordName#0000)") {
        items['discord'] = response[i].getResponse()
      }
    }
   
  Logger.log(JSON.stringify(items));
  
      var options = {
        "method": "post",
        "payload": JSON.stringify(items),
        "headers": {
          "key": "[INSERT KEY FROM CONFIG HERE]",
          "Content-Type": "application/json"
        } 
      };

  UrlFetchApp.fetch(POST_URL, options);
}
