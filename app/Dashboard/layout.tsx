// app/Dashboard/layout.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  
   const cookieStore = await cookies();

  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    jwt.verify(token, JWT_SECRET); // You may destructure here if needed
    return <>{children}</>;
  } catch (err) {
    console.error('[JWT ERROR]', err);
    redirect('/login');
  }
}