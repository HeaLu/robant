const config = require("./config/index")
const Discord = require("discord.js")
const datefns = require('date-fns')
const daily = require('./services/daily')
var CronJob = require('cron').CronJob
const { default: axios } = require("axios")

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.once('ready', () => {
  console.log("AnT Reminder est dans la place !");
})

client.on('messageReactionAdd', async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
  
  const langs = [
    {short: 'BG', label: 'Bulgarian', flags: ['🇧🇬']},
    {short: 'CS', label: 'Czech', flags: ['🇨🇿']},
    {short: 'DA', label: 'Danish', flags: ['🇩🇰']},
    {short: 'DE', label: 'German', flags: ['🇩🇪']},
    {short: 'EL', label: 'Greek', flags: ['🇬🇷']},
    {short: 'EN', label: 'English', flags: ['🇺🇸', '🇬🇧']},
    {short: 'ES', label: 'Spanish', flags: ['🇪🇸']},
    {short: 'ET', label: 'Estonian', flags: ['🇪🇪']},
    {short: 'FI', label: 'Finnish', flags: ['🇫🇮']},
    {short: 'FR', label: 'French', flags: ['🇫🇷']},
    {short: 'HU', label: 'Hungarian', flags: ['🇭🇺']},
    {short: 'IT', label: 'Italian', flags: ['🇮🇹']},
    {short: 'JA', label: 'Japanese', flags: ['🇯🇵']},
    {short: 'LT', label: 'Lithuanian', flags: ['🇱🇹']},
    {short: 'LV', label: 'Latvian', flags: ['🇱🇻']},
    {short: 'NL', label: 'Dutch', flags: ['🇳🇱']},
    {short: 'PL', label: 'Polish', flags: ['🇵🇱']},
    {short: 'PT', label: 'Portuguese', flags: ['🇵🇹', '🇧🇷']},
    {short: 'RO', label: 'Romanian', flags: ['🇷🇴']},
    {short: 'RU', label: 'Russian', flags: ['🇷🇺']},
    {short: 'SK', label: 'Slovak', flags: ['🇸🇰']},
    {short: 'SL', label: 'Slovenian', flags: ['🇸🇮']},
    {short: 'SV', label: 'Swedish', flags: ['🇸🇪']},
    {short: 'ZH', label: 'Chinese', flags: ['🇨🇳']}
  ]

  const targetLang = langs.find(lang => lang.flags.indexOf(reaction._emoji.name) !== -1)
  
  if (!targetLang) return

  const translation = await axios.get('https://api-free.deepl.com/v2/translate', {
    params: {
      target_lang: targetLang.short,
      text: reaction.message.content,
      auth_key: config.deepl.key
    }
  })

  const originLang = langs.find(lang => lang.short === translation.data.translations[0].detected_source_language)

  const message = `Your translation of **${reaction.message.author.username}**'s message, from ${originLang.flags[0]} **${originLang.label}** (detected):  
  \`\`\`${translation.data.translations[0].text}\`\`\`
  
  **Original text:**  
  >>> *${reaction.message.content}*`
  
  user.send(message)
  reaction.remove()
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

  const today = new Date()
	const { commandName } = interaction;
  switch (commandName) {
    case "today": 
      interaction.reply({content: daily.getDiscordDaily(today), ephemeral: true})
      break
    case "daily": 
      interaction.reply({content: daily.getGameDaily(today), ephemeral: true})
      break
    case "tomorrow":
      interaction.reply({content: daily.getDiscordDaily(datefns.addDays(today, 1)), ephemeral: true})
      break
    case "monday":
      interaction.reply({content: daily.getDiscordDaily(datefns.nextMonday(today)), ephemeral: true})
      break
    case "tuesday":
      interaction.reply({content: daily.getDiscordDaily(datefns.nextTuesday(today)), ephemeral: true})
      break
    case "wednesday":
      interaction.reply({content: daily.getDiscordDaily(datefns.nextWednesday(today)), ephemeral: true})
      break
    case "thursday":
      interaction.reply({content: daily.getDiscordDaily(datefns.nextThursday(today)), ephemeral: true})
      break
    case "friday":
      interaction.reply({content: daily.getDiscordDaily(datefns.nextFriday(today)), ephemeral: true})
      break
    case "saturday":
      interaction.reply({content: daily.getDiscordDaily(datefns.nextSaturday(today)), ephemeral: true})
      break
    case "sunday":
      interaction.reply({content: daily.getDiscordDaily(datefns.isSunday(today) ? today : datefns.nextSunday(today)), ephemeral: true})
      break
    default:
      break
  }
})

client.on("messageCreate", message => {
  const today = new Date()
  switch (message.content) {
    case "!today": 
      message.reply(daily.getDiscordDaily(today))
      break
    case "!daily": 
      message.reply(daily.getGameDaily(today))
      break
    case "!tomorrow":
      message.reply(daily.getDiscordDaily(datefns.addDays(today, 1)))
      break
    case "!monday":
      message.reply(daily.getDiscordDaily(datefns.nextMonday(today)))
      break
    case "!tuesday":
      message.reply(daily.getDiscordDaily(datefns.nextTuesday(today)))
      break
    case "!wednesday":
      message.reply(daily.getDiscordDaily(datefns.nextWednesday(today)))
      break
    case "!thursday":
      message.reply(daily.getDiscordDaily(datefns.nextThursday(today)))
      break
    case "!friday":
      message.reply(daily.getDiscordDaily(datefns.nextFriday(today)))
      break
    case "!saturday":
      message.reply(daily.getDiscordDaily(datefns.nextSaturday(today)))
      console.log(datefns.nextSaturday(today));
      break
    case "!sunday":
      message.reply(daily.getDiscordDaily(datefns.isSunday(today) ? today : datefns.nextSunday(today)))
      break
    case "!help":
      message.reply("RobAnT help:\nType !monday, !tuesday, etc., !today or !tomorrow to get daily event objectives. !daily gives today event without emojis");
      break
    case "!borek":
      message.reply("🍺🥂")
      break
    case "!hana" :
      message.reply("👸💖")
      break
    case "!kam" :
      message.reply("⚔️😈")
      break
    case "!meta" :
      message.reply("🌪️👼")
      break
    case "!test" :
      message.reply("!déçu que test soi**t** même pas utilisé (suggestion de Kam avec une correction sur la conjugaison)")
      break
    default:
      break
  }
})
/*const channelOfficers = client.channels.cache.get(config.channel.officers)
const channelPublic = client.channels.cache.get(config.channel.public)
console.log(channelPublic);
const job = new cron ('45 11 * * *', function () {
  channelOfficers.send("test0")
  channelPublic.send("testp")
  console.log('Running a job at 01:00')
})

job.start()*/

const job = new CronJob('00 00 00 * * *', function() {
  const today = new Date()
  client.channels.cache.get(config.channel.officers).send(daily.getGameDaily(today))
  client.channels.cache.get(config.channel.public).send(daily.getDiscordDaily(today))
  console.log('Running a job at 01:00')
}, null, true, 'UTC');

job.start();
client.login(config.discord.token)