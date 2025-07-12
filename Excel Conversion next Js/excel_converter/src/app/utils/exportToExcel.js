import * as XLSX from "xlsx";
import { fetchData } from "../lib/fetchData";

export async function exportToExcel(){
    const firebaseData = await  fetchData();

    const allFieldSet = new Set();
    Object.values(firebaseData).forEach(doc=>{
        Object.keys(doc.updates).forEach(field=>{
            allFieldSet.add(field)
        })
    });
    const allFields= Array.from(allFieldSet);

      const excelData = [
    ["Document ID", ...allFields],
    ...Object.entries(firebaseData).map(([docId, doc]) => [
      docId,
      ...allFields.map(field => doc.updates[field] || "")
    ])
  ];

const worksheet = XLSX.utils.aoa_to_sheet(excelData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Updates");

 XLSX.writeFile(workbook, "firebase-updates-backup.xlsx");
}