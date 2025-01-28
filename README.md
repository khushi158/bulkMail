Bulk Email Sender



📑 Table of Contents
✨ Overview
🚀 Features
🛠️ Tech Stack
📸 Screenshots
🏃‍♂️ Getting Started
📁 Project Structure
🤝 Contributing


✨ Overview
The Bulk Email Sender is a robust application designed to streamline the process of sending bulk emails efficiently and reliably. By leveraging Gmail SMTP and Nodemailer, this tool ensures high deliverability rates and provides features such as HTML email customization and email tracking.

🚀 Features
📨 Bulk Email Sending

Send emails to multiple recipients effortlessly.

Add, edit, and manage recipient lists.

Support for bulk operations.

⚡ Advanced Email Features

HTML content support to enhance engagement.

Achieve up to a 70% email open rate.

Automated email tracking with Cloudflare integration.

Detailed tracking insights, including open rates and click-through rates.

🔐 Security

Secure user authentication.

Protected email-sending routes.

Use of Gmail SMTP with app password for better security.

💻 User Interface

Command-line interface for executing email operations.

Clean and simple setup.

Easily configurable settings for bulk email tasks.

🛠️ Tech Stack

Backend: Node.js, Express.js ,MONGODB,UPSTASH

Email Sending: Nodemailer, Gmail SMTP

Tracking: Cloudflare

Deployment: Render


🏃‍♂️ Getting Started

Prerequisites

Node.js (v14 or higher)

npm or yarn

Gmail account with SMTP access enabled (use an app password for security)

Installation

Clone the repository:

git clone https://github.com/khushi158/bulk-email-sender.git

Navigate to the project directory:

cd bulk-email-sender

Install dependencies:

npm install

Setup

Configure environment variables:

cp .env.example .env

Fill in your Gmail SMTP credentials in the .env file:

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

Run the Application

Start the server:

node server.js

Use the CLI or API routes to execute bulk email operations.

📁 Project Structure

Bulk-Email-Sender/
├── dist/
├── node_modules/
├── routes/
│   ├── emailRoutes.js
├── .gitignore
├── README.md
├── Upstash.js
├── package-lock.json
├── package.json
├── server.js

🤝 Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request with your improvements.



Built with ❤️ by KHUSHNIMA


 
 
