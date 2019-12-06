const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  likes: { type: Number } //============ADDED
})

const spotSchema = new mongoose.Schema({
  spotName: { type: String, required: true, unique: true },
  lat: { type: String },
  long: { type: String },
  country: { type: String, required: true },
  region: { type: String },
  image: { type: String },
  description: { type: String },
  level: { type: String, required: true },
  typeOfWave: { type: String, required: true },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema]
}, {
  timestamps: true
})

// const animalSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true },
//   species: { type: String, required: true },
//   isCarnivore: { type: Boolean, required: true },
//   image: { type: String, required: true },
//   dangerRating: { type: Number, required: true, min: 1, max: 5 },
//   habitats: { type: [String] },
//   user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
//   comments: [ commentSchema ]
// }, {
//   timestamps: true
// })

spotSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Spot', spotSchema)
// module.exports = mongoose.model('Animal', animalSchema)  // OLD
