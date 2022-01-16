const { getDay } = require('date-fns')
const { MessageEmbed } = require('discord.js')

const objectives = {
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

const getHourColonyActions = (d = new Date()) => {
  const day = getDay(d)
  let hour = d.getUTCHours()

  while (hour > 7) {
    hour = hour - 8
  }
  
  const nowCA = colonyactions[day][hour]
  const svs = colonyactions[day].svs

  const ok = nowCA.filter(o => svs.indexOf(o) !== -1)
  const pasok = nowCA.filter(o => svs.indexOf(o) === -1)
  let dispOk = ""
  let dispPasok = ""
  for (const i of ok) {
    dispOk = dispOk + objectives[i].pic + " - " + objectives[i].label+"\n"
  }

  for (const i of pasok) {
    dispPasok = dispPasok + objectives[i].pic + " - " + objectives[i].label+"\n"
  }

  const message = new MessageEmbed()
  .setColor(ok.length > 0 ? '#00FF00' : '#ff0000')
  .setTitle("Colony actions - "+d.getUTCHours()+ "h to "+(d.getUTCHours()+1)+"h UTC")
  .setDescription(ok.length > 0 ? `👍 ${ok.length} shared objective${ok.length > 1 ? "s" : ""} with SvS\rDon't forget raspberry !` : "❌ no shared objective with SvS")
  .addField('\u200b', '\u200b')
  if (ok.length > 0 && pasok.length > 0) {
    message.addFields(
      {name: `Matching SvS objective${ok.length > 1 ? "s" : ""}`, value: dispOk},
      {name: '\n\u200b', value: '\n\u200b'},
      {name: `Other${pasok.length > 1 ? "s" : "colo"}`, value: dispPasok}
    )
  } else if (ok.length > 0) {
    message.addField(`Matching SvS objective${ok.length > 1 ? "s" : ""}`, dispOk)
  } else if (pasok.length > 0) {
    message.addField(`Objective${pasok.length > 1 ? "s" : ""}`, dispPasok)
  }

  return message
}

exports.getHourColonyActions = getHourColonyActions