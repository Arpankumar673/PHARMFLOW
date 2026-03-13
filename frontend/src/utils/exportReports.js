import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Export data to Excel (.xlsx)
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file
 */
export const exportToExcel = (data, fileName = "report") => {
    if (!data || data.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    
    saveAs(dataBlob, `${fileName}_${Date.now()}.xlsx`);
};

/**
 * Export data to CSV (.csv)
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Name of the file
 */
export const exportToCSV = (data, fileName = "report") => {
    if (!data || data.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    saveAs(dataBlob, `${fileName}_${Date.now()}.csv`);
};
