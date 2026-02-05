# Agent Guidelines: Hello-uni Course

This document provides essential information for AI agents working on the Hello-uni Course repository. It covers technical stacks, coding standards, and project-specific patterns.

### Linting & Formatting
*Note: No specific linter (ESLint/Prettier) is configured. Follow existing code style manually.*
- **Indentation**: Use **Tabs** for indentation (as seen in `App.vue` and `components/`).
- **Semicolons**: Do **not** use trailing semicolons for statement termination.
- **Quotes**: Prefer **single quotes** (`'`) for strings in JavaScript and attributes in HTML/Vue templates where possible.

---

## 2. Code Style Guidelines

### Tech Stack
- **Core Framework**: Uni-app (Vue 3)
- **Script Style**: `<script setup>` (Composition API) is the standard for all new components.
- **Language**: JavaScript (ES6+). No TypeScript is used in the main logic.
- **Styling**: Scoped CSS/SCSS. Use `uni.scss` variables for global consistency.

### File Structure & Organization
The project follows a strict separation of concerns to keep components clean and testable.
- **Pages**: `/pages/` contains the top-level view components.
- **Components**: `/components/` contains reusable UI elements. Each component should have its own directory.
- **Functions**: `/functions/` contains all business logic, API wrappers, and event handler creators.
- **Static Assets**: `/static/` for images, icons, and fonts.
- **Global Styles**: `uni.scss` for global variables and mixins.

### Component & Logic Pattern
Follow the "Handler Creator" pattern established in this repository:
1. **In `functions/*.js`**: Export functions that accept reactive state (refs) and return methods.
   ```javascript
   export const createSomeHandlers = ({ state, emit }) => {
     const doSomething = () => { /* logic */ }
     return { doSomething }
   }
   ```
2. **In `components/*.vue`**: Import and initialize the handlers.
   ```vue
   <script setup>
   import { ref } from 'vue'
   import { createSomeHandlers } from '@/functions/some.js'
   const state = ref('')
   const { doSomething } = createSomeHandlers({ state, emit: defineEmits(['update']) })
   </script>
   ```

### Naming Conventions
- **Directories**: `kebab-case` (e.g., `components/schedule-board/`).
- **Vue Files**: `kebab-case` (e.g., `timetable-edit.vue`).
- **JavaScript Files**: `kebab-case` (e.g., `request.js`, `timetable-course.js`).
- **Variables/Functions**: `camelCase` (e.g., `handleSubmit`, `isLogin`).
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `BASE_URL`).
- **CSS Classes**: `kebab-case` (e.g., `.input-group`, `.submit-btn`).

### Documentation (JSDoc)
Use JSDoc for all exported functions in the `functions/` directory to improve maintainability.
```javascript
/**
 * Fetches data from the API
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>}
 */
export const fetchData = (params) => { ... }
```

### Network & State
- **API Requests**: Always use the wrapper in `@/functions/request.js`. It handles token injection and basic error reporting.
- **Local Storage**: Use `uni.setStorageSync` and `uni.getStorageSync` for persistence (e.g., auth tokens).
- **Global State**: For complex shared state, consider using a global reactive object or a simple store if needed, but prefer local `ref`s and `props/emits` where possible.

### Error Handling
- **User Feedback**: Use `uni.showToast({ title: '...', icon: 'none' })` for all user-facing error messages.
- **Logging**: Use `console.error` for internal debugging information.
- **Async Logic**: Wrap asynchronous API calls in `try...catch` blocks within the handler functions.

### UI/UX Standards
- **Icons**: Use the `uni-icons` module.
- **Navigation**: All pages use `navigationStyle: "custom"`. You must implement your own header/navigation bar using the `schedule-header` or similar components.
- **Responsiveness**: Design for mobile first, but ensure it works on H5.

---

## 3. Tool-Specific Instructions

### Cursor & Copilot Integration
- No project-specific `.cursorrules` or `.github/copilot-instructions.md` were found.
- **Proactive Search**: Before creating a new API endpoint, search `functions/` to see if a similar request already exists.
- **Page Registration**: When adding a new page in `pages/`, you MUST register it in `pages.json` and set `navigationStyle: "custom"`.

### Future Improvements
- If the project grows, migrating to TypeScript would be beneficial.
- Integration of a linting tool like ESLint with `eslint-plugin-vue` is highly recommended.
- Adding a centralized state management like Pinia if the cross-page state becomes unmanageable via local storage.
