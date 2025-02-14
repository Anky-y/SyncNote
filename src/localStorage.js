// localStorage.js

import Dexie from "dexie";

// Initialize a Dexie database
const db = new Dexie("NotesDB");
db.version(1).stores({
  notes: "id, title, content, updatedAt, synced, bgColor",
});

// Function to save a note locally
export async function saveNoteLocally(note) {
  await db.notes.put({ ...note, synced: 0 });
}

export async function getAllNotes() {
  try {
    const notes = await db.notes.toArray(); // Get all notes as an array
    console.log("Fetched notes:", notes);
    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

// Function to get unsynced notes
export async function getUnsyncedNotes() {
  return await db.notes.where("synced").equals(0).toArray();
}

export async function getSyncedNotes() {
  return await db.notes.where("synced").equals(1).toArray();
}

// Function to mark note as synced
export async function markNoteAsSynced(noteId) {
  await db.notes.update(noteId, { synced: 1 });
}
