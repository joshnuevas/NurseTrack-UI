(() => {
  const run = () => {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    const isAdmin = path.includes("/admin/");
    const isChair = path.includes("/admin-manager/");
    const isInstructor = path.includes("/clinical-instructor/");
    const isStudent = path.includes("/nursing-student/");
    const page = path.split("/").pop();
    const legacyAdminPages = new Set(["user-list-manage-users.html", "user-management.html", "role-assignment.html"]);

    const one = (selector) => document.querySelector(selector);
    const all = (selector) => Array.from(document.querySelectorAll(selector));

    const render = (markup) => {
      const template = document.createElement("template");
      template.innerHTML = markup.trim();
      return template.content.firstElementChild;
    };

    const chairNavItems = [
      { label: "Dashboard", href: "admin-dashboard.html", pages: ["admin-dashboard.html"] },
      { label: "Schedules", href: "admin-schedules.html", pages: ["admin-schedules.html", "schedule-maker.html", "selected-schedule.html", "create-schedule.html", "edit-schedule.html", "assign-duty.html", "schedule-report.html"] },
      { label: "Live Attendance", href: "live-attendance-tracker.html", pages: ["live-attendance-tracker.html"] },
      { label: "Student Progress", href: "chair-student-progress.html", pages: ["chair-student-progress.html", "student-progress-detail.html"] },
      { label: "Clinical Cases View", href: "clinical-cases-view.html", pages: ["clinical-cases-view.html", "clinical-case-selection.html", "case-validation.html"] },
      { label: "CI Recommendations", href: "student-appeals.html", pages: ["student-appeals.html"] },
      { label: "Overtime Details", href: "overtime-details.html", pages: ["overtime-details.html"] },
      { label: "Reports", href: "generate-report.html", pages: ["generate-report.html", "case-report.html", "duty-report.html", "export-page.html"] }
    ];

    const adminNavItems = [
      { label: "Dashboard", href: "admin-dashboard.html", pages: ["admin-dashboard.html"] },
      { label: "Manage Users", href: "manage-users.html", pages: ["manage-users.html"] },
      { label: "Role Assignment", href: "role-assignment.html", pages: ["role-assignment.html"] },
      { label: "Enrollment Summary / Archive", href: "enrollment-archive.html", pages: ["enrollment-archive.html"] }
    ];

    const instructorNavItems = [
      { label: "Dashboard", href: "instructor-dashboard.html", pages: ["instructor-dashboard.html"] },
      { label: "Assigned Schedules", href: "schedule-management.html", pages: ["schedule-management.html", "assigned-roster.html", "create-schedule.html", "edit-schedule.html", "assign-duty.html"] },
      { label: "Live Attendance", href: "live-attendance-tracker.html", pages: ["live-attendance-tracker.html"] },
      { label: "Clinical Cases Review", href: "select-validation-user.html", pages: ["select-validation-user.html", "clinical-case-selection.html", "case-validation.html", "validation-history.html"] },
      { label: "Student Progress", href: "instructor-student-view.html", pages: ["instructor-student-view.html", "student-progress-detail.html", "pending-requirements.html"] },
      { label: "Student Appeals", href: "student-appeals.html", pages: ["student-appeals.html"] },
      { label: "Reports", href: "instructor-reports.html", pages: ["instructor-reports.html"] }
    ];

    const renderSidebarNav = (items) => {
      const nav = one(".sidebar-nav");

      if (!nav) {
        return;
      }

      nav.innerHTML = items.map((item) => {
        const isActive = item.pages.includes(page);
        const ariaCurrent = isActive ? ' aria-current="page"' : "";
        return `<a class="nav-link${isActive ? " is-active" : ""}" href="${item.href}"${ariaCurrent}><span class="nav-dot"></span>${item.label}</a>`;
      }).join("");

      window.NurseTrackSidebarIcons?.refresh?.();
    };

    const replaceMainWithNotice = ({ kicker, title, copy, actionHref, actionLabel }) => {
      const main = one("main.workspace");

      if (!main) {
        return;
      }

      main.className = "workspace dashboard-workspace route-guard-workspace";
      main.innerHTML = `
        <section class="workspace-hero dashboard-hero">
          <div>
            <p class="section-kicker">${kicker}</p>
            <h2>${title}</h2>
            <p>${copy}</p>
          </div>
          <a class="primary-button workspace-action button-link" href="${actionHref}">${actionLabel}</a>
        </section>
      `;
    };

    const enforceRoleOwnership = () => {
      const signedRole = window.sessionStorage?.getItem("nursetrackRole");
      const routeRole = isAdmin ? "admin" : isChair && legacyAdminPages.has(page) ? "admin" : isChair ? "chair" : isInstructor ? "instructor" : isStudent ? "student" : "";

      if (!signedRole || !routeRole || signedRole === routeRole) {
        return false;
      }

      const roleLabels = {
        admin: "Admin",
        chair: "Chair",
        instructor: "Clinical Instructor",
        student: "Nursing Student"
      };

      setText(".topbar-title h1", "Access limited");
      replaceMainWithNotice({
        kicker: "Role Guard",
        title: `${roleLabels[routeRole]} access is required for this page.`,
        copy: `You are signed in as ${roleLabels[signedRole] || signedRole}. This page is owned by the ${roleLabels[routeRole]} role.`,
        actionHref: "../index.html",
        actionLabel: "Return to login"
      });

      return true;
    };

    const enhanceRoleSidebars = () => {
      if (isAdmin) {
        setText(".role-chip", "Admin");
        setText(".topbar-title p", "Admin Workspace");
        setText(".sidebar-account strong", "Admin Santos");
        setText(".sidebar-account span", "System Admin");
        const avatar = one(".sidebar-account .avatar");
        if (avatar) {
          avatar.textContent = "AS";
        }
        renderSidebarNav(adminNavItems);
        return;
      }

      if (isChair) {
        renderSidebarNav(chairNavItems);
        return;
      }

      if (isInstructor) {
        renderSidebarNav(instructorNavItems);
      }
    };

    const enhanceLegacyAdminRouteNotice = () => {
      if (!isChair || !legacyAdminPages.has(page)) {
        return false;
      }

      const targetHref = page === "role-assignment.html" ? "../admin/role-assignment.html" : "../admin/manage-users.html";
      const targetLabel = page === "role-assignment.html" ? "Open Admin Role Assignment" : "Open Admin Manage Users";

      setText(".topbar-title p", "Chair Workspace");
      setText(".topbar-title h1", "Admin-only module moved");
      replaceMainWithNotice({
        kicker: "Admin-owned Route",
        title: "This account-management page now belongs to Admin.",
        copy: "The Chair role handles schedules, student progress, and reports. User management and role assignment are owned by Admin.",
        actionHref: targetHref,
        actionLabel: targetLabel
      });

      return true;
    };

    const insertAfterHero = (key, markup) => {
      const main = one("main.workspace");
      const hero = one(".workspace-hero");

      if (!main || !hero || one(`[data-consultation="${key}"]`)) {
        return null;
      }

      const node = render(markup);
      node.dataset.consultation = key;
      hero.insertAdjacentElement("afterend", node);
      return node;
    };

    const appendMain = (key, markup) => {
      const main = one("main.workspace");

      if (!main || one(`[data-consultation="${key}"]`)) {
        return null;
      }

      const node = render(markup);
      node.dataset.consultation = key;
      main.appendChild(node);
      return node;
    };

    const setText = (selector, text) => {
      const element = one(selector);

      if (element) {
        element.textContent = text;
      }
    };

    const replaceSelectOptions = (selector, options) => {
      const select = one(selector);

      if (!select) {
        return;
      }

      select.innerHTML = options.map((option) => {
        const label = typeof option === "string" ? option : option.label;
        let value = typeof option === "string" ? option : option.value;

        if (label.toLowerCase().startsWith("select ")) {
          value = "";
        } else if (label.toLowerCase().startsWith("all ")) {
          value = "all";
        }

        return `<option value="${value}">${label}</option>`;
      }).join("");
    };

    const setSelectValue = (selector, value) => {
      const select = one(selector);

      if (select && Array.from(select.options).some((option) => option.textContent === value)) {
        select.value = value;
      }
    };

    const hospitalWardMap = {
      VSMMC: ["SP St 201", "SP ST 301", "VND 401", "VNDE 401", "VNDE 501", "IDTM 101", "CFI 101", "OR Main", "Main Station 205"],
      LCH: ["3rd Floor", "4th Floor"],
      PSH: ["3B Station", "4th Floor", "5th Floor", "Operating Room", "Intensive Care Unit"],
      CCMC: ["Pedia Pulmo Ward", "NICU", "Emergency Room", "Operating Room"],
      CBS: ["Male Ward", "Female Ward"],
      SAMCH: ["Operating Room", "Delivery Room"],
      MMC: ["Delivery Room"],
      VMH: ["Delivery Room"],
      ECS: ["Outpatient Department"],
      CCHD: ["Community Health / Duty Area"],
      CSMC: [],
      "Mactan Medical Hospital": [],
      "Vicente Mendiola Center for Health Infirmary": ["Emergency Room", "Medical Ward", "Delivery Room"],
      "Healing Hands Dialysis Center": ["Dialysis Center"],
      "Mabolo Birthing Center": ["Birthing Center"],
      "Inayawan Birthing Center": ["Birthing Center"],
      "Quiot Birthing Center": ["Birthing Center"],
      "Tejero Birthing Center": ["Birthing Center"],
      "CHN Brgy. Dumlog": ["Community Health Nursing Area"],
      "Preventive Promotive Brgy. Lagtang": ["Community Health / Preventive Promotive Area"],
      "Psycare Basak San Nicolas": ["Psychiatric Duty Area"]
    };

    const hospitalNames = Object.keys(hospitalWardMap);

    const normalizeHospitalWardSelects = () => {
      const attendanceSiteFilter = one("#attendance-site-filter");
      if (attendanceSiteFilter) {
        const previousSite = hospitalNames.includes(attendanceSiteFilter.value) ? attendanceSiteFilter.value : hospitalNames[0];
        attendanceSiteFilter.innerHTML = hospitalNames.map((hospital) => `<option value="${hospital}">${hospital}</option>`).join("");
        attendanceSiteFilter.value = previousSite;
      }

      const pairs = [
        ["#clinical-site", "#duty-area"],
        ["#selected-schedule-hospital", "#selected-schedule-area"],
        ["#manual-hospital", "#manual-area"]
      ];

      pairs.forEach(([hospitalSelector, areaSelector]) => {
        const hospitalSelect = one(hospitalSelector);
        const areaSelect = one(areaSelector);

        if (!hospitalSelect) {
          return;
        }

        const previousHospital = hospitalNames.includes(hospitalSelect.value) ? hospitalSelect.value : hospitalNames[0];
        const hasPlaceholder = Array.from(hospitalSelect.options).some((option) => option.value === "");

        hospitalSelect.innerHTML = [
          ...(hasPlaceholder ? ['<option value="">Select clinical site</option>'] : []),
          ...hospitalNames.map((hospital) => `<option value="${hospital}">${hospital}</option>`)
        ].join("");
        hospitalSelect.value = previousHospital;

        if (!areaSelect) {
          return;
        }

        const syncAreas = () => {
          const wards = hospitalWardMap[hospitalSelect.value] || [];
          const previousArea = areaSelect.value;
          const hasAreaPlaceholder = Array.from(areaSelect.options).some((option) => option.value === "");
          areaSelect.innerHTML = [
            ...(hasAreaPlaceholder ? ['<option value="">Select duty area</option>'] : []),
            ...wards.map((ward) => `<option value="${ward}">${ward}</option>`)
          ].join("");

          if (wards.includes(previousArea)) {
            areaSelect.value = previousArea;
          } else if (wards.length > 0) {
            areaSelect.value = wards[0];
          } else {
            areaSelect.value = "";
          }

          areaSelect.disabled = wards.length === 0;
        };

        hospitalSelect.addEventListener("change", syncAreas);
        syncAreas();
      });
    };

    const normalizeSidebarBrandLink = () => {
      const brand = one(".sidebar-brand");

      if (!brand) {
        return;
      }

      const href = isStudent || isChair || isInstructor ? "about.html" : isAdmin ? "../about.html" : "about.html";

      if (brand.tagName.toLowerCase() === "a") {
        brand.setAttribute("href", href);
        brand.setAttribute("aria-label", "About NurseTrack");
        return;
      }

      const link = render(`<a class="${brand.className}" href="${href}" aria-label="About NurseTrack"></a>`);
      link.innerHTML = brand.innerHTML;
      brand.replaceWith(link);
    };

    const simplifyTopbarActions = () => {
      const isNotificationPage = ["notifications.html", "instructor-notifications.html", "admin-notifications.html"].includes(page);

      if (isNotificationPage) {
        all(".topbar-actions .ghost-button").forEach((button) => button.remove());
      }
    };

    const removePanelByHeading = (patterns) => {
      all(".workspace-panel").forEach((panel) => {
        const heading = panel.querySelector(".panel-heading h2");
        const kicker = panel.querySelector(".panel-heading .section-kicker");
        const label = `${kicker?.textContent || ""} ${heading?.textContent || ""}`.trim();

        if (patterns.some((pattern) => pattern.test(label))) {
          panel.remove();
        }
      });
    };

    const simplifyRepeatedExtras = () => {
      removePanelByHeading([
        /validation actions/i,
        /follow-up queue/i,
        /chair controls/i
      ]);

      if (!isAdmin && !isChair) {
        return;
      }

      removePanelByHeading([
        /report actions/i,
        /open report views/i,
        /report links/i,
        /recent exports/i,
        /chair actions/i,
        /^links\s+continue$/i
      ]);

      if (page === "role-assignment.html") {
        all(".dashboard-stats .stat-card").forEach((card) => {
          const label = card.querySelector("span")?.textContent.trim();

          if (label === "Changes") {
            card.remove();
          }
        });
      }

      if (isChair && ["schedule-report.html", "duty-report.html", "case-report.html", "generate-report.html"].includes(page)) {
        all("select option").forEach((option) => {
          if (/^all\s+/i.test(option.textContent.trim())) {
            option.remove();
          }
        });

        all("select").forEach((select) => {
          select.dispatchEvent(new Event("input", { bubbles: true }));
        });
      }
    };

    const simplifyHelpPages = () => {
      if (!page.endsWith("help.html")) {
        return;
      }

      one(".help-search-panel")?.remove();
      one(".help-hero .workspace-action")?.remove();
      setText(".help-hero h2", "Find answers for the main workflow.");
      setText(".help-hero p:not(.section-kicker)", "Choose a topic to open the page related to your role.");
      all(".help-main-stack > .workspace-panel").slice(1).forEach((panel) => panel.remove());
      one(".help-layout .duty-side-panel")?.remove();

      const helpLayout = one(".help-layout");
      if (helpLayout) {
        helpLayout.className = "simple-help-layout";
      }
    };

    const simplifyNotificationCategories = () => {
      if (!["notifications.html", "instructor-notifications.html"].includes(page)) {
        return;
      }

      removePanelByHeading([/quick filters\s+notification type/i]);

      const typeFilter = one("#type-filter");
      const statusFilter = one("#status-filter");
      const firstCard = one("#notification-list .notification-card");

      all("#type-filter option[value='all'], #status-filter option[value='all']").forEach((option) => option.remove());

      if (typeFilter && firstCard?.dataset.type) {
        typeFilter.value = firstCard.dataset.type;
      }

      if (statusFilter && firstCard?.dataset.status) {
        statusFilter.value = firstCard.dataset.status;
      }

      [typeFilter, statusFilter].filter(Boolean).forEach((select) => {
        select.dispatchEvent(new Event("input", { bubbles: true }));
      });
    };

    const simplifyAssignedSchedulePage = () => {
      if (page !== "schedule-management.html") {
        return;
      }

      one(".schedule-management-workspace > .dashboard-stats")?.remove();
      one(".schedule-management-layout .duty-side-panel")?.remove();
      one(".workspace-hero > .status-badge")?.remove();

      const layout = one(".schedule-management-layout");
      if (layout) {
        layout.className = "simple-report-layout";
      }
    };

    const simplifyChairGuide4 = () => {
      if (!isChair) {
        return;
      }

      if (page === "admin-dashboard.html") {
        removePanelByHeading([/reports\s+monitoring summary/i, /workflow\s+chair controls/i]);
      }

      if (page === "chair-student-progress.html") {
        one(".chair-student-progress-workspace > .dashboard-stats")?.remove();
        const hero = one(".student-progress-lookup-hero");
        if (hero) {
          hero.classList.add("guide4-direct-hero");
        }
      }
    };

    const redirectDeprecatedChairValidation = () => false;

    const enhanceStudentInstructorTopbar = () => {
      const actions = one(".topbar-actions");
      const notificationButton = one(".topbar-actions .notification-button");
      const isNotificationPage = ["notifications.html", "instructor-notifications.html", "admin-notifications.html"].includes(page);

      if (notificationButton) {
        notificationButton.classList.toggle("is-active", isNotificationPage);
        if (isNotificationPage) {
          notificationButton.setAttribute("aria-current", "page");
        } else {
          notificationButton.removeAttribute("aria-current");
        }
      }

      if (!isStudent && !isInstructor) {
        return;
      }

      all('.sidebar-nav .nav-link[href="view-profile.html"]').forEach((link) => link.remove());

      if (!actions) {
        return;
      }

      const profileHref = "view-profile.html";
      let profileButton = one(".topbar-profile-button");

      if (!profileButton) {
        profileButton = render(`
          <a class="icon-button topbar-profile-button button-link" href="${profileHref}" aria-label="Profile" title="Profile">
            <svg class="profile-user-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21a8 8 0 0 1 16 0"></path>
            </svg>
          </a>
        `);

        if (notificationButton) {
          notificationButton.insertAdjacentElement("afterend", profileButton);
        } else {
          const logout = one(".topbar-actions .logout-link");
          actions.insertBefore(profileButton, logout || null);
        }
      }

      const isProfilePage = ["view-profile.html", "edit-profile.html", "change-password.html"].includes(page);

      if (notificationButton && profileButton.previousElementSibling !== notificationButton) {
        notificationButton.insertAdjacentElement("afterend", profileButton);
      }

      profileButton.classList.toggle("is-active", isProfilePage);
      if (isProfilePage) {
        profileButton.setAttribute("aria-current", "page");
      } else {
        profileButton.removeAttribute("aria-current");
      }
    };

    const enhanceChairTerminology = () => {
      if (!isChair) {
        return;
      }

      setText(".role-chip", "Chair");
      setText(".topbar-title p", "Chair Workspace");
      setText(".sidebar-account strong", "Reyes");
      setText(".sidebar-account span", "Chair");
      document.title = document.title.replace("Admin", "Chair");

      all(".workspace-hero p, .workspace-hero h2, .sync-pill").forEach((item) => {
        item.textContent = item.textContent.replace("Admin", "Chair");
      });
    };

    const enhanceChairSchedules = () => {
      if (!isChair || page !== "admin-schedules.html") {
        return;
      }

      one('[data-consultation="chair-schedule-workflow"]')?.remove();
      one('[data-consultation="chair-import"]')?.remove();
      one('[data-consultation="chair-schedule-maker-panel"]')?.remove();
      one(".workspace-hero")?.remove();
      one(".schedule-management-workspace > .dashboard-stats")?.remove();
    };

    const enhanceUserImportPages = () => {
      if (!isChair || !["user-management.html", "user-list-manage-users.html"].includes(page)) {
        return;
      }

      insertAfterHero("student-list-import", `
        <section class="workspace-panel chair-import-panel">
          <div class="panel-heading">
            <div>
              <p class="section-kicker">Excel Import</p>
              <h2>Student list maintenance</h2>
            </div>
            <span class="status-badge status-pending">Editable after upload</span>
          </div>
          <div class="chair-control-grid">
            <div class="chair-control-card"><span>XL</span><strong>Upload student list</strong><p>Import school ID, full name, section, contact, status, and enrollment notes.</p></div>
            <div class="chair-control-card"><span>GR</span><strong>Upload groupings</strong><p>Map students to groups, RLE/rotation, semester, and duty grouping code.</p></div>
            <div class="chair-control-card"><span>ED</span><strong>Correct records</strong><p>Edit names, group labels, membership, and late enrollment changes.</p></div>
            <div class="chair-control-card"><span>TR</span><strong>Track changes</strong><p>Keep uploaded data reviewable before it affects schedules.</p></div>
          </div>
        </section>
      `);
    };

    const enhanceStudentSchedule = () => {
      if (!isStudent || page !== "view-schedule.html") {
        return;
      }

      setText(".workspace-hero h2", "View your assigned clinical duty schedule.");
      setText(
        ".workspace-hero p:not(.section-kicker)",
        "Schedules are published by the Chair. You can view your hospital, area, assigned CI, shift, rotation, and reminders."
      );

      one('[data-consultation="student-schedule-lock"]')?.remove();
    };

    const enhanceDutyEntry = () => {
      if (!isStudent || page !== "record-duty-hours.html") {
        return;
      }

      all("h2").forEach((heading) => {
        if (heading.textContent.includes("Today")) {
          heading.textContent = "Today's assigned shift";
        }
      });

      setText(".workspace-hero h2", "Time in and time out from your assigned schedule.");
      setText(
        ".workspace-hero p:not(.section-kicker)",
        "Attendance is tied to the Chair-published schedule, assigned location, and CI verification. Submit records only for your assigned duty."
      );

      replaceSelectOptions("#clinical-site", ["Select clinical site", "CCMC", "VSMMC", "CHN Brgy. Dumlog"]);
      replaceSelectOptions("#duty-area", ["Select duty area", "Emergency Room", "Delivery Room", "Operating Room", "Pedia Pulmo Ward"]);
      setSelectValue("#clinical-site", "CCMC");
      setSelectValue("#duty-area", "Emergency Room");

      const instructor = one("#clinical-instructor");
      if (instructor) {
        instructor.value = "Prof. Reyes";
        instructor.readOnly = true;
      }

      const message = one("#form-message");
      if (message && !one('[data-consultation="schedule-tied-attendance"]')) {
        message.insertAdjacentElement("beforebegin", render(`
          <div class="attendance-rules-panel integration-placeholder" data-consultation="schedule-tied-attendance">
            <strong>Schedule-tied attendance check</strong>
            <p>Allowed shift: 7:00 AM - 3:00 PM. Location: CCMC, Emergency Room. CI session: Prof. Reyes. Bluetooth/proximity and location rules are prepared for mobile integration and CI verification.</p>
          </div>
        `));
      }
    };

    const enhanceCaseEntry = () => {
      if (!isStudent || !["add-clinical-case.html", "edit-case.html"].includes(page)) {
        return;
      }

      setText(".workspace-hero h2", page === "add-clinical-case.html" ? "Submit a DR or OR clinical case." : "Update a DR or OR clinical case.");
      setText(
        ".workspace-hero p:not(.section-kicker)",
        "Clinical cases are monitored by category and must be reviewed by the assigned CI before they count toward progress."
      );

      const category = one("#case-category");
      if (category) {
        category.innerHTML = `
          <option value="">Select main category</option>
          <option value="DR">DR</option>
          <option value="OR">OR</option>
        `;

        if (!one("#case-subcategory")) {
          category.closest(".form-grid")?.insertAdjacentElement("afterend", render(`
            <div class="form-grid" data-consultation="case-subcategory-fields">
              <label class="form-label" for="case-subcategory">
                Subcategory
                <select id="case-subcategory" name="caseSubcategory" required>
                  <option value="">Select subcategory</option>
                </select>
              </label>
              <label class="form-label" for="case-major-role">
                Major OR role
                <select id="case-major-role" name="caseMajorRole" disabled>
                  <option value="">Select Major OR role</option>
                  <option value="Scrub cases">Scrub cases</option>
                  <option value="Circulating cases">Circulating cases</option>
                </select>
              </label>
            </div>
          `));
        }
      }

      const subcategory = one("#case-subcategory");
      const majorRole = one("#case-major-role");

      const syncSubcategory = () => {
        if (!category || !subcategory) {
          return;
        }

        const previousSubcategory = subcategory.value;
        const options = category.value === "OR"
          ? ["Select subcategory", "Minor cases", "Major cases"]
          : category.value === "DR"
            ? ["Select subcategory", "Handled cases", "Assisted cases", "Newborn care", "Labor watch monitoring"]
            : ["Select subcategory"];

        subcategory.innerHTML = options.map((option) => {
          const value = option.toLowerCase().startsWith("select ") ? "" : option;
          return `<option value="${value}">${option}</option>`;
        }).join("");

        if (options.includes(previousSubcategory)) {
          subcategory.value = previousSubcategory;
        }

        const isMajorOrCase = category.value === "OR" && subcategory.value === "Major cases";

        if (majorRole) {
          majorRole.disabled = !isMajorOrCase;
          majorRole.required = isMajorOrCase;

          if (!isMajorOrCase) {
            majorRole.value = "";
          }

          majorRole.closest(".form-label")?.classList.toggle("is-disabled", !isMajorOrCase);
        }
      };

      category?.addEventListener("input", syncSubcategory);
      subcategory?.addEventListener("input", syncSubcategory);
      syncSubcategory();

      insertAfterHero("case-taxonomy", `
        <section class="workspace-panel case-taxonomy-panel">
          <div class="panel-heading">
            <div>
              <p class="section-kicker">Clinical Case Structure</p>
              <h2>DR and OR monitoring categories</h2>
            </div>
            <span class="status-badge status-pending">CI validation required</span>
          </div>
          <div class="case-counter-grid">
            <div class="case-counter-card"><span>DR</span><strong>Handled cases</strong><p><span class="case-counter-metric">Required 3</span><span class="case-counter-metric">Completed 1</span><span class="case-counter-metric">Pending 1</span><span class="case-counter-metric">Lacking 1</span></p></div>
            <div class="case-counter-card"><span>DR</span><strong>Assisted cases</strong><p><span class="case-counter-metric">Required 3</span><span class="case-counter-metric">Completed 2</span><span class="case-counter-metric">Pending 0</span><span class="case-counter-metric">Lacking 1</span></p></div>
            <div class="case-counter-card"><span>DR</span><strong>Newborn care</strong><p><span class="case-counter-metric">Required 3</span><span class="case-counter-metric">Completed 2</span><span class="case-counter-metric">Pending 1</span><span class="case-counter-metric">Lacking 0</span></p></div>
            <div class="case-counter-card"><span>OR</span><strong>Major scrub/circulating</strong><p><span class="case-counter-metric">Required 4</span><span class="case-counter-metric">Completed 1</span><span class="case-counter-metric">Pending 1</span><span class="case-counter-metric">Not applicable 1</span></p></div>
          </div>
          <p class="readonly-note">Invalid or unmatched cases should be marked Not Applicable by the reviewer instead of deleted, so the record remains traceable.</p>
        </section>
      `);
    };

    const enhanceCaseHistory = () => {
      if (!isStudent || !["case-history.html", "case-detail.html", "checklist-form.html"].includes(page)) {
        return;
      }

      replaceSelectOptions("#category-filter", ["All categories", "DR", "OR"]);

      insertAfterHero("case-progress-counters", `
        <section class="workspace-panel case-taxonomy-panel">
          <div class="panel-heading">
            <div>
              <p class="section-kicker">Clinical Case Progress</p>
              <h2>Category completion counters</h2>
            </div>
            <span class="status-badge status-pending">Monitoring only</span>
          </div>
          <div class="case-counter-grid">
            <div class="case-counter-card"><span>DR</span><strong>Handled cases</strong><p><span class="case-counter-metric">Required 3</span><span class="case-counter-metric">Verified 1</span><span class="case-counter-metric">Pending 1</span><span class="case-counter-metric">Lacking 1</span></p></div>
            <div class="case-counter-card"><span>DR</span><strong>Labor watch monitoring</strong><p><span class="case-counter-metric">Required 3</span><span class="case-counter-metric">Verified 2</span><span class="case-counter-metric">Pending 0</span><span class="case-counter-metric">Lacking 1</span></p></div>
            <div class="case-counter-card"><span>OR</span><strong>Minor cases</strong><p><span class="case-counter-metric">Required 2</span><span class="case-counter-metric">Verified 1</span><span class="case-counter-metric">Pending 1</span><span class="case-counter-metric">Lacking 0</span></p></div>
            <div class="case-counter-card"><span>OR</span><strong>Major cases</strong><p><span class="case-counter-metric">Scrub 1</span><span class="case-counter-metric">Circulating 1</span><span class="case-counter-metric">Not applicable 1</span></p></div>
          </div>
        </section>
      `);
    };

    const enhanceInstructorValidation = () => {
      if (!isInstructor || !["case-validation.html", "duty-validation.html", "approval-rejection.html"].includes(page)) {
        return;
      }

      if (page === "case-validation.html" && !new URLSearchParams(window.location.search).has("case")) {
        setText("#selected-case-code", "J. A. K.");
        setText("#selected-case-category", "Major Case - Assist");
        setText("#selected-case-procedure", "Primary Lower Segment Transverse Cesarean Section");
        setText("#selected-case-shift-time", "6:00 AM - 2:00 PM");
        setText("#selected-case-supervising-ci", "Patricia Reyes, RN, MAN");
      }
    };

    const enhanceAttendanceMonitoring = () => {
      return;
    };

    const enhanceInstructorScheduling = () => {
      if (!isInstructor || !["schedule-management.html", "create-schedule.html", "edit-schedule.html", "assign-duty.html"].includes(page)) {
        return;
      }

      if (page === "schedule-management.html") {
        setText(".topbar-title p", "Assigned Schedules");
        setText(".topbar-title h1", "Assigned Schedules");
        setText(".workspace-hero .section-kicker", "Assigned schedules");
        setText(".workspace-hero h2", "View assigned clinical duty schedules.");
        setText(
          ".workspace-hero p:not(.section-kicker)",
          "Monitor Chair-published rotations for your assigned groups, hospitals, duty areas, and shift windows."
        );
      } else {
        setText(".topbar-title p", "Schedule Monitoring");
        setText(".topbar-title h1", "Chair-Controlled Action");

        const main = one("main.workspace");

        if (main) {
          main.className = "workspace dashboard-workspace";
          main.innerHTML = `
            <section class="workspace-hero dashboard-hero">
              <div>
                <p class="section-kicker">Read-only Access</p>
                <h2>This scheduling action is handled by the Chair.</h2>
                <p>Clinical instructors can monitor assigned schedules, rosters, and attendance sessions. Schedule creation, reassignment, and group editing are restricted to the Chair role.</p>
              </div>
              <a class="primary-button workspace-action button-link" href="schedule-management.html">View assigned schedules</a>
            </section>
          `;
        }
      }

      if (page !== "schedule-management.html") {
        insertAfterHero("ci-readonly-scheduling", `
          <section class="workspace-panel schedule-lock-panel">
            <div class="panel-heading">
              <div>
                <p class="section-kicker">Assigned Schedule Access</p>
                <h2>Read-only schedule monitoring</h2>
              </div>
              <span class="status-badge status-pending">Chair-controlled</span>
            </div>
            <p class="readonly-note">Clinical Instructors can view assigned groups and schedules, but schedule creation, reassignment, Excel uploads, and group membership edits are handled by the Chair.</p>
          </section>
        `);
      }

      all('a[href="create-schedule.html"], a[href="edit-schedule.html"], a[href="assign-duty.html"]').forEach((link) => {
        const card = link.closest(".requirement-item, .action-item");

        if (card) {
          card.remove();
          return;
        }

        link.textContent = "View assigned schedules";
        link.setAttribute("href", "schedule-management.html");
        link.classList.add("ci-schedule-return-action");

        if (page !== "schedule-management.html") {
          link.classList.add("consultation-disabled");
          link.setAttribute("aria-disabled", "true");
          link.title = "Chair-controlled action";
        }
      });

      all("form input, form select, form textarea, form button").forEach((control) => {
        if (page !== "schedule-management.html") {
          control.disabled = true;
        }
      });
    };

    const enhanceChairValidation = () => {};

    const enhanceReports = () => {
      if (!page.includes("report") && page !== "generate-report.html") {
        return;
      }

      replaceSelectOptions("#report-type", [
        "Compliance Summary",
        "Duty Report",
        "Case Report",
        "Schedule Report",
        "Lacking Duty Hours",
        "Lacking Clinical Cases",
        "Late Attendance Records",
        "Not Applicable Records",
        "Group Progress",
        "CI Assigned Student Status"
      ]);

      insertAfterHero("practical-reporting", `
        <section class="workspace-panel report-scope-panel">
          <div class="panel-heading">
            <div>
              <p class="section-kicker">Practical Reporting</p>
              <h2>Monitoring filters and export-ready summaries</h2>
            </div>
            <span class="status-badge status-verified">PDF / CSV</span>
          </div>
          <div class="report-scope-grid">
            <div class="report-scope-card"><span>DH</span><strong>Lacking duty hours</strong><p>Students, groups, CI, hospital, area, term, status.</p></div>
            <div class="report-scope-card"><span>CC</span><strong>Clinical case progress</strong><p>Completed, lacking, pending, verified, and not applicable cases.</p></div>
            <div class="report-scope-card"><span>AT</span><strong>Attendance records</strong><p>On time, late, absent, incomplete, verified, and overridden entries.</p></div>
            <div class="report-scope-card"><span>GP</span><strong>Group and term progress</strong><p>Semester/term progress by group, CI, hospital, and rotation.</p></div>
          </div>
        </section>
      `);
    };

    const enhanceProgressReadiness = () => {
      if (isInstructor) {
        return;
      }

      if (!["student-progress.html", "instructor-student-view.html", "student-progress-detail.html", "completion-status.html", "pending-requirements.html", "chair-student-progress.html"].includes(page)) {
        return;
      }

      appendMain("future-clearance-readiness", `
        <section class="workspace-panel clearance-ready-panel">
          <div class="future-ready">
            <div class="card-icon">CR</div>
            <div>
              <p class="section-kicker">Future-ready Indicator</p>
              <h2>Clearance readiness snapshot</h2>
              <p class="panel-note">This remains a progress/status indicator only: completed requirements, pending duty hours, pending clinical cases, and items needing validation.</p>
            </div>
            <span class="status-badge status-pending">Not final clearance</span>
          </div>
        </section>
      `);
    };

    const removeStudentDutyHours = () => {
      if (!isStudent) {
        return;
      }

      const studentDutyPages = new Set([
        "record-duty-hours.html",
        "duty-history.html",
        "duty-detail.html",
        "duty-progress.html",
        "duty-verification.html"
      ]);
      const dutyHrefPattern = /(record-duty-hours|duty-history|duty-detail|duty-progress|duty-verification)\.html/i;

      all("a[href]").forEach((link) => {
        const href = link.getAttribute("href") || "";

        if (!dutyHrefPattern.test(href)) {
          return;
        }

        const container = link.closest(".not-found-link-card, .requirement-item.action-item, .help-topic-card");
        (container || link).remove();
      });

      all(".stat-card, .progress-breakdown-item, .progress-summary-card, .report-scope-card, .workflow-card, .schedule-lock-card, .about-module-card, .help-topic-card, .help-faq-item, .requirement-item, .activity-item").forEach((card) => {
        if (/duty hour/i.test(card.textContent)) {
          card.remove();
        }
      });

      all("select").forEach((select) => {
        Array.from(select.options).forEach((option) => {
          if (/duty hours|duty report|lacking duty/i.test(option.textContent)) {
            option.remove();
          }
        });
      });

      all("p, span, strong").forEach((item) => {
        if (item.closest(".nav-icon, .icon-button, svg")) {
          return;
        }

        const updatedText = item.textContent
          .replace("Your duty hours, case records, and assigned schedule are ready for review.", "Your clinical case records and assigned schedule are ready for review.")
          .replace("See duty hours, case logs, schedule compliance, and validation status in one place.", "See case logs, schedule compliance, and validation status in one place.")
          .replace("Completed records include verified duty hours and approved clinical case logs.", "Completed records include approved clinical case logs and schedule compliance updates.")
          .replace("completed requirements, pending duty hours, pending clinical cases, and items needing validation.", "completed requirements, pending clinical cases, and items needing validation.")
          .replace("Manage duty hours, case logs, schedules, validation updates, progress, and reports in one secure workspace.", "Manage case logs, schedules, validation updates, progress, and reports in one secure workspace.")
          .replace("Records duty hours, submits cases, checks schedules, and monitors progress.", "Submits cases, checks schedules, and monitors progress.")
          .replace("Track completed hours, pending requirements, and completion status.", "Track clinical case progress, pending requirements, and completion status.")
          .replace("Review duty hours, case logs, schedules, completion status, and export-ready summaries.", "Review case logs, schedules, completion status, and export-ready summaries.");

        if (updatedText !== item.textContent) {
          item.textContent = updatedText;
        }
      });

      all("input[placeholder], textarea[placeholder]").forEach((field) => {
        field.placeholder = field.placeholder
          .replace("Search duty hours, case logs, schedules, reports", "Search case logs, schedules, reports")
          .replace("duty hours, ", "");
      });

      if (studentDutyPages.has(page)) {
        setText(".topbar-title p", "Student Workspace");
        setText(".topbar-title h1", "Module Unavailable");
        document.title = "NurseTrack | Student Workspace";

        const main = one("main.workspace");

        if (main) {
          main.className = "workspace dashboard-workspace";
          main.innerHTML = `
            <section class="workspace-hero dashboard-hero">
              <div>
                <p class="section-kicker">Student Access</p>
                <h2>This function is not available in the Nursing Student role.</h2>
                <p>Students can view schedules, submit clinical cases, check progress, and review validation updates. Monitoring and verification for this area are handled by the Clinical Instructor and Chair workflows.</p>
              </div>
              <a class="primary-button workspace-action button-link" href="view-schedule.html">View schedule</a>
            </section>

            <section class="dashboard-stats" aria-label="Student available modules">
              <article class="workspace-card stat-card">
                <div class="workspace-card-header">
                  <span class="card-icon">Clinical cases</span>
                  <span class="status-badge status-pending">Pending</span>
                </div>
                <h3>Clinical cases</h3>
                <p>Submit DR/OR case records for CI validation.</p>
              </article>

              <article class="workspace-card stat-card">
                <div class="workspace-card-header">
                  <span class="card-icon">Schedule</span>
                  <span class="status-badge status-verified">Assigned</span>
                </div>
                <h3>Schedule</h3>
                <p>View Chair-published hospital, area, shift, and assigned CI.</p>
              </article>

              <article class="workspace-card stat-card">
                <div class="workspace-card-header">
                  <span class="card-icon">Progress</span>
                  <span class="status-badge status-pending">In progress</span>
                </div>
                <h3>Progress</h3>
                <p>Track clinical case completion and validation status.</p>
              </article>
            </section>
          `;
        }
      }
    };

    normalizeSidebarBrandLink();
    simplifyTopbarActions();
    enhanceStudentInstructorTopbar();
    enhanceRoleSidebars();
    simplifyRepeatedExtras();
    simplifyHelpPages();
    simplifyNotificationCategories();
    simplifyAssignedSchedulePage();
    simplifyChairGuide4();
    normalizeHospitalWardSelects();

    if (enforceRoleOwnership()) {
      return;
    }

    if (redirectDeprecatedChairValidation()) {
      return;
    }

    if (enhanceLegacyAdminRouteNotice()) {
      return;
    }

    enhanceChairTerminology();
    enhanceChairSchedules();
    enhanceUserImportPages();
    enhanceStudentSchedule();
    enhanceDutyEntry();
    enhanceCaseEntry();
    enhanceCaseHistory();
    enhanceInstructorValidation();
    enhanceAttendanceMonitoring();
    enhanceInstructorScheduling();
    removeStudentDutyHours();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
