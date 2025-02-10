import { useState, useCallback, useEffect } from 'react';

interface ResizeState {
  columnWidths: { [key: number]: number };
  rowHeights: { [key: number]: number };
}

export function useResize(initialColumnCount: number, initialRowCount: number) {
  const [resizeState, setResizeState] = useState<ResizeState>({
    columnWidths: {},
    rowHeights: {}
  });

  // Reset state when row/column counts change
  useEffect(() => {
    setResizeState({
      columnWidths: {},
      rowHeights: {}
    });
  }, [initialColumnCount, initialRowCount]);

  const handleColumnResize = useCallback((columnIndex: number, width: number) => {
    setResizeState(prev => ({
      ...prev,
      columnWidths: {
        ...prev.columnWidths,
        [columnIndex]: Math.max(width, 100) // Minimum width of 100px
      }
    }));
  }, []);

  const handleRowResize = useCallback((rowIndex: number, height: number) => {
    setResizeState(prev => ({
      ...prev,
      rowHeights: {
        ...prev.rowHeights,
        [rowIndex]: Math.max(height, 40) // Minimum height of 40px
      }
    }));
  }, []);

  return {
    columnWidths: resizeState.columnWidths,
    rowHeights: resizeState.rowHeights,
    handleColumnResize,
    handleRowResize
  };
} 