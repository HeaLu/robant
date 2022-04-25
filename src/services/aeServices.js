const {CronJob, CronTime} = require('cron')
const { formatDistance, startOfDay, subHours, addHours, startOfHour, nextFriday, format } = require('date-fns')
const config = require('../config')
const { MessageEmbed } = require('discord.js')

module.exports = class Ae {
  constructor(client) {
    this._client = client
    this._date = new Date()

    this._job = new CronJob('0 */5 * * * *', async function () {
      if (new Date() > this._date) {
        this.stop()
        return
      }
      const diff = formatDistance(new Date(), this._date)
      const channel = await this._client.channels.cache.get(config.channels.expedition)
      if (channel.name !== `🌴-ae-in-${diff}`) channel.setName(`🌴-ae-in-${diff}`)
    }, null, false, 'UTC', this)

    this._remind1 = new CronJob(new Date(), async function () {
      const message = new MessageEmbed()
      .setColor('BLUE')
      .setTitle("Reminder")
      .setThumbnail("https://www.clipartmax.com/png/full/18-185824_bell-icon-bell-icon.png")
      .setDescription(`<@&${config.roles.members}> don't forget Alliance Expedition today at **__${this._date.getUTCHours()}h UTC__**`)
      this._client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, false, 'UTC', this)

    this._remind2 = new CronJob(new Date(), async function () {
      const message = new MessageEmbed()
      .setColor('BLUE')
      .setTitle("Reminder")
      .setThumbnail("https://www.clipartmax.com/png/full/18-185824_bell-icon-bell-icon.png")
      .setDescription(`<@&${config.roles.members}> Alliance Expedition in **__1 hour__**, prepare yourself for battle !`)
      this._client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, false, 'UTC', this)
  }

  get running() {
    return this._job.running
  }
  
  async resetName() {    
    const expedition = await this._client.channels.cache.get(config.channels.expedition)
    if (expedition.name !== "🌴-alliance-expedition") expedition.setName(`🌴-alliance-expedition`)
  }

  async empty () {    
    const channel = await this._client.channels.fetch(config.channels.expedition)
    let deleted;
    do {
      deleted = await channel.bulkDelete(100);
    } while (deleted.size != 0);
  }

  async poll () {
    const today = new Date()
    const friday = format(nextFriday(today), "EEEE, MMMM d")

    const message = new MessageEmbed()
    .setColor('PURPLE')
    .setTitle("Alliance expedition of " + friday)
    .setDescription(`<@&${config.roles.members}> please indicate all your availabilities for the event. You can put several`)
    .setThumbnail('https://www.pinclipart.com/picdir/big/538-5381843_clipart-flower-images-png-transparent-background-tropical-flower.png')
    .addFields(
      {name: "11h UTC", value: "1️⃣", inline: true},
      {name: "13h UTC", value: "2️⃣", inline: true},
      {name: '\u200b', value: '\u200b'},
      {name: "20h UTC", value: "3️⃣", inline: true}, 
      {name: "23h UTC", value: "4️⃣", inline: true}
    )
    .setFooter({text: "Please come back here next week !"})

    const display = await this._client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    await display.react('1️⃣')
    await display.react('2️⃣')
    await display.react('3️⃣')
    await display.react('4️⃣')
  }

    async getChannel() {
    const channel = await this._client.channels.cache.get(config.channels.expedition)
    return channel
  }

  start(date) {
    if (!this.running) {
      this._date = startOfHour(date)
      const guild = this._client.guilds.cache.get(config.discord.guildId)
      guild.scheduledEvents.create({
        name: "Alliance Expedition",
        scheduledStartTime: this._date,
        scheduledEndTime: addHours(this._date, 1),
        privacyLevel: "GUILD_ONLY",
        entityType: "EXTERNAL",
        entityMetadata: {
          location: "In the jungle"
        }
      })
      this._job.start()
      if (this._date > startOfDay(this._date)) {
        this._remind1.setTime(new CronTime(addHours(startOfDay(this._date), 2)))
        this._remind1.start()
      }
      if (this._date > subHours(this._date, 1)) {
        this._remind2.setTime(new CronTime(subHours(this._date, 1)))
        this._remind2.start()
      }
      return true
    } else {
      return false
    }
  }

  async stop() {
    if (this._remind1.running)  this._remind1.stop()
    if (this._remind2.running) this._remind2.stop()
    const channel = this._client.channels.cache.get(config.channels.expedition)
    if (channel.name !== "🌴-alliance-expedition") channel.setName("🌴-alliance-expedition")
    if (this._job.running) {
      this._job.stop()
      return "AE countdown **stopped**"
    } else {
      return "Error, AE countdown wasn't running"
    }
  }  

  async restart(newdate) {
    try {
      await this.stop()
      this.start(newdate)
      return true
    }
    catch (e) {
      return false
    }
  }
}