import './globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import IntroLoader from './components/IntroLoader';
import HelpBot from '@/app/components/HelpBot'; 
import type { Metadata } from 'next';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Nyagrik Legal Firm',
=======
  title: 'Nyagrik',
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
  description: 'A modern legal tech platform',
};


export default function RootLayout({ children}: { children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body>
      <Navbar/>
<<<<<<< HEAD
        <main className="pt-16">{children}</main>
        <Footer />
        <IntroLoader />
        <HelpBot />
=======
        <main className="pt-16">{children}</main> 
        <Footer />
        <IntroLoader />
        <HelpBot /> 
>>>>>>> 0f802d0e38b8c488819d54c8f95ed221e988d32f
      </body>
    </html>
  );
}