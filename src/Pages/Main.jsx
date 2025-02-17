import styles from ".././App.module.css";
import Navbar from "../Components/Navbar";
import Notecard from "../Components/Notecard";
import { getAllNotes, deleteNote } from "../database/noteStorage";
import { createSignal, onMount, onCleanup } from "solid-js";
import {
  syncDeletedNotes,
  syncSyncStatus,
  syncUpdatedNotes,
  syncUsernameUpdate,
  syncNotes,
  syncAll,
} from "../database/syncStorage";
import { getLoggedInUser, checkAuth } from "../database/userStorage";
import { useNavigate } from "@solidjs/router";
function Main() {
  const [allNotes, setAllNotes] = createSignal([]);
  const [syncEnabled, setSyncEnabled] = createSignal(false);

  const navigate = useNavigate();

  onMount(async () => {
    if (!(await checkAuth())) {
      navigate("/");
    }
    const notes = await getAllNotes();
    setAllNotes(notes); // Set the fetched notes to the signal

    // check if syncing is enabled
    if (navigator.onLine) {
      await syncSyncStatus();
    }
    const user = await getLoggedInUser();
    if (user) {
      setSyncEnabled(user.sync || false); // Default to false if not set
    }
    if (navigator.onLine && syncEnabled()) {
      await syncAll();
    }

    // Attach online event listener to sync when user comes online
    window.addEventListener("online", handleOnlineSync);
  });

  onCleanup(() => {
    window.removeEventListener("online", handleOnlineSync);
  });

  // Function to sync when coming online
  const handleOnlineSync = async () => {
    const user = await getLoggedInUser();
    if (user) {
      setSyncEnabled(user.sync || false); // Default to false if not set
    }
    if (syncEnabled()) {
      await syncAll();
      setAllNotes(await getAllNotes()); // Update UI
    } else {
      console.log("User is online, but syncing is disabled.");
    }
  };

  // Function to delete and update UI
  const handleDelete = async (noteId) => {
    await deleteNote(noteId);
    setAllNotes(await getAllNotes()); // Re-fetch the notes to update UI
    if (navigator.onLine && syncEnabled()) {
      console.log("here");
      await syncDeletedNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-6xl mx-auto">
        <Navbar />
        {/* Separator */}
        <div className="my-4 border-t-2 border-accent"></div>
        {/* Notes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto max-w-5xl justify-center ">
          <For each={allNotes()}>
            {(note, index) => <Notecard note={note} onDelete={handleDelete} />}
          </For>
          {/* Add Note Button */}
        </div>
        <a href="/create-note">
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-light text-dark py-3 px-5 rounded-full cursor-pointer hover:bg-link-hover transition flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl">
            <span className="text-3xl">+</span> {/* Plus Icon */}
            <span className="hidden sm:block">Create a New Note</span>{" "}
            {/* Text for larger screens */}
          </div>
        </a>
      </div>
    </div>
  );
}

export default Main;
