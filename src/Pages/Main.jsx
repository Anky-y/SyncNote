import styles from ".././App.module.css";
import Navbar from "../Components/Navbar";
import Notecard from "../Components/Notecard";
import { getAllNotes, deleteNote } from "../localStorage";
import { createSignal, onMount } from "solid-js";
import { syncDeletedNotes } from "../syncNotes";
function Main() {
  const [allNotes, setAllNotes] = createSignal([]);

  onMount(async () => {
    const notes = await getAllNotes();
    setAllNotes(notes); // Set the fetched notes to the signal
  });

  // Function to delete and update UI
  const handleDelete = async (noteId) => {
    await deleteNote(noteId);
    setAllNotes(await getAllNotes()); // Re-fetch the notes to update UI
    if (navigator.onLine) {
      await syncDeletedNotes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-green-200 p-6">
      <div className="w-full max-w-6xl mx-auto">
        <Navbar />
        {/* Separator */}
        <div className="my-4 border-t-2 border-green-400"></div>
        {/* Notes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mx-auto max-w-5xl justify-center ">
          <For each={allNotes()}>
            {(note, index) => <Notecard note={note} onDelete={handleDelete} />}
          </For>
          {/* Add Note Button */}
        </div>
        <a href="/create-note">
          <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-3 px-5 rounded-full cursor-pointer hover:bg-green-600 transition flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl">
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
