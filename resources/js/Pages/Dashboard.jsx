import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

const getStatusClasses = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-400 text-gray-900';
        case 'inprogress':
            return 'bg-blue-500 text-white';
        case 'completed':
            return 'bg-green-500 text-white';
        case 'onhold':
            return 'bg-gray-500 text-white';
        default:
            return 'bg-gray-400 text-gray-900';
    }
};

export default function Dashboard({
    users = {}, // Paginated users for Superadmin
    totalTickets = 0,
    activeTickets = 0,
    auth_user,
    viewType = 'user', // 'superadmin', 'admin', or 'user'
    recentUserTickets = [],
    totalUsersCount = 0, // New prop for Superadmin
}) {
    const userList = users?.data || [];

    // Header Logic
    const getDashboardTitle = () => {
        if (viewType === 'superadmin') return "System Master Control";
        if (viewType === 'admin') return "Ticket Administration";
        return `Welcome, ${auth_user?.name}`;
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-white">{getDashboardTitle()}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    
                    {/* STAT CARDS SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        
                        {/* Total Users - Visible ONLY to Superadmin */}
                        {viewType === 'superadmin' && (
                            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-purple-500 hover:bg-gray-700 transition duration-200">
                                <h3 className="text-lg font-semibold text-purple-400 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    Total System Users
                                </h3>
                                <p className="mt-2 text-3xl font-bold text-white">{totalUsersCount}</p>
                            </div>
                        )}

                        {/* Total Tickets - Visible to Admins/Superadmins */}
                        {(viewType === 'admin' || viewType === 'superadmin') && (
                            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-indigo-500 hover:bg-gray-700 transition duration-200">
                                <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    All Tickets
                                </h3>
                                <p className="mt-2 text-3xl font-bold text-white">{totalTickets}</p>
                            </div>
                        )}

                        {/* Active Tickets - Visible to everyone */}
                        <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-red-500 hover:bg-gray-700 transition duration-200">
                            <h3 className="text-lg font-semibold text-red-400 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                {viewType === 'user' ? 'My Active Tickets' : 'System Active Tickets'}
                            </h3>
                            <p className="mt-2 text-3xl font-bold text-white">{activeTickets}</p>
                        </div>
                    </div>

                    {viewType === 'superadmin' && userList.length > 0 && (
                        <div className="bg-gray-800 shadow-2xl rounded-xl p-6 mb-8 border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-purple-400">Recent System Users</h3>
                                <Link href={route('users.index')} className="text-sm font-semibold text-purple-400 hover:text-purple-300 underline">
                                    Manage All Users &rarr;
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto text-gray-300">
                                    <thead>
                                        <tr className="bg-gray-700 text-purple-300 text-sm uppercase">
                                            <th className="px-6 py-3 text-left">Name</th>
                                            <th className="px-6 py-3 text-left">Email</th>
                                            <th className="px-6 py-3 text-left">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userList.map(u => (
                                            <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                                                <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                                                <td className="px-6 py-4">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded bg-gray-900 text-xs font-mono">{u.role}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    
                    {recentUserTickets.length > 0 ? (
                        <div className="bg-gray-800 shadow-2xl rounded-xl p-6 border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-blue-400">
                                    {viewType === 'admin' ? 'Recent Global Tickets' : 'My Recent Tickets'}
                                </h3>
                                <Link href={route('tickets.index')} className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition">
                                    View All Tickets &rarr;
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto text-gray-300">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-300 text-sm uppercase">
                                            <th className="px-6 py-3 text-left">Title</th>
                                            <th className="px-6 py-3 text-left">Status</th>
                                            <th className="px-6 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUserTickets.map(ticket => (
                                            <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                                                <td className="px-6 py-4 font-medium text-white">{ticket.name}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusClasses(ticket.status)}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={route('tickets.show', ticket.id)} className="text-blue-400 hover:underline">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : viewType === 'user' && (
                        <div className="bg-gray-800 p-10 text-center rounded-xl shadow-2xl border border-gray-700">
                            <p className="text-lg text-gray-400 mb-4">You have no active tickets.</p>
                            <Link 
                                href={route('tickets.create')} 
                                className="inline-flex items-center px-4 py-2 bg-blue-600 rounded-md font-semibold text-xs text-white uppercase hover:bg-blue-500 transition"
                            >
                                Create New Ticket
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}