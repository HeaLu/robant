const addHours = require('date-fns/addHours')
const startOfHour = require('date-fns/startOfHour')
const format = require('date-fns/format')
const getTimezoneOffset = require('date-fns-tz/getTimezoneOffset')
const toDate = require('date-fns-tz/toDate')
const { MessageEmbed } = require('discord.js')
const { days, goals, colonyactions } = require('../tools')

module.exports = class Ca {
  constructor(date = new Date(), timezone = 'UTC') {
    this._date = startOfHour(date)
    this._timezone = timezone
  }

  get localHour () { return toDate(format(this._date, 'yyyy-MM-dd HH:mm:ss'+' ')+ this._timezone) }

  getDayComparative () {
    const day = this._date.getUTCDay()
  
    let tab = {}
  
    for (let i = 0; i < 8; i++) {
      const nowCA = colonyactions[day][i]
      const svs = colonyactions[day].svs
      const ok = nowCA.filter(o => svs.indexOf(o) !== -1)
      
      if (ok.length > 0) {
        tab[i] = ok
      }
    }
    
    return tab
  }

  getZonedHours (hours) {
    const offset = getTimezoneOffset(this._timezone) / 60 / 60 / 1000
    const newHours = hours*1+offset
    if (newHours>23) return newHours-24
    if (newHours<0) return newHours+24
    
    return newHours
  }

  getHourComparative () {
    const day = this.localHour.getUTCDay()
    let hour = this.localHour.getUTCHours()
  
    while (hour > 7) {
      hour = hour - 8
    }
    
    const nowCA = colonyactions[day][hour]
    const svs = colonyactions[day].svs
    
    const ok = nowCA.filter(o => svs.indexOf(o) !== -1)
    const pasok = nowCA.filter(o => svs.indexOf(o) === -1)
  
    return {svs: ok, others: pasok}
  }

  arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
  }

  getSortedDayComparative = () => {
    const daygoals = this.getDayComparative(this._date)
    let newtab = []
  
    for (const [key, value] of Object.entries(daygoals)) {
      let match = newtab.findIndex(el => this.arraysEqual(el.goals, value))
      if (match === -1) {
        newtab.push({hours: [parseInt(key)], goals: value})
      } else {
        newtab[match].hours.push(parseInt(key))
      }
    }
  
    newtab.sort((a, b) => b.goals.length - a.goals.length)
  
    return newtab
  }
  
  getHourColonyActions() {
    const comp = this.getHourComparative(this._date)
    const day = days[this.localHour.getUTCDay()]
    let dispOk = ""
    let dispPasok = ""
  
    for (const i of comp.svs) {
      dispOk = dispOk + goals[i].pic + " - " + goals[i].label+"\n"
    }
  
    for (const i of comp.others) {
      dispPasok = dispPasok + goals[i].pic + " - " + goals[i].label+"\n"
    }
  
    const message = new MessageEmbed()
    .setColor(comp.svs.length > 0 ? 'GREEN' : 'RED')
    .setTitle(day+" colony actions - "+this._date.getHours()+"h"+ " to "+addHours(this._date, 1).getHours()+"h")
    .setDescription(comp.svs.length > 0 ? `🟢 ${comp.svs.length} shared goal${comp.svs.length > 1 ? "s" : ""} with SvS` : "🔴 no shared goal with SvS")
    .setThumbnail(comp.svs.length > 0 ? 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Raspberry_Pi_logo.svg/langfr-130px-Raspberry_Pi_logo.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Forbidden_Symbol_Transparent.svg/400px-Forbidden_Symbol_Transparent.svg.png')
    if (comp.svs.length > 0 && comp.others.length > 0) {
      message.addFields(
        {name: `Matching SvS goals`, value: dispOk},
        {name: `Other${comp.others.length > 1 ? "s" : ""}`, value: dispPasok}
      )
    } else if (comp.svs.length > 0) {
      message.addField(`Matching SvS goals`, dispOk)
    } else if (comp.others.length > 0) {
      message.addField(`Goal${comp.others.length > 1 ? "s" : ""}`, dispPasok)
    }
    message.setFooter({text: `Timezone set to ${this._timezone}`})
    
    return message
  }

  getAlldayColonyAction () {
    const daygoals = colonyactions[this._date.getUTCDay()]
    const day = days[this._date.getUTCDay()]
    const message = new MessageEmbed()  
    .setColor("BLUE")  
    .setTitle(`${day} colony actions`)
    .setThumbnail('https://students.wustl.edu/wp-content/uploads/2018/08/Schedule.png')
    for (let i = 0; i < 8; i++) {
      let content = ""
      for (const j in daygoals[i]) {
        content += goals[daygoals[i][j]].pic+" - "+goals[daygoals[i][j]].label
        if (j*1+1 < daygoals[i].length) content += '\n'
      }
      const name = `${this.getZonedHours(i)}h, ${this.getZonedHours(i*1+8)}h and ${this.getZonedHours(i*1+16)}h`
      message.addField(name, content)
    }
    message.setFooter({text: `Timezone set to ${this._timezone}`})
  
    return message
  }
  
  searchCa(goal) {
    const daygoals = colonyactions[this._date.getUTCDay()]
    goal = parseInt(goal)
    let matching = []
    for (let i = 1; i < 8; i++) {
      if (daygoals[i].indexOf(goal) !== -1) matching.push(i, i+8, i+16)
    }
  
    let content = ""
  
    if (matching.length > 0) {
      matching = matching.sort((a,b)=>a-b)
      for (const i in matching) {
        content += this.getZonedHours(matching[i])+"h"
        if (i*1+2 < matching.length) {
          content += ", "
        }
        if (i*1+2 === matching.length) {
          content += " and "
        }
      }
    } else {
      content = "No result for that..."
    }
  
    const message = new MessageEmbed()
  
    .setColor("BLUE")
    .setTitle(goals[goal].pic+" - "+goals[goal].label)
    .setDescription(content)
    .setThumbnail("https://www.pinclipart.com/picdir/big/142-1425732_marine-clipart.png")
    message.setFooter({text: `Timezone set to ${this._timezone}`})
  
    return message
  }
  
  getDayColonyActions () {
    const tab = this.getSortedDayComparative(this._date)
    const day = days[this._date.getUTCDay()]
    const message = new MessageEmbed()
    .setColor("BLUE")
    .setTitle(`${day} raspberry times`)
    .setDescription("Here are colony actions sharing goals with SvS ")
    .setThumbnail('https://students.wustl.edu/wp-content/uploads/2018/08/Schedule.png')
  
    for (const item of tab) {
      let dispObj = ""
      let dispHours = ""
  
      for (let i = 0; i < 3; i++) {
        for (const j in item.hours) {
          dispHours = dispHours+this.getZonedHours(item.hours[j]*1+i*8)+"h"
          dispHours += (i === 2 && parseInt(j) === item.hours.length-2) ? " and " : ", "
        }
      }
      dispHours = dispHours.substring(0, dispHours.length - 2)
  
      for (const obj of item.goals) {
        dispObj=dispObj+goals[obj].pic+" - "+goals[obj].label+"\n"
      }
      message.addField(dispHours,dispObj)
    }
    message.setFooter({text: `Timezone set to ${this._timezone}`})
  
    return message
  }
}