const datefns = require("date-fns")
const { MessageEmbed } = require('discord.js')

const dailyData = {
  monday: { 
    day: "Monday", 
    tasks: "Buildings", 
    actions: "0h30 (SvS is not active before), 5h, 13h, 21h UTC", 
    tips: "Watch the construction time of your biggest buildings, and start them in order they finish on Monday", 
    tomorrow: "Send your troops to harvest today, so that they finish as soon as possible when you are available after the 0h UTC reset. But don´t recall them before 0h30 when the Gathering event starts"
  },
  tuesday: { 
    day: "Tuesday",
    tasks: "Harvesting and Cells", 
    actions: "1h, 5h, 7h, 9h, 13h, 15h, 21h, 23h UTC", 
    tips: "Send your troops harvesting the day before, in order the tile they are harvesting are empty a few minutes before you wake up. Get the Cell material in Epoptic Funghi store, Alliance store or by hunting lizzards. ", 
    tomorrow: "Launch a big evolution for tomorrow" 
  },
  wednesday: { 
    day: "Wednesday", 
    tasks: "Evolution", 
    actions: "1h, 9h, 17h UTC", 
    tips: "The real power is in Evolutions, don't forget them! Focus on achieving 100% Zone Develop. This will give you many times more points in svs and rich rewards. Check your evo progress in the Cave Challenge." 
  },
  thursday: { 
    day: "Thursday", 
    tasks: "Special ants", 
    actions: "Even hours (0h30, 2h, 4h, etc. UTC)", 
    tips: "Collect eggs all along the week, and hatch them on Thursday. Do not open all eggs at once. When you reach 3 shells in colony action, stop opening and wait for the next colony action. Get more points: use spores, gain experience (hunt wild, kiwi dew), unlock skills."
  },
  friday: { 
    day: "Friday", 
    tasks: "Hatching and Genes", 
    actions: "1h, 5h, 6h, 9h, 11h, 13h, 14h, 17h, 19h, 21h, 22h UTC", 
    tips: "Hatch your best with raspberry in order to play 2 colony action (example raspberry at 13h45 UTC to play 13h and 14h colony action with the same raspeberry). If you need SvS points at the end, you can still mutate some ants. Get the Gene material in Mine store."
  },
  saturday: { 
    day: "Saturday", 
    tasks: "Free and Germs", 
    tips: "Harvesting for cultivators, or hatching for herders and raider are the easiest. Get the Germ material in Duel store."
  },
  sunday1: { 
    day: "Sunday", 
    tasks: "War Event and Insect", 
    actions: "Odd hours (1h, 3h, 5h, etc. UTC) for insects", 
    tips: "Time for war! You're not a fighter? Go harvesting on enemy server at about 150 feets from their tree. Harvest only level 7 tiles far from your anthill (50 to 100 feet). Your're a figher? You know what you have to do."
  },
  sunday2: { 
    day: "Sunday", 
    tasks: "Groundhogs and Insect", 
    actions: "Odd hours (1h, 3h, 5h, etc. UTC) for insects", 
    tips: "Raider class, full shooters, attack bonuses, berry. Tp closer to groundhog, share rallies. Send pro unit 3 times to groundhog, then put your best special ants and insect to an other formation, send it 3 times to gh, then put your best special ants and insect to an other formation, etc."
  }
}

function getDailyContent (d = new Date()) {
  if (datefns.isMonday(d)) return dailyData.monday
  if (datefns.isTuesday(d)) return dailyData.tuesday
  if (datefns.isWednesday(d))  return dailyData.wednesday
  if (datefns.isThursday(d)) return dailyData.thursday
  if (datefns.isFriday(d)) return dailyData.friday
  if (datefns.isSaturday(d)) return dailyData.saturday
  if (datefns.isSunday(d)) return datefns.getWeek(d)%2 === 0 ? dailyData.sunday1 : dailyData.sunday2
}

const getDiscordDaily = (d = new Date()) => {
  const message = new MessageEmbed()
  const c = getDailyContent(d)
  if (c.day) message.setTitle("📰 __The Daily AnT__ - " + c.day + "\n")
  if (c.tasks) message.addField("🏆 Today SvS", c.tasks + "\n")
  if (c.actions) message.addField("⏰ Colony actions", c.actions + "\n")
  if (c.tips) message.addField("👍🏽 AnTip", c.tips+ "\n")
  if (c.tomorrow) message.addField("📆 Prepare for tomorrow",  c.tomorrow)
  return message
  let text =  c.day ? "📰 **Daily AnT - " + c.day + "**\n\n" : "Daily AnT"
  text = c.tasks ? text + "🏆 **Today SvS**\n" + c.tasks + "\n\n" : text
  text = c.actions ? text + "⏰ **Colony actions**\n" + c.actions + "\n\n" : text
  text = c.tips ? text + "👍🏽 **AnTip**\n" + c.tips + "\n\n" : text
  text = c.tomorrow ? text + "📆 **Prepare for tomorrow**\n" + c.tomorrow : text
  return text
} 

const getGameDaily = (d = new Date()) => {
  const c = getDailyContent(d)
  let text =  c.day ? "The Daily AnT - " + c.day + ":\n\n" : "Daily AnT"
  text = c.tasks ? text + "Today SvS:\n" + c.tasks + "\n\n" : text
  text = c.actions ? text + "Colony actions:\n" + c.actions + "\n\n" : text
  text = c.tips ? text + "AnTip:\n" + c.tips + "\n\n" : text
  text = c.tomorrow ? text + "Prepare for tomorrow:\n" + c.tomorrow : text
  return text
}

exports.getDiscordDaily = getDiscordDaily
exports.getGameDaily = getGameDaily