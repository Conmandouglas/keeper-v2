import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Note from "./Note.jsx";
import CreateArea from "./CreateArea.jsx";

function App() {
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
    try {
      const response = await fetch('http://localhost:5001/notes');
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const jsonData = await response.json();
      setNotes(jsonData);
      console.log("Fetched data:", jsonData);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };
  

  useEffect(() => {
    getNotes();
  }, []);

  //make the route handler from the server for add.
  const addNote = async ({ item_title, description }) => {
    try {
      const newNote = { item_title, description }; // Ensure correct keys
      const response = await fetch("http://localhost:5001/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      });
  
      const savedNote = await response.json();
      setNotes(prevNotes => [...prevNotes, savedNote]);
    } catch (err) {
      console.error(err.message);
    }
  };
  
  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5001/notes/${id}`, { method: "DELETE" })
      getNotes();
    } catch (err) {
      console.error(err.message);
    }

  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem, index) => {
        return (
          <Note
            key={index}
            id={index}
            title={noteItem.item_title}
            content={noteItem.description}
            onDelete={() => deleteNote(noteItem.item_id)}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
