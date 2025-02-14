import { Navigate } from "solid-app-router";
import BinIcon from "../assets/trash-can-regular.svg";
import { deleteNote, getAllNotes } from "../localStorage";
import Modal from "./ConfirmationModal";
import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

function Notecard(props) {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.cancelBubble = true; // Prevent the card click from triggering
    setIsModalOpen(true);
  };

  const handleCardClick = (e) => {
    // Only trigger navigation if the modal isn't open
    if (!isModalOpen()) {
      navigate(`/Update-note`, { state: props.note });
    }
  };
  return (
    <div
      className={`${props.note.bgColor} p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition-all col-span-1 cursor-pointer`}
      on:click={handleCardClick}
    >
      <div className="flex flex-row justify-between">
        <h2 className="text-lg sm:text-xl font-semibold text-green-800">
          {props.note.title}
        </h2>
        <button
          on:click={handleDeleteClick} // Show modal on click
        >
          <BinIcon className="w-5 sm:w-6 h-5 sm:h-6 cursor-pointer group-hover:scale-110 transition-all duration-300" />
        </button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close modal
          onConfirm={() => {
            props.onDelete(props.note);
            setIsModalOpen(false);
          }}
        />
      </div>
      <p className="text-gray-600 mt-2 text-sm sm:text-base line-clamp-2">
        {props.note.content}
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-4 text-right">
        Last modified: {new Date(props.note.updatedAt).toLocaleDateString()}
      </p>
    </div>
  );
}
export default Notecard;
