"use client";


// /components/ExportButton.js
import { exportToExcel } from "../utils/exportToExcel";

// Button component to trigger Excel export
export default function ExportButton() {
return (
    <button
        onClick={exportToExcel}
        className="cursor-pointer bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 px-4 py-2 font-semibold shadow"
    >
        Export Updates to Excel
    </button>
);
}
