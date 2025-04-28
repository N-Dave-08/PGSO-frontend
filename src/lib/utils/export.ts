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
  // Create PDF in landscape for better layout
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
  });

  // Add header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text("Request Report", doc.internal.pageSize.width / 2, 15, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.text(
    new Date().toLocaleDateString(),
    doc.internal.pageSize.width - 20,
    15,
    { align: "right" }
  );

  // Filter out columns where all values are N/A
  const filteredHeaders: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    const allNA = data.every((item) => item[key] === "N/A");
    if (!allNA) {
      filteredHeaders[key] = value;
    }
  });

  let currentY = 25; // Starting Y position
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const photoWidth = 60;
  const photoHeight = 45;
  const photosPerRow = 2;
  const photoSpacing =
    (pageWidth - 2 * margin - photosPerRow * photoWidth) / (photosPerRow - 1);

  // Process each request
  for (const item of data) {
    // Add table row for current request
    const rowData = Object.keys(filteredHeaders)
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
      });

    // Add single row table
    autoTable(doc, {
      head: [
        Object.values(filteredHeaders).filter(
          (header) => !header.includes("Photo URL")
        ),
      ],
      body: [rowData],
      startY: currentY,
      styles: {
        fontSize: 9,
        cellPadding: 2,
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [44, 62, 80],
        fontSize: 10,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 244, 248],
      },
    });

    // Update Y position after table
    currentY =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;

    // Add photos for current request
    const fileUrl = item.file_url as string | undefined | null;
    const fileCompletionUrl = item.file_completion_url as
      | string
      | undefined
      | null;
    const controlNo = item.control_no as string;

    // Function to add photo
    const addPhoto = async (
      url: string | undefined | null,
      label: string,
      xPosition: number
    ) => {
      if (!url || url === "N/A") return;

      try {
        const imgData = await loadImage(url);
        if (imgData) {
          // Check if we need to add a new page
          if (currentY + photoHeight + 20 > pageHeight) {
            doc.addPage();
            currentY = 20;
          }

          // Add photo with border
          doc.setDrawColor(44, 62, 80);
          doc.setLineWidth(0.1);
          doc.rect(xPosition, currentY, photoWidth, photoHeight);
          doc.addImage(
            imgData,
            "JPEG",
            xPosition,
            currentY,
            photoWidth,
            photoHeight
          );

          // Add label
          doc.setFontSize(8);
          doc.text(`${label} (${controlNo})`, xPosition, currentY - 2);
        }
      } catch (error) {
        console.error(`Error adding ${label}:`, error);
      }
    };

    // Add request and completion photos side by side
    await addPhoto(fileUrl, "Request Photo", margin);
    await addPhoto(
      fileCompletionUrl,
      "Completion Photo",
      margin + photoWidth + photoSpacing
    );

    // Update Y position for next request
    currentY += photoHeight + 20;

    // Add new page if needed
    if (currentY > pageHeight - 40) {
      doc.addPage();
      currentY = 20;
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
