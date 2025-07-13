import './globals.css';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import IntroLoader from './components/IntroLoader';
import HelpBot from '@/app/components/HelpBot'; 
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nyagrik',
  description: 'A modern legal tech platform',
};


export default function RootLayout({ children}: { children: React.ReactNode}) {
  return (
    <html lang='en'>
      <body>
      <Navbar/>
        <main className="pt-16">{children}</main> 
        <Footer />
        <IntroLoader />
        <HelpBot /> 
      </body>
    </html>
  );
}