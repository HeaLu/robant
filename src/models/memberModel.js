const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true
    },
    discordName: {
      type: String
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    usage: [
      {
        command: String,
        qty: {
          type: Number,
          default: 0
        },
        last: Date
      }
    ],
    dailyMail: {
      type: Boolean,
      default: false
    },
    birthdate: {
      year: Number,
      month: Number,
      day: Number
    }
  },
  { timestamps: { createdAt: "created_at" } }
)

const Member = mongoose.model("Member", memberSchema)
module.exports = Member