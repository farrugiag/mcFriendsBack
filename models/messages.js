const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    emetteur: {type: mongoose.Schema.Types.Objectif, ref: 'users'},
    recepteur: {type: mongoose.Schema.Types.Objectif, ref: 'users'},
    message: String,
    date: Date
})

const MessagesModel = mongoose.model('messages', message)

module.exports = MessagesModel