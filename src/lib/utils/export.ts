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
  // Create PDF in portrait for receipt-like format
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add wrapped text
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * lineHeight;
  };

  // Helper function to add a field with label
  const addField = (
    label: string,
    value: any,
    x: number,
    y: number,
    maxWidth: number
  ): number => {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label + ": ", x, y);

    const labelWidth = doc.getTextWidth(label + ": ");
    doc.setFont("helvetica", "normal");
    const displayValue = value?.toString() || "N/A";
    return addWrappedText(
      displayValue,
      x + labelWidth,
      y,
      maxWidth - labelWidth,
      4
    );
  };

  // Helper function to safely convert to string
  const toString = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    return String(value);
  };

  // Helper function to format date string
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch {
      return String(dateStr);
    }
  };

  // Process each request
  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    // Start each request on a new page
    if (i > 0) {
      doc.addPage();
    }

    let currentY = margin;

    // Add header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(44, 62, 80);
    doc.text("Request Report", pageWidth / 2, currentY, { align: "center" });

    // Add date
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString(), pageWidth - margin, currentY, {
      align: "right",
    });
    currentY += 10;

    // Add divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 8;

    // Control number in highlight box
    const controlNo = toString(item.control_no);
    doc.setFillColor(44, 62, 80);
    doc.setTextColor(255, 255, 255);
    doc.rect(margin, currentY, 45, 8, "F");
    doc.setFontSize(11);
    doc.text(controlNo, margin + 3, currentY + 5.5);
    currentY += 15;

    // Reset text color
    doc.setTextColor(44, 62, 80);

    // Main fields
    currentY = addField(
      "Title",
      toString(item.request_title),
      margin,
      currentY,
      contentWidth
    );
    currentY = addField(
      "Description",
      toString(item.description),
      margin,
      currentY + 3,
      contentWidth
    );
    currentY = addField(
      "Category",
      toString(item.category_name),
      margin,
      currentY + 3,
      contentWidth
    );
    currentY += 8;

    // Status Section with custom layout
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, currentY, contentWidth, 18, "F");

    // Status info in three columns
    const colWidth = contentWidth / 3;
    currentY += 4;
    doc.setFontSize(8);

    // Status column
    doc.setFont("helvetica", "bold");
    doc.text("Status:", margin + 3, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(toString(item.status), margin + 3, currentY + 5);

    // Date Requested column
    doc.setFont("helvetica", "bold");
    doc.text("Date Requested:", margin + colWidth + 3, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(
      formatDate(toString(item.date_requested)),
      margin + colWidth + 3,
      currentY + 5
    );

    // Date Completed column
    doc.setFont("helvetica", "bold");
    doc.text("Date Completed:", margin + colWidth * 2 + 3, currentY);
    doc.setFont("helvetica", "normal");
    doc.text(
      formatDate(toString(item.date_completed)),
      margin + colWidth * 2 + 3,
      currentY + 5
    );

    currentY += 25;

    // Personnel fields with improved spacing
    const requestedBy = toString(item["requested_by.full_name"]);
    const department = toString(item["requested_by.department"]);
    const division = toString(item["requested_by.division"]);
    const personnel = Array.isArray(item.personnel)
      ? item.personnel.map((p) => toString(p)).join("; ")
      : toString(item.personnel);
    const teamLead = toString(item.team_lead);

    currentY = addField(
      "Requested By",
      requestedBy,
      margin,
      currentY,
      contentWidth
    );
    currentY = addField(
      "Department",
      department,
      margin,
      currentY + 3,
      contentWidth
    );
    currentY = addField(
      "Division",
      division,
      margin,
      currentY + 3,
      contentWidth
    );
    currentY = addField(
      "Personnel",
      personnel,
      margin,
      currentY + 3,
      contentWidth
    );
    currentY = addField(
      "Team Lead",
      teamLead,
      margin,
      currentY + 3,
      contentWidth
    );
    currentY += 8;

    // Feedback Section
    if (item.feedback || item.rating) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Feedback", margin, currentY);
      currentY += 6;

      // Add feedback in a box
      if (item.feedback) {
        doc.setFillColor(245, 247, 250);
        doc.rect(margin, currentY, contentWidth, 15, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        currentY = addWrappedText(
          toString(item.feedback),
          margin + 3,
          currentY + 4,
          contentWidth - 6,
          4
        );
      }

      // Add rating
      if (item.rating) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text(`Rating: ${toString(item.rating)}/5`, margin, currentY + 8);
      }
      currentY += 15;
    }

    // Photos section
    const photoWidth = 75;
    const photoHeight = 55;

    // Add photos side by side if they exist
    const fileUrl = item.file_url as string | undefined | null;
    const fileCompletionUrl = item.file_completion_url as
      | string
      | undefined
      | null;

    if (fileUrl || fileCompletionUrl) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Photos", margin, currentY);
      currentY += 6;

      const addPhoto = async (
        url: string | undefined | null,
        label: string,
        x: number
      ) => {
        if (!url || url === "N/A") return;

        try {
          const imgData = await loadImage(url);
          if (imgData) {
            // Add photo with border
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            doc.rect(x, currentY, photoWidth, photoHeight);
            doc.addImage(imgData, "JPEG", x, currentY, photoWidth, photoHeight);

            // Add label
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(label, x, currentY - 2);
          }
        } catch (error) {
          console.error(`Error adding ${label}:`, error);
        }
      };

      // Add photos side by side
      await addPhoto(fileUrl, "Request Photo", margin);
      await addPhoto(
        fileCompletionUrl,
        "Completion Photo",
        margin + photoWidth + 10
      );
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
