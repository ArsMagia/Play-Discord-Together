const Discord = require('discord.js');
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES] });
const { DiscordTogether } = require('discord-together');
const config = require('./config.json');

const prefix = config.prefix;
client.discordTogether = new DiscordTogether(client);

client.on('ready', () => {
    client.user.setActivity('!help - コマンド一覧', { type: 'PLAYING' })
    console.log(`${client.user.tag}でログイン...`);
});

client.on('messageCreate', async message => {
    const author = message.author.username;
    const voiceChannel = message.member.voice.channel;
    let game = message.content.replace(prefix, '');

    if (message.author === client.user) return;

    setTimeout(() => {
        if (message != null && message.author !== client.user) {
            if (message.content.startsWith(prefix)) message.delete().catch(console.error);
        }
    }, 1000);

    switch (game) {
        case 'help':
            const helpEmbed = {
                color: 0x999999,
                title: 'Discord-Together',
                url: 'https://github.com/ArsMagia/Play-Discord-Together',
                author: {
                    name: author,
                    icon_url: message.author.avatarURL,
                    url: '',
                },
                description:
                    'コマンド一覧\n' +
                    '`!yt`\n' +
                    '`!poker`\n' +
                    '`!betrayal`\n' +
                    '`!fishing`\n' +
                    '`!chess`\n' +
                    '`!lettertile`\n' +
                    '`!wordsnack`\n' +
                    '`!doodlecrew`\n' +
                    '`!awkword`\n' +
                    '`!spellcast`\n' +
                    '`!checkers`\n',
                // '`puttparty`\n'
                timestamp: new Date(),
            };
            return message.reply({ embeds: [helpEmbed] });

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
        case 'lettertile':
        case 'doodlecrew':
        case 'wordsnack':
        case 'awkword':
        case 'spellcast':
        case 'checkers':
            // case 'puttparty':
            break;

        default:
            return;
    }

    if (!voiceChannel) return message.reply(`${author}が入っているVCを検出できませんでした。`);

    const reply = await message.reply(`${author}が \`${game}\`を開始しました。VC: ${voiceChannel}`);
    client.discordTogether.createTogetherCode(message.member.voice.channel.id, game).then(async invite => {
        reply.edit(`${reply.content}\n${invite.code}`);
    });
});

client.login(config.token);
