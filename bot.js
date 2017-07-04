// Requires
const Discord = require('discord.js');
const YTDL = require('ytdl-core');

const PREFIX = "!";

var client = new Discord.Client();

servers = {};

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

      if (servers[message.guild.id]) {
        servers[message.guild.id] = {
          queue: []
        };
      }

      var server = servers[message.guild.id];
      server.queue.push(args[1]);

      if (!message.guild.voiceConnection) {
        message.member.voiceChannel.join().then(function(connection) {
          playVideo(connection, message);
        });
      }
      break;
    case "skip":
      var server = servers[message.guild.id];

      if (server.dispatcher) {
        server.dispatcher.end();
      }
      break;
    case "stop":
      var server = servers[message.guild.id];

      if (message.guild.voiceConnection) {
        message.guild.voiceConnection.disconnect();
      }
      break;
    default:
      break;
  }
});

/**
 * Play a song/video
 * @param {Discord.VoiceChannel} [connection] The voice channel you are in
 * @param {Discord.Message} [message] 
 */
playVideo = function(connection, message) {
    if (!connection instanceof Discord.VoiceChannel) {
        var embed = new Discord.RichEmbed();
        embed.setColor("#F22213");
        embed.addField("Eror running !play", "'connection' is not an instance of 'Discord.VoiceChannel'");
        embed.setFooter("Check your code");

        client.channels.get("330410520622530562").sendEmbed(embed);
        return;
    }
    if (!message instanceof Discord.Message) {
        var embed = new Discord.RichEmbed();
        embed.setColor("#F22213");
        embed.addField("Eror running !play", "'message' is not an instance of 'Discord.Message'");
        embed.setFooter("Check your code");

        client.channels.get("330410520622530562").sendEmbed(embed);
        return;
    }

    var server = this.servers[message.guild.id];
    
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function() {
        if (server.queue[0]) {
            playVideo(connection, message);
        }
    });
}

client.login(process.env.BOT_TOKEN);
