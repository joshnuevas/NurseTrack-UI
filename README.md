# NurseTrack UI

NurseTrack is a static front-end prototype for a role-based clinical tracking and scheduling system for nursing education. The app models how nursing students, clinical instructors, chairs/coordinators, assistants, enrollment staff, and system administrators interact while managing duty schedules, attendance, duty hours, clinical cases, validations, reports, appeals, clearance, and system access.

This repository does not contain a backend or database. Workflow state is simulated in the browser through hardcoded sample data, query parameters, `sessionStorage`, and `localStorage`. Because of that, diagrams for this project should describe the intended system behavior shown by the screens and scripts, not server-side tables or APIs.

## How To Preview

Open `index.html` in a browser.

The login flow is handled by `scripts/auth.js` and uses mock accounts:

| Role                | Email / ID                             | Password        | Destination                                     |
| ------------------- | -------------------------------------- | --------------- | ----------------------------------------------- |
| Nursing Student     | `maria.cruz@cit.edu` / `12-3456-789`   | `NurseTrack123` | `nursing-student/student-dashboard.html`        |
| Clinical Instructor | `reyes@cit.edu` / `CI-1002`            | `NurseTrack123` | `clinical-instructor/instructor-dashboard.html` |
| Chair               | `chair.reyes@cit.edu` / `CH-1001`      | `NurseTrack123` | `admin-manager/admin-dashboard.html`            |
| System Admin        | `admin.santos@cit.edu` / `AD-1001`     | `NurseTrack123` | `admin/admin-dashboard.html`                    |
| Coordinator         | `coordinator.lim@cit.edu` / `CO-1001`  | `NurseTrack123` | `admin-manager/coordinator-dashboard.html`      |
| Enrollment Team     | `enrollment.team@cit.edu` / `EN-1001`  | `NurseTrack123` | `admin-manager/chair-student-progress.html`     |
| Assistant           | `assistant.garcia@cit.edu` / `AS-1001` | `NurseTrack123` | `admin-manager/assistant-dashboard.html`        |

## Project Structure

| Path                                                                         | Purpose                                                                                                                                                         |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`, `register.html`, `forgot-password.html`, `reset-password.html` | Authentication and account access pages                                                                                                                         |
| `nursing-student/`                                                           | Student dashboard, schedules, duty records, clinical cases, progress, reports, alerts, appeals, and clearance submission                                        |
| `clinical-instructor/`                                                       | Instructor dashboard, rosters, schedules, attendance, validation queues, case review, student progress, appeals, reports, and notifications                     |
| `admin-manager/`                                                             | Chair/coordinator/assistant workspaces for scheduling, reports, progress oversight, clearance, appeals, manual attendance review, overtime, and case validation |
| `admin/`                                                                     | System administration pages for users, roles, assistant access, sections, enrollment archive, hospitals/duty areas, audit logs, and notifications               |
| `scripts/`                                                                   | Page-level UI logic, validation, filtering, mock workflow state, and local/session storage behavior                                                             |
| `styles/nursetrack.css`                                                      | Shared styling and layout system                                                                                                                                |
| `assets/`                                                                    | Static visual assets                                                                                                                                            |

## Main Actors

Use these actors in use case and activity diagrams:

| Actor                | System role                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nursing Student      | Records duty hours, submits clinical cases, views schedules/progress, submits appeals, submits clearance when opened                                 |
| Clinical Instructor  | Reviews student duty/case submissions, manages attendance, monitors assigned students, recommends or rejects student appeals                         |
| Chair / Coordinator  | Creates schedules, reviews reports, monitors compliance, handles clearance, extension days, overtime, manual attendance review, and appeal decisions |
| Assistant            | Limited support role with view access by default and optional edit permissions configured by Admin                                                   |
| Enrollment Team      | Progress/enrollment-oriented oversight role routed into the admin-manager area                                                                       |
| System Administrator | Manages accounts, roles, assistant/coordinator access, section import, hospitals/duty areas, enrollment archive, audit logs, and admin notifications |
| NurseTrack System    | Validates inputs, stores simulated state, updates statuses, routes users, refreshes dashboards, and records notification/audit-style feedback        |

## Feature / Package Grouping

Use this section as the main guide for separating use case diagrams and activity diagrams. Each package below can become one use case cluster and one or more activity diagrams.

### 1. Authentication and Account Access

Relevant pages and scripts:

- `index.html`
- `register.html`
- `forgot-password.html`
- `reset-password.html`
- `scripts/auth.js`
- `scripts/register.js`
- `scripts/forgot-password.js`
- `scripts/reset-password.js`
- `scripts/password-toggle.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- Chair / Coordinator
- Assistant
- Enrollment Team
- System Administrator
- NurseTrack System

Implemented behavior:

- User enters email/ID and password.
- System validates required fields and minimum password length.
- System compares credentials with mock accounts.
- System stores `nursetrackRole` in `sessionStorage`.
- System routes the user to the correct role workspace.
- Forgot password, reset password, and registration are represented as separate access pages.

Suggested use cases:

- Log In
- Register Account
- Forgot Password
- Reset Password
- Route User by Role
- Show Login Error

Suggested activity diagram:

- Swimlanes: User, NurseTrack System, Role Workspace
- Main flow: Open login page -> enter credentials -> validate inputs -> identify role -> route to dashboard
- Alternate flows: missing fields, invalid password length, account not found

### 2. Student Duty Hours Tracking and Verification

Relevant pages and scripts:

- `nursing-student/record-duty-hours.html`
- `nursing-student/duty-verification.html`
- `nursing-student/duty-progress.html`
- `nursing-student/duty-detail.html`
- `nursing-student/student-pending-items.html`
- `scripts/record-duty-hours.js`
- `scripts/duty-verification.js`
- `scripts/duty-progress.js`
- `scripts/duty-detail.js`
- `scripts/pending-requirements.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- NurseTrack System

Implemented behavior:

- Student records duty date, site, duty area, clinical instructor, time in, and time out.
- System calculates total duty hours from time in and time out.
- System checks required fields.
- System validates that the duty record follows the assigned 7:00 AM to 3:00 PM schedule window, with configured grace periods.
- System identifies late submissions.
- Valid duty entries redirect to duty verification.
- Duty progress and pending item pages show the student's completion state.

Suggested use cases:

- Record Duty Hours
- Save Duty Draft
- Submit Duty Hours
- Verify Duty Submission
- View Duty Progress
- View Duty Detail
- Correct Duty Record

Suggested activity diagram:

- Swimlanes: Nursing Student, NurseTrack System, Clinical Instructor
- Main flow: Open assigned schedule -> record duty hours -> calculate hours -> validate schedule window -> submit -> verify -> mark pending -> instructor reviews -> approve or return
- Alternate flows: incomplete form, invalid time range, outside schedule window, late duty record, returned correction loop

### 3. Clinical Case and Procedure Checklist

Relevant pages and scripts:

- `nursing-student/add-clinical-case.html`
- `nursing-student/checklist-form.html`
- `nursing-student/case-history.html`
- `nursing-student/case-detail.html`
- `nursing-student/edit-case.html`
- `clinical-instructor/clinical-case-selection.html`
- `clinical-instructor/case-validation.html`
- `admin-manager/clinical-case-selection.html`
- `admin-manager/case-validation.html`
- `scripts/add-clinical-case.js`
- `scripts/checklist-form.js`
- `scripts/case-history.js`
- `scripts/case-detail.js`
- `scripts/edit-case.js`
- `scripts/clinical-instructor-data.js`
- `scripts/clinical-case-selection.js`
- `scripts/case-validation.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- Chair / Coordinator
- Assistant
- NurseTrack System

Implemented behavior:

- Student submits clinical case details such as case date, shift time, patient identifier, category, procedure, hospital, supervising CI, duty area, submitted date/time, and reflection.
- System requires all important case fields before submission.
- Student can save a clinical case draft.
- Case history and detail pages display case status.
- Instructor and chair-side validation pages use shared case data and support approve/reject decisions.
- Rejection requires a comment.
- Chair/admin-manager case validation can become read-only for assistant/coordinator roles unless access is enabled.

Suggested use cases:

- Add Clinical Case
- Save Case Draft
- Complete Checklist
- View Case History
- Edit Case
- Review Clinical Case
- Approve Case
- Reject Case with Comment
- View Case Validation History

Suggested activity diagram:

- Swimlanes: Nursing Student, NurseTrack System, Clinical Instructor, Chair/Coordinator
- Main flow: Student submits case -> system validates required fields -> case enters pending queue -> reviewer opens case -> approve or reject -> system updates status -> student views result
- Alternate flows: save draft, missing fields, rejected case requiring correction, read-only assistant/coordinator review

### 4. Scheduling and Roster Management

Relevant pages and scripts:

- `nursing-student/view-schedule.html`
- `nursing-student/schedule-details.html`
- `nursing-student/assigned-roster.html`
- `clinical-instructor/schedule-management.html`
- `clinical-instructor/assigned-roster.html`
- `admin-manager/admin-schedules.html`
- `admin-manager/schedule-maker.html`
- `admin-manager/manual-schedule.html`
- `admin-manager/selected-schedule.html`
- `scripts/schedule-management.js`
- `scripts/schedule-details.js`
- `scripts/assigned-roster.js`
- `scripts/chair-schedules.js`
- `scripts/chair-schedule-maker.js`
- `scripts/chair-manual-schedule.js`
- `scripts/selected-schedule.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- Chair / Coordinator
- NurseTrack System

Implemented behavior:

- Chair/coordinator schedule pages support imported schedule drafts, manual schedule creation, date ranges, break dates, roster viewing, roster editing, and publishing-style actions.
- Schedule maker validates date ranges and break dates.
- Roster tools show assigned students by group.
- Students view assigned schedules, schedule details, and assigned rosters.
- Instructors view schedules and rosters for assigned duty groups.

Suggested use cases:

- Create Schedule
- Import Schedule Draft
- Edit Schedule Dates
- Add Break Date
- Assign Students to Roster
- Publish Schedule
- View Assigned Schedule
- View Assigned Roster

Suggested activity diagram:

- Swimlanes: Chair/Coordinator, NurseTrack System, Clinical Instructor, Nursing Student
- Main flow: Create/import schedule -> validate dates and roster -> adjust roster -> publish schedule -> notify/view by instructor and students
- Alternate flows: invalid date range, break date outside schedule range, roster adjustment, manual schedule creation

### 5. Attendance and Manual Backup

Relevant pages and scripts:

- `bluetooth-attendance.html`
- `clinical-instructor/live-attendance-tracker.html`
- `clinical-instructor/manual-attendance.html`
- `admin-manager/live-attendance-tracker.html`
- `admin-manager/manual-attendance-review.html`
- `scripts/live-attendance-tracker.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- Chair / Coordinator
- Assistant
- System Administrator
- NurseTrack System

Implemented behavior:

- Live attendance tracker filters connected student attendance by site, area, and search query.
- System calculates connected time and marks overtime when connected minutes exceed the overtime threshold.
- Manual attendance backup lets a CI encode attendance records when live scanning is unavailable.
- Manual records are saved in `localStorage` under `nursetrack-manual-attendance-submissions`.
- Chair/admin-manager review pages list pending manual attendance submissions by CI.
- Reviewers can approve or return manual attendance records.
- Assistant/coordinator decision controls depend on local access flags.

Suggested use cases:

- Start Live Attendance
- Detect Connected Students
- Filter Attendance by Site/Area
- Encode Manual Attendance
- Submit Manual Attendance for Review
- Review Manual Attendance
- Approve Manual Attendance
- Return Manual Attendance
- Track Overtime

Suggested activity diagram:

- Swimlanes: Clinical Instructor, NurseTrack System, Chair/Coordinator, Nursing Student
- Main flow: Start attendance -> detect/encode attendance -> save record -> review if manual backup -> approve/return -> update duty evidence
- Alternate flows: scanner unavailable, manual backup submission, returned manual record, overtime detection, limited assistant access

### 6. Progress Monitoring, Notifications, Alerts, and Reports

Relevant pages and scripts:

- `nursing-student/student-dashboard.html`
- `nursing-student/student-progress.html`
- `nursing-student/duty-progress.html`
- `nursing-student/student-reports.html`
- `nursing-student/notifications.html`
- `nursing-student/alerts.html`
- `clinical-instructor/instructor-dashboard.html`
- `clinical-instructor/instructor-student-view.html`
- `clinical-instructor/student-progress-detail.html`
- `clinical-instructor/instructor-reports.html`
- `admin-manager/chair-student-progress.html`
- `admin-manager/student-progress-detail.html`
- `admin-manager/generate-report.html`
- `admin-manager/admin-notifications.html`
- `admin/admin-notifications.html`
- `scripts/student-dashboard.js`
- `scripts/student-own-progress.js`
- `scripts/student-progress.js`
- `scripts/student-progress-detail.js`
- `scripts/instructor-dashboard.js`
- `scripts/instructor-student-view.js`
- `scripts/chair-student-progress.js`
- `scripts/generate-report.js`
- `scripts/student-reports.js`
- `scripts/notifications.js`
- `scripts/alerts.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- Chair / Coordinator
- System Administrator
- NurseTrack System

Implemented behavior:

- Student dashboards show progress, pending items, alerts, notifications, and report generation for the student's own account.
- Instructor views student progress and validation-related status.
- Chair/coordinator views broader progress lists and generates reports by person, section, site, or group.
- Report generation validates that a valid target is selected.
- Notification and alert pages provide status filtering and acknowledgement behavior.

Suggested use cases:

- View Dashboard
- View Progress Summary
- View Student Progress Detail
- Filter Progress Records
- Generate Student Report
- Generate General Report
- Export Report
- View Notifications
- Acknowledge Alerts

Suggested activity diagram:

- Swimlanes: Nursing Student, Clinical Instructor, Chair/Coordinator, NurseTrack System
- Main flow: System aggregates duty/case/schedule/status data -> actor opens dashboard/progress/report page -> actor filters or selects target -> system validates and displays summary/report
- Alternate flows: missing report target, no matching records, alerts acknowledged

### 7. Appeals, Extension Days, Overtime, and Clearance

Relevant pages and scripts:

- `nursing-student/student-appeals.html`
- `nursing-student/case-history.html`
- `clinical-instructor/student-appeals.html`
- `clinical-instructor/extension-days.html`
- `clinical-instructor/extension-day-detail.html`
- `admin-manager/student-appeals.html`
- `admin-manager/extension-days.html`
- `admin-manager/extension-day-view.html`
- `admin-manager/extension-day-detail.html`
- `admin-manager/overtime-rendered.html`
- `admin-manager/overtime-details.html`
- `admin-manager/student-clearance.html`
- `admin-manager/student-clearance-detail.html`
- `scripts/student-appeal-submit.js`
- `scripts/student-appeals.js`
- `scripts/chair-student-appeals.js`
- `scripts/extension-days.js`
- `scripts/overtime-rendered.js`
- `scripts/overtime-details.js`
- `scripts/student-clearance.js`
- `scripts/chair-clearance.js`

Primary actors:

- Nursing Student
- Clinical Instructor
- Chair / Coordinator
- Assistant
- NurseTrack System

Implemented behavior:

- Student appeal form supports attendance, schedule, and clinical case appeal types.
- Student can submit and edit a pending appeal.
- Instructor appeal queue supports filtering, selecting, accepting/recommending, and rejecting appeals.
- Chair appeal queue focuses on CI-recommended appeals and final action.
- Extension day and overtime pages separate extra-duty/exception tracking from normal duty hours.
- Chair can open or lock clearance submissions through a local access flag.
- Student clearance submission is allowed only when the chair opens clearance.
- Chair can approve clearance, and student can print only after approval.
- Clearance records use `localStorage` under `nursetrack-clearance-records`.

Suggested use cases:

- Submit Appeal
- Edit Pending Appeal
- Review Student Appeal
- Recommend Appeal to Chair
- Reject Appeal
- Review Extension Day
- Review Overtime
- Open Clearance Submission
- Submit Clearance Request
- Approve Clearance
- Print Clearance

Suggested activity diagram:

- Swimlanes: Nursing Student, Clinical Instructor, Chair/Coordinator, NurseTrack System
- Main flow: Student submits exception request -> system validates and stores pending request -> CI reviews/recommends when needed -> chair approves/rejects -> system updates status -> student views result
- Alternate flows: incomplete request, rejected appeal, returned appeal, clearance locked, print blocked before approval

### 8. Admin User, Role, Access, and System Configuration

Relevant pages and scripts:

- `admin/admin-dashboard.html`
- `admin/manage-users.html`
- `admin/role-assignment.html`
- `admin/assistant-access.html`
- `admin/section-import.html`
- `admin/enrollment-archive.html`
- `admin/hospital-duty-area.html`
- `admin/audit-logs.html`
- `admin/admin-notifications.html`
- `scripts/admin-dashboard.js`
- `scripts/user-management.js`
- `scripts/role-assignment.js`
- `scripts/assistant-access.js`
- `scripts/admin-section-import.js`
- `scripts/enrollment-archive.js`
- `scripts/admin-location-settings.js`
- `scripts/admin-audit-logs.js`

Primary actors:

- System Administrator
- Assistant
- Coordinator
- Clinical Instructor
- Nursing Student
- NurseTrack System

Implemented behavior:

- Admin dashboard supports pending account approval/denial style interactions.
- Manage users supports filtering by role/status/search, creating pending accounts, approving/rejecting pending accounts, editing user details, changing roles, and suspending/restoring accounts.
- Role assignment is separated as its own page.
- Assistant access config toggles module-level edit permissions for assistant/coordinator roles and level-view assignments.
- Section import previews uploaded section data and marks import readiness.
- Hospital/duty area settings add hospitals and duty areas.
- Enrollment archive and audit logs support administrative oversight.

Suggested use cases:

- Manage Users
- Create User Account
- Approve Pending Account
- Reject Pending Account
- Edit User
- Assign Role
- Configure Assistant Access
- Import Sections
- Archive Enrollment
- Configure Hospital
- Configure Duty Area
- View Audit Logs

Suggested activity diagram:

- Swimlanes: System Administrator, NurseTrack System, Affected User Role
- Main flow: Admin selects configuration task -> system validates input -> account/configuration/access is updated -> affected dashboards or permissions reflect the change -> audit/log/notification state updates
- Alternate flows: invalid form data, pending approval denied, assistant/coordinator access disabled, section import preview before save

## Use Case Diagram Guidelines

Use case diagrams should show what each actor can do, not every screen.

Recommended system boundary:

- Name the boundary `NurseTrack`.
- Place actors outside the boundary.
- Place use cases inside the boundary.
- Group use cases visually by the feature packages above.

Recommended actors:

- `Nursing Student`
- `Clinical Instructor`
- `Chair / Coordinator`
- `Assistant`
- `Enrollment Team`
- `System Administrator`
- Optional secondary actor: `Browser Storage` if you want to show that prototype state is simulated through browser storage. For formal diagrams, keep it as an internal system detail instead.

Good use case grouping:

- Authentication and Account Access
- Duty Hours Tracking and Verification
- Clinical Case and Checklist
- Scheduling and Roster Management
- Attendance and Manual Backup
- Progress Monitoring and Reporting
- Appeals, Extension Days, Overtime, and Clearance
- Admin User and System Management

Suggested include relationships:

- `Log In` includes `Validate Credentials`
- `Record Duty Hours` includes `Calculate Duty Hours`
- `Record Duty Hours` includes `Check Assigned Schedule Window`
- `Submit Clinical Case` includes `Validate Required Case Fields`
- `Review Clinical Case` includes `View Case Details`
- `Generate Report` includes `Select Report Target`
- `Approve Clearance` includes `Review Student Case History`
- `Manage Users` includes `Filter User List`

Suggested extend relationships:

- `Save Duty Draft` extends `Record Duty Hours`
- `Submit Appeal` extends `View Progress / Pending Items`
- `Export Report` extends `Generate Report`
- `Manual Attendance Backup` extends `Record Attendance`
- `Print Clearance` extends `View Clearance Status`
- `Edit Reviewed Case Decision` extends `Review Clinical Case`

Suggested package-level use case diagrams:

1. Authentication and Account Access: all actors connect to `Log In`; student connects to `Register`; system admin connects to account management.
2. Student Submission Package: student connects to duty and case submission use cases; CI connects to review and validation use cases.
3. Scheduling and Attendance Package: chair/coordinator creates schedules; CI manages rosters and attendance; student views schedule and attendance status.
4. Monitoring and Exceptions Package: student views progress and submits appeals/clearance; CI recommends; chair/coordinator finalizes; system updates status.
5. Administration Package: admin manages users, roles, access, sections, locations, archives, and audit logs.

## Activity Diagram Guidelines

Activity diagrams should show flow, decisions, loops, and actor handoffs. For this project, do not try to place every feature in one giant activity diagram. Use one activity diagram per feature package.

Recommended swimlanes:

- `Nursing Student`
- `Clinical Instructor`
- `Chair / Coordinator`
- `Assistant` only when the package involves delegated access
- `System Administrator` only for admin packages
- `NurseTrack System`

Recommended activity diagram rules:

- Put form entry and human decisions in the actor swimlane.
- Put validation, status changes, storage, routing, notifications, and dashboard refreshes in the `NurseTrack System` swimlane.
- Show decisions as diamonds: valid credentials, complete form, within schedule, approve/reject, report target selected, clearance opened, access enabled.
- Show correction loops for rejected duty records, rejected cases, returned manual attendance, and rejected/returned appeals.
- Show role-based routing only in the authentication diagram, not in every diagram.
- Keep each diagram focused on one package. If a flow crosses packages, end with a handoff such as `Update progress summary` or `Notify reviewer`.

Recommended activity diagrams to create:

| Diagram                | Swimlanes                                                          | Core flow                                                                                   |
| ---------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Authentication Flow    | User, NurseTrack System, Role Workspace                            | Login -> validate -> identify role -> route to dashboard                                    |
| Duty Hours Flow        | Student, NurseTrack System, Clinical Instructor                    | Record duty -> validate schedule/time -> verify -> pending -> approve/return                |
| Clinical Case Flow     | Student, NurseTrack System, Clinical Instructor, Chair/Coordinator | Submit case -> validate -> review -> approve/reject -> update history                       |
| Schedule/Roster Flow   | Chair/Coordinator, NurseTrack System, Clinical Instructor, Student | Create/import schedule -> validate -> edit roster -> publish -> view                        |
| Attendance Flow        | Clinical Instructor, NurseTrack System, Chair/Coordinator, Student | Live/manual attendance -> save -> review if manual -> approve/return -> student sees status |
| Reporting Flow         | Student, Clinical Instructor, Chair/Coordinator, NurseTrack System | View progress -> select report scope -> validate target -> generate/export                  |
| Appeals/Clearance Flow | Student, NurseTrack System, Clinical Instructor, Chair/Coordinator | Submit request -> CI recommendation if needed -> chair decision -> notify student           |
| Admin Management Flow  | System Administrator, NurseTrack System, Affected User             | Create/edit/approve/configure -> validate -> update access/data -> audit                    |

## Practical Diagram Boundaries

For the clearest school deliverables:

- Use one main use case diagram for the full system.
- Use separate package-level use case diagrams if the main diagram becomes crowded.
- Use at least four activity diagrams: Authentication, Duty Hours, Clinical Case Validation, and Scheduling/Attendance.
- Add Appeals/Clearance and Admin Management diagrams if you need complete coverage of all implemented modules.
- Avoid putting static pages like `About`, `View Profile`, or `Notifications` at the center unless the diagram is specifically about account/profile/notification behavior.

## Implementation Notes That Matter For Diagrams

- The app is currently a front-end prototype, so "save", "approve", and "notify" actions are represented by UI state, messages, query parameters, `sessionStorage`, or `localStorage`.
- `sessionStorage` key `nursetrackRole` controls role-aware page behavior after login.
- `localStorage` keys are used for simulated shared workflow state, including assistant access, manual attendance submissions, appeal overrides, and clearance records.
- Clinical case validation is shared by instructor and admin-manager pages through `scripts/case-validation.js`.
- Manual attendance entry and review are both handled in `scripts/live-attendance-tracker.js`, with behavior changing based on the current page path.
- Clearance has student-side behavior in `scripts/student-clearance.js` and chair-side behavior in `scripts/chair-clearance.js`.
- Assistant/coordinator edit permissions are configured through `scripts/assistant-access.js` and checked by validation/review scripts.
