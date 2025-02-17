import UserIcon from "../assets/user-regular.svg";
import { createSignal } from "solid-js";
import { FiEdit, FiCheck, FiX } from "solid-icons/fi"; // SolidJS compatible icons
import { AiOutlineUser } from "solid-icons/ai";
import {
  addUnsyncedSyncUpdate,
  getLoggedInUser,
  updateLoggedInUsername,
  updateUserSyncStatus,
} from "../database/userStorage";
import { addUnsyncedUsernameUpdate } from "../database/userStorage";
import { onMount, onCleanup } from "solid-js";
import {
  syncAll,
  syncSyncStatus,
  syncUsernameUpdate,
} from "../database/syncStorage";

import { useNavigate } from "@solidjs/router";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  const [isEditing, setIsEditing] = createSignal(false);
  const [username, setUsername] = createSignal("Your Username"); // Replace with actual username data
  const [syncToggle, setSyncToggle] = createSignal(true); // Default sync state

  const navigate = useNavigate();

  onMount(async () => {
    const user = await getLoggedInUser();
    console.log(user);
    setUsername(user.username);
    setSyncToggle(user.sync);

    document.addEventListener("click", handleClickOutside);
  });
  onCleanup(() => document.removeEventListener("click", handleClickOutside));
  const handleClickOutside = (event) => {
    if (
      dropdownOpen() &&
      !event.target.closest(".dropdown-menu") && // Ensure click is outside dropdown
      !event.target.closest(".user-icon") && // Ensure click is outside user icon
      !event.target.closest(".edit-icon")
    ) {
      setDropdownOpen(false);
    }
  };

  async function handleUsernameUpdate() {
    const user = await getLoggedInUser();
    updateLoggedInUsername(user.id, username());
    await addUnsyncedUsernameUpdate(username());
    setIsEditing(false);
    if (navigator.onLine && user?.sync) {
      await syncUsernameUpdate();
    }
  }

  async function handleSyncUpdate() {
    setSyncToggle(!syncToggle());
    const user = await getLoggedInUser();
    await updateUserSyncStatus(user.id, syncToggle());
    await addUnsyncedSyncUpdate(syncToggle());
    if (navigator.onLine) {
      await syncSyncStatus();
    }

    if (syncToggle()) {
      await syncAll();
    }
  }

  const handleLogout = async () => {
    // Make POST request to the backend logout route
    const res = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include", // Important for cookies
    });

    const data = await res.json();

    if (res.ok) {
      // Clear localStorage (if you are storing tokens or user data there)
      localStorage.removeItem("authToken");

      // Optionally, redirect to the login page
      navigate("/");
    } else {
      console.error("Logout failed:", data.message);
      alert("Logout failed: " + (data.message || "Please try again"));
    }
  };

  return (
    <div className="flex justify-between items-center p-4 ">
      <h1 className="text-3xl sm:text-4xl font-bold text-dark">SyncNote</h1>

      <div className="relative">
        {/* User Icon */}
        <div
          className="w-10 h-10 bg-secondary text-black flex items-center justify-center rounded-full cursor-pointer user-icon"
          onClick={() => setDropdownOpen(!dropdownOpen())}
        >
          <AiOutlineUser size={20} />
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen() && (
          <div className="absolute right-5 mt-2 w-56 bg-white text-black shadow-md rounded-lg overflow-hidden p-3 dropdown-menu">
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
                    className="text-gray-600 ml-2 edit-icon"
                  >
                    <FiEdit size={18} /> {/* Edit Button */}
                  </button>
                </>
              )}
            </div>

            {/* Toggle Sync Button */}
            <div className="flex justify-between items-center px-2 py-2 rounded">
              <span>Online Sync</span>
              <label className="relative inline-flex cursor-pointer items-center  ">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={syncToggle()}
                  onChange={handleSyncUpdate}
                />
                <div
                  className={`w-12 h-6 rounded-full transition-colors duration-300  ${
                    syncToggle()
                      ? "bg-green-500 hover:bg-green-600 "
                      : "bg-gray-300  hover:bg-gray-400"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300  ${
                      syncToggle() ? "translate-x-7" : "translate-x-1"
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {/* Logout Button */}
            <button
              onclick={handleLogout}
              className="w-full px-2 py-2 text-red-500 hover:bg-gray-200 active:bg-gray-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
