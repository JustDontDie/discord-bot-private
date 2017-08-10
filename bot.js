// Requires
const Discord = require('discord.js');
const YTDL = require('ytdl-core');

const PREFIX = "!";

var client = new Discord.Client();

var servers = [];

client.on('ready', () => {
  console.log("Bot online! :D");

  var embed = new Discord.RichEmbed();
  embed.setColor("#40C03D");
  embed.addField("Bot Status", "The bot is now online!");
  embed.setFooter("Your bot is now ready to do what it was made to do. ( ͡° ͜ʖ ͡°)");

  client.channels.get("330410520622530562").sendEmbed(embed);
});

client.on('message', function(message) {
  if (!message.content.startsWith(PREFIX)) return;

  var command = message.content.replace("!", "").split(" ");

  switch (command[0].toLowerCase()) {
    case "help":
      if (!message.channel.id === "329985394949226506") {
        message.delete();
        client.channel.send(message.author + ", that command cannot be used here.");
        return;
      }
      client.channels.get("329985394949226506").send(`@everyone, ${message.author.username} is requesting assistance`);
      break;
    case "play":
      if (message.channel.id !== 332321569818935306) {
        message.delete();
        client.channel.send(message.author + ", that command cannot be used here.");
        return;
      }
      
      if (!command[1]) {
        message.channel.send("I need a link.");
        return;
      }

      message.delete();

      if ((!command[1].includes("https")) || (!command[1].includes("youtube.com") || (!command[1].includes("youtu.be")))) {
        message.channel.send("Invalid link.");
        return;
      }

      if (!message.member.voiceChannel) {
        message.channel.send("You must to be in a voice channel to use this feature.");
        return;
      }

      if (!servers[message.guild.id]) {
        servers[message.guild.id] = {
          queue: []
        };
      }

      var server = servers[message.guild.id];
      server.queue.push(command[1]);

      if (!message.guild.voiceConnection) {
        message.member.voiceChannel.join().then(function(connection) {
          playVideo(connection, message);

          var embed = new Discord.RichEmbed();
          embed.setColor("#40C03D");
          YTDL.getInfo(command[1], function(err, info) {
            embed.addField("Music", info.title + " is now playing");
          });
          embed.setFooter("Set back, grab a drink, and enjoy! :D");

          client.channels.get("332321569818935306").sendEmbed(embed);
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
        for (var i = server.queue.length - 1; i >= 0; i--) {
          server.queue.splice(i, 1);
        }
        server.dispatcher.end();
      }
      break;
    default:
      break;
  }
});

/**
 * Play a song/video
 * @param {Discord.VoiceConnection} [connection] The voice channel you are in
 * @param {Discord.Message} [message] 
 */
function playVideo(connection, message) {
    var server = servers[message.guild.id];
    
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {
      filter: "audioonly"
    }));

    server.queue.shift();
    
    server.dispatcher.on("end", function() {
        if (server.queue[0]) {
            playVideo(connection, message);
        } else {
          connection.disconnect();
        }
    });
}

client.login(process.env.BOT_TOKEN);
