// Requirements
const express = require('express');
const path = require('path');
const fs = require('fs');
//use unique port if provided otherwise use test port of 3001
const PORT = process.env.PORT || 3001;
// initiate express app
const app = express();
// middleware
app.use(express.json()); //put parsed json request in body
app.use(express.static('public')); // make assets available when hosting html files

// GET Route for landing page
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html')) // return index.html
);
// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html')) // return notes.html
);
// API GET Request to pull all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', function read(err, data) {
        if (err) {
            res.err('file missing');
        }
        res.json(JSON.parse(data)) //send json response with json data from db.json
    });
});
// API POST Request to add a new note
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', function read(err, data) { // get json data from db.json file
        if (err) {
            res.err('file missing'); // throw error if file is missing or corrupted 
        } else {
            console.log(data);
            const parsedData = JSON.parse(data); // parse existing notes
            // conditional to check if there is existing note data
            if (parsedData.length){
                // if note data exist, get the last note made and increment it's id by one
                // this incremented id will be used for the new note
                const lastID = parsedData[parsedData.length-1].id
                note_id = lastID + 1
            }else{
                // if no notes exist assign the new note ID as 1
                note_id = 1
            }
            // deconstruct the request body object and then construct a content object with the req data and add ID
            const { title, text }  = req.body
            const content = {
                id: note_id,
                title,
                text
            };
            parsedData.push(content);// push new note to existing notes parsed from file
            fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) => // write the json file with the updated notes array
                err ? res.error('Error in adding note') : res.json('Added note') // send response to complete promise and trigger callback functions
            );
        }
    });
});
// API DELETE Request to remove a note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', function read(err, data) { // get json data from db.json file
        if (err) {
            res.err('file missing'); // throw error if file is missing or corrupted 
        }
        const notes = JSON.parse(data); // parse json data
        newNotes = notes.filter(note => note.id != req.params.id) // use array filter method to remove the ID of the note to be removed
        fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err) => // write the json file with filtered notes array
            err ? res.error('Error in removing note') : res.json('Note Removed') // send response to complete promise and trigger callback functions
        );
    });
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));