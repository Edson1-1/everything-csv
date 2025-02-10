interface FileNameModalProps {
  isOpen: boolean;
  defaultFileName: string;
  onClose: () => void;
  onSubmit: (fileName: string) => void;
}

export function FileNameModal({ isOpen, defaultFileName, onClose, onSubmit }: FileNameModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const fileName = formData.get('fileName') as string;
    onSubmit(fileName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Save File As</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-2">
              File Name
            </label>
            <input
              type="text"
              id="fileName"
              name="fileName"
              defaultValue={defaultFileName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md 
                shadow-sm text-sm font-medium text-gray-700 
                hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md 
                shadow-sm text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 focus:outline-none focus:ring-2 
                focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 