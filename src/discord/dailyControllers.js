const daily = require('../services/dailyServices')
const datefns = require('date-fns')

module.exports = client => {
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
}

