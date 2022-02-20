const daily = require('../services/dailyServices')
const Ca = require("../services/caServices")
const config = require('../config')
const { next } = require('../tools')
const isFriday = require('date-fns/isFriday')
const utcToZonedTime = require('date-fns-tz/utcToZonedTime')
const { MessageEmbed } = require('discord.js')
const Member = require('../models/memberModel')

const timezoneFooter = (timezone) => {
  return `Timezone set to ${timezone === "UTC" ? "UTC. Set your own by using /timezone command" : timezone}`
}

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
      value: "**/daily** to get The Daily AnT."
    },
    {
      name: "⏰ Colony actions",
      value: `**/ca hour** to get hourly colony actions [NOT WORKING CURRENTLY]\n**/ca svs** to get daily colony actions matching with SvS\n**/ca allday** to get all colony action of a given day\n**/ca search** to find all hours in a day matching with given goal\n**/timezone** permits you to set your own timezone`
    },
    {
      name: "🌎 Translator",
      value: "React with a flag 🇬🇧🇫🇷🇷🇺 (24 language availables) to get the translation of a text by private message"
    },
    {
      name: "📆 Scheduled tasks",
      value: "Colony actions are updated each hour at xh05\nDaily AnT each day at 0h UTC\nNew alliance expedition poll each Saturday at 0h UTC, reminder for members Wednesday at 0h UTC and for officers at 21h UTC"
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

module.exports = (client, AeInstance) => {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const { _subcommand, _hoistedOptions} = interaction.options

    let member = await Member.findOne({discordId: interaction.member.id})
    if (!member) {
      member = new Member({discordId: interaction.member.id})
    }
    const index = member.usage.findIndex(el => el.command === commandName)
    if (index === -1) {
      member.usage.push({command: commandName, qty: 1, last: new Date()})
    } else {
      member.usage[index].qty++
      member.usage[index].last = new Date()
    }
    member.markModified("usage")
    member.discordName = interaction.member.displayName

    switch (commandName) {
      case "timezone": 
        const set = _hoistedOptions.find(el => el.name === "set")
        if (!set) {
          const message = new MessageEmbed()
          message.setColor("BLUE").setTitle(`Your timezone is currently **__${member.timezone}__**`)
          .setDescription("If you want to change it, type **/timezone set** *yourtimezone*. You can find all timezones [by clicking here](https://timezonedb.com/time-zones), expected codes are in the 3rd column")
          interaction.reply({embeds: [message], ephemeral: true})
          break
        } else {
          const test = utcToZonedTime(new Date(), set.value)
          if (isNaN(test)) {
            const message = new MessageEmbed()
            message.setColor("RED").setTitle("Error while detecting your timezone")
            .setDescription('Are you sure it\'s in a valid format (example "Europe/Paris") ? You can find all timezones [by clicking here](https://timezonedb.com/time-zones), expected codes are in the 3rd column')
            interaction.reply({embeds: [message], ephemeral: true})
            break
          } else {
            member.timezone = set.value
            const message = new MessageEmbed()
            message.setColor("GREEN").setTitle("Success")
            .setDescription(`Your timezone is now **__${member.timezone}__** and it will be used when you will use **/ca** commands`)
            interaction.reply({embeds: [message], ephemeral: true})
          }
        }
        break
      case "ca":
        if (_subcommand === "hour") {
          const weekday = _hoistedOptions.find(el => el.name === "weekday")
          const hours = _hoistedOptions.find(el => el.name === "hours")
          const day = next[weekday.value].setHours(hours.value)
          const message = new Ca(day, member.timezone).getHourColonyActions()
          message.setFooter({text: timezoneFooter(member.timezone)})
          interaction.reply({embeds: [message], ephemeral: true})
        }
        if (_subcommand === "svs") {
          const weekday = _hoistedOptions.find(el => el.name === "weekday")
          const day = next[weekday.value]
          const message = new Ca(day, member.timezone).getDayColonyActions()
          message.setFooter({text: timezoneFooter(member.timezone)})
          interaction.reply({embeds: [message], ephemeral: true})
        }
        if (_subcommand === "allday") {
          const weekday = _hoistedOptions.find(el => el.name === "weekday")
          const day = next[weekday.value]
          const message = new Ca(day, member.timezone).getAlldayColonyAction()
          message.setFooter({text: timezoneFooter(member.timezone)})
          interaction.reply({embeds: [message], ephemeral: true})
        }
        if (_subcommand === "search") {
          const weekday = _hoistedOptions.find(el => el.name === "weekday")
          const goal = _hoistedOptions.find(el => el.name === "goal")
          const day = next[weekday.value]
          const message = new Ca(day, member.timezone).searchCa(goal.value)
          message.setFooter({text: timezoneFooter(member.timezone)})
          interaction.reply({embeds: [message], ephemeral: true})
        }
        break
      case "daily": 
        const weekday = _hoistedOptions.find(el => el.name === "weekday")
        const ingame = _hoistedOptions.find(el => el.name === "ingame")
        const withoutEmojis = ingame !== undefined ? ingame.value : false
        const day = next[weekday.value]
        if (withoutEmojis) {
          interaction.reply({content: daily.getGameDaily(day), ephemeral: true})
        } else {
          interaction.reply({embeds: [daily.getDiscordDaily(day)], ephemeral: true})
        }
        break
      case "ae":
        if (interaction.member._roles.indexOf(config.roles.officers) === -1) {
          interaction.reply({content: "Only R4 can do it, sorry...", ephemeral: true})
          break
        }
        const hour = _hoistedOptions.find(el => el.name === "hour")
        if (_subcommand === "start") {
          const friday = isFriday(new Date()) ? new Date() : next["friday"]
          friday.setUTCHours(parseInt(hour.value))
          const result = AeInstance.start(friday)
          if (result) {
            interaction.reply({content: "AE countdown **started**. Don't worry if it seems it doesn't work, the refresh time is each 5 minutes (according to Discord rules)", ephemeral: true})
          } else {
            interaction.reply({content: "Error while starting AE", ephemeral: true})
          }
          break
        }
        if (_subcommand === "stop") {
          const content = await AeInstance.stop()
          interaction.reply({content, ephemeral: true})
          break
        }
        if (_subcommand === "restart") {
          const result = await AeInstance.restart(friday)
          if (result) {
            interaction.reply({content: "AE countdown **restarted**. Don't worry if it seems it doesn't work, the refresh time is each 5 minutes (according to Discord rules)", ephemeral: true})
          } else {
            interaction.reply({content: "Error while restarting AE", ephemeral: true})
          }
          break
        }
      case "help":
        interaction.reply({embeds: [help], ephemeral: true})
        break
      default:
        break
    }
    member.save()
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
        message.reply("👼☕")
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

