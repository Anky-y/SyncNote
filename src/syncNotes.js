// syncNotes.js

import { getUnsyncedNotes, markNoteAsSynced } from "./localStorage";

export async function syncNotes() {
  // Check if the user is online
  if (!navigator.onLine) {
    console.log("You are offline. Syncing is postponed.");
    return;
  }

  console.log("Syncing notes to MongoDB...");

  // Get all unsynced notes from Dexie.js
  const unsyncedNotes = await getUnsyncedNotes();

  // Send unsynced notes to MongoDB
  for (const note of unsyncedNotes) {
    const res = await fetch("http://localhost:5000/notes/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });

    if (res.ok) {
      console.log(`Note with id ${note.id} synced successfully!`);
      await markNoteAsSynced(note.id); // Mark as synced in Dexie
    } else {
      console.log(`Failed to sync note with id ${note.id}`);
    }
  }
}
