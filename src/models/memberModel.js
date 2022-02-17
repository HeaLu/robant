const mongoose = require("mongoose")

const memberSchema = new mongoose.Schema(
  {
    discordId: {
      type: String,
      required: true,
      unique: true
    },
    timezone: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
)

const Member = mongoose.model("Member", memberSchema)
module.exports = Member