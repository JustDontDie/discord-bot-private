// Requires
const Discord = require('discord.js');

const PREFIX = "!";

var client = new Discord.Client();
var music = new MusicPlayer();

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
    case "play":
      if (!args[1]) {
        message.channel.send("I need a link");
        return;
      }

      if (!message.member.voiceChannel) {
        message.channel.send("You have to be in a voice channel");
        return;
      }

      if (!music.servers[message.guild.id]) {
        music.servers[message.guild.id] = {
          queue: []
        };
      }

      var server = music.servers[message.guild.id];
      server.queue.push(args[1]);

      if (!message.guild.voiceConnection) {
        message.member.voiceChannel.join().then(function(connection) {
          music.playVideo(connection, message);
        });
      }
      break;
    case "skip":
      var server = music.servers[message.guild.id];

      if (server.dispatcher) {
        server.dispatcher.end();
      }
      break;
    case "stop":
      var server = music.servers[message.guild.id];

      if (message.guild.voiceConnection) {
        message.guild.voiceConnection.disconnect();
      }
      break;
    default:
      break;
  }
});

client.login(process.env.BOT_TOKEN);
