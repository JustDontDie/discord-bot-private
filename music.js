const Discord = require('discord.js');
const YTDL = require('ytdl-core');

var client = new Discord.Client();

function MusicPlayer() {
    this.servers = {};
}

MusicPlayer.prototype.playVideo = function(connection, message) {
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