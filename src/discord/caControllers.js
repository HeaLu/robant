const daily = require('../services/dailyServices')
const ca = require("../services/caServices")
const datefns = require('date-fns')

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
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.addDays(today, 1))], ephemeral: true})
        break
      case "monday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.nextMonday(today))], ephemeral: true})
        break
      case "tuesday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.nextTuesday(today))], ephemeral: true})
        break
      case "wednesday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.nextWednesday(today))], ephemeral: true})
        break
      case "thursday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.nextThursday(today))], ephemeral: true})
        break
      case "friday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.nextFriday(today))], ephemeral: true})
        break
      case "saturday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.nextSaturday(today))], ephemeral: true})
        break
      case "sunday":
        interaction.reply({embeds: [daily.getDiscordDaily(datefns.isSunday(today) ? today : datefns.nextSunday(today))], ephemeral: true})
        break
      case "ca":
        interaction.reply({embeds: [ca.getDiscordColonyActions(today)], ephemeral: true})
        break
      default:
        break
    }
  })
  
  client.on("messageCreate", message => {
    const today = new Date()
    switch (message.content) {
      case "!daily": 
        message.reply(daily.getGameDaily(today))
        break
      case "!today": 
        message.reply({embeds: [daily.getDiscordDaily(today)]})
        break
      case "!tomorrow":
        message.reply({embeds: [daily.getDiscordDaily(datefns.addDays(today, 1))]})
        break
      case "!monday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.nextMonday(today))]})
        break
      case "!tuesday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.nextTuesday(today))]})
        break
      case "!wednesday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.nextWednesday(today))]})
        break
      case "!thursday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.nextThursday(today))]})
        break
      case "!friday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.nextFriday(today))]})
        break
      case "!saturday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.nextSaturday(today))]})
        break
      case "!sunday":
        message.reply({embeds: [daily.getDiscordDaily(datefns.isSunday(today) ? today : datefns.nextSunday(today))]})
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

