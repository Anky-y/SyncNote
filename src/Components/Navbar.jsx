import UserIcon from "../assets/user-regular.svg";
import { createSignal } from "solid-js";
import { FiEdit, FiCheck, FiX } from "solid-icons/fi"; // SolidJS compatible icons
import { AiOutlineUser } from "solid-icons/ai";
import {
  addUnsyncedUsernameUpdate,
  getLoggedInUser,
  updateLoggedInUsername,
} from "../localStorage";
import { onMount } from "solid-js";
import { syncUsernameUpdate } from "../syncNotes";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  const [isEditing, setIsEditing] = createSignal(false);
  const [username, setUsername] = createSignal("Your Username"); // Replace with actual username data
  const [syncEnabled, setSyncEnabled] = createSignal(true); // Default sync state

  onMount(async () => {
    const user = await getLoggedInUser();
    setUsername(user.username);
  });

  async function handleUsernameUpdate() {
    const user = await getLoggedInUser();
    updateLoggedInUsername(user.id, username());
    await addUnsyncedUsernameUpdate(username());
    setIsEditing(false);
    if (navigator.onLine) {
      await syncUsernameUpdate();
    }
  }

  return (
    <div className="flex justify-between items-center p-4 ">
      <h1 className="text-3xl sm:text-4xl font-bold text-green-500">
        SyncNote
      </h1>

      <div className="relative">
        {/* User Icon */}
        <div
          className="w-10 h-10 bg-yellow-500 text-black flex items-center justify-center rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen())}
        >
          <AiOutlineUser size={20} />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen() && (
          <div className="absolute right-5 mt-2 w-56 bg-white text-gray-800 shadow-md rounded-lg overflow-hidden p-3 ">
            {/* Editable Username */}
            <div className="flex items-center justify-between border-b pb-2 mb-2 mx-2">
              {isEditing() ? (
                <>
                  <input
                    type="text"
                    className="border px-2 py-1 rounded w-full outline-none"
                    value={username()}
                    onInput={(e) => setUsername(e.target.value)}
                  />
                  <button
                    onClick={handleUsernameUpdate}
                    className="ml-2 text-green-500"
                  >
                    <FiCheck size={18} /> {/* Save Button */}
                  </button>
                  <button
                    onClick={async () => {
                      const user = await getLoggedInUser();
                      setUsername(user.username);
                      setIsEditing(false);
                    }}
                    className="ml-1 text-red-500"
                  >
                    <FiX size={18} /> {/* Cancel Button */}
                  </button>
                </>
              ) : (
                <>
                  <span>{username()}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 ml-2"
                  >
                    <FiEdit size={18} /> {/* Edit Button */}
                  </button>
                </>
              )}
            </div>

            {/* Toggle Sync Button */}
            <div className="flex justify-between items-center px-2 py-2 hover:bg-gray-200 rounded">
              <span>Online Sync</span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={syncEnabled()}
                  onChange={() => setSyncEnabled(!syncEnabled())}
                />
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={syncEnabled()}
                    onChange={() => setSyncEnabled(!syncEnabled())}
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      syncEnabled() ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${
                        syncEnabled() ? "translate-x-7" : "translate-x-1"
                      }`}
                    ></div>
                  </div>
                </label>
              </label>
            </div>

            {/* Logout Button */}
            <button className="w-full px-2 py-2 text-red-500 hover:bg-gray-200 active:bg-gray-300">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
