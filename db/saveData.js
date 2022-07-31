// Dependecncies
const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // Newest update


const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);

class Save {
    write(note) {
        return writeNote('db/db.json', JSON.stringify(note));
    }

    read() {
        return readNote('db/db.json', 'utf8');
    }

    async retrieveNotes() {
        const notes = await this.read();
        let parsedNotes;
        try {
            parsedNotes = [].concat(JSON.parse(notes));
        } catch (err) {
            parsedNotes = [];
        }
        return parsedNotes;
    }

    async addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error('Both title and text can not be blank');
        }
        // Use UUID package to add unique IDs
        const newNote = { title, text, id: uuidv4() };

        // Retrieve Notes, add the new note, update notes
        const notes = await this.retrieveNotes();
        const updatedNotes = [...notes, newNote];
        await this.write(updatedNotes);
        return newNote;
    }

    // Delete Note function - BONUS
    async deleteNote(id) {
        const notes = await this.retrieveNotes();
        const filteredNotes = notes.filter(note => note.id !== id);
        return await this.write(filteredNotes);
    }
}

module.exports = new Save();