// Requires
const Discord = require('discord.js');

// Create an instance of a Discord client
var client = new Discord.Client();

// The bot is ready
client.on('ready', () => {
  console.log('Bot Started');
})

client.on('ready', () => {
  client.user.setGame('Moderating');
});

client.on('message', function(message) {
  if (message.channel.name === "trial_help") {
    if (message.content.startsWith("!help ")) {
      message.channel.send(`${message.author.username} is requesting assistance! @everyone`, () => {
        console.log("Sent a message in the " + message.channel.name + " text channel");
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);
