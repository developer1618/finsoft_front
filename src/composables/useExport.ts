import * as XLSX from 'xlsx';

/**
 * Composable for exporting data to Excel
 */
export function useExport() {
    /**
     * Export data to Excel file
     */
    const exportToExcel = (
        data: Record<string, any>[],
        filename: string,
        sheetName = 'Sheet1'
    ) => {
        try {
            // Create worksheet from data
            const worksheet = XLSX.utils.json_to_sheet(data);

            // Create workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Generate Excel file
            const excelBuffer = XLSX.write(workbook, {
                bookType: 'xlsx',
                type: 'array',
            });

            // Create blob and download
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();

            // Cleanup
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Failed to export to Excel:', error);
            return false;
        }
    };

    /**
     * Export multiple sheets to Excel
     */
    const exportMultipleSheets = (
        sheets: Array<{ data: Record<string, any>[]; name: string }>,
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

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
            link.click();

            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Failed to export to Excel:', error);
            return false;
        }
    };

    /**
     * Export table data with custom headers
     */
    const exportTableToExcel = (
        headers: string[],
        data: Record<string, any>[],
        filename: string
    ) => {
        try {
            // Map data to use only specified headers
            const mappedData = data.map(row => {
                const newRow: Record<string, any> = {};
                headers.forEach(header => {
                    newRow[header] = row[header] ?? '';
                });
                return newRow;
            });

            return exportToExcel(mappedData, filename);
        } catch (error) {
            console.error('Failed to export table to Excel:', error);
            return false;
        }
    };

    return {
        exportToExcel,
        exportMultipleSheets,
        exportTableToExcel,
    };
}
