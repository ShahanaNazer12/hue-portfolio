
'use client';

import { useState } from 'react';

const initialBookingForm = {
  fullName: '',
  email: '',
  preferredDateTime: '',
  agenda: '',
};

const initialContactForm = {
  name: '',
  email: '',
  message: '',
};

const PROFILE = {
  name: 'Shahana Sherin K',
  email: 'shahananasarkk@gmail.com',
  github: 'https://github.com/ShahanaNazer12',
  linkedin: 'https://www.linkedin.com/in/shahana-nazer-529216279',
  photo: '/shana.jpeg',
};

const skills = [
  'HTML & CSS',
  'Tailwind CSS',
  'Bootstrap',
  'JavaScript (ES6+)',
  'React.js',
  'Next.js',
  'Redux',
  'Node.js',
  'Express.js',
  'MongoDB',
  'MySQL',
  'PostgreSQL',
  'Python',
  'REST APIs',

  'Git & GitHub',
  'GitLab',
];

export default function Portfolio({ projects = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const [booking, setBooking] = useState(initialBookingForm);
  const [bookingState, setBookingState] = useState({
    loading: false,
    message: '',
    error: false,
  });

  const [contact, setContact] = useState(initialContactForm);
  const [contactState, setContactState] = useState({
    loading: false,
    message: '',
    error: false,
  });

  const minDate = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  function updateBooking(field, value) {
    setBooking((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateContact(field, value) {
    setContact((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submitBooking(event) {
    event.preventDefault();

    setBookingState({
      loading: true,
      message: '',
      error: false,
    });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...booking,
          preferredDateTime: new Date(
            booking.preferredDateTime
          ).toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Could not send booking request.'
        );
      }

      setBooking({ ...initialBookingForm });

      setBookingState({
        loading: false,
        message: data.message,
        error: false,
      });
    } catch (error) {
      setBookingState({
        loading: false,
        message: error.message,
        error: true,
      });
    }
  }

  async function submitContact(event) {
    event.preventDefault();

    setContactState({
      loading: true,
      message: '',
      error: false,
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Could not send message.'
        );
      }

      setContact({ ...initialContactForm });

      setContactState({
        loading: false,
        message: data.message,
        error: false,
      });
    } catch (error) {
      setContactState({
        loading: false,
        message: error.message,
        error: true,
      });
    }
  }

  return (
    <>
      {/* Navigation */}
      <header className="site-header">
        <a className="brand" href="#home">
          Shahana Sherin K<span>.</span>
        </a>

        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
          <a className="nav-cta" href="#booking">
            Book a meeting
          </a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="hero section" id="home">
          <div className="hero-copy">
            <p className="eyebrow">HELLO, I'M</p>

            <h1>
              SHAHANA SHERIN<span>.</span>
            </h1>

            <h2>Web Developer · React · Next.js</h2>

            <p className="lead">
              I build thoughtful, responsive web experiences
              and practical applications that solve real problems.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#projects">
                Explore my work ↗
              </a>

              <a className="button secondary" href="#contact">
                Let's talk
              </a>
            </div>

            <div className="hero-meta">
              <span>📍 Kozhikode, Kerala</span>
              <span>✳ Open to opportunities</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-placeholder">
              <img
                src={PROFILE.photo}
                alt={`${PROFILE.name} — Web Developer`}
                className="profile-photo"
              />
            </div>

            <div className="floating-card">
              ✦ Curious mind
              <br />
              <strong>Building every day</strong>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="section about" id="about">
          <div className="section-label">01 / ABOUT</div>

          <div className="section-heading">
            <h2>
              A little about <span>me.</span>
            </h2>

            <p>
              I enjoy turning ideas into useful, easy-to-use
              digital products.
            </p>
          </div>

          <div className="about-grid">
            <article className="about-card">
              <h3>My story</h3>

              <p>
                I'm Shahana Sherin K, a web developer interested
                in building responsive interfaces and full-stack
                applications. I enjoy learning new technologies,
                solving problems, and improving user experiences.
              </p>

             <p>
  <strong>Education:</strong>
</p>
<p>Master of Computer Applications (MCA) — 2025</p>
<p>B.Sc. Computer Science — 2020–2023</p>
            </article>

            <article className="about-card skills-card">
              <h3>Tools I work with</h3>

              <div className="skill-list">
                {skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </article>
          </div>
        </section>

        {/* Projects */}
        <section className="section projects" id="projects">
          <div className="section-label">02 / SELECTED WORK</div>

          <div className="section-heading">
            <h2>
              Things I've <span>built.</span>
            </h2>

            <p>
              Projects and ideas brought to life through code.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((project) => (
                <button
                  className="project-card"
                  key={project._id}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-image-wrap">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                    />

                    <span className="project-open">↗</span>
                  </div>

                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-projects">
              <span>✳</span>
              <h3>Projects are on the way</h3>
              <p>
                Projects added through the admin dashboard
                will appear here.
              </p>
            </div>
          )}
        </section>

        {/* Contact */}
        <section className="section contact" id="contact">
          <div className="section-label">03 / SAY HELLO</div>

          <div className="contact-grid">
            <div>
              <div className="section-heading">
                <h2>
                  Let's make something <span>great.</span>
                </h2>

                <p>
                  Have an opportunity, question, or idea?
                  Send me a message.
                </p>
              </div>

              <div className="contact-details">
                <a href={`mailto:${PROFILE.email}`}>
                  ✉ {PROFILE.email}
                </a>

                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  ↗ GitHub
                </a>

                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  ↗ LinkedIn
                </a>
              </div>
            </div>

            <form
              className="form-card"
              onSubmit={submitContact}
            >
              <h3>Send a message</h3>

              <label>
                Your name
                <input
                  required
                  maxLength={100}
                  value={contact.name}
                  onChange={(event) =>
                    updateContact('name', event.target.value)
                  }
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  value={contact.email}
                  onChange={(event) =>
                    updateContact('email', event.target.value)
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Message
                <textarea
                  required
                  maxLength={3000}
                  rows={4}
                  value={contact.message}
                  onChange={(event) =>
                    updateContact('message', event.target.value)
                  }
                  placeholder="Tell me a little about it..."
                />
              </label>

              <button
                className="button primary"
                disabled={contactState.loading}
              >
                {contactState.loading
                  ? 'Sending…'
                  : 'Send message ↗'}
              </button>

              {contactState.message && (
                <p
                  className={
                    contactState.error
                      ? 'status error'
                      : 'status success'
                  }
                  role="status"
                >
                  {contactState.message}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Meeting booking */}
        <section className="section booking" id="booking">
          <div className="section-label">04 / LET'S CONNECT</div>

          <div className="booking-grid">
            <div className="section-heading">
              <h2>
                Book a time to <span>talk.</span>
              </h2>

              <p>
                Choose a convenient time and tell me what
                you'd like to discuss. I'll follow up with
                the meeting details.
              </p>

              <div className="booking-note">
                ✦ Your request is not a confirmed calendar
                invitation. I'll email you to confirm.
              </div>
            </div>

            <form
              className="form-card"
              onSubmit={submitBooking}
            >
              <h3>Request a meeting</h3>

              <label>
                Full name
                <input
                  required
                  maxLength={100}
                  value={booking.fullName}
                  onChange={(event) =>
                    updateBooking('fullName', event.target.value)
                  }
                  placeholder="Your full name"
                />
              </label>

              <label>
                Email address
                <input
                  required
                  type="email"
                  value={booking.email}
                  onChange={(event) =>
                    updateBooking('email', event.target.value)
                  }
                  placeholder="you@example.com"
                />
              </label>

              <label>
                Preferred date & time
                <input
                  required
                  type="datetime-local"
                  min={minDate}
                  value={booking.preferredDateTime}
                  onChange={(event) =>
                    updateBooking(
                      'preferredDateTime',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Reason / agenda
                <textarea
                  required
                  minLength={5}
                  maxLength={3000}
                  rows={4}
                  value={booking.agenda}
                  onChange={(event) =>
                    updateBooking('agenda', event.target.value)
                  }
                  placeholder="What would you like to discuss?"
                />
              </label>

              <button
                className="button primary"
                disabled={bookingState.loading}
              >
                {bookingState.loading
                  ? 'Sending request…'
                  : 'Request meeting ↗'}
              </button>

              {bookingState.message && (
                <p
                  className={
                    bookingState.error
                      ? 'status error'
                      : 'status success'
                  }
                  role="status"
                >
                  {bookingState.message}
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <a className="brand" href="#home">
          Shahana Sherin K<span>.</span>
        </a>

        <p>
          Designed and built with care · ©{' '}
          {new Date().getFullYear()} {PROFILE.name}
        </p>

        <a href="#home">Back to top ↑</a>
      </footer>

      {/* Project details modal */}
      {selectedProject && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project"
            >
              ×
            </button>

            <img
              src={selectedProject.imageUrl}
              alt={selectedProject.title}
            />

            <div className="modal-content">
              <p className="eyebrow">PROJECT DETAILS</p>

              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>

              {selectedProject.projectUrl && (
                <a
                  className="button primary"
                  href={selectedProject.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View project ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
