import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {BloodUnit} from "@/app/models/bloodUnit";

export const exportToCSV = (data : BloodUnit, filename = "Inventory.csv") => {
    const flatData = flattenData(data);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
};

export const exportToExcel = (data : BloodUnit, filename = "Inventory.xlsx") => {
    const flatData = flattenData(data);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
};

export const exportToPDF = (data : BloodUnit, filename = "Inventory.pdf") => {
    const flatData = flattenData(data);
    const doc = new jsPDF();
    const headers = Object.keys(flatData[0]);
    const rows = flatData.map((obj: Record<string, any>) => headers.map((h: string) => obj[h]));
    autoTable(doc, {
        head: [headers],
        body: rows,
    });
    doc.save(filename);
};

// Utility function to flatten nested donor object
const flattenData = (data : BloodUnit) => {
    return data.content.map((item) => ({
        "Unit ID": item.unitId,
        "Donor Name": item.donor.fullName,
        "Blood Type": item.bloodType,
        "Collection Date": item.collectionDate,
        "Expiration Date": item.expirationDate,
        "Volume (ml)": item.volumeMl,
        "Component": item.componentType,
        "Storage": item.storageLocation,
        "Status": item.currentStatus,
        "Collection Center": item.collectionCenter,
    }));
};
