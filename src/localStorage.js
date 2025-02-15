// localStorage.js

import Dexie from "dexie";

// Initialize a Dexie database
const db = new Dexie("NotesDB");
db.version(1).stores({
  notes: "id,userId, title, content, updatedAt, synced, bgColor",
  deletedNotes: "id, title, content, updatedAt, synced, bgColor",
  updateNotes: "id, updatedFields, updatedAt",
  loggedInUser: "id, username",
  unsyncedUsernameUpdates: "++id, userId, username, updatedAt",
});

export async function saveLoggedInUserLocally(user) {
  await db.loggedInUser.clear();
  await db.loggedInUser.put({ id: user.id, username: user.username });
}

export async function getLoggedInUser() {
  return await db.loggedInUser.toCollection().first();
}

export async function updateLoggedInUsername(userId, newUsername) {
  await db.loggedInUser.update(userId, { username: newUsername });
}

// Function to get unsynced username updates for the logged-in user
export async function getUnsyncedUsernameUpdates() {
  const user = await getLoggedInUser();
  return await db.unsyncedUsernameUpdates
    .where("userId")
    .equals(user.id) // Only fetch updates for the logged-in user
    .last();
}

// Function to add a username update to unsynced collection
export async function addUnsyncedUsernameUpdate(newUsername) {
  const user = await getLoggedInUser();
  if (!user || !user.id) {
    console.error("User not found or not logged in.");
    return;
  }

  const updatedAt = new Date().toISOString();

  // Get the latest unsynced update for this user
  const existingUpdate = await db.unsyncedUsernameUpdates
    .where("userId")
    .equals(user.id)
    .first();

  if (existingUpdate) {
    await db.unsyncedUsernameUpdates.delete(existingUpdate.id);
  }

  // Insert the new username update
  const newId = await db.unsyncedUsernameUpdates.put({
    userId: user.id,
    username: newUsername,
    updatedAt,
  });

  console.log(`✅ New unsynced username update stored (ID: ${newId})`);
}

// Function to delete a synced username update
export async function deleteUnsyncedUsernameUpdate(user) {
  await db.unsyncedUsernameUpdates.where("userId").equals(user.id).delete();
}

// Function to mark the username update as synced
export async function markUsernameAsSynced(username) {
  await deleteUnsyncedUsernameUpdate(username);
}

// Function to save a note locally
export async function saveNoteLocally(note) {
  console.log(note);
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
    const user = await getLoggedInUser();
    const notes = await db.notes
      .filter((note) => note.userId === user.id) // Filter by userId
      .reverse()
      .toArray(); // Get all notes as an array
    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

// Function to get unsynced notes
export async function getUnsyncedNotes() {
  const user = await getLoggedInUser();
  return await db.notes.where({ synced: 0, userId: user.id }).toArray();
}
export async function getUnsyncedUpdatedNotes() {
  const test = db.updateNotes.toArray();
  console.log(test);
  return await db.updateNotes.toArray();
}
export async function getUnsyncedDeletedNotes() {
  return await db.deletedNotes.where({ synced: 0, userId: user.id }).toArray();
}

export async function getSyncedNotes() {
  return await db.notes.where({ synced: 1, userId: user.id }).toArray();
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
