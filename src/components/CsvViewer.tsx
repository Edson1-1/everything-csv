import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { CsvForm } from './CsvForm';
import { useResize } from '../hooks/useResize';
import { FileNameModal } from './FileNameModal';
import { Button } from './Button';
import { VscJson } from "react-icons/vsc";
import { BsFiletypeCsv } from "react-icons/bs";
import { FiPlus } from "react-icons/fi";
import { WelcomeCard } from './WelcomeCard';

interface CsvData {
  headers: string[];
  rows: string[][];
}

export function CsvViewer() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const { columnWidths, rowHeights, handleColumnResize, handleRowResize } = useResize(
    csvData?.headers.length ?? 0,
    csvData?.rows.length ?? 0
  );
  const [showFileNameModal, setShowFileNameModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const parseCsvText = (text: string): CsvData => {
    // Initialize state variables
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;
    let currentChar = '';
    let previousChar = '';
    
    // First pass: handle line breaks and quotes properly
    for (let i = 0; i < text.length; i++) {
      currentChar = text[i];
      
      // Handle escaped quotes
      if (currentChar === '"' && previousChar !== '\\') {
        inQuotes = !inQuotes;
      }
      
      // Handle line breaks
      if ((currentChar === '\n' || currentChar === '\r') && !inQuotes) {
        if (currentLine.trim()) {
          lines.push(currentLine);
        }
        currentLine = '';
        // Skip \r\n
        if (currentChar === '\r' && text[i + 1] === '\n') {
          i++;
        }
      } else {
        currentLine += currentChar;
      }
      
      previousChar = currentChar;
    }
    // Add the last line if it exists
    if (currentLine.trim()) {
      lines.push(currentLine);
    }

    // Parse each row while preserving markdown content
    const parseRow = (row: string): string[] => {
      const cells: string[] = [];
      let cell = '';
      let inQuotes = false;
      let i = 0;
      
      while (i < row.length) {
        const char = row[i];
        
        // Handle quoted content
        if (char === '"' && row[i - 1] !== '\\') {
          if (!inQuotes) {
            // Starting a quoted section
            inQuotes = true;
            i++;
            continue;
          } else if (row[i + 1] === '"') {
            // Escaped quote within quoted content
            cell += '"';
            i += 2;
            continue;
          } else {
            // Ending a quoted section
            inQuotes = false;
            i++;
            continue;
          }
        }
        
        // Handle commas
        if (char === ',' && !inQuotes) {
          cells.push(cell.trim());
          cell = '';
          i++;
          continue;
        }
        
        // Add character to current cell
        cell += char;
        i++;
      }
      
      // Add the last cell
      cells.push(cell.trim());
      return cells;
    };

    const headers = parseRow(lines[0]);
    const rows = lines.slice(1).map(line => parseRow(line));

    return { headers, rows };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadedFileName(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCsvText(text);
      setCsvData(parsedData);
    };
    reader.readAsText(file);
  };

  const handleJsonDownload = () => {
    if (!csvData) return;

    // Convert CSV data to JSON format
    const jsonData = csvData.rows.map(row => {
      const rowObject: Record<string, string> = {};
      csvData.headers.forEach((header, index) => {
        rowObject[header] = row[index] || '';
      });
      return rowObject;
    });

    // Create and download JSON file
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCsvDownload = () => {
    if (!csvData) return;
    setShowFileNameModal(true);
  };

  const handleFileNameSubmit = (fileName: string) => {
    if (!csvData) return;
    
    // Convert data to CSV
    const headers = csvData.headers.join(',');
    const rows = csvData.rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if needed
        const escaped = cell.replace(/"/g, '""');
        return /[,"\n\r]/.test(cell) ? `"${escaped}"` : cell;
      }).join(',')
    ).join('\n');
    const csv = `${headers}\n${rows}`;
    
    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setShowFileNameModal(false);
  };

  const handleRowEdit = (rowIndex: number) => {
    if (!csvData) return;
    
    // Convert row data to form data format
    const rowData = csvData.rows[rowIndex].reduce((acc, cell, index) => {
      acc[csvData.headers[index]] = cell;
      return acc;
    }, {} as Record<string, string>);

    setFormData(rowData);
    setEditingRowIndex(rowIndex);
    setShowForm(true);
  };

  const handleAddNewItem = (newItem: Record<string, string>) => {
    if (!csvData) return;

    const newRow = csvData.headers.map(header => newItem[header] || '');
    
    if (editingRowIndex !== null) {
      // Update existing row
      const updatedRows = [...csvData.rows];
      updatedRows[editingRowIndex] = newRow;
      setCsvData({
        ...csvData,
        rows: updatedRows
      });
    } else {
      // Add new row
      setCsvData({
        ...csvData,
        rows: [...csvData.rows, newRow]
      });
    }
    
    setShowForm(false);
    setEditingRowIndex(null);
    setFormData({});
  };

  // Update the form title based on whether we're editing or adding
  const formTitle = editingRowIndex !== null ? 'Edit Item' : 'Add New Item';

  const handleCellClick = (e: React.MouseEvent, rowIndex: number, cellIndex: number | null) => {
    e.stopPropagation(); // Prevent row click event from firing
    
    if (cellIndex === null) {
      // Clicked on Sl.No column - edit the entire row
      handleRowEdit(rowIndex);
    } else {
      // Clicked on a regular cell - copy content to form
      if (!csvData) return;
      
      const header = csvData.headers[cellIndex];
      const cellValue = csvData.rows[rowIndex][cellIndex];
      
      setFormData(prev => ({
        ...prev,
        [header]: cellValue
      }));
      
      if (!showForm) {
        setShowForm(true);
      }
    }
  };

  const ResizableCell = ({ 
    children, 
    index, 
    width, 
    height,
    onColumnResize,
    onRowResize,
    isHeader = false,
    onClick,
    className = ''
  }: {
    children: React.ReactNode;
    index: number;
    width?: number;
    height?: number;
    onColumnResize?: (index: number, width: number) => void;
    onRowResize?: (index: number, height: number) => void;
    isHeader?: boolean;
    onClick?: () => void;
    className?: string;
  }) => {
    const cellRef = useRef<HTMLTableCellElement>(null);
    const [isResizing, setIsResizing] = useState(false);
    
    const startColumnResize = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.pageX;
      const startWidth = cellRef.current?.offsetWidth ?? 0;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (onColumnResize) {
          const diff = e.pageX - startX;
          onColumnResize(index, startWidth + diff);
        }
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setIsResizing(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      setIsResizing(true);
    };

    const startRowResize = (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.pageY;
      const startHeight = cellRef.current?.offsetHeight ?? 0;
      
      const handleMouseMove = (e: MouseEvent) => {
        if (onRowResize) {
          const diff = e.pageY - startY;
          onRowResize(index, startHeight + diff);
        }
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setIsResizing(false);
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      setIsResizing(true);
    };

    const Tag = isHeader ? 'th' : 'td';
    
    return (
      <Tag
        ref={cellRef}
        className={`relative border border-gray-600 text-start align-top px-4 py-2 ${
          isHeader ? 'bg-gray-900 text-white' : 'bg-gray-700 text-white'
        } ${className}`}
        style={{ 
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
          cursor: isResizing ? 'col-resize' : 'default'
        }}
        onClick={onClick}
      >
        {children}
        {onColumnResize && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-400"
            onMouseDown={startColumnResize}
          />
        )}
        {onRowResize && (
          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-blue-400"
            onMouseDown={startRowResize}
          />
        )}
      </Tag>
    );
  };

  if (showForm && csvData) {
    return (
      <div className="grid grid-cols-4 gap-6 p-4 pr-0 h-fit">
        <div className="col-span-1 min-w-[400px] max-h-[calc(100vh-200px)]">
          <CsvForm 
            headers={csvData.headers}
            onSubmit={handleAddNewItem}
            onCancel={() => {
              setShowForm(false);
              setEditingRowIndex(null);
              setFormData({});
            }}
            formData={formData}
            setFormData={setFormData}
            title={formTitle}
            editingRowIndex={editingRowIndex}
          />
        </div>

        {/* Right side - Table */}
        <div className="col-span-3 flex flex-col">
          <h2 className="text-xl font-semibold mb-4">Current Data</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg rounded-r-none max-h-[calc(100vh-130px)]">
            <table className="min-w-full border-collapse relative">
              <thead className="sticky top-0 bg-gray-900 z-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
                <tr>
                  <th className="sticky left-0 z-20 px-4 py-2 align-top border border-gray-600 bg-gray-900 text-white font-bold text-sm w-20">
                    Sl.No
                  </th>
                  {csvData.headers.map((header, index) => (
                    <ResizableCell
                      key={index}
                      index={index}
                      width={columnWidths[index]}
                      onColumnResize={handleColumnResize}
                      isHeader
                    >
                      {header}
                    </ResizableCell>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td 
                      className="px-4 py-2 align-top border border-gray-600 bg-gray-900 text-white text-center text-sm cursor-pointer hover:bg-gray-800"
                      onClick={(e) => handleCellClick(e, rowIndex, null)}
                    >
                      {rowIndex + 1}
                    </td>
                    {row.map((cell, cellIndex) => (
                      <ResizableCell
                        key={cellIndex}
                        index={rowIndex}
                        width={columnWidths[cellIndex]}
                        height={rowHeights[rowIndex]}
                        onRowResize={handleRowResize}
                      >
                        <div 
                          onClick={(e) => handleCellClick(e, rowIndex, cellIndex)}
                          className="cursor-pointer hover:bg-teal-800"
                        >
                          <ReactMarkdown>{cell}</ReactMarkdown>
                        </div>
                      </ResizableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 pl-8">
      <div className="mb-4 space-y-4">
        <div className="w-fit">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-200
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-50 file:text-gray-700
              hover:file:bg-gray-100 file:cursor-pointer cursor-pointer"
          />
        </div>
        
        {csvData && (
          <div className="flex justify-between">
            <div> 
            <Button
                variant="secondary"
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <FiPlus className="text-lg" />
                Add New Row
              </Button>
            </div>
            <div className="flex gap-4 pr-8"> 
            <Button
              variant="secondary"
              onClick={handleJsonDownload}
              className="flex items-center gap-2 cursor-pointer"
            >
              <VscJson className="text-lg" />
              Download as JSON
            </Button>
            <Button
              variant="secondary"
              onClick={handleCsvDownload}
              className="flex items-center gap-2 cursor-pointer"
            >
              <BsFiletypeCsv className="text-lg" />
              Download as CSV
            </Button>


            </div>
            
            
          </div>
        )}
      </div>

      {csvData ? (
        <div className="overflow-x-auto border border-r-0 border-gray-200 rounded-lg rounded-r-none max-h-[calc(100vh-200px)] w-full">
          <table className="min-w-full border-collapse relative">
            <thead className="sticky top-0 bg-gray-900 z-10 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)]">
              <tr>
                <th className="sticky left-0 z-20 px-4 py-2 align-top border border-gray-600 bg-gray-900 text-white font-bold text-sm w-20">
                  Sl.No
                </th>
                {csvData.headers.map((header, index) => (
                  <ResizableCell
                    key={index}
                    index={index}
                    width={columnWidths[index]}
                    onColumnResize={handleColumnResize}
                    isHeader
                  >
                    {header}
                  </ResizableCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td 
                    className="px-4 py-2 align-top border border-gray-600 bg-gray-900 text-white text-center text-sm cursor-pointer hover:bg-gray-800"
                    onClick={(e) => handleCellClick(e, rowIndex, null)}
                  >
                    {rowIndex + 1}
                  </td>
                  {row.map((cell, cellIndex) => (
                    <ResizableCell
                      key={cellIndex}
                      index={rowIndex}
                      width={columnWidths[cellIndex]}
                      height={rowHeights[rowIndex]}
                      onRowResize={handleRowResize}
                    >
                      <div 
                        onClick={(e) => handleCellClick(e, rowIndex, cellIndex)}
                        className="cursor-pointer hover:bg-teal-800"
                      >
                        <ReactMarkdown>{cell}</ReactMarkdown>
                      </div>
                    </ResizableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <WelcomeCard />
      )}

      <FileNameModal
        isOpen={showFileNameModal}
        defaultFileName={uploadedFileName || 'download'}
        onClose={() => setShowFileNameModal(false)}
        onSubmit={handleFileNameSubmit}
      />
    </div>
  );
} 