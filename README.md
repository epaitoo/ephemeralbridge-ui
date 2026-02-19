# EphemeralBridge UI

A clean, modern frontend for EphemeralBridge - your personal file and text sharing service.

## Features

- **Files**: Upload, download, and manage files with drag-and-drop support
- **Texts**: Create, edit, copy, and manage text snippets
- **Toast notifications**: Visual feedback for all API operations
- **Responsive design**: Works on desktop and tablet

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Sonner** for toast notifications
- **React Router** for navigation
- **React Dropzone** for file uploads

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Development

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Update `VITE_API_URL` in `.env` to point to your API:

```
VITE_API_URL=https://yourapi.com
```

4. Start the development server:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deployment to Cloudflare Pages

### Option 1: Connect GitHub Repository

1. Push this code to a GitHub repository
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Create a new project and connect your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL` = `https://yourapi.com`
6. Deploy!

### Option 2: Direct Upload

1. Build the project:

```bash
npm run build
```

2. Go to Cloudflare Pages dashboard
3. Create a new project with "Direct Upload"
4. Upload the `dist` folder

## Project Structure

```
src/
├── components/
│   ├── DeleteConfirmModal.jsx   # Confirmation dialog for deletions
│   ├── EmptyState.jsx           # Empty state placeholder
│   ├── Layout.jsx               # Main layout with sidebar
│   ├── Modal.jsx                # Reusable modal component
│   ├── Sidebar.jsx              # Navigation sidebar
│   ├── TextModal.jsx            # Create/edit text modal
│   └── UploadModal.jsx          # File upload modal with dropzone
├── pages/
│   ├── FilesPage.jsx            # Files list and management
│   └── TextsPage.jsx            # Texts list and management
├── services/
│   └── api.js                   # API client
├── App.jsx                      # Main app with routing
├── index.css                    # Global styles and Tailwind config
└── main.jsx                     # Entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://yourapi.com` |

## Authentication

The frontend relies on Cloudflare Access for authentication:

1. User visits the site
2. Cloudflare Access shows login page (One-time PIN)
3. After login, Cloudflare sets a session cookie
4. All API requests include cookies automatically
5. Backend verifies the Cloudflare JWT

No login page needed in the frontend!

## License

MIT
