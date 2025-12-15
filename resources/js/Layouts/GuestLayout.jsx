import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
       
        <div className="flex min-h-screen flex-col items-center 
            bg-gradient-to-br from-black-900 to-blue-950 text-black
            pt-10 sm:justify-center sm:pt-0"
        >
            <div>
                <Link href="/">
                    
                    <ApplicationLogo className="h-20 w-20 fill-current text-black" /> 
                </Link>
            </div>

            
            <div className="mt-6 w-full overflow-hidden 
                bg-black/5 backdrop-blur-sm px-6 py-4 shadow-2xl border border-white/10 sm:max-w-md sm:rounded-xl"
            >
                {children}
            </div>
        </div>
    );
}