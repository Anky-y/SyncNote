import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import CheckSolid from "../assets/check-solid.svg";
import { syncNotes } from "../syncNotes";
import {
  saveNoteLocally,
  getAllNotes,
  getUnsyncedNotes,
  getSyncedNotes,
} from "../localStorage";
function CreateNote(note) {
  const navigate = useNavigate();
  const [title, setTitle] = createSignal(note.title ? note.title : "");
  const [content, setContent] = createSignal(note.content ? note.content : "");
  const [bgColor, setBgColor] = createSignal(
    note.bgColor ? note.bgColor : "bg-white"
  );

  const colors = [
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200",
  ];

  const handleSave = async () => {
    const newNote = {
      id: note.id || crypto.randomUUID(), // Generate unique ID if not provided
      title: title(),
      content: content(),
      updatedAt: Date.now(),
      bgColor: bgColor(),
    };
    saveNoteLocally(newNote);

    console.log("Saved note locally:", newNote);
    getAllNotes();
    getUnsyncedNotes();
    if (navigator.onLine) {
      await syncNotes();
      console.log(getSyncedNotes());
      console.log(getAllNotes());
      console.log(getUnsyncedNotes());
    }
  };

  return (
    <div class={`${bgColor()} min-h-screen p-6`}>
      {/* Header Section */}
      <div class="flex justify-between items-center mb-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          class="text-xl text-gray-700 hover:text-gray-900"
        >
          ← Back
        </button>

        {/* Save Button */}
        <button
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          onclick={handleSave}
        >
          Save
        </button>
      </div>

      {/* Note Inputs */}
      <div class="max-w-3xl mx-auto mt-6 bg-white p-6 rounded-xl shadow-md">
        <input
          type="text"
          placeholder="Title"
          value={title()}
          onInput={(e) => setTitle(e.target.value)}
          class="w-full p-2 text-xl font-semibold border-b-2 focus:outline-none"
        />
        <textarea
          placeholder="Write your note here..."
          value={content()}
          onInput={(e) => setContent(e.target.value)}
          class="w-full mt-4 p-2 h-40 border rounded focus:outline-none"
        />

        {/* Color Selector */}
        <div class="mt-4 flex gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setBgColor(color)}
              class={`${color} w-10 h-10 flex justify-center items-center rounded-full border-2 ${
                bgColor() === color ? "border-black" : "border-transparent"
              }`}
            >
              {bgColor() === color ? (
                <CheckSolid class="w-4 sm:w-6 h-4 sm:h-6 " />
              ) : (
                ""
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateNote;
