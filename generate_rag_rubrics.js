const XLSX = require('xlsx');

const wbTrack = XLSX.utils.book_new();

// Instructions
const wsInstructions = XLSX.utils.aoa_to_sheet([
  ["RUBRIC IMPORT INSTRUCTIONS"],
  ["--------------------------"],
  ["1. DO NOT change the column headers in the 'Template' sheet."],
  ["2. * indicates a REQUIRED field."],
  ["3. 'Max Score' and 'Weight' must be positive numbers."],
  ["4. 'Rubric Name' must be unique within the same Round/Track."],
  ["5. 'Track*' must exactly match one of your configured tracks on the UI."],
]);
XLSX.utils.book_append_sheet(wbTrack, wsInstructions, "Instructions");

// Template Data
const wsTrack = XLSX.utils.aoa_to_sheet([
  ["Track*", "Rubric Name*", "Description", "Max Score*", "Weight*"],
  ["Thay_Tên_Track_Vào_Đây", "RAG Architecture Design", "Evaluate the overall architecture of the Retrieval-Augmented Generation pipeline. Assess vector DB choice, embedding models, and chunking strategy.", 20, 2],
  ["Thay_Tên_Track_Vào_Đây", "Retrieval Accuracy", "Measure the precision and recall of the retrieved documents against a standard set of queries.", 25, 3],
  ["Thay_Tên_Track_Vào_Đây", "Generation Quality & Hallucination", "Evaluate the LLM's response quality. Does it answer the prompt accurately based ONLY on retrieved context without hallucinating?", 25, 3],
  ["Thay_Tên_Track_Vào_Đây", "System Latency & Performance", "Check the end-to-end response time of the RAG system under load.", 15, 1.5],
  ["Thay_Tên_Track_Vào_Đây", "UI/UX Integration", "How user-friendly is the frontend interface for interacting with the AI?", 10, 1],
  ["Thay_Tên_Track_Vào_Đây", "Prompt Engineering", "Assess the quality, security, and context-window optimization of the prompts sent to the LLM.", 15, 1.5],
  ["Thay_Tên_Track_Vào_Đây", "Data Processing Pipeline", "Evaluate how well the system extracts, cleans, and ingests source documents (PDFs, URLs, etc) into the vector database.", 20, 2]
]);

// Auto-size columns slightly
wsTrack["!cols"] = [
    { wch: 25 },
    { wch: 35 },
    { wch: 80 },
    { wch: 15 },
    { wch: 15 }
];

XLSX.utils.book_append_sheet(wbTrack, wsTrack, "Template");
XLSX.writeFile(wbTrack, '../Building_Rag_AI_Automation_Semi_final_Rubrics_Template_With_Track.xlsx');

console.log("RAG Sample Excel file (with Track column) created successfully!");
