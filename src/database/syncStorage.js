// syncNotes.js

import {
  deleteNoteFromDeletedNotes,
  getUnsyncedNotes,
  markNoteAsSynced,
  getUnsyncedUpdatedNotes,
  deleteNoteFromUpdatedNotes,
  getUnsyncedDeletedNotes,
} from "./noteStorage";
import {
  getUnsyncedUsernameUpdates,
  deleteUnsyncedUsernameUpdate,
  getUnsyncedSyncUpdates,
  deleteUnsyncedSyncUpdate,
} from "./userStorage";


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

export async function syncUpdatedNotes() {
  if (!navigator.onLine) {
    console.log("You are offline. Syncing updated notes is postponed.");
    return;
  }

  console.log("Syncing updated notes to MongoDB...");

  // Get all unsynced notes (which includes updates)
  const unsyncedUpdates = await getUnsyncedUpdatedNotes();
  console.log(unsyncedUpdates);

  const latestUpdates = {};

  unsyncedUpdates.forEach(({ id, updatedFields, updatedAt }) => {
    if (!latestUpdates[id] || updatedAt > latestUpdates[id].updatedAt) {
      latestUpdates[id] = { updatedFields, updatedAt };
    }
  });

  // Send updated notes to MongoDB
  for (const [id, { updatedFields }] of Object.entries(latestUpdates)) {
    console.log(`Attempting to sync note ${id} with updates:`, updatedFields);
    if (!Object.keys(updatedFields).length) {
      console.log(`Skipping note ${id} because there are no changes.`);
      continue; // Skip empty updates
    }
    console.log("updatedFields:", JSON.stringify(updatedFields, null, 2));
    const res = await fetch(`http://localhost:5000/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });

    if (res.ok) {
      console.log(`Updated note with id ${id} synced successfully!`);
      await deleteNoteFromUpdatedNotes(id);
      await markNoteAsSynced(id); // Mark note as synced
    } else {
      console.log(`Failed to sync updated note with id ${id}`);
    }
  }
}

export async function syncDeletedNotes() {
  const unsyncedDeletions = await getUnsyncedDeletedNotes();

  for (let note of unsyncedDeletions) {
    const res = await fetch(`http://localhost:5000/notes/${note.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      deleteNoteFromDeletedNotes(note);
      console.log(`Note ${note.id} deleted from server.`);
    }
  }
}

export async function syncUsernameUpdate() {
  // Check if the user is online
  if (!navigator.onLine) {
    console.log("You are offline. Syncing username update is postponed.");
    return;
  }

  console.log("Syncing username update to MongoDB...");

  // Get the latest unsynced username update for the logged-in user
  const unsyncedUsername = await getUnsyncedUsernameUpdates();

  console.log(unsyncedUsername);

  if (!unsyncedUsername) {
    console.log("No unsynced username update found.");
    return;
  }

  const { username } = unsyncedUsername;

  // Send the username update to MongoDB
  const res = await fetch("http://localhost:5000/user/update", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newUsername: username,
      userId: unsyncedUsername.userId,
    }),
  });

  if (res.ok) {
    console.log(`Username update "${username}" synced successfully!`);
    await deleteUnsyncedUsernameUpdate(unsyncedUsername);
  } else {
    console.log(`Failed to sync username update "${username}"`);
  }
}

export async function syncSyncStatus() {
  if (!navigator.onLine) {
    console.log("You are offline. Syncing sync status is postponed.");
    return;
  }

  console.log("Syncing sync status to MongoDB...");

  const unsyncedSync = await getUnsyncedSyncUpdates();

  if (!unsyncedSync) {
    console.log("No unsynced sync status update found.");
    return;
  }

  const { sync, userId } = unsyncedSync;

  const res = await fetch("http://localhost:5000/user/sync-status", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sync, userId }),
  });

  if (res.ok) {
    console.log(`Sync status "${sync}" synced successfully!`);
    await deleteUnsyncedSyncUpdate(unsyncedSync);
  } else {
    console.log(`Failed to sync sync status "${sync}"`);
  }
}
