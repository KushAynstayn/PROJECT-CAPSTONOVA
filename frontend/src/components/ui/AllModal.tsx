export const DownloadModal = ({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md font-sans">
        <p className="text-center text-lg font-semibold text-gray-800 mb-6">
          Download to open file
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-[#660000] text-white font-semibold px-6 py-2 rounded-md transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Okay
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-[#660000] hover:text-white text-gray-800 font-semibold px-6 py-2 rounded-md transition-transform duration-200 ease-in-out hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
