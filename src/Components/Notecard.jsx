function Notecard() {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md hover:shadow-lg transition-all col-span-1">
      <h2 className="text-lg sm:text-xl font-semibold text-green-800">
        Meeting Notes
      </h2>
      <p className="text-gray-600 mt-2 text-sm sm:text-base line-clamp-2">
        Discussed project scope, deadlines, and next steps...
      </p>
      <p className="text-gray-500 text-xs sm:text-sm mt-4">
        Last Updated: Feb 12, 2025
      </p>
    </div>
  );
}
export default Notecard;
