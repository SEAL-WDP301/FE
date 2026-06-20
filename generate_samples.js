const XLSX = require('xlsx');

// 1. File WITH Track
const wbTrack = XLSX.utils.book_new();
const wsTrack = XLSX.utils.aoa_to_sheet([
  ["Track*", "Rubric Name*", "Description", "Max Score*", "Weight*"],
  // Track 1
  ["Web Development", "UI/UX Design", "Evaluate the overall user interface, visual hierarchy, aesthetics, and user experience flow of the web application.", 10, 2],
  ["Web Development", "Frontend Functionality", "Assess the implementation of core features, responsiveness, state management, and browser compatibility.", 20, 3],
  ["Web Development", "Code Quality & Structure", "Check for clean code practices, proper componentization, and naming conventions in the frontend codebase.", 10, 1.5],
  ["Web Development", "Performance & SEO", "Analyze the loading speed, Core Web Vitals, and basic search engine optimization practices applied.", 10, 1],
  ["Web Development", "Innovation & Creativity", "Determine the originality of the solution and creative approaches to problem-solving.", 10, 1],
  // Track 2
  ["Mobile Development", "Mobile UI/UX Design", "Evaluate the mobile app interface, touch target sizing, navigation patterns, and native feel.", 10, 2],
  ["Mobile Development", "App Functionality", "Assess offline capabilities, performance on low-end devices, and core feature completeness.", 20, 3],
  ["Mobile Development", "Architecture & Code", "Check the mobile architecture (e.g. MVVM, Clean Architecture) and state management effectiveness.", 10, 1.5],
  ["Mobile Development", "API Integration", "Review how the app communicates with the backend, handles errors, and manages data caching.", 10, 1],
  ["Mobile Development", "Device Features", "Analyze the usage of native device features like camera, GPS, or push notifications.", 10, 1],
]);
XLSX.utils.book_append_sheet(wbTrack, wsTrack, "Template");
XLSX.writeFile(wbTrack, '../Sample_Rubrics_With_Track.xlsx');

// 2. File WITHOUT Track
const wbNoTrack = XLSX.utils.book_new();
const wsNoTrack = XLSX.utils.aoa_to_sheet([
  ["Rubric Name*", "Description", "Max Score*", "Weight*"],
  ["Problem Statement & Impact", "Does the project solve a real-world problem? Evaluate the potential impact on the target audience.", 15, 2],
  ["Technical Complexity", "Assess the difficulty of the technical challenges overcome and the depth of the technologies used.", 20, 3],
  ["Implementation Quality", "Review the overall quality of the source code, bug-free execution, and system architecture.", 15, 2],
  ["Design & User Experience", "Evaluate the visual aesthetics, user journey, and accessibility of the final product.", 10, 1.5],
  ["Innovation & Originality", "How unique is the approach? Does it offer a novel solution compared to existing alternatives?", 10, 1],
  ["Business Viability", "Analyze the market potential, scalability, and monetization strategy (if applicable).", 10, 1],
  ["Presentation & Pitch", "Assess the clarity, confidence, and persuasiveness of the team's presentation.", 10, 1],
  ["Demo Quality", "Did the live demonstration work flawlessly? Was it well-rehearsed and compelling?", 10, 1],
  ["Team Collaboration", "Evaluate how well the team worked together and distributed tasks effectively.", 5, 0.5],
  ["Documentation & Readme", "Review the project setup instructions, API documentation, and code comments.", 5, 0.5],
]);
XLSX.utils.book_append_sheet(wbNoTrack, wsNoTrack, "Template");
XLSX.writeFile(wbNoTrack, '../Sample_Rubrics_No_Track.xlsx');

console.log("Sample Excel files created successfully!");
