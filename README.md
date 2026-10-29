# Personal Developer Portfolio

A full-stack developer portfolio built with Next.js, MongoDB, Cloudinary, and Resend. The website showcases my profile, technical skills, and projects, with an admin dashboard for managing project content and forms for contact messages and meeting requests.

## Features

- **Personal Portfolio:** Profile, about, skills, education, and project sections.
- **Admin Authentication:** Secure admin login using environment-based credentials and signed session cookies.
- **Project Management:** Add, edit, and delete projects through the admin dashboard.
- **Image Uploads:** Upload project images using Cloudinary.
- **Contact Form:** Receive messages from visitors.
- **Meeting Booking:** Accept meeting requests and send email notifications.
- **Database Integration:** Store projects, contact messages, and booking requests in MongoDB.
- **Responsive Design:** Layout designed for desktop and mobile devices.

## Tech Stack

**Frontend**
- Next.js
- React.js
- JavaScript
- CSS

**Backend**
- Next.js API Routes
- Node.js
- MongoDB
- Cloudinary
- Resend

## Getting Started

### Prerequisites

- Node.js (20 LTS or a compatible current LTS release)
- npm
- MongoDB Atlas account
- Cloudinary account
- Resend account

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd hue-portfolio-task
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the project root and configure the environment variables listed below.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Configure the following variables in `.env.local` with your own credentials:

```env
MONGODB_URI=
MONGODB_DB=hue_portfolio

ADMIN_EMAIL=
ADMIN_PASSWORD=
SESSION_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
EMAIL_FROM=
ADMIN_PUBLIC_EMAIL=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` or expose passwords, API keys, database credentials, or session secrets in your repository.

## Admin Dashboard

Access the admin login page at:

`http://localhost:3000/admin`

Sign in using the credentials configured through environment variables.

The dashboard allows the administrator to:

- Create projects with descriptions, images, and optional project links.
- Edit existing project details.
- Delete projects.
- Upload images through Cloudinary.

Project changes are stored in MongoDB and reflected on the public portfolio.

## Contact and Meeting Forms

The contact form stores visitor messages in MongoDB and sends notifications to the configured admin email.

The meeting booking form stores meeting requests and sends email notifications to the administrator and visitor using Resend.

Email delivery requires valid Resend credentials and an appropriately configured sender address. A meeting request is a request, not an automatically confirmed appointment.

## Deployment

The application can be deployed to Vercel.

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables in the Vercel project settings.
3. Set `NEXT_PUBLIC_SITE_URL` to the deployed website URL.
4. Deploy the application.
5. Test the public portfolio, admin authentication, project management, image uploads, and email functionality.

## Security

- Environment variables are used for sensitive configuration.
- Admin-only operations require an authenticated session.
- Session cookies are HTTP-only.
- Uploaded images have file-size and image-type checks.
- Public forms should be protected against spam and abuse before production use.

## Author

**Shahana Sherin K**

- GitHub: [ShahanaNazer12](https://github.com/ShahanaNazer12)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/shahana-nazer-529216279/)

---

Built as a full-stack portfolio project for the Hue Solutions portfolio task.
