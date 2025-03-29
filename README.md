# 🌌 Universe - University Messaging System

A comprehensive messaging system designed for higher education institutions to facilitate communication between students, group leaders, university staff, and administration. This system serves as a critical tool for enhancing operational efficiency and streamlining the educational process through timely information exchange.

## 🌟 Overview

The University Messaging System provides an efficient and user-friendly platform for communication within the university network. It enables real-time information sharing, which is essential for effective organization of the educational process and administration.

## 🎯 Target Users

- 👩‍🎓 **Students**: Can quickly exchange information with professors, group leaders, and other students
- 👨‍🏫 **Group Leaders**: Able to coordinate their groups, send announcements, and manage group-related communications
- 🏛 **University Staff**: Can organize and coordinate their activities, share important updates, and maintain communication with students and colleagues

## 🎯 Project Goals

- 📊 Analyze existing messaging systems to identify strengths and weaknesses
- 📝 Define system requirements based on the needs of different user groups
- 🛠 Select appropriate technologies and tools for implementation
- 🎨 Design the core components of the system
- 🚀 Implement and integrate the developed components into a cohesive messaging platform

## 🛠 Technology Stack

- 🎨 **Frontend**: React, TypeScript
- ⚙️ **Backend**: Node.js, TypeScript
- 🗄 **Database**: MongoDB with Mongoose
- 🔄 **Real-time Communication**: Socket.io
- 📦 **Deployment**: Docker Compose

## 🔑 Key Features

- 💬 Real-time messaging between all university stakeholders
- 👥 Group-based communication channels
- 🏛 Administrative controls for university staff
- 🔔 Notification system for important announcements
- 🔐 User authentication and role-based permissions
- 📱 Mobile-responsive design for access on various devices

## 🚀 Getting Started

### 1️⃣ Make sure you have installed:
- 🐳 [Docker](https://www.docker.com/get-started)
- ⚙️ [Docker Compose](https://docs.docker.com/compose/install/)

### 2️⃣ Clone the repository
```sh
git clone https://github.com/backstabslash/universe.git
cd universe
```

### 3️⃣ Start the containers
```sh
docker-compose up --build
```
> 🛠 The `--build` flag is required for the first run or when the `Dockerfile` changes.

### 4️⃣ Access the services:
- 🌍 **Server**: [http://localhost:3001](http://localhost:3001)
- 🎨 **Client**: [http://localhost:3000](http://localhost:3000)

## 📜 Project Structure
```
/universe
│── /server          # ⚙️ Server side (Node.js, Express)
│── /client          # 🎨 Client side (React)
│── docker-compose.yml
│── README.md
```

## 🛠 Useful Commands
### 📌 Stop containers:
```sh
docker-compose down
```
### 🔄 Restart with rebuild:
```sh
docker-compose up --build
```
### 📜 View logs:
```sh
docker-compose logs -f
```
### 📦 Check running containers:
```sh
docker ps
```

## 🖥 Interface Showcase

### 🔑 Login page
![Login page](/assets/login_page.png)

### 🏠 Main view
![Main view](/assets/main_view.png)

### ✍️ Message rich text editor
![Message rich text editor](/assets/message_rich_text_editor.png)

### 📝 Formatted message
![Formatted message](/assets/formatted_message.png)
