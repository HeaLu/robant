const {CronJob, CronTime} = require('cron')
const { formatDistance, startOfDay, subHours, startOfHour } = require('date-fns')
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
      .setDescription(`<@&${config.roles.members}> don't forget Alliance Expedition today at ${this._date.getUTCHour()}h UTC`)
      client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, false, 'UTC', this)
    this._remind2 = new CronJob(subHours(this._date, -1), async function () {
      const message = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle("Reminder")
      .setDescription(`<@&${config.roles.members}> Alliance Expedition in 1 hour, prepare yourself for battle !`)
      client.channels.cache.get(config.channels.expedition).send({embeds: [message]})
    }, null, false, 'UTC', this)
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
    if (this.running) {
      this._job.stop()
      this._remind1.stop()
      this._remind2.stop()
      this._client.channels.cache.get(config.channels.expedition).setName("🌴-alliance-expedition")
      return true
    } else {
      return false
    }
  }  

  async restart(newdate) {
    await this.stop()
    this.start(newdate)
  }
}