const datefns = require("date-fns")

const dailyData = {
  monday: {
    day: "Monday", 
    tasks: "Building", 
    actions: "0h30 (SvS is not active before), 8h, 16h UTC", 
    tips: "Watch the construction time of your biggest buildings, and start them in order they finish on Monday",
    tomorrow: "Send your troops to harvest today, so that they finish as soon as possible when you are available after the 0h UTC reset"
  },
  tuesday: {
    day: "Tuesday", 
    tasks: "Harvesting and cells",
    tips: "Send your troops harvesting the day before, in order the tile they are harvesting are empty a few minutes before you wake up",
    tomorrow: "Launch a big evolution for tomorrow"
  },
  wednesday: {
    day: "Wednesday", 
    tasks: "Evolutions", 
    actions: "1h, 9h, 17h UTC", 
    tips: "The real power is in Evolutions, don't forget them !"
  },
  thursday: {
    day: "Thursday", 
    tasks: "Special ants", 
    actions: "Even hours (0h, 2h, 4h, etc. UTC)", 
    tips: "Collect eggs all along the week, and hatch them on Thursday"
  },
  friday: {
    day: "Friday", 
    tasks: "Hatching and genes", 
    actions: "5h, 6h, 13h, 14h, 21h, 22h UTC", 
    tips: "Hatch your best with raspberry in order to play 2 colony action (example raspberry at 13h45 UTC to play 13h and 14h colony action with the same raspeberry). If you need SvS points at the end, you can still mutate some ants"
  },
  saturday: {
    day: "Saturday", 
    tasks: "Free and germs",
    tips: "Harvesting for cultivators, or hatching for herders and raider are the easiest"
  },
  sunday1: {
    day: "Sunday", 
    tasks: "War Event and insect", 
    actions: "Odd hours (1h, 3h, 5h, etc. UTC) for insects", 
    tips: "Time for war ! You're not a fighter ? Go harvesting on ennemy server at about 150 feets from their tree. Harvest only level 7 tiles far from your anthill (50 to 100 feet). Your're a figher ? You know what you have to do."
  },
  sunday2: {
    day: "Sunday", 
    tasks: "Groundhogs and insect", 
    actions: "Odd hours (1h, 3h, 5h, etc. UTC) for insects", 
    tips: "Send pro 3 times to groundhog, then put your best special ants and insect to an other formation, send it 3 times to groundhog, then put your best special ants and insect to an other formation, etc."
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
  const c = getDailyContent(d)
  let text =  c.day ? "📰 **Daily AnT - " + c.day + "**\n\n" : "Daily AnT"
  text = c.tasks ? text + "🏆 **Today SvS**\n" + c.tasks + "\n\n" : text
  text = c.actions ? text + "⏰ **Colony actions**\n" + c.actions + "\n\n" : text
  text = c.tips ? text + "👍🏽 **AnTip**\n" + c.tips + "\n\n" : text
  text = c.tomorrow ? text + "📆 **Prepare for tomorrow**\n" + c.tomorrow : text
  return text
} 

const getGameDaily = (d = new Date()) => {
  const c = getDailyContent(d)
  let text =  c.day ? "Daily AnT - " + c.day + ":\n\n" : "Daily AnT"
  text = c.tasks ? text + "Today SvS:\n" + c.tasks + "\n\n" : text
  text = c.actions ? text + "Colony actions:\n" + c.actions + "\n\n" : text
  text = c.tips ? text + "AnTip:\n" + c.tips + "\n\n" : text
  text = c.tomorrow ? text + "Prepare for tomorrow:\n" + c.tomorrow : text
  return text
} 

exports.getDiscordDaily = getDiscordDaily
exports.getGameDaily = getGameDaily