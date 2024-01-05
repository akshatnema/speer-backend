import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }]
}, {
    timestamps: true
});

const Note = model('Note', NoteSchema);

export const prototype = Note.prototype;

export default Note;