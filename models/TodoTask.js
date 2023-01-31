const mongoose = require("mongoose");
var uuid = require('uuid');

const todoTask = new mongoose.Schema({
    id: {
      type: String,
      default: uuid.v4
    },
    content: {
      type:String,
      required: true
    },
    created_date: {
      type: Date,
      required: true,
      default:Date.now
    },
    updated_at: {
      type: Date,
      required:false,
      default:null
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deleted_at: {
      type: Date,
      required:false,
      default: null
    },
    status: {
      type:  Boolean,
      default: false,
    },
    filter: {
      type: String,
      options: ["all","active","completed"],
      default: "active"
    }
});

module.exports = mongoose.model('todoTask', todoTask);