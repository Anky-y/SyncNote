// localStorage.js

import Dexie from "dexie";

// Initialize a Dexie database
const db = new Dexie("NotesDB");
db.version(1).stores({
  notes: "id, title, content, updatedAt, synced, bgColor",
  deletedNotes: "id, title, content, updatedAt, synced, bgColor",
  updateNotes: "id, updatedFields, updatedAt",
});

// Function to save a note locally
export async function saveNoteLocally(note) {
  await db.notes.put({ ...note, synced: 0 });
}

// Function to update a note locally
export async function updateNoteLocally(noteId, updatedFields) {
  try {
    const existingNote = await db.notes.get(noteId);
    if (!existingNote) {
      throw new Error(`Note with ID ${noteId} not found`);
    }

    const updatedNote = {
      ...existingNote,
      ...updatedFields,
      updatedAt: Date.now(),
      synced: 3, // Mark as not synced
    };

    await db.notes.put(updatedNote);
    // Store only the changed fields in `updateNotes`
    await db.updateNotes.put({
      id: noteId,
      updatedFields,
      updatedAt: updatedNote.updatedAt,
    });
    console.log(`Note with ID ${noteId} updated successfully`);
  } catch (error) {
    console.error("Error updating note:", error);
  }
}

export async function getAllNotes() {
  try {
    const notes = await db.notes.orderBy("updatedAt").reverse().toArray(); // Get all notes as an array
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
export async function getUnsyncedUpdatedNotes() {
  const test = db.updateNotes.toArray();
  console.log(test);
  return await db.updateNotes.toArray();
}
export async function getUnsyncedDeletedNotes() {
  return await db.deletedNotes.where("synced").equals(0).toArray();
}

export async function getSyncedNotes() {
  return await db.notes.where("synced").equals(1).toArray();
}

// Function to mark note as synced
export async function markNoteAsSynced(noteId) {
  await db.notes.update(noteId, { synced: 1 });
}

// Function to delete a note
export async function deleteNote(note) {
  try {
    console.log(note);
    await db.deletedNotes.put({ ...note, synced: 0 });
    await db.notes.delete(note.id);
    console.log(`Note with ID ${note.id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

export async function deleteNoteFromDeletedNotes(note) {
  try {
    console.log(note);
    await db.deletedNotes.delete(note.id);
    console.log(`Note with ID ${note.id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}
export async function deleteNoteFromUpdatedNotes(noteId) {
  try {
    console.log(noteId);
    await db.updateNotes.delete(noteId);
    console.log(`Note with ID ${noteId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}
