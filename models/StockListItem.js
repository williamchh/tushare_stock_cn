const mongoose = require('mongoose')

const StockListItemSchema = mongoose.Schema({
    code: {
        type: String,
        require: true
    },
    latestUpdate: {
        type: Date,
        require: true
    },
    week: [{
        date: {
            type: String,
            require: true
        },
        value: {
            type: Number,
            require: true
        }
    }],
    month: [{
        date: {
            type: String,
            require: true
        },
        value: {
            type: Number,
            require: true
        }
    }]
})

module.exports = mongoose.model('stockListItem', StockListItemSchema)