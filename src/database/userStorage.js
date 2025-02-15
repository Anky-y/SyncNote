import db from "./localStorage";

// authStorage.js - Handles user authentication storage
export async function saveLoggedInUserLocally(user) {
  await db.loggedInUser.clear();
  await db.loggedInUser.put({
    id: user.id,
    username: user.username,
    sync: user.sync,
  });
}

export async function getLoggedInUser() {
  return await db.loggedInUser.toCollection().first();
}

export async function updateLoggedInUsername(userId, newUsername) {
  await db.loggedInUser.update(userId, {
    username: newUsername,
  });
}

// --- Username Update Sync Handling ---

export async function getUnsyncedUsernameUpdates() {
  const user = await getLoggedInUser();
  return await db.unsyncedUsernameUpdates
    .where("userId")
    .equals(user.id)
    .last();
}

export async function addUnsyncedUsernameUpdate(newUsername) {
  const user = await getLoggedInUser();
  if (!user || !user.id) {
    console.error("User not found or not logged in.");
    return;
  }

  const updatedAt = new Date().toISOString();
  const existingUpdate = await db.unsyncedUsernameUpdates
    .where("userId")
    .equals(user.id)
    .first();
  if (existingUpdate) {
    await db.unsyncedUsernameUpdates.delete(existingUpdate.id);
  }

  const newId = await db.unsyncedUsernameUpdates.put({
    userId: user.id,
    username: newUsername,
    updatedAt,
  });
  console.log(`✅ New unsynced username update stored (ID: ${newId})`);
}

export async function deleteUnsyncedUsernameUpdate(user) {
  await db.unsyncedUsernameUpdates.where("id").equals(user.id).delete();
}

// --- Sync Toggle Update Handling ---

export async function updateUserSyncStatus(userId, syncStatus) {
  await db.loggedInUser.update(userId, {
    sync: syncStatus,
  });
}

export async function getUnsyncedSyncUpdates() {
  const user = await getLoggedInUser();
  return await db.unsyncedSyncUpdates
    .where("userId")
    .equals(user.id)
    .last();
}

export async function addUnsyncedSyncUpdate(syncStatus) {
  const user = await getLoggedInUser();
  if (!user || !user.id) {
    console.error("User not found or not logged in.");
    return;
  }

  const updatedAt = new Date().toISOString();
  const existingUpdate = await db.unsyncedSyncUpdates
    .where("userId")
    .equals(user.id)
    .first();
  if (existingUpdate) {
    await db.unsyncedSyncUpdates.delete(existingUpdate.id);
  }

  const newId = await db.unsyncedSyncUpdates.put({
    userId: user.id,
    sync: syncStatus,
    updatedAt,
  });
  console.log(` New unsynced sync update stored (ID: ${newId})`);
}

export async function deleteUnsyncedSyncUpdate(user) {
  await db.unsyncedSyncUpdates.where("id").equals(user.id).delete();
}
