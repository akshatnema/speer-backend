import { expect as _expect } from 'chai';
const expect = _expect;
import { stub } from 'sinon';
import {prototype} from '../models/note.js';
import { checkNotesDetails } from '../utils/note.js';
import { addNote } from '../controllers/note.js';

describe('addNote function', () => {
    let saveStub;

    it('should add a note to the database', async () => {
        const note = {
            title: 'Test Title',
            content: 'Test Content',
            owner: 'Test Owner'
        };

        // checkNotesDetailsStub.resolves({ status: 200 });
        saveStub = stub(prototype, 'save');
        saveStub.resolves(note);

        const result = await addNote(note.title, note.content, note.owner);

        expect(result.status).to.equal(200);
        expect(result.message).to.equal('Note added successfully');
        saveStub.restore();
    });

    it('should return an error if note details are not valid', async () => {
        const note = {
            title: 'Test Title',
            content: 'Test Content',
            owner: 'Test Owner'
        };

        // checkNotesDetailsStub.resolves({ status: 400 });
        saveStub = stub(prototype, 'save');
        
        const result = await addNote(note.title, note.content, note.owner);

        expect(result.status).to.equal(400);
        saveStub.restore();
    });

    it('should return an error if there is a problem saving the note', async () => {
        const note = {
            title: 'Test',
            content: 'Test Content',
            owner: 'Test Owner'
        };

        saveStub.rejects(new Error('Internal Server Error'));

        const result = await addNote(note.title, note.content, note.owner);

        expect(result.status).to.equal(500);
        expect(result.message).to.equal('Internal Server Error');
    });
});