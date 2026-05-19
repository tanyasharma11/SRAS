# Project Context & AI Rules

This file serves as the context and operational manual for AI assistants (Copilots) working on this Angular + Spring Boot project.

## 1. Project Context
* **Frontend:** Angular (using `AuthService` for state management, RxJS for reactive programming).
* **Backend:** Spring Boot (RESTful API, JWT authentication).
* **Key Features:**
    * Conditional UI components (Navbar, Rankings).
    * Toast notification system for user feedback.
    * Session management (initialization checks on load).
    * User authentication flow (Login/Signup/Logout).

## 2. Operational Rules & Constraints

### File Modification Policy
* **Minimal Scope:** Modify the minimum number of files necessary to achieve the task.
* **Limited Impact:** Do not make widespread, architectural, or refactoring changes without explicit instruction.
* **No Unrequested Commits:** **NEVER** commit, push, or execute Git commands automatically. You are strictly restricted from performing automated commits. You must provide the code/diffs for the user to review.

### Task Execution & Workflow
* **Break Down Tasks:** If a task is complex or large (e.g., "Implement complete Auth system"), **first** provide a breakdown of smaller, actionable chunks. Do not attempt to code the entire feature in one response.
* **Avoid Circularity:** If a task involves complex logic, analyze the current codebase first. If you notice yourself proposing circular logic or redundant states, pause and ask the user for clarification before proceeding.
* **Initialization Safety:** Always verify if a feature relies on session/auth state. Ensure the UI handles "loading" states correctly so that "ghost data" from local storage is not displayed on page refresh.

### Coding Standards
* **Angular:** Use `*ngIf` for conditional rendering. Prefer `async` pipe for observables.
* **Error Handling:** Always implement robust `catchError` logic in service calls. Map backend error messages to UI toast notifications.
* **Security:** Ensure sensitive data (JWTs) are handled appropriately and session invalidation occurs correctly on both the client (clear local storage) and server (logout endpoint).
