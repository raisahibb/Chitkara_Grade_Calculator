# Chitkara Grade Calculator - Project Handbook

## Overview
This document outlines the development journey of the Chitkara Grade Calculator. The project is a beautifully designed, premium web application tailored for students to track their academic performance by calculating their Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) accurately based on Chitkara University's grading scheme.

## Tech Stack & Architecture
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS integrated with custom CSS variables for a premium Glassmorphism aesthetic.
- **Animations:** Framer Motion (`motion/react`) for fluid UI transitions, dynamic progress rings, and layout animations.
- **Icons:** Lucide React for consistent and modern iconography.

## Development Phases

### 1. Project Initialization & Tooling
- Scaffolded the project using Vite with the React + TypeScript template.
- Installed essential dependencies including Tailwind CSS, Framer Motion, and Lucide React.
- Configured ESLint, TypeScript, and PostCSS for robust development and precise styling.

### 2. UI/UX Design System
- **Glassmorphism Aesthetic:** Implemented a dark-themed UI featuring semi-transparent cards, subtle background orbs, and glowing hover effects.
- **Responsive Layouts:** Ensured the calculator looks stunning and functions perfectly across both desktop and mobile devices.
- **Progress Visualizations:** Built custom SVG-based circular progress rings (`<ProgressRing />`) to dynamically display SGPA and CGPA scores with animated fill effects.

### 3. Core Calculation Engine
Implemented the precise grading logic required by the university:
- **Grade Mapping:** Programmed the conversion of numerical scores to letter grades (O, A+, A, B+, B, C, P, F) and their corresponding grade points (10 to 0).
- **Subject-Specific Assessment Logic:** Created specialized calculation pathways for different subject types, correctly weighting internal and external assessments:
  - `standard` (FA, ST, End Term)
  - `numerical_aptitude` (FA, ST, End Term)
  - `art_communication` / `business_communication` (CA1, CA2)
  - `programming_abstractions` (ST, End Term)
  - `backend_eng` (Abstract, Mid-Term, End Term)
  - `applied_ai` (FA1, FA2, End Term)
- **SGPA & CGPA Computation:** Engineered the logic to aggregate subject scores, apply credit weights, and accurately compute the final GPA metrics.

### 4. Interactive Components & Features
- **Dynamic Subject Forms:** Developed forms that adapt their input fields based on the selected subject type, ensuring users only see relevant fields.
- **Input Validation:** Implemented a robust `clampVal` helper to strictly enforce maximum mark limits, preventing invalid data entry and accidental mouse-scroll changes.
- **Tooltips:** Added informative tooltips indicating the weightage percentage for each evaluation component.
- **Dual Past Semester Modes:** Allowed users to input past performance either via a quick overall CGPA entry or detailed semester-wise SGPA entries.

### 5. Local Data Persistence
- Developed a custom `useLocalStorage` React hook to securely save users' entered grades, subject configurations, and past semester data directly in their browser.
- Ensured seamless data persistence across page reloads.

### 6. Polish & Optimization
- Refined micro-interactions using Framer Motion (`AnimatePresence` for smooth mounting/unmounting of elements).
- Structured the application for high maintainability and fluid state management using React hooks.
- Finalized production builds with Vite for optimal performance and fast load times.

## Conclusion
The Chitkara Grade Calculator stands as a robust, visually striking tool that simplifies academic tracking. By focusing on a highly responsive, premium user interface and precise grading algorithms, it provides an unmatched experience for students managing their academic goals.
