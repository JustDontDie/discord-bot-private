// Requires
const Discord = require('discord.js');

const PREFIX = "!";

// Create an instance of a Discord client
var client = new Discord.Client();

client.on('ready', () => {
  console.log('Bot Started');
  
  var embed = new Discord.RichEmbed();
  embed.setColor("#40C03D");
  embed.addField("Bot Status", "The bot is now online!");
  embed.setFooter("Your bot is now ready to do what it was made to do.");

  client.channels.get("330410520622530562").sendEmbed(embed);
});

client.on('disconnect', () => {
  var embed = new Discord.RichEmbed();
  embed.setColor("#F22213");
  embed.addField("Bot Status", "The bot has gone offline!");
  embed.setFooter("The bot may have ran into an error. If you know it didn't, you're good to go. Else, check Heroku for more information");

  client.channels.get("330410520622530562").sendEmbed(embed);
});

client.on('message', function(message) {
  if (!message.content.startsWith(PREFIX)) return;

  var command = message.content.replace("!", "").split(" ");

  switch (command[0].toLowerCase()) {
    case "help":
      client.channels.get("329985394949226506").send(`@everyone, ${message.author.username} is requesting assistance`);
      break;
    default:
      break;
  }
});

client.login(process.env.BOT_TOKEN);
