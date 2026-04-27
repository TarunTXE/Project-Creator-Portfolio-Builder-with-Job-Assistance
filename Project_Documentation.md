# Portfolio Creator - Project Documentation

## 1. PROJECT STRUCTURE

### Frontend Structure (React + Vite)
*   **`src/components/`**: Reusable UI blocks. Includes `Navbar`, `FeedbackSection`, and a `templates/` folder containing various portfolio design layouts (Modern, Minimal, Creative, etc.).
*   **`src/pages/`**: Main views for the application. Includes `Login`, `Register`, `Dashboard`, `Builder` (form to create portfolio), `PublicPortfolio` (the shareable view), `JobPortal`, and `PortfolioAnalyzer`.
*   **`src/context/`**: Contains `AuthContext.jsx` for global state management regarding the logged-in user.
*   **`src/services/`**: Contains `api.js`, which configures Axios for all API requests.

### Backend Structure (Node.js + Express)
*   **`models/`**: Mongoose database schemas defining how data looks in MongoDB. Includes `User.js`, `Portfolio.js`, and `Feedback.js`.
*   **`controllers/`**: Contains the core logic for endpoints. Includes `authController.js` (login/register logic), `portfolioController.js` (CRUD for portfolios), and `feedbackController.js`.
*   **`routes/`**: Defines the API URL endpoints and links them to the corresponding controllers. Includes `jobRoutes.js`, `authRoutes.js`, etc.
*   **`server.js`**: The main entry point. Connects to MongoDB, configures middleware (CORS, JSON parsing), and mounts the routes.

### Frontend ↔ Backend Communication
*   The frontend communicates with the backend via HTTP REST API calls using **Axios**.
*   **API Interceptor (`api.js`)**: An Axios interceptor automatically attaches the user's JWT token (from `localStorage`) to the `Authorization` header of every outgoing request, ensuring secure routes can authenticate the user.

---

## 2. CORE FEATURES (IN DETAIL)

### Authentication (JWT)
*   **Purpose**: Secure the app so only registered users can create and manage their portfolios.
*   **How it works**: Users register/login with email and password. The backend verifies credentials, generates a JSON Web Token (JWT), and sends it back. The frontend stores this token and sends it with future requests to prove identity.
*   **Files involved**: `authController.js`, `User.js` (model), `Login.jsx`, `AuthContext.jsx`.

### Portfolio Creation
*   **Purpose**: Allow users to input their data (bio, skills, projects, links) to generate a portfolio.
*   **How it works**: The user fills out a dynamic form in the Builder. When submitted, the frontend sends a JSON object containing all details to the backend. The backend links the portfolio to the logged-in user's ID and saves it to MongoDB.
*   **Files involved**: `Builder.jsx`, `portfolioController.js`, `Portfolio.js`.

### Template System
*   **Purpose**: Allow users to change the visual look of their portfolio dynamically.
*   **How it works**: Different React components exist for different layouts (e.g., `TemplateMinimal`). The portfolio database object has a `template` field. The `PublicPortfolio` page reads this field and uses a `switch` statement to render the correct template component, passing the user data as props.
*   **Files involved**: `PublicPortfolio.jsx`, components in `src/components/templates/`.

### Portfolio Analyzer
*   **Purpose**: Evaluate the completeness of a portfolio and provide actionable feedback.
*   **How it works**: A custom function analyzes the portfolio data object against specific conditions (e.g., bio length, number of skills/projects). It assigns points to calculate a percentage score and generates a list of text suggestions for missing elements.
*   **Files involved**: `PortfolioAnalyzer.jsx`.

### Feedback System
*   **Purpose**: Allow visitors viewing a public portfolio to leave a rating and comment.
*   **How it works**: A separate MongoDB collection stores feedback, linked to a specific `portfolioId`. The `FeedbackSection` component fetches existing feedback and provides a form to submit new feedback.
*   **Files involved**: `FeedbackSection.jsx`, `feedbackController.js`, `Feedback.js`.

### Job Portal
*   **Purpose**: Allow users to find remote tech jobs in India directly from the app.
*   **How it works**: The user enters a search keyword. The frontend calls the backend `/api/jobs` route. The backend acts as a proxy, fetching live data from the **JSearch API (RapidAPI)**, filtering results to ensure they are India-based, and sending clean data back to the frontend to display.
*   **Files involved**: `JobPortal.jsx`, `jobRoutes.js`.

### PDF Generation
*   **Purpose**: Allow users/visitors to download the portfolio as a PDF document.
*   **How it works**: When "Export PDF" is clicked, the `html2pdf.js` library is utilized. It clones the currently rendered template HTML, places it in a hidden container (removing global CSS that might break the parser), and converts that specific HTML block into a downloadable PDF canvas.
*   **Files involved**: `PublicPortfolio.jsx`.

### Routing and Navigation
*   **Purpose**: Manage transitions between different pages without reloading the browser (Single Page Application).
*   **How it works**: Uses `react-router-dom`. Private routes wrap components like `Dashboard` and `Builder` to check if a user is logged in (via `AuthContext`). If not, they are redirected to `/login`.
*   **Files involved**: `App.jsx` (defines routes).

---

## 3. IMPORTANT CODE LOGIC

### Authentication Logic
*   **Login**: The controller receives `email` and `password`. It searches MongoDB for the user. If found, it uses bcrypt (`user.matchPassword`) to compare the hashed password. If it matches, `jsonwebtoken` is used to create a token containing the user's `_id`, which is sent to the client.

### Portfolio Creation Logic
*   **Saving**: In `portfolioController.js`, `createPortfolio` takes the `req.body` (portfolio details) and manually attaches `req.user._id` (obtained from the auth middleware) to it. This guarantees that the portfolio is permanently owned by the user who made the request before running `.save()` on the Database model.

### Analyzer Scoring Logic
*   **Calculations**: The logic is entirely handled on the frontend (`analyzePortfolio` function). It starts with a `score` of 0. It checks conditions: e.g., `if (data.skills.length >= 3)` add 30 points; if between 1-2, add 15 points. It also pushes string warnings into a `suggestions` array if conditions fail (e.g., "Add a GitHub link").

### Job API Fetch Logic
*   **Proxy Request**: The backend receives a `keyword`. It appends `" in India"` to it. It uses `fetch()` with RapidAPI headers (`X-RapidAPI-Key`). It receives a complex JSON response, maps over it to extract only what the frontend needs (Title, Company, Location, Apply Link), applies a strict `.filter()` to double-check the location contains "India", and returns this simplified array to the frontend.

---

## 4. DATA FLOW EXPLANATION

### Login Flow
1.  **User**: Enters email & password in UI.
2.  **Frontend**: Sends POST request to `/api/auth/login`.
3.  **Backend**: Queries Database. Compares password hash. Generates JWT Token.
4.  **Database**: Returns user record (if exists).
5.  **Response**: Backend sends user data + token back to Frontend.
6.  **UI**: Frontend saves token in Context/LocalStorage and redirects to Dashboard.

### Creating Portfolio Flow
1.  **User**: Fills form and clicks Save.
2.  **Frontend**: Sends POST request with form JSON and JWT Token to `/api/portfolio`.
3.  **Backend**: Middleware verifies token. Controller assigns User ID to portfolio object.
4.  **Database**: Saves the new document in `portfolios` collection.
5.  **Response**: Returns the created portfolio document.
6.  **UI**: Dashboard updates to show the new portfolio.

### Analyzer Flow
1.  **User**: Clicks "Analyze Portfolio".
2.  **Frontend**: Sends GET request to `/api/portfolio/:id`.
3.  **Backend/DB**: Retrieves portfolio data.
4.  **Frontend**: Runs the `analyzePortfolio` JavaScript function on the retrieved data to calculate the percentage score locally.
5.  **UI**: Displays the score out of 100% and a list of suggestions.

### Job Search Flow
1.  **User**: Types "React Developer" in Job Portal.
2.  **Frontend**: Sends GET request to backend (`/api/jobs?keyword=React Developer`).
3.  **Backend**: Sends outgoing request to JSearch RapidAPI.
4.  **External API**: Returns raw job listings.
5.  **Backend**: Cleans, filters, and formats the raw data.
6.  **Response**: Sends clean array of job objects.
7.  **UI**: Maps over array and renders job cards with "Apply" buttons.
