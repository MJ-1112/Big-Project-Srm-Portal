// /pages/index.js
import ExportButton from "./components/ExportButton";
import './styles/globals.css'

// Main page with export button
export default function Home() {
  return (
    <div className="flex  bg-blue-100 flex-col items-center justify-center gap-5 h-screen w-screen">
      <h1 className="bg-blue-200 w-100 h-20 font-medium text-white text-3xl flex items-center justify-center">Firebase To Excel Conveter</h1>
      <p>
        Click the button below to export all document updates from Firebase to Excel.
      </p>
      <ExportButton  />
    </div>
  );
}
