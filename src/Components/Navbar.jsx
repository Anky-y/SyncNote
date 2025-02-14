import styles from ".././App.module.css";
import UserIcon from "../assets/user-regular.svg";

function Navbar() {
  return (
    <div>
      <div className="flex justify-between items-centerp-4 rounded-xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-green-800">
          SyncNote
        </h1>
        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-400 rounded-xl flex justify-center items-center shadow-md cursor-pointer">
          <UserIcon class="w-6 sm:w-8 h-6 sm:h-8" />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
