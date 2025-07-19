# Focus Flow

A modern, feature-rich task management application built with Next.js and TypeScript. Streamline your productivity with an intuitive interface that combines powerful task organization with elegant design.

![Focus Flow](https://img.shields.io/badge/Next.js-14.1.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🎯 Drag & Drop Reordering** - Intuitively organize tasks with smooth drag-and-drop functionality
- **📅 Due Date Management** - Set and track due dates with calendar integration
- **🏷️ Priority Levels** - Mark tasks as High, Medium, Low, or No Priority
- **📂 Custom Categories** - Organize tasks with custom tags and categories
- **🔍 Advanced Filtering** - Filter by status, priority, due date, and search functionality
- **🌙 Theme Toggle** - Switch between dark and light themes
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **⚡ Real-time Notifications** - Get notified about overdue tasks
- **🎨 Modern UI** - Beautiful interface built with Tailwind CSS and Radix UI

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/focus-flow.git
   cd focus-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Drag & Drop:** DND Kit
- **Date Handling:** date-fns
- **Icons:** Lucide React
- **Theme:** next-themes

## 📖 Usage

### Adding Tasks
- Type your task in the input field
- Click the calendar icon to set a due date (optional)
- Click "Add" to create the task

### Managing Tasks
- **Complete:** Click the checkbox to mark as done
- **Edit:** Double-click the task text to edit
- **Reorder:** Drag the grip handle to reorder tasks
- **Delete:** Use the dropdown menu to delete tasks

### Filtering & Search
- **Search:** Click the search icon to find specific tasks
- **Filter:** Use the filter button to filter by status, priority, or due date
- **Categories:** Add custom tags to organize your tasks

### Priority Levels
- **High Priority:** Red indicator
- **Medium Priority:** Yellow indicator  
- **Low Priority:** Blue indicator
- **No Priority:** Gray indicator

## 🎨 Features in Detail

### Drag & Drop
Tasks can be reordered by dragging the grip handle on the left side of each task. The interface provides smooth animations and visual feedback during dragging.

### Due Date Management
- Set due dates using the built-in date picker
- View overdue tasks with visual indicators
- Filter tasks by due date (today, upcoming, overdue)

### Advanced Filtering
- **Status:** All, Active, Completed
- **Priority:** All, High, Medium, Low, None
- **Due Date:** All, Today, Upcoming, Overdue
- **Search:** Search through task text and categories

### Theme Support
Toggle between dark and light themes using the theme button in the header. The theme preference is saved and persists across sessions.

## 📱 Responsive Design

Focus Flow is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

The interface adapts seamlessly to different screen sizes while maintaining all functionality.

## 🔧 Development

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

### Project Structure

```
focus-flow/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Feature components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── ...
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [DND Kit](https://dndkit.com/) for drag and drop functionality
- [Lucide](https://lucide.dev/) for beautiful icons

---

**Made with ❤️ by [Your Name]**

Feel free to star this repository if you find it helpful! 