import { Show } from "solid-js";

function Modal({ isOpen, onClose, onConfirm }) {
  return (
    <Show when={isOpen()}>
      <div class="fixed inset-0 bg-white/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg w-80">
          <h2 class="text-xl font-semibold text-gray-800">Confirm Delete</h2>
          <p class="text-gray-600 mt-2">
            Are you sure you want to delete this note?
          </p>
          <div class="mt-4 flex justify-end gap-4">
            <button
              onClick={onClose}
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose(); // Close the modal after confirmation
              }}
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}

export default Modal;
