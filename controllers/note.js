import Note from '../models/note.js';
import User from '../models/user.js';
import Fuse from 'fuse.js';
import { checkNotesDetails } from '../utils/note.js';

// function to add a note to the database
const addNote = async (title, content, ownerId) => {
    try{
        const noteDetails = await checkNotesDetails(title, content, ownerId);
        if(noteDetails.status!==200) return noteDetails;

        const note = new Note({
            title,
            content,
            owner: ownerId
        });

        await note.save();

        return { status: 200, message: 'Note added successfully' }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

// function to get all Notes from the database
const getAllNotes = async (ownerId) => {
    try {
        const notes = await Note.find({ owner: ownerId });
        return { status: 200, message: notes }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

// function to update a note by id
const updateNote = async (noteId, ownerId, title, content) => {
    try {
        const noteDetails = await checkNotesDetails(title, content, ownerId);
        if(noteDetails.status!==200) return noteDetails;

        const updatedNote = await Note.findOneAndUpdate({ _id: noteId, owner: ownerId }, { title, content }, { new: true });

        if (!updatedNote) {
            return { status: 404, message: 'Note not found or you do not have permission to update it'}
        }

        return { status: 200, message: 'Note updated successfully' }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

// function to delete a note by id and owner id
const deleteNote = async (ownerId, propertyId) => {
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: propertyId, owner: ownerId });

        if (!deletedNote) {
            return { status: 404, message: 'Note not found or you do not have permission to delete it'}
        }

        return { status: 200, message: 'Note deleted successfully' }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

// function to get a properties by owner id
const getNote = async (ownerId, noteId) => {
    try {
        const note = await Note.findOne({ _id: noteId, owner: ownerId });

        if (!note) {
            return { status: 404, message: 'Note not found or you do not have permission to view it'}
        }

        return { status: 200, message: note }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

const shareNote = async (ownerId, noteId, userId) => {
    const checkUser = await User.findOne({ _id: userId });
    if (!checkUser) {
        return { status: 404, message: 'User not found' }
    }

    const checkNote = await Note.findOne({ _id: noteId, owner: ownerId });
    if (!checkNote) {
        return { status: 404, message: 'Note not found or you do not have permission to share it'}
    }

    const sharedWith = checkNote.sharedWith;
    if (sharedWith.includes(userId)) {
        return { status: 400, message: 'Note already shared with this user' }
    }

    sharedWith.push(userId);

    const updatedNote = await Note.findOneAndUpdate({ _id: noteId, owner: ownerId }, { sharedWith }, { new: true });

    if (!updatedNote) {
        return { status: 404, message: 'Note not found or you do not have permission to share it'}
    }

    return { status: 200, message: 'Note shared successfully' }
}

// search for notes in the database
const searchNotes = async (ownerId, query) => {
    try{
        const notes = await Note.find({ owner: ownerId });
        const options = {
            includeScore: true,
            keys: ['title', 'content']
        }
        const fuseNotes = new Fuse(notes, options);
        const result = fuseNotes.search(query);
        return { status: 200, message: result }
    } catch (error) {
        console.error(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

export {
    addNote,
    getAllNotes,
    updateNote,
    deleteNote,
    getNote,
    shareNote,
    searchNotes
}