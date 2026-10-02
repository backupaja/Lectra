# LECTRA (Lecturer Budget System)

LECTRA is a modern web application designed for efficient budget management, monitoring, and analysis for university lecturers and faculty administrators.

## Features

- **Dashboard Penyerapan Anggaran:** Monitor budget utilization in real-time.
- **Manajemen Dosen:** Admins can oversee faculty budget allocations.
- **AI Assistant:** Integrated smart chatbot to query budget statuses and draft reports securely.
- **Secure Authentication:** Powered by Supabase Auth with Role-Level Security.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS v4
- **Backend/API:** Vercel Serverless Functions
- **Database & Auth:** Supabase (PostgreSQL)
- **AI Integration:** Google Gemini API

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation
1. Clone the repository
2. Run \`npm install\` to install dependencies
3. Set up your environment variables locally in \`.env.local\` (do not commit this file)

### Running Locally
Start the development server with:
\`\`\`bash
npm run dev
\`\`\`

## Security Notes
- API Keys (like \`GEMINI_API_KEY\`) are stored exclusively in the server environment.
- Access to administrative APIs requires a valid JWT with the \`admin\` role.
