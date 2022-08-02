const express = require("express");
const fs = require("fs");
const app = express();
const noteData = require('./db/db.json');
const path = require("path");
const PORT = process.env.PORT || 3001;
const { v4: uuidv4 } = require('uuid');

//Settibng jsonand public folder 
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

//setting up diff routes
// Get/notes - needs to return notes.html 
app.get("/notes", (request, response) => {
    response.sendFile(path.join(__dirname, "./public/notes.html"));
    console.log("My Notes");

})

// Get - needs to return index.html
app.get("/", (request, response) => {
    // response.sendFile(path.join(__dirname, "..", "..", "index.html"));
    response.sendFile(path.join(__dirname, "./public/index.html"));
    console.log("My index");
})

//Displaay all notes 
app.get("/api/notes", (request, response) => {
   
    // Read in file and loop through it
    fs.readFile("./db/db.json",'utf8', function (err, data) {
        console.log("API Notes", data);
        //return the data to HTML page 
        let convertData = [].concat(JSON.parse(data)); 
       console.log("Converting into JSON object", convertData); 
        response.json(convertData); 


    })
})
; 

//Creating a new note and adding to the exisiting notes list 
app.post('/api/notes',(request, response) => {
    let newNote ={...request.body, id: uuidv4()}; 
    console.log("create new notes: ", newNote); 
    //Read file 
    fs.readFile("./db/db.json",'utf8', function (err, data) {
        console.log("API Notes", data);
        //return the data to HTML page 
        let convertData = [].concat(JSON.parse(data)); 
       console.log("Converting into JSON object", convertData); 
       

       //Combine old and new NOtes together 
       let combinedNotes = [...convertData, newNote]; 
       console.log("Combined Data old and NEw", combinedNotes); 

       //Write file with new data
        fs.writeFile("./db/db.json",JSON.stringify(combinedNotes), (error, data)=>{
            if(error) console.log(error); 
            console.log("edit newNotes successfully" ); 
            //retur the json
             response.json(combinedNotes);
        })

    })
        
})

// Server listening confirmation
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});