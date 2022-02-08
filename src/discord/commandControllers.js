const daily = require('../services/dailyServices')
const ca = require("../services/caServices")
const { addDays, nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, isSunday, nextSunday } = require('date-fns')

const help = {
  color: 0xff0000,
  title: 'Manual of RobAnT',
  thumbnail: 'https://w7.pngwing.com/pngs/682/990/png-transparent-product-manuals-explanation-illustrator-%E3%81%84%E3%82%89%E3%81%99%E3%81%A8%E3%82%84-manual-book-illustrator-material-business-thumbnail.png',
  author: {
    name: "RobAnT",
    icon_url: "https://cdn.discordapp.com/app-icons/929654147471540234/ab4bf5bc1b1229497e5c0d4c8d85397b.png?size=256"
  },
  fields: [
    {
      name: "📰 The Daily AnT",
      value: "Type **/today, /tomorrow, /monday, /tuesday**, etc. to get The Daily AnT. Type **/daily** to get The Daily AnT without emojis"
    },
    {
      name: "⏰ Colony actions",
      value: "Type **/ca** to see current colony actions and all colony actions matching SvS goals"
    },
    {
      name: "🌎 Translator",
      value: "React with a flag 🇬🇧🇫🇷🇷🇺 (24 language availables) to get the translation of a text by private message"
    },
    {
      name: "📆 Scheduled tasks",
      value: "Colony actions each hour at xh05\nDaily AnT each day at 0h UTC\nNew alliance expedition poll each saturday at 0h UTC"
    },
    {
      name: "👋 Welcome",
      value: "RobAnT says Hello to newcomers"
    },
    {
      name: "✅ Want more ?",
      value: "If you have any idea to improve RobAnT, feel free to share it with me <@277817818815266827> !"
    }
  ]
}

module.exports = client => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const today = new Date()
    const { commandName } = interaction;
    switch (commandName) {
      case "daily": 
        interaction.reply({content: daily.getGameDaily(today), ephemeral: true})
        break
      case "today": 
        interaction.reply({embeds: [daily.getDiscordDaily(today)], ephemeral: true})
        break
      case "tomorrow":
        interaction.reply({embeds: [daily.getDiscordDaily(addDays(today, 1))], ephemeral: true})
        break
      case "monday":
        interaction.reply({embeds: [daily.getDiscordDaily(nextMonday(today))], ephemeral: true})
        break
      case "tuesday":
        interaction.reply({embeds: [daily.getDiscordDaily(nextTuesday(today))], ephemeral: true})
        break
      case "wednesday":
        interaction.reply({embeds: [daily.getDiscordDaily(nextWednesday(today))], ephemeral: true})
        break
      case "thursday":
        interaction.reply({embeds: [daily.getDiscordDaily(nextThursday(today))], ephemeral: true})
        break
      case "friday":
        interaction.reply({embeds: [daily.getDiscordDaily(nextFriday(today))], ephemeral: true})
        break
      case "saturday":
        interaction.reply({embeds: [daily.getDiscordDaily(nextSaturday(today))], ephemeral: true})
        break
      case "sunday":
        interaction.reply({embeds: [daily.getDiscordDaily(isSunday(today) ? today : nextSunday(today))], ephemeral: true})
        break
      case "ca":
        interaction.reply({embeds: [ca.getHourColonyActions(), ca.getDayColonyActions()], ephemeral: true})
        break
      case "help":
        interaction.reply({embeds: [help], ephemeral: true})
        break
      case "test" :
        interaction.reply({embeds: [daily.getDiscord2Daily(today)], ephemeral: true})
        break
      default:
        break
    }
  })
  
  client.on("messageCreate", message => {
    switch (message.content) {
      case "!borek":
        message.reply("🍺🥂")
        break
      case "!hana" :
        message.reply("👸🎼")
        break
      case "!kam" :
        message.reply("⚔️😈")
        break
      case "!meta" :
        message.reply("🌪️👼")
        break
      case "!iesu" :
        message.reply("🚜👩‍💻")
        break
      case "!thm" :
        message.reply("🛡️🔩")
        break
      case "!healu" :
        message.reply("♔🖥️")
        break
      case "!new" :
        message.reply({embeds: [daily.getDiscordDaily(), daily.getDiscord2Daily()]})
        break
      case "!test" :
        message.reply("!déçu que test soi**t** même pas utilisé (suggestion de Kam avec une correction sur la conjugaison)")
        break
      default:
        break
    }
  })
}

