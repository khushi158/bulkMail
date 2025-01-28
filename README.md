 <p align="center">The Bulk Email Sender</p>
 <h2>📑 Table of Contents</h2>
<ul>
  <li><a href="#overview">✨ Overview</a></li>
  <li><a href="#features">🚀 Features</a></li>
  <li><a href="#tech-stack">🛠️ Tech Stack</a></li>
  <li><a href="#getting-started">🏃‍♂️ Getting Started</a></li>
  <li><a href="#project-structure">📁 Project Structure</a></li>
</ul>

<h2 id="overview">✨ Overview</h2>
<p>The Bulk Email Sender is a robust application designed to streamline the process of sending bulk emails efficiently and reliably. By leveraging Gmail SMTP and Nodemailer, this tool ensures high deliverability rates and provides features such as HTML email customization and email tracking.</p>

<h2 id="features">🚀 Features</h2>
<h3>📨 Bulk Email Sending</h3>
<ul>
  <li>Send emails to multiple recipients effortlessly.</li>
  <li>Add, edit, and manage recipient lists.</li>
  <li>Support for bulk operations.</li>
</ul>

<h3>⚡ Advanced Email Features</h3>
<ul>
  <li>HTML content support to enhance engagement.</li>
  <li>Achieve up to a 70% email open rate.</li>
  <li>Automated email tracking with Cloudflare integration.</li>
  <li>Detailed tracking insights, including open rates and click-through rates.</li>
</ul>

<h3>🔐 Security</h3>
<ul>
  <li>Secure user authentication.</li>
  <li>Protected email-sending routes.</li>
  <li>Use of Gmail SMTP with app password for better security.</li>
</ul>

<h3>💻 User Interface</h3>
<ul>
  <li>Command-line interface for executing email operations.</li>
  <li>Clean and simple setup.</li>
  <li>Easily configurable settings for bulk email tasks.</li>
</ul>

<h2 id="tech-stack">🛠️ Tech Stack</h2>
<ul>
  <li><strong>Backend:</strong> Node.js, Express.js</li>
  <li><strong>Frontend:Reactjs,javascript</li>
  <li><strong>Database:</strong> MongoDB, Upstash</li>
  <li><strong>Email Sending:</strong> Nodemailer, Gmail SMTP</li>
  <li><strong>Tracking:</strong> Cloudflare</li>
  <li><strong>Deployment:</strong> Render</li>
</ul>


<h2 id="getting-started">🏃‍♂️ Getting Started</h2>
<h3>Prerequisites</h3>
<ul>
  <li>Node.js (v14 or higher)</li>
  <li>npm or yarn</li>
  <li>Gmail account with SMTP access enabled (use an app password for security)</li>
</ul>

### Installation

1. Clone the repository
```bash
https://github.com/khushi158/bulkMail


2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
Fill in your Gmail SMTP credentials in the .env file:
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password


Start the Application
node server.js


4. 📁 Project Structure
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


