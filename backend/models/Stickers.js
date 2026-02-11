const mongoose = require('mongoose');

const stickerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    note_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: String,
    is_public: { type: Boolean, default: false },
});

const Sticker = mongoose.model('Sticker', stickerSchema);
module.exports = Sticker;