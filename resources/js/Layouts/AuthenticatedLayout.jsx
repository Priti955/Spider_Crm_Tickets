import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isAdmin = user && user.is_admin;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Sidebar Link Helper Component
    const SidebarLink = ({ href, active, children, icon }) => (
        <Link
            href={href}
            className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group mb-1 ${
                active 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <span className={`mr-3 text-lg ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
                {icon}
            </span>
            {isSidebarOpen && <span>{children}</span>}
        </Link>
    );

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* --- SIDEBAR --- */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col fixed inset-y-0 z-50`}
            >
                {/* Logo Area */}
                <div className="flex h-16 items-center justify-center border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-8 w-auto fill-current text-indigo-500" />
                        {isSidebarOpen && <span className="text-white font-bold tracking-tight text-xl">CRM<span className="text-indigo-500">Ticket</span></span>}
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 py-6 overflow-y-auto">
                    <SidebarLink href={route('dashboard')} active={route().current('dashboard')} icon="📊">
                        Dashboard
                    </SidebarLink>
                    
                    <SidebarLink href={route('tickets.index')} active={route().current('tickets.*')} icon="🎫">
                        Tickets
                    </SidebarLink>

                    {isAdmin && (
                        <>
                            <div className={`mt-6 mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500 ${!isSidebarOpen && 'hidden'}`}>
                                Administration
                            </div>
                            <SidebarLink href={route('users.index')} active={route().current('users.*')} icon="👥">
                                User Management
                            </SidebarLink>
                        </>
                    )}
                </nav>

                {/* Bottom Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-4 border-t border-slate-800 text-slate-500 hover:text-white flex justify-center transition-colors"
                >
                    {isSidebarOpen ? '⇠ Collapse' : '⇢'}
                </button>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-20'}`}>
                
                {/* Top Header/Navbar */}
                <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div>
                        {header ? header : <h1 className="text-slate-400 text-sm">Main / Overview</h1>}
                    </div>

                    <div className="flex items-center gap-4">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition group">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs text-white shadow-md group-hover:bg-indigo-500">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden md:inline">{user.name}</span>
                                    <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="right" width="48" contentClasses="bg-slate-800 border border-slate-700 py-1">
                                <Dropdown.Link href={route('profile.edit')} className="text-slate-300 hover:bg-slate-700">Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-400 hover:bg-slate-700">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 animate-in fade-in duration-500">
                    {children}
                </main>

                {/* Footer */}
                <footer className="mt-auto py-6 px-8 border-t border-slate-900 text-slate-600 text-xs flex justify-between items-center bg-slate-950">
                    <p>&copy; 2025 SupportPro Management System.</p>
                    <div className="flex gap-4">
                        <button className="hover:text-slate-400 transition">Privacy Policy</button>
                        <button className="hover:text-slate-400 transition">Support</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}