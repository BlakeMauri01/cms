const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schema = mongoose.Schema({
    sequenceId: { type: String, required: true},
    maxMessageId: { type: String, required: true},
    maxContactId: { type: String, required: true},
    maxDocumentId: { type: Schema.Types.ObjectId, ref: 'Contact'}
});

module.exports = mongoose.model('Sequence', schema);