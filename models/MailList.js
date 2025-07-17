const mongoose = require('mongoose')

const mailListSchema = new mongoose.Schema({
  mail: [{ type: String, required: true }],
  idCopy: { type: String, required: true },
  size: { type: String },
  image: { type: String }
});

const MailList = mongoose.model('MailList', mailListSchema);

module.exports =  MailList;