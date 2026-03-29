const portalApp = document.querySelector("#portal-app");

function hp(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const portalState = {
  mode: "signin",
  user: null,
  drafts: [],
  fullDraft: null,
  message: "",
  error: "",
  loading: true,
  theme: (() => {
    try {
      return window.localStorage.getItem("lifeAudit.portalTheme") || "dark";
    } catch {
      return "dark";
    }
  })(),
};

function isRecoveryFlow() {
  const hash = window.location.hash || "";
  const search = window.location.search || "";
  return /type=recovery/.test(hash) || /type=recovery/.test(search);
}

function emptyFullAuditState(user, restartCount = 0) {
  return {
    started: false,
    currentIndex: 0,
    restartCount,
    completedAt: null,
    answers: {},
    reflections: {},
    supportOpen: null,
    depthPromptQuestionId: null,
    depthPromptBypass: {},
    skipPromptQuestionId: null,
    skippedQuestionIds: {},
    focusMode: false,
    disclaimerChecked: false,
    disclaimerAccepted: false,
    user: {
      name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
    },
  };
}

function fullAuditProgressSummary(fullState) {
  if (!fullState) {
    return { label: "Not started yet", percent: 0 };
  }

  const totalQuestions = Array.isArray(window.LIFE_AUDIT_FULL_STEPS)
    ? window.LIFE_AUDIT_FULL_STEPS.reduce((sum, section) => sum + (Array.isArray(section.questions) ? section.questions.length : 0), 0)
    : 0;
  const answeredCount = Object.values(fullState.answers || {}).filter((value) => String(value || "").trim()).length;
  const percent = totalQuestions ? Math.max(0, Math.min(100, Math.round((answeredCount / totalQuestions) * 100))) : 0;

  if (fullState.completedAt) {
    return { label: "Completed", percent: 100 };
  }

  if (answeredCount === 0) {
    return { label: "Ready to begin", percent: 0 };
  }

  return { label: `${answeredCount} of ${totalQuestions} questions answered`, percent };
}

function renderPortal() {
  const configured = Boolean(window.lifeAuditCloud?.configured);
  const userName = portalState.user?.user_metadata?.full_name || portalState.user?.email || "Your account";
  const fullState = portalState.fullDraft?.state || null;
  const restartCount = fullState?.restartCount || 0;
  const canRestart = Boolean(portalState.user && fullState && !fullState.completedAt && restartCount < 1);
  const progress = fullAuditProgressSummary(fullState);
  const inRecovery = portalState.mode === "update-password";
  const draftRows = portalState.drafts.length
    ? portalState.drafts
        .map(
          (draft) => `
            <div class="portal-draft-row">
              <div>
                <strong>${draft.audit_kind === "full" ? "Full Life Audit" : "Free Trial Audit"}</strong>
                <p>Last updated ${new Date(draft.updated_at).toLocaleString()}</p>
              </div>
            </div>
          `
        )
        .join("")
    : `<div class="portal-empty">No saved cloud sessions yet. Start the Full Audit once signed in and your draft will begin saving here.</div>`;
  const authTitle =
    portalState.mode === "signup"
      ? "Create account"
      : portalState.mode === "reset"
        ? "Reset password"
        : "Members sign in";
  const authNote =
    portalState.mode === "signup"
      ? "Account access is currently open during development. Purchase gating will be added later."
      : portalState.mode === "reset"
        ? "A reset link will be sent to your email so you can choose a new password securely."
        : "Secure access to your saved audit session.";
  const securityNote =
    portalState.mode === "reset"
      ? "Password reset is handled through a secure recovery link sent to your email."
      : "Your sign-in is handled through a secure account session. Personal audit data stays attached to your account.";

  portalApp.innerHTML = `
    <div class="portal-page" data-theme="${portalState.theme}">
      <div class="legal-shell">
        <header class="legal-header">
          <a class="brand" href="./index.html"><span class="brand-mark" aria-hidden="true"></span><span>LIFE AUDIT</span></a>
          <div class="portal-header-actions">
            <div class="portal-theme-toggle" aria-label="Portal appearance">
              <button class="portal-theme-button ${portalState.theme === "dark" ? "is-active" : ""}" type="button" data-portal-theme="dark">Dark</button>
              <button class="portal-theme-button ${portalState.theme === "light" ? "is-active" : ""}" type="button" data-portal-theme="light">Light</button>
            </div>
            <a class="legal-back" href="./index.html">Back to site</a>
          </div>
        </header>
        <section class="portal-card">
          <div class="portal-head">
            <p class="section-kicker">Members access</p>
            <h1>Members Access</h1>
            <p class="legal-lead">Private access to your Life Audit account and saved session.</p>
          </div>

          ${
            !configured
              ? `<div class="portal-banner">Supabase is not configured yet. Add your project URL and anon key in <code>supabase-config.js</code> first.</div>`
              : ""
          }

          ${
            portalState.error
              ? `<div class="portal-banner is-error">${hp(portalState.error)}</div>`
              : portalState.message
                ? `<div class="portal-banner is-success">${hp(portalState.message)}</div>`
                : ""
          }

          ${
            portalState.loading
              ? `<div class="portal-empty">Loading portal...</div>`
              : inRecovery
                ? `
                  <form class="portal-form" id="portal-password-update-form">
                    <label class="mini-audit-field"><span>New password</span><input type="password" name="password" placeholder="Choose a new password" required minlength="8" /></label>
                    <label class="mini-audit-field"><span>Confirm password</span><input type="password" name="confirmPassword" placeholder="Repeat your new password" required minlength="8" /></label>
                    <div class="portal-actions">
                      <button class="button button-primary" type="submit" ${configured ? "" : "disabled"}>Update password</button>
                      <a class="button button-secondary" href="./portal.html">Back</a>
                    </div>
                  </form>
                `
                : portalState.user
                ? `
                  <div class="portal-session">
                    <div class="portal-session-card portal-session-card-wide">
                      <p class="section-kicker">Full Life Audit</p>
                      <h2>${hp(userName)}</h2>
                      <p>${progress.label}</p>
                      <div class="portal-progress">
                        <div class="portal-progress-bar"><span style="width: ${progress.percent}%;"></span></div>
                        <strong>${progress.percent}%</strong>
                      </div>
                      <div class="portal-chip-row">
                        <span class="portal-chip">Secure sign-in</span>
                        <span class="portal-chip">Saved progress</span>
                        <span class="portal-chip">Private access</span>
                      </div>
                      <div class="portal-actions">
                        <a class="button button-primary" href="./index.html?fullaudit=1">${fullState ? "Continue Full Audit" : "Enter Full Audit"}</a>
                        <button class="button button-secondary" type="button" data-portal-action="signout">Sign out</button>
                      </div>
                    </div>
                    <div class="portal-session-card">
                      <p class="section-kicker">Saved progress</p>
                      <h2>Your saved audit</h2>
                      <p>Return to where you left off without losing the thread.</p>
                      <div class="portal-drafts">${draftRows}</div>
                    </div>
                    <div class="portal-session-card">
                      <p class="section-kicker">Audit settings</p>
                      <h2>Manage your Full Audit</h2>
                      <p>${
                        !fullState
                          ? "No Full Audit draft yet."
                          : fullState.completedAt
                            ? "This audit has been completed. Self-serve restart is locked."
                            : restartCount >= 1
                              ? "Your one self-serve restart has already been used."
                              : "You can clear this audit once and begin again if needed."
                      }</p>
                      <div class="portal-actions">
                        <button class="button button-secondary" type="button" data-portal-action="restart-audit" ${canRestart ? "" : "disabled"}>Start again</button>
                      </div>
                    </div>
                    <div class="portal-session-card portal-session-card-compact">
                      <p class="section-kicker">Preferences</p>
                      <h2>Appearance</h2>
                      <p>Choose the portal view that feels calmer and easier to use.</p>
                      <div class="portal-theme-toggle">
                        <button class="portal-theme-button ${portalState.theme === "dark" ? "is-active" : ""}" type="button" data-portal-theme="dark">Dark mode</button>
                        <button class="portal-theme-button ${portalState.theme === "light" ? "is-active" : ""}" type="button" data-portal-theme="light">Light mode</button>
                      </div>
                    </div>
                    <div class="portal-session-card portal-session-card-compact">
                      <p class="section-kicker">Policies</p>
                      <h2>Privacy and terms</h2>
                      <p>Review how your information is handled and the current product terms.</p>
                      <div class="portal-actions">
                        <a class="button button-secondary" href="./privacy.html">Privacy Policy</a>
                        <a class="button button-secondary" href="./terms.html">Terms &amp; Disclaimer</a>
                      </div>
                    </div>
                  </div>
                `
                : `
                  <div class="portal-auth-layout">
                    <div class="portal-auth-panel">
                      <div class="portal-auth-top">
                        <p class="section-kicker">Secure access</p>
                        <h2>${authTitle}</h2>
                        <p>${authNote}</p>
                      </div>
                      <div class="portal-security-note">
                        <div class="portal-security-icon" aria-hidden="true">+</div>
                        <div>
                          <strong>Secure account access</strong>
                          <p>${securityNote}</p>
                        </div>
                      </div>
                      <div class="portal-toggle">
                        <button class="portal-toggle-button ${portalState.mode === "signin" ? "is-active" : ""}" type="button" data-portal-mode="signin">Sign in</button>
                        <button class="portal-toggle-button ${portalState.mode === "signup" ? "is-active" : ""}" type="button" data-portal-mode="signup">Create account</button>
                        <button class="portal-toggle-button ${portalState.mode === "reset" ? "is-active" : ""}" type="button" data-portal-mode="reset">Reset password</button>
                      </div>
                      <form class="portal-form" id="portal-auth-form">
                        ${
                          portalState.mode === "signup"
                            ? `<label class="mini-audit-field"><span>Name</span><input type="text" name="name" placeholder="Your name" required /></label>`
                            : ""
                        }
                        <label class="mini-audit-field"><span>Email</span><input type="email" name="email" placeholder="you@example.com" required /></label>
                        ${
                          portalState.mode === "reset"
                            ? `<p class="mini-audit-footnote">Enter your account email and we will send a password reset link.</p>`
                            : `<label class="mini-audit-field"><span>Password</span><input type="password" name="password" placeholder="${portalState.mode === "signup" ? "Create a password" : "Your password"}" required minlength="8" /></label>`
                        }
                        <div class="portal-actions">
                          <button class="button button-primary" type="submit" ${configured ? "" : "disabled"}>${
                            portalState.mode === "signup"
                              ? "Create account"
                              : portalState.mode === "reset"
                                ? "Send reset link"
                                : "Sign in"
                          }</button>
                          <a class="button button-secondary" href="./index.html">Back</a>
                        </div>
                        <p class="portal-form-footnote">Secure server connection. Your audit session is tied to your account, not shared publicly.</p>
                        ${
                          portalState.mode === "signin"
                            ? `<button class="portal-inline-link" type="button" data-portal-mode="reset">Forgot password?</button>`
                            : ""
                        }
                      </form>
                    </div>
                  </div>
                `
          }
        </section>
      </div>
    </div>
  `;
}

async function refreshPortalSession() {
  portalState.loading = true;
  portalState.error = "";
  renderPortal();
  if (!window.lifeAuditCloud?.configured) {
    portalState.user = null;
    portalState.drafts = [];
    portalState.loading = false;
    renderPortal();
    return;
  }
  const user = await window.lifeAuditCloud.getUser();
  portalState.user = user;
  if (user) {
    const { data, error } = await window.lifeAuditCloud.listDrafts();
    portalState.drafts = error ? [] : data || [];
    const draftResult = await window.lifeAuditCloud.loadDraft("full");
    portalState.fullDraft = draftResult.error ? null : draftResult.data || null;
  } else {
    portalState.drafts = [];
    portalState.fullDraft = null;
  }
  portalState.loading = false;
  if (isRecoveryFlow()) {
    portalState.mode = "update-password";
  }
  renderPortal();
}

portalApp?.addEventListener("click", async (event) => {
  const themeButton = event.target.closest("[data-portal-theme]");
  if (themeButton) {
    portalState.theme = themeButton.dataset.portalTheme === "light" ? "light" : "dark";
    try {
      window.localStorage.setItem("lifeAudit.portalTheme", portalState.theme);
    } catch {}
    renderPortal();
    return;
  }

  const modeButton = event.target.closest("[data-portal-mode]");
  if (modeButton) {
    portalState.mode = modeButton.dataset.portalMode;
    portalState.error = "";
    portalState.message = "";
    renderPortal();
    return;
  }

  const actionButton = event.target.closest("[data-portal-action='signout']");
  if (actionButton) {
    portalState.error = "";
    portalState.message = "";
    const { error } = await window.lifeAuditCloud.signOut();
    if (error) {
      portalState.error = error.message || "Could not sign out.";
    } else {
      portalState.message = "Signed out.";
    }
    await refreshPortalSession();
    return;
  }

  const restartButton = event.target.closest("[data-portal-action='restart-audit']");
  if (restartButton) {
    const fullState = portalState.fullDraft?.state;
    const restartCount = fullState?.restartCount || 0;
    if (!portalState.user || !fullState || fullState.completedAt || restartCount >= 1) {
      return;
    }
    const confirmed = window.confirm("This will clear your current Full Audit progress and cannot be undone. Continue?");
    if (!confirmed) return;
    const nextState = emptyFullAuditState(portalState.user, restartCount + 1);
    const { error } = await window.lifeAuditCloud.saveDraft("full", nextState);
    if (error) {
      portalState.error = error.message || "Could not restart this audit.";
    } else {
      portalState.message = "Your Full Audit has been reset. You can begin again from the site.";
      try {
        window.localStorage.setItem("lifeAudit.fullAuditState", JSON.stringify(nextState));
      } catch {}
    }
    await refreshPortalSession();
  }
});

portalApp?.addEventListener("submit", async (event) => {
  const form = event.target.closest("#portal-auth-form");
  if (form) {
    event.preventDefault();
    portalState.error = "";
    portalState.message = "";
    renderPortal();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!email || ((portalState.mode === "signup" || portalState.mode === "signin") && !password) || (portalState.mode === "signup" && !name)) {
      portalState.error = "Please complete the required fields.";
      renderPortal();
      return;
    }

    if (portalState.mode === "reset") {
      const result = await window.lifeAuditCloud.resetPassword(email);
      if (result.error) {
        portalState.error = result.error.message || "Could not send reset email.";
      } else {
        portalState.message = "Password reset email sent. Open the link in that email to choose a new password.";
      }
      renderPortal();
      return;
    }

    const result =
      portalState.mode === "signup"
        ? await window.lifeAuditCloud.signUp({ email, password, name })
        : await window.lifeAuditCloud.signIn({ email, password });

    if (result.error) {
      portalState.error = result.error.message || "Authentication failed.";
      renderPortal();
      return;
    }

    portalState.message =
      portalState.mode === "signup"
        ? "Account created. If email confirmation is enabled in Supabase, verify your email before signing in."
        : "Signed in.";

    try {
      window.localStorage.setItem("lifeAudit.miniAuditUser", JSON.stringify({ name, email }));
    } catch {}

    await refreshPortalSession();
    return;
  }

  const passwordForm = event.target.closest("#portal-password-update-form");
  if (!passwordForm) return;
  event.preventDefault();
  portalState.error = "";
  portalState.message = "";
  const formData = new FormData(passwordForm);
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();
  if (!password || password.length < 8) {
    portalState.error = "Choose a password with at least 8 characters.";
    renderPortal();
    return;
  }
  if (password !== confirmPassword) {
    portalState.error = "Passwords do not match.";
    renderPortal();
    return;
  }
  const result = await window.lifeAuditCloud.updatePassword(password);
  if (result.error) {
    portalState.error = result.error.message || "Could not update password.";
    renderPortal();
    return;
  }
  portalState.mode = "signin";
  portalState.message = "Password updated. You can now sign in with your new password.";
  if (window.location.hash) {
    history.replaceState({}, "", "./portal.html");
  }
  await refreshPortalSession();
});

refreshPortalSession();
