import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type DataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | DataValue[]
  | { [key: string]: DataValue };
export type DataRecord = Record<string, DataValue>;

/**
 * Convert data to CSV format
 * @param data Array of objects to convert
 * @param headers Object mapping column keys to display names
 * @returns CSV string
 */
export function convertToCSV<T extends DataRecord>(
  data: T[],
  headers: Record<string, string>
): string {
  // Create header row
  const headerRow = Object.values(headers).join(",");

  // Create data rows
  const rows = data.map((item) => {
    return Object.keys(headers)
      .map((key) => {
        const value = item[key];
        // Handle nested objects
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            return `"${value.map((v) => v?.toString() ?? "").join("; ")}"`;
          }
          return `"${JSON.stringify(value)}"`;
        }
        // Handle strings with commas
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value ?? "";
      })
      .join(",");
  });

  return [headerRow, ...rows].join("\n");
}

/**
 * Convert data to Excel format
 * @param data Array of objects to convert
 * @param headers Object mapping column keys to display names
 * @returns Excel workbook
 */
export function convertToExcel<T extends DataRecord>(
  data: T[],
  headers: Record<string, string>
): XLSX.WorkBook {
  const headerRow = Object.values(headers);
  const rows = data.map((item) =>
    Object.keys(headers).map((key) => {
      const value = item[key];
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          return value.map((v) => v?.toString() ?? "").join("; ");
        }
        return JSON.stringify(value);
      }
      return value ?? "";
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headerRow, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  return workbook;
}

/**
 * Load an image from a URL and convert it to base64
 */
async function loadImage(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error loading image:", error);
    return "";
  }
}

/**
 * Convert data to PDF format
 * @param data Array of objects to convert
 * @param headers Object mapping column keys to display names
 * @returns PDF document
 */
export async function convertToPDF<T extends DataRecord>(
  data: T[],
  headers: Record<string, string>
): Promise<jsPDF> {
  const doc = new jsPDF();
  const headerRow = Object.values(headers).filter(
    (header) => !header.includes("Photo URL")
  );

  // Filter out photo URLs from the data rows
  const rows = data.map((item) =>
    Object.keys(headers)
      .filter((key) => !key.includes("_url"))
      .map((key) => {
        const value = item[key];
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            return value.map((v) => v?.toString() ?? "").join("; ");
          }
          return JSON.stringify(value);
        }
        return value ?? "";
      })
  );

  // Add the table
  autoTable(doc, {
    head: [headerRow],
    body: rows,
    startY: 10,
    styles: { fontSize: 8, cellPadding: 1 },
    headStyles: { fillColor: [66, 66, 66] },
  });

  // Add images after the table
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY;
  let yOffset = finalY + 10;

  for (const item of data) {
    const fileUrl = item.file_url as string | undefined | null;
    const fileCompletionUrl = item.file_completion_url as
      | string
      | undefined
      | null;
    const controlNo = item.control_no as string;

    if (fileUrl && fileUrl !== "N/A") {
      try {
        const imgData = await loadImage(fileUrl);
        if (imgData) {
          doc.addImage(imgData, "JPEG", 10, yOffset, 80, 60);
          doc.text(`Request Photo (${controlNo})`, 10, yOffset - 5);
          yOffset += 70;
        }
      } catch (error) {
        console.error("Error adding request photo:", error);
      }
    }

    if (fileCompletionUrl && fileCompletionUrl !== "N/A") {
      try {
        const imgData = await loadImage(fileCompletionUrl);
        if (imgData) {
          doc.addImage(imgData, "JPEG", 10, yOffset, 80, 60);
          doc.text(`Completion Photo (${controlNo})`, 10, yOffset - 5);
          yOffset += 70;
        }
      } catch (error) {
        console.error("Error adding completion photo:", error);
      }
    }

    // Add a new page if we're running out of space
    if (yOffset > doc.internal.pageSize.height - 80) {
      doc.addPage();
      yOffset = 10;
    }
  }

  return doc;
}

/**
 * Download data as CSV file
 * @param data Array of objects to export
 * @param headers Object mapping column keys to display names
 * @param filename Name of the file to download
 */
export function downloadCSV<T extends DataRecord>(
  data: T[],
  headers: Record<string, string>,
  filename: string
): void {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download data as Excel file
 * @param data Array of objects to export
 * @param headers Object mapping column keys to display names
 * @param filename Name of the file to download
 */
export function downloadExcel<T extends DataRecord>(
  data: T[],
  headers: Record<string, string>,
  filename: string
): void {
  const workbook = convertToExcel(data, headers);
  XLSX.writeFile(workbook, filename);
}

/**
 * Download data as PDF file
 * @param data Array of objects to export
 * @param headers Object mapping column keys to display names
 * @param filename Name of the file to download
 */
export async function downloadPDF<T extends DataRecord>(
  data: T[],
  headers: Record<string, string>,
  filename: string
): Promise<void> {
  const doc = await convertToPDF(data, headers);
  doc.save(filename);
}
