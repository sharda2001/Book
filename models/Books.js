const mongoose = require('mongoose');
const db = require('../config/db');

const bookSchema = new mongoose.Schema({
    Bookname:{
        type:String,
        default:"----"
    },
    BookId:{
      type:String,
    },
    BookPrice:{
        type:Number,
      },
    Authorname:{
        type:String,
        default:"----"
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
    CreatedBy: {
        type: String,
        default: "-"
    }
});

module.exports = mongoose.model('books',bookSchema);