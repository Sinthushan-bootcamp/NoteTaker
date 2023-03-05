const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', function read(err, data) {
        if (err) {
            res.err('file missing');
        }
        res.json(JSON.parse(data))
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', function read(err, data) {
        if (err) {
            res.err('file missing');
        } else {
            console.log(data);
            const parsedData = JSON.parse(data);
            if (parsedData.length){
                const lastID = parsedData[parsedData.length-1].id
                note_id = lastID + 1
            }else{
                note_id = 1
            }
            const { title, text }  = req.body
            const content = {
                id: note_id,
                title,
                text
            };
            parsedData.push(content);
            fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) =>
                err ? res.error('Error in adding note') : res.json('Added note')
            );
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('./db/db.json', function read(err, data) {
        if (err) {
            res.err('file missing');
        }
        const notes = JSON.parse(data);
        newNotes = notes.filter(note => note.id != req.params.id)
        fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err) =>
            err ? res.error('Error in removing note') : res.json('Note Removed')
        );
    });
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));