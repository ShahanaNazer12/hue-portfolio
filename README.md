# Hue Solutions Portfolio Task — Next.js Starter

A single-page public portfolio plus `/admin` dashboard, MongoDB project CRUD, Cloudinary image uploads, and meeting/contact forms using Resend.

## 0. Before starting

Install Node.js 20 LTS (or a compatible current LTS), Git, and VS Code. Create accounts for MongoDB Atlas, Cloudinary, Resend, GitHub and Vercel. You must supply your own credentials; this starter cannot send real email or upload images until configured.

## 1. Install and run locally

1. Extract this ZIP.
2. Open the `hue-portfolio-task` folder in VS Code.
3. Open a terminal in that folder and run:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env.local`.
5. Fill in every value as explained below.
6. Start the site:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000` for the portfolio and `http://localhost:3000/admin` for login.

## 2. Configure MongoDB Atlas

1. Create a free cluster at MongoDB Atlas.
2. Create a database user and password.
3. In Network Access, permit your development IP. For deployment, configure network access according to your provider's current recommendations; avoid broad access if your setup supports a narrower allowlist.
4. Click Connect → Drivers and copy the connection string.
5. Put it in `MONGODB_URI` in `.env.local`, replacing the username/password placeholders. URL-encode special characters in the password.
6. Set `MONGODB_DB=hue_portfolio`.

Collections are created automatically as needed: `projects`, `bookings`, and `contactMessages`.

## 3. Configure the admin login

In `.env.local`, set:

- `ADMIN_EMAIL`: the email you want to use to sign in.
- `ADMIN_PASSWORD`: a long, unique password that you do not use elsewhere.
- `SESSION_SECRET`: at least 32 random characters. Generate a secret locally, for example with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

The admin login is configured through environment variables, so you do not need to create a separate admin record in MongoDB. Keep these values private. The session is an HTTP-only cookie and expires after eight hours. For a public production site, consider adding rate limiting to the login endpoint.

## 4. Configure Cloudinary image storage

1. Create a Cloudinary account.
2. Find your cloud name, API key and API secret in the Cloudinary dashboard.
3. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` in `.env.local`.
4. The admin dashboard uploads project photos through `/api/upload`. The server checks that the file is an image and is no larger than 5 MB. Never expose the Cloudinary API secret in browser code.

## 5. Configure Resend email

1. Create a Resend account and API key.
2. Verify a sender domain according to Resend's instructions. Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`.
3. Set `ADMIN_PUBLIC_EMAIL` to the address that should receive contact and meeting requests. Set `ADMIN_EMAIL` to the login email.
4. Email delivery providers may restrict unverified senders/recipients in test mode. Verify the domain and follow the provider's current test-mode rules before evaluating the real email flow.

When a visitor books a meeting, the app validates all fields, rejects past dates, stores the request in MongoDB, and sends an email to the admin plus a thank-you email to the visitor. A requested meeting is not automatically a confirmed calendar appointment; the email tells the visitor that confirmation/link will follow. If the provider fails, the booking may already be stored and the UI reports that email delivery failed.

## 6. Personalize the public website

Edit `components/Portfolio.js` and replace all sample details:

- `Your Name` and `YN` with your name/initials.
- The education and story text in About.
- Skills so they accurately reflect your experience.
- `you@example.com`, phone number, GitHub and LinkedIn URLs.
- Replace the portrait placeholder with your own photo if you wish. For example, put an image in `public/profile.jpg` and replace the `.portrait-placeholder` block with `<img className="profile-photo" src="/profile.jpg" alt="Your Name" />`, then add appropriate CSS.
- Update metadata in `app/layout.js`.

Do not claim skills, qualifications or project details you cannot explain in an interview.

## 7. Add, edit and delete projects

1. Run the app and visit `/admin`.
2. Sign in using `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
3. Add title, description, optional live URL and a project image, then click Add project.
4. The project is saved in MongoDB; the public homepage reads projects from the database, so it appears in the Projects section on refresh without changing code.
5. Use Edit to update a project, or Delete to remove it. Confirm the public page reflects changes.

The project API is `GET/POST /api/projects` and `PUT/DELETE /api/projects/:id`. Write operations require a valid admin session.

## 8. Test the forms

### Contact form
- Submit with an empty field; browser validation should stop submission.
- Enter an invalid email.
- Submit valid details and check MongoDB `contactMessages` and the admin inbox.

### Meeting booking
- Try each missing field.
- Enter an invalid email.
- Select a date/time in the past (the UI min attribute and server validation should reject it).
- Submit a future date/time and agenda.
- Confirm a record exists in MongoDB `bookings`.
- Confirm both admin and visitor emails arrived. Check spam and the Resend logs if not.

For an actual production deployment, add rate limiting or bot protection to public forms and consider a mail-delivery retry queue. Do not expose secrets in the client.

## 9. Build and deploy to Vercel

1. Create a GitHub repository and push the project. `.gitignore` excludes `.env` files.
2. Import the repository into Vercel.
3. In Vercel Project → Settings → Environment Variables, add the same production values from `.env.local` one by one. Do not upload `.env.local` to GitHub.
4. Set `NEXT_PUBLIC_SITE_URL` to your final Vercel domain.
5. Deploy. Test the live portfolio, `/admin`, image upload, project CRUD and both email paths.
6. Redeploy after changing environment variables if Vercel requires it.

## 10. Submission checklist from the task PDF

- [ ] Live website link
- [ ] Admin test login details (share securely with the recruiter; don't put secrets in a public README)
- [ ] GitHub code link
- [ ] A roughly 2-minute video showing adding a project and submitting a booking
- [ ] Screenshots of the admin and visitor emails
- [ ] Mobile and laptop layout checked
- [ ] Add/edit/delete project flow verified
- [ ] `.env.local` and all secrets excluded from GitHub

## Folder map

```text
app/
  page.js                     public one-page portfolio
  layout.js                   app shell and metadata
  globals.css                 responsive design
  admin/page.js               redirects to login/dashboard
  admin/login/page.js         admin login UI
  admin/dashboard/page.js     project CRUD UI
  api/auth/login/route.js     creates secure session cookie
  api/auth/logout/route.js    clears session cookie
  api/projects/route.js       list/create projects
  api/projects/[id]/route.js  edit/delete projects
  api/upload/route.js         authenticated Cloudinary upload
  api/bookings/route.js       meeting request + two emails
  api/contact/route.js        contact message + admin email
components/Portfolio.js       all public page sections and forms
lib/db.js                     MongoDB connection
lib/auth.js                   signed admin session
lib/cloudinary.js             image provider config
lib/email.js                  Resend helper
lib/validators.js             basic input validation
.env.example                  environment variable template
```

## Notes

This is a starter implementation, not a substitute for testing your own credentials and deployed environment. The public page is one page; `/admin` is private management UI. The project deliberately uses editable sample profile text, so personalize it before submission. Email provider restrictions and cloud dashboard settings can affect whether emails actually arrive.
