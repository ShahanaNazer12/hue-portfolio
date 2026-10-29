import './globals.css';
export const metadata = {
  title: 'Your Name | Developer Portfolio',
  description: 'A portfolio showcasing my skills, projects and contact information.'
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
