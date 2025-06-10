# Travel Agency Application

This project consists of a React frontend and a Node.js/Express backend.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   MongoDB Atlas account (for database hosting)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd travel-agency
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

### Environment Variables Setup

Both the frontend and backend require environment variables to function correctly.

1.  **Create a `.env` file in the `backend` directory:**
    Navigate to the `backend` directory and create a file named `.env`.

    ```bash
    cd backend
    touch .env
    ```

2.  **Add the following variables to `backend/.env`:**

    ```
    PORT=5001
    NODE_ENV=development
    MONGODB_URI=<Your_MongoDB_Atlas_Connection_String>
    JWT_SECRET=<A_Strong_Random_Secret_Key_For_JWT>
    EMAIL_USER=<Your_Email_Service_Username>
    EMAIL_PASSWORD=<Your_Email_Service_Password>
    FRONTEND_URL=http://localhost:3000
    ```
    *   Replace `<Your_MongoDB_Atlas_Connection_String>` with your actual connection string from MongoDB Atlas. This usually looks like `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority`.
    *   Generate a strong, random string for `<A_Strong_Random_Secret_Key_For_JWT>`.
    *   `<Your_Email_Service_Username>` and `<Your_Email_Service_Password>` are for sending emails (e.g., for password resets). If you are using Gmail, you might need to generate an App Password.

3.  **MongoDB Atlas Configuration (Important for database connection):**
    Ensure your MongoDB Atlas cluster is configured to allow connections from your current IP address.
    *   Go to your MongoDB Atlas dashboard.
    *   Navigate to **Network Access** under the **Security** section.
    *   Click **Add IP Address** and add your current IP, or for development purposes, you can allow access from anywhere (0.0.0.0/0), though this is less secure for production.

### Running the Project

To run the project, you need to start both the backend and the frontend servers.

1.  **Start the Backend Server:**
    Open a new terminal, navigate to the `backend` directory, and run:
    ```bash
    cd backend
    npm start
    ```
    You should see "Server is running on port 5001" and "Connected to MongoDB" if the connection is successful.

2.  **Start the Frontend Server:**
    Open another new terminal, navigate to the project root directory, and run:
    ```bash
    npm start
    ```
    This will open the application in your browser at `http://localhost:3000` (or another port if 3000 is already in use).

Now you should have both the frontend and backend running, and the application should be accessible in your browser.
