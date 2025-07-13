// Dashboard/layout.tsx
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
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string; userId: string };


        return <>{children}</>;
    } catch (err) {
        console.error('[JWT ERROR]', err);
        redirect('/login');
    }
}
