# Lost and Found Platform

An organization-based Lost and Found platform that helps users report, discover, and recover lost belongings. The platform uses **TF-IDF-based similarity search** to identify potentially matching items from their names, descriptions, and locations, making it easier to find relevant results.

## Overview

Losing personal belongings can be frustrating, especially in colleges, offices, and other organizations where many people share common spaces. This platform provides a centralized system where users can report lost or found items, search for potential matches, and submit claim requests for items they believe belong to them.

The platform also provides organization-specific administration to help manage users and keep records organized within each organization.

## Features

### 1. User Authentication

- **Email OTP verification during signup:** Users verify their email addresses using a One-Time Password (OTP) before completing registration.
- **Secure login:** Registered users can access their accounts using their credentials.
- **Forgot password:** Users can reset their passwords through an email-based OTP verification process.

### 2. Admin Authentication and Management

- **Admin registration:** Administrators register using an email address and password.
- **Organization-specific management:** Administrators can view and manage users associated with their organization.
- **User oversight:** Provides administrators with access to organization-related user information.

### 3. Lost Item Management

- Report lost belongings with relevant information, including:
  - Item name
  - Description
  - Date
  - Location
  - Image, where applicable
- View and manage reported lost items.
- Keep a record of items reported by users.

### 4. Found Item Management

- Report items that have been found.
- Include item details, descriptions, dates, locations, and images where applicable.
- Browse available found-item listings to identify potentially matching belongings.

### 5. TF-IDF-Based Similarity Search

The platform uses **TF-IDF (Term Frequency–Inverse Document Frequency)** to identify potentially relevant matches between reported lost items and found items.

The search system considers multiple fields:

- **Item name:** Matches the names or terms used to describe an item.
- **Description:** Compares descriptive information about the item.
- **Location:** Considers location-related terms.
- **Date:** Considers approximate date.

Individual similarity scores can be combined using a weighted approach to rank results according to their relevance.

This approach helps users find potentially matching items even when the wording of their reports differs.

### 6. Claim Request System

- Users can submit claim requests for found items they believe belong to them.
- A user can submit a claim only for an item they have previously reported as lost.
- Claim requests are associated with the relevant lost and found records.
- Claim status can be tracked through the platform.

### 7. User Profile

- View personal account information.
- Access previously reported lost items.
- View found-item reports associated with the user.
- Review submitted claim requests and their statuses.

## Technology Stack

The project uses the following technologies:

| Component           | Technology                                               |
| ------------------- | -------------------------------------------------------- |
| Frontend            | React.js                                                 |
| Backend             | Python, FastAPI                                          |
| Database            | PostgreSQL                                               |
| Search and Matching | TF-IDF and similarity scoring                            |
| Authentication      | Email/password authentication and email OTP verification |
| Version Control     | Git and GitHub                                           |

## How It Works

1. **Register:** Users create an account and verify their email address using an OTP. Administrators register using their email addresses and passwords.
2. **Log in:** Registered users access the platform.
3. **Report an item:** Users submit a report for a lost or found item with relevant details.
4. **Search for matches:** The platform compares item information using TF-IDF-based similarity scoring and ranks relevant results.
5. **Submit a claim:** If a found item appears to match a previously reported lost item, the user can submit a claim request.
6. **Track claims:** Users can review their claim requests and their current statuses.

## Authentication and Security

- Email OTP verification helps confirm that a user can access the email address provided during registration.
- Password-based authentication is used for administrator registration and account access.
- Email OTP verification is used in the forgot-password workflow.
- Claim validation restricts users to claiming found items associated with their own previously reported lost items.

> **Note:** Email OTP verification confirms access to an email address; it does not independently establish a person's real-world identity.

## Project Structure

The project is organized into frontend and backend components.

```text
Lost-Found/
├── frontend/       # React.js user interface
├── backend/        # FastAPI backend and application logic
└── README.md       # Project documentation
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Abrar822/Lost-Found.git
cd Lost-Found
```

### 2. Set Up the Backend

Open a terminal in the project directory:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables for the database connection and email OTP service. Use the project's expected variable names and configuration format.

Run the FastAPI application using the entry point configured in your project. For example, if the application instance is named `app` in `main.py`:

```bash
uvicorn main:app --reload
```

The backend will typically be available at `http://127.0.0.1:8000`.

FastAPI's interactive API documentation is typically available at `http://127.0.0.1:8000/docs`.

### 3. Set Up the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal to access the application.

### 4. Database Configuration

- Create a PostgreSQL database for the application.
- Configure the database connection using the environment variables expected by the backend.
- Ensure that the required database tables and schema are initialized before using the application.

**Important:** The commands above provide a general setup guide. The backend entry point, environment variable names, database initialization procedure, and email service configuration should match the actual project implementation.

## Future Enhancements

Potential future improvements include:

- Automated notifications when highly similar lost and found items are identified.
- Image-based item matching.
- Improved claim verification and approval workflows.
- Advanced search filters and sorting options.
- Email notifications for claim status updates.

## Contributing

Contributions and suggestions are welcome. To propose a change:

1. Fork the repository.
2. Create a new branch.
3. Implement and test your changes.
4. Submit a pull request describing the proposed improvements.

---

**Lost and Found Platform** — Making lost belongings easier to find and recover.
