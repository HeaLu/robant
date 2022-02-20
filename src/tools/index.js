const addDays = require('date-fns/addDays')
const nextMonday = require('date-fns/nextMonday')
const nextTuesday = require('date-fns/nextTuesday')
const nextWednesday = require('date-fns/nextWednesday')
const nextThursday = require('date-fns/nextThursday')
const nextFriday = require('date-fns/nextFriday')
const nextSaturday = require('date-fns/nextSaturday')
const nextSunday = require('date-fns/nextSunday')

const next = {
  get today() { return new Date()},
  get tomorrow() { return addDays(new Date(), 1)},
  get monday() { return nextMonday(new Date())},
  get tuesday() { return nextTuesday(new Date())},
  get wednesday() { return nextWednesday(new Date())},
  get thursday() { return nextThursday(new Date())},
  get friday() { return nextFriday(new Date())},
  get saturday() { return nextSaturday(new Date())},
  get sunday() { return nextSunday(new Date())}
}
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

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
    pic: "🥚"
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
    svs: [1],
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
    6: [1, 3, 5],
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

exports.colonyactions = colonyactions
exports.days = days
exports.goals = goals
exports.next = next