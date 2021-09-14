const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });
const { DiscordTogether } = require('discord-together');
const config = require('./config.json');

const prefix = config.prefix;

client.discordTogether = new DiscordTogether(client);



client.on('ready', () => {
    client.user.setActivity('bobobot')
    console.log(`${client.user.tag}でログイン中...`);
});

client.on('messageCreate', async message => {
    let author = message.author.username;
    let voiceChannel = message.member.voice.channel;

    if (message.author === client.user) {
        return;
    }

    setTimeout(() => {
        if (message != null && message.author !== client.user) {
            if (message.content.startsWith(prefix)) message.delete();
        }
    }, 500);

    let text = message.content.replace(prefix, '');

    if (text === 'time') {
        let nowTime = new Date();
        let yearTime = nowTime.getFullYear();
        let monthTime = nowTime.getMonth();
        let dateTime = nowTime.getDate();
        let hourTime = nowTime.getHours();
        let minTime = nowTime.getMinutes();

        return message.reply(`現在の時間: \`${yearTime}/${monthTime + 1}/${dateTime} - ${hourTime}:${minTime}\``);
    }

    let game = "";

    switch (text) {
        case 'yt':
            game = 'youtube';
            break;

        case 'youtube':
        case 'youtubedev':
        case 'poker':
        case 'betrayal':
        case 'fishing':
        case 'chess':
        case 'chessdev':
            game = text;
            break;
    }

    if (game == "") return;

    if (!voiceChannel) {
        return message.reply(`${author}が入っているVCを検出できませんでした。`);
    }

    message.reply(`${author}が \`${game}\`を開始しました。VC: ${voiceChannel}`);
    client.discordTogether.createTogetherCode(message.member.voice.channel.id, game).then(async invite => {
        message.channel.send(`${invite.code}`);
    });
});

client.login(config.token);
