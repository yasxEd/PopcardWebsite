# Mini Loyalty System – Web Backoffice

A modern, responsive backoffice dashboard for managing a loyalty program, built with React, Redux Toolkit, and Material UI.

<div align="center">

  <img src="https://github.com/user-attachments/assets/34ca93ad-c1a9-4083-a1dd-ee6dd7ecc9d1" alt="icon" width="200" />

</div>

---

## 📸 Screenshots

<div align="center">
  <img width="385" alt="Screenshot 2025-06-22 at 15 07 24" src="https://github.com/user-attachments/assets/14921888-373d-4eb6-b901-cd684b3181b8" />

  <img width="376" alt="Screenshot 2025-06-22 at 14 21 51" src="https://github.com/user-attachments/assets/4920c528-3525-4fb9-af48-4fd5e6723e5f" />
</div>

---

## 🎥 Video Demo


https://github.com/user-attachments/assets/7211e7ef-3cb6-4d9e-8db2-5e0149f71afa



---

## 📝 Features

- **Authentication**: Secure login for admin users.
- **Client Management**: Add, edit, delete, and search loyalty clients.
- **Points & Visits**: Track points and store visits per client.
- **Modern UI**: Responsive, animated, and accessible Material UI design.
- **Persistent Data**: Client data is stored in browser localStorage for demo purposes.
- **Demo Credentials**: Use the demo button on the login screen to auto-fill credentials.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
git clone https://github.com/yourusername/mini-loyalty-system.git
cd mini-loyalty-system/web-backoffice
npm install
```

### Running Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Login

- **Email:** `admin@popcard.com`
- **Password:** `popcard2025`

---

## 🗂️ Project Structure

```
mini-loyalty-system/
├── web-backoffice/
│   ├── public/
│   └── src/
│       ├── app/
│       ├── features/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── index.js
│       └── App.js
└── README.md
```

- **public/**: Static files and index.html
- **src/**: React components, pages, and Redux logic
- **app/**: Redux store configuration
- **features/**: Redux slices and async thunks
- **components/**: Reusable UI components
- **pages/**: Page components for routing
  
---

## 🗺️ System Flow Diagram

```mermaid
flowchart TD
    A[Login Page] -->|Auth Success| B[Dashboard]
    B --> C[Clients List]
    C --> D[Add/Edit Client Dialog]
    C --> E[Delete Client Dialog]
    C --> F[Client Table]
    B --> G[Footer]
    B --> H[Stats Cards]
    subgraph Redux Store
        I[authSlice]
        J[clientsApi]
    end
    A <--> I
    C <--> J
    D <--> J
    E <--> J
```

---

## 📚 Learning Resources

- **React Documentation**: [React Docs](https://reactjs.org/docs/getting-started.html)
- **Redux Toolkit Documentation**: [Redux Toolkit Docs](https://redux-toolkit.js.org/introduction/getting-started)
- **Material UI Documentation**: [Material UI Docs](https://mui.com/getting-started/installation/)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Happy Coding**

