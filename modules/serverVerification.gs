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
     if (response[i].getItem().getTitle() == "Current Major(s)") {
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
