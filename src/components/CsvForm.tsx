import { useState, Dispatch, SetStateAction, useRef, useEffect } from 'react';

interface CsvFormProps {
  headers: string[];
  onSubmit: (data: Record<string, string>) => void;
  onCancel: () => void;
  formData: Record<string, string>;
  setFormData: Dispatch<SetStateAction<Record<string, string>>>;
  title?: string;
  editingRowIndex?: number | null;
}

export function CsvForm({ 
  headers, 
  onSubmit, 
  onCancel, 
  formData, 
  setFormData,
  title = 'Add New Row',
  editingRowIndex = null
}: CsvFormProps) {
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [lastUpdatedField, setLastUpdatedField] = useState<string | null>(null);

  useEffect(() => {
    if (lastUpdatedField && textareaRefs.current[lastUpdatedField] && scrollContainerRef.current) {
      const textarea = textareaRefs.current[lastUpdatedField];
      const container = scrollContainerRef.current;
      
      // const textareaRect = textarea.getBoundingClientRect();
      // const containerRect = container.getBoundingClientRect();
      
      container.scrollTo({
        top: textarea.offsetTop - container.offsetHeight / 2 + textarea.offsetHeight / 2,
        behavior: 'smooth'
      });
      
      textarea?.focus();
      setLastUpdatedField(null);
    }
  }, [formData, lastUpdatedField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (header: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [header]: value
    }));
    setLastUpdatedField(header);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col max-h-[calc(100vh-85px)] text-white">
      {/* Fixed Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {editingRowIndex !== null && (
            <p className="text-sm text-gray-400 mt-1">
              Sl.No: {editingRowIndex + 1}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-300 hover:text-white cursor-pointer"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
        {/* Scrollable Form Fields */}
        <div ref={scrollContainerRef} className="flex-1 overflow-auto pr-2 space-y-4">
          {headers.map(header => (
            <div key={header} className="space-y-2">
              <label className="block text-sm font-bold text-white">
                {header}
              </label>
              <textarea
                ref={el => {
                  if (el) {
                    textareaRefs.current[header] = el;
                  }
                }}
                value={formData[header] || ''}
                onChange={(e) => handleChange(header, e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md 
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 
                  focus:border-teal-500 text-white placeholder-gray-400"
                rows={3}
                placeholder={`Enter ${header} or click a cell from the table`}
              />
            </div>
          ))}
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex justify-end space-x-4 pt-4 mt-4 border-t border-gray-600">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-500 rounded-md 
              shadow-sm text-sm font-medium text-gray-200 
              hover:bg-gray-600 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-teal-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md 
              shadow-sm text-sm font-medium text-white bg-teal-600 
              hover:bg-teal-700 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-teal-500"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
} 