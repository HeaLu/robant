const config = require("./config/index")
const Discord = require("discord.js")
const datefns = require('date-fns')
const daily = require('./services/daily')
//const { default: axios } = require("axios")

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

/*client.on('messageReactionAdd', async (reaction, user) => {
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
    {target_lang: 'BG', label: 'Bulgarian', flags: ['🇧🇬']},
    {target_lang: 'CS', label: 'Czech', flags: ['🇨🇿']},
    {target_lang: 'DA', label: 'Danish', flags: ['🇩🇰']},
    {target_lang: 'DE', label: 'German', flags: ['🇩🇪']},
    {target_lang: 'EL', label: 'Greek', flags: ['🇬🇷']},
    {target_lang: 'EN', label: 'English', flags: ['🇺🇸', '🇬🇧']},
    {target_lang: 'ES', label: 'Spanish', flags: ['🇪🇸']},
    {target_lang: 'ET', label: 'Estonian', flags: ['🇪🇪']},
    {target_lang: 'FI', label: 'Finnish', flags: ['🇫🇮']},
    {target_lang: 'FR', label: 'French', flags: ['🇫🇷']},
    {target_lang: 'HU', label: 'Hungarian', flags: ['🇭🇺']},
    {target_lang: 'IT', label: 'Italian', flags: ['🇮🇹']},
    {target_lang: 'JA', label: 'Japanese', flags: ['🇯🇵']},
    {target_lang: 'LT', label: 'Lithuanian', flags: ['🇱🇹']},
    {target_lang: 'LV', label: 'Latvian', flags: ['🇱🇻']},
    {target_lang: 'NL', label: 'Dutch', flags: ['🇳🇱']},
    {target_lang: 'PL', label: 'Polish', flags: ['🇵🇱']},
    {target_lang: 'PT', label: 'Portuguese', flags: ['🇵🇹', '🇧🇷']},
    {target_lang: 'RO', label: 'Romanian', flags: ['🇷🇴']},
    {target_lang: 'RU', label: 'Russian', flags: ['🇷🇺']},
    {target_lang: 'SK', label: 'Slovak', flags: ['🇸🇰']},
    {target_lang: 'SL', label: 'Slovenian', flags: ['🇸🇮']},
    {target_lang: 'SV', label: 'Swedish', flags: ['🇸🇪']},
    {target_lang: 'ZH', label: 'Chinese', flags: ['🇨🇳']}
  ]

  

  for (const l of langs) {
    const index = l.flags.indexOf(reaction._emoji.name)
    if (index !== -1) {
      let translator = {content: reaction.message.content, target: l}
      const translation = await axios.get('https://api-free.deepl.com/v2/translate', {
        params: {
          target_lang: translator.target.target_lang,
          text: translator.content,
          auth_key: config.deepl.key
        }
      })
      console.log(reaction.users);
      //reaction.message.author.send('You wanted')
      //console.log(translation.data);
    }
  }
});*/

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
    default:
      break
  }
})


client.login(config.discord.token)