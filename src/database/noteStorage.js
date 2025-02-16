import { getLoggedInUser } from "./userStorage";
import db from "./localStorage";

export async function saveNoteLocally(note) {
  console.log(note);
  await db.notes.put({ ...note, synced: 0 });
}

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
    };

    await db.notes.put(updatedNote);
    if (existingNote.synced === 1) {
      await db.updateNotes.put({
        id: noteId,
        updatedFields,
        updatedAt: updatedNote.updatedAt,
      });
    }
    console.log(`Note with ID ${noteId} updated successfully`);
  } catch (error) {
    console.error("Error updating note:", error);
  }
}

export async function getAllNotes() {
  try {
    const user = await getLoggedInUser();
    const notes = await db.notes
      .filter((note) => note.userId === user.id)
      .reverse()
      .toArray();
    return notes.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

export async function getUnsyncedNotes() {
  const user = await getLoggedInUser();
  return await db.notes.where({ synced: 0, userId: user.id }).toArray();
}

export async function markNoteAsSynced(noteId) {
  await db.notes.update(noteId, { synced: 1 });
}

export async function deleteNote(note) {
  try {
    console.log(note);
    if (note.synced === 1) {
      console.log("here");
      await db.deletedNotes.put(note);
    }
    await db.notes.delete(note.id);
    console.log(`Note with ID ${note.id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}

export async function getUnsyncedDeletedNotes() {
  const user = await getLoggedInUser();
  return await db.deletedNotes.toArray();
}

export async function getUnsyncedUpdatedNotes() {
  const test = db.updateNotes.toArray();
  console.log(test);
  return await db.updateNotes.toArray();
}

export async function deleteNoteFromDeletedNotes(note) {
  try {
    console.log(note);
    await db.deletedNotes.delete(note.id);
    await db.updateNotes.delete(note.id);
    console.log(`Note with ID ${note.id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}
export async function deleteNoteFromUpdatedNotes(noteId) {
  try {
    await db.updateNotes.delete(noteId);
    console.log(`Note with ID ${noteId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting note:", error);
  }
}
