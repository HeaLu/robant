const { MessageEmbed } = require('discord.js')

const goals = {
  0: {
    label: "Use any speedup",
    pic: "🕖"
  },
  1: {
    label: "Get building power",
    pic: "🏗️"
  },
  2: {
    label: "Use building speedup",
    pic: "🕖🏗️"
  },
  3: {
    label: "Get evolution power",
    pic: "🔬"
  },
  4: {
    label: "Use evolution speedup",
    pic: "🕖🔬"
  },
  5: {
    label: "Soldier hatching",
    pic: "🪖"
  },
  6: {
    label: "Use hatching speedup",
    pic: "🕖🪖"
  },
  7: {
    label: "Hatch, feed or star up insects",
    pic: "🦗"
  },
  8: {
    label: "Special ants",
    pic: "🐜"
  },
  9: {
    label: "Cells",
    pic: "🧬"
  },
  10: {
    label: "Genes",
    pic: "🧬"
  },
  11: {
    label: "Germs",
    pic: "🧬"
  },
  12: {
    label: "Fungus",
    pic: "🧬"
  }  ,
  13: {
    label: "Creature remain",
    pic: "🦴"
  }
}

const colonyactions = {
  0: {
    svs: [7],
    0: [1, 2],
    1: [0, 7],
    2: [2, 4, 6],
    3: [3, 4, 7],
    4: [0],
    5: [6, 7],
    6: [1, 3, 6],
    7: [0, 7]
  },
  1: {
    svs: [0, 1, 2],
    0: [1],
    1: [3, 4],
    2: [1],
    3: [0],
    4: [1, 3],
    5: [1, 2],
    6: [1, 3, 5],
    7: [1, 3, 5]
  },
  2: {
    svs: [9],
    0: [1, 2],
    1: [1, 9],
    2: [6],
    3: [1, 9],
    4: [2, 4, 6],
    5: [1, 3, 6, 9],
    6: [2, 3, 5],
    7: [1, 9]
  },
  3: {
    svs: [0, 3, 4, 13],
    0: [1, 2],
    1: [3, 4, 13],
    2: [6],
    3: [1, 3, 13],
    4: [1, 5],
    5: [2, 4, 6, 13],
    6: [1, 3, 6],
    7: [2, 4, 6, 13]
  },
  4: {
    svs: [8],
    0: [1, 2],
    1: [8],
    2: [2, 4, 6],
    3: [8],
    4: [0],
    5: [8],
    6: [1, 3, 5],
    7: [8]
  },
  5: {
    svs: [0, 5, 6, 10],
    0: [0],
    1: [2, 4, 6, 10],
    2: [1, 3, 6],
    3: [6, 10],
    4: [1, 3, 6],
    5: [1, 5, 10],
    6: [3, 5],
    7: [0, 10]
  },
  6: {
    svs: [11],
    0: [0],
    1: [3, 4, 11],
    2: [1, 2],
    3: [6, 11],
    4: [1, 3, 6],
    5: [1, 3, 6, 11],
    6: [1, 5],
    7: [3, 5, 11]
  }
}

const getHourComparative = (d = new Date()) => {
  const day = d.getUTCDay()
  let hour = d.getUTCHours()

  while (hour > 7) {
    hour = hour - 8
  }
  
  const nowCA = colonyactions[day][hour]
  const svs = colonyactions[day].svs
  
  const ok = nowCA.filter(o => svs.indexOf(o) !== -1)
  const pasok = nowCA.filter(o => svs.indexOf(o) === -1)

  return {svs: ok, others: pasok}
}

const getDayComparative = (d = new Date()) => {
  const day = d.getUTCDay()

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

function arraysEqual(a1,a2) {
  return JSON.stringify(a1)==JSON.stringify(a2);
}

const getSortedDayComparative = (d = new Date()) => {
  const daygoals = getDayComparative(d)
  let newtab = []

  for (const [key, value] of Object.entries(daygoals)) {
    let match = newtab.findIndex(el => arraysEqual(el.goals, value))
    if (match === -1) {
      newtab.push({hours: [parseInt(key)], goals: value})
    } else {
      newtab[match].hours.push(parseInt(key))
    }
  }

  newtab.sort((a, b) => b.goals.length - a.goals.length)

  return newtab
}

const getHourColonyActions = (d = new Date()) => {

  const comp = getHourComparative(d)
  let dispOk = ""
  let dispPasok = ""

  for (const i of comp.svs) {
    dispOk = dispOk + goals[i].pic + " - " + goals[i].label+"\n"
  }

  for (const i of comp.others) {
    dispPasok = dispPasok + goals[i].pic + " - " + goals[i].label+"\n"
  }

  const message = new MessageEmbed()
  .setColor(comp.svs.length > 0 ? '#00ff00' : '#ff0000')
  .setTitle("Colony actions - "+(d.getUTCHours() === 0 && comp.svs.length > 0 ? "0h30" : d.getUTCHours()+"h")+ " to "+(d.getUTCHours()+1 === 24 ? 0 : d.getUTCHours()+1)+"h UTC")
  .setDescription(comp.svs.length > 0 ? `🟢 ${comp.svs.length} shared goal${comp.svs.length > 1 ? "s" : ""} with SvS 🟢\nDon't forget raspberry 👍🏼` : "🔴 no shared goal with SvS 🔴")
	.setThumbnail(comp.svs.length > 0 ? 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3b/Raspberry_Pi_logo.svg/langfr-130px-Raspberry_Pi_logo.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/France_road_sign_AB4.svg/220px-France_road_sign_AB4.svg.png')
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

  return message
}

const getDayColonyActions = (d = new Date()) => {
  const tab = getSortedDayComparative(d)
  const message = new MessageEmbed()
  .setColor("BLUE")
  .setTitle("Today raspberry times")
  .setDescription("Here are colony actions sharing goals with SvS ")

  for (const item of tab) {
    let dispObj = ""
    let dispHours = ""

    for (let i = 0; i < 3; i++) {
      for (const j in item.hours) {
        dispHours = dispHours+(item.hours[j]*1+i*8 === 0 ? "0h30, " : item.hours[j]*1+i*8+"h, ")
      }
    }
    dispHours = dispHours.substring(0, dispHours.length - 2) + " UTC"

    for (const obj of item.goals) {
      dispObj=dispObj+goals[obj].pic+" - "+goals[obj].label+"\n"
    }
    message.addField(dispHours,dispObj)
  }

  return message
}

const getGoals = (obj) => {
  return goals[obj]
}

const getSvs = (d = new Date()) => {
  const day = d.getUTCDay()
  return colonyactions[day].svs
}

exports.getSortedDayComparative = getSortedDayComparative
exports.getHourComparative = getHourComparative
exports.getDayColonyActions = getDayColonyActions
exports.getGoals = getGoals
exports.getSvs = getSvs
exports.getHourColonyActions = getHourColonyActions