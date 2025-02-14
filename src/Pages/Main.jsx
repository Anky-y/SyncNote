import userIcon from "../assets/user-regular.svg";
import styles from ".././App.module.css";

function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-r p-6">
      {/* <!-- Navbar --> */}
      <div className="flex justify-between items-center p-4 rounded-xl">
        <h1 className="text-5xl font-semibold text-green-800">SyncNote</h1>
        <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex justify-center items-center shadow-md cursor-pointer">
          <img src={userIcon} alt="User Icon" className="w-8 h-8" />
        </div>
      </div>

      {/* <!-- Separator --> */}
      <div className="my-4 border-t-2 border-green-400"></div>

      {/* <!-- Notes Section --> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-green-800">Note Title</h2>
          <p className="text-gray-600 mt-2 line-clamp-2">
            This is a sample note content. It will be cut off after two lines to
            maintain structure...
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Last Updated: Feb 14, 2025
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-green-800">
            Meeting Notes
          </h2>
          <p className="text-gray-600 mt-2 line-clamp-2">
            Discussed project scope and deliverables. Need to finalize design
            documents...
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Last Updated: Feb 12, 2025
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-green-800">To-Do List</h2>
          <p className="text-gray-600 mt-2 line-clamp-2">
            - Fix responsiveness - Implement sync feature - Write a blog post...
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Last Updated: Feb 10, 2025
          </p>
        </div>
      </div>
    </div>
  );
}

export default Main;
