const {CronJob, CronTime} = require('cron')
const { formatDistance, startOfDay, subHours, startOfHour, addSeconds } = require('date-fns')
const config = require('../config')
const { MessageEmbed } = require('discord.js')

module.exports = class Ae {
  constructor(client) {
    this._client = client
    this._date = new Date()
    this._job = new CronJob('0 */5 * * * *', this.tick, null, false, 'UTC', this)
    this._remind1 = new CronJob(subHours(this._date, -1), async function () {
      const message = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle("Reminder")
      .setThumbnail("https://www.clipartmax.com/png/full/18-185824_bell-icon-bell-icon.png")
      .setDescription(`<@&${config.roles.members}> don't forget Alliance Expedition today at ${this._date.getUTCHours()}h UTC`)
      this._client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, false, 'Europe/Paris', this)
    this._remind2 = new CronJob(subHours(this._date, -1), async function () {
      const message = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle("Reminder")
      .setThumbnail("https://www.clipartmax.com/png/full/18-185824_bell-icon-bell-icon.png")
      .setDescription(`<@&${config.roles.members}> Alliance Expedition in 1 hour, prepare yourself for battle !`)
      this.client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, false, 'Europe/Paris', this)
  }

  get running() {
    return this._job.running
  }



  async tick() {
    if (new Date() > this._date) {
      this.stop()
      return
    }
    const diff = formatDistance(new Date(), this._date)
    const channel = await this.getChannel()
    if (channel.name !== `🌴-ae-in-${diff}`) channel.setName(`🌴-ae-in-${diff}`)
  }

  async getChannel() {
    const channel = await this._client.channels.cache.get(config.channels.expedition)
    return channel
  }

  start(date) {
    if (!this.running) {
      this._date = startOfHour(date)
      this._job.start()
      if (this._date < startOfDay(this._date)) {
        this._remind1.setTime(new CronTime(startOfDay(this._date)))
        this._remind1.start()
      }
      if (this._date < subHours(this._date, 1)) {
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
      return "AE countdown **stoped**"
    } else {
      return "Error, AE countdown wasn't running"
    }
  }  

  async restart(newdate) {
    await this.stop()
    this.start(newdate)
  }
}