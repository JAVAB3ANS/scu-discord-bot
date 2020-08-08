var POST_URL = "{insert webhook url}";

function onSubmit(e) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[allResponses.length - 1];
    var response = latestResponse.getItemResponses();
    var items = [];

    for (var i = 0; i < response.length; i++) {
        var question = response[i].getItem().getTitle();
        var answer = response[i].getResponse();
        try {
            var parts = answer.match(/[\s\S]{1,1024}/g) || [];
        } catch (e) {
            var parts = answer;
        }

        if (answer == "") {
            continue;
        }
        for (var j = 0; j < parts.length; j++) {
            if (j == 0) {
                items.push({
                    "name": question,
                    "value": parts[j],
                    "inline": false
                });
            } else {
                items.push({
                    "name": question.concat(" (cont.)"),
                    "value": parts[j],
                    "inline": false
                });
            }
        }
    }

    var options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            "content": "‌", // This is not an empty string
            "embeds": [{
                "title": "SCU 🐎💨 | #BroncoUp Server Verification",
                "fields": items,
                "footer": {
                    "text": "Brought to you by the server lords!",
                },
                "color": 10231598 ,
              "thumbnail": {
                "url": "https://jasonanhvu.github.io/assets/img/logo-pic.png",
              }
            }]
        })
    };

    UrlFetchApp.fetch(POST_URL, options);
};