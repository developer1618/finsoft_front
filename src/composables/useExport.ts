import * as XLSX from 'xlsx';
import { sanitizeFilename } from '../utils/sanitize';

export function useExport() {
    const exportToExcel = (
        data: Record<string, unknown>[],
        filename: string,
        sheetName = 'Sheet1'
    ) => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });

            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const safeFilename = sanitizeFilename(filename);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeFilename}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();

            URL.revokeObjectURL(url);

            return true;
        } catch {
            return false;
        }
    };

    const exportMultipleSheets = (
        sheets: Array<{ data: Record<string, unknown>[]; name: string }>,
        filename: string
    ) => {
        try {
            const workbook = XLSX.utils.book_new();

            sheets.forEach(({ data, name }) => {
                const worksheet = XLSX.utils.json_to_sheet(data);
                XLSX.utils.book_append_sheet(workbook, worksheet, name);
            });

            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });

            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const safeFilename = sanitizeFilename(filename);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${safeFilename}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();

            URL.revokeObjectURL(url);

            return true;
        } catch {
            return false;
        }
    };

    const exportTableToExcel = (
        headers: string[],
        data: Record<string, unknown>[],
        filename: string
    ) => {
        try {
            const mappedData = data.map(row => {
                const newRow: Record<string, unknown> = {};
                headers.forEach(header => {
                    newRow[header] = row[header] ?? '';
                });
                return newRow;
            });

            return exportToExcel(mappedData, filename);
        } catch {
            return false;
        }
    };

    return {
        exportToExcel,
        exportMultipleSheets,
        exportTableToExcel,
    };
}
