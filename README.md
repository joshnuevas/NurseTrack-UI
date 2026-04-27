# NurseTrack

NurseTrack is a responsive static website prototype for a clinical tracking and scheduling system for nursing students. It includes role-based page groups for Nursing Student, Clinical Instructor, and Admin / Manager views.

## Preview

Open `index.html` in a browser to start from the login page.

```text
index.html
```

Because this is a static prototype, no server or database setup is required.

## Project Structure

```text
.
|-- index.html
|-- register.html
|-- forgot-password.html
|-- reset-password.html
|-- global-layout.html
|-- nursing-student/
|-- clinical-instructor/
|-- admin-manager/
|-- assets/
|-- styles/
`-- scripts/
```

## Role Folders

### Nursing Student

Located in `nursing-student/`.

Includes pages for:

- Dashboard
- Profile
- Duty hours submission and history
- Clinical case logs
- Schedule viewing
- Progress tracking
- Reports
- Notifications
- About and Help

### Clinical Instructor

Located in `clinical-instructor/`.

Includes pages for:

- Dashboard
- Student selection for validation
- Review submissions
- Duty validation
- Case validation
- Scheduling
- Student progress monitoring
- Reports
- Notifications
- Help

### Admin / Manager

Located in `admin-manager/`.

Includes pages for:

- Dashboard
- User list and user management
- Role assignment
- Schedule oversight
- Validation overview
- Report generation
- Export pages
- Notifications
- Help

## Design System

- Font: Kumbh Sans
- Primary color: Maroon `#8A252C`
- Accent color: Gold `#FFCF01`
- Layout: Responsive card-based interface
- Branding: CIT-U logo used on authentication pages, sidebars, and topbars

## Main Workflow

```text
Authentication -> Data Entry -> Verification -> Validation -> Monitoring -> Reporting
```

## Notes

- This repository contains only the front-end prototype.
- Page interactions are handled with plain HTML, CSS, and JavaScript.
- Shared styles, scripts, and images are stored once at the root level.
- Role-specific HTML files are grouped into their own folders for easier navigation.
