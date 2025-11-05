import './globals.css';
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
        <main>{children}</main> 
        <IntroLoader />
        <HelpBot /> 
      </body>
    </html>
  );
}
