const mongoose = require('mongoose')

const StockListItemSchema = mongoose.Schema({
    code: {
        type: String,
        require: true
    },
    latestUpdate: {
        type: Date,
        require: true
    }
})

module.exports = mongoose.model('stockListItemSchema', StockListItemSchema)