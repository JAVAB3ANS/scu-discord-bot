module.exports = async (content, message) => {
  try {
    return message.say({ embed: { title: "Error", color: 13632027, description: content } }); 
  } catch (err) {
      if (err === "TypeError: message.say is not a function") return;
  } 
};