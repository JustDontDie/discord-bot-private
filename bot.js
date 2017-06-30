// Requires
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

// The bot is ready
client.on('ready', () => {
  console.log('Bot Started');
})

client.on('ready', () => {
  client.user.setGame('Moderating');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login(process.env.BOT_TOKEN);
