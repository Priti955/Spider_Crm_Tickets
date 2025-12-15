import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Utility function for Status Badges (Kept bright for contrast against dark tables)
const getStatusClasses = (status) => {
    switch (status) {
        case 'pending':
            return 'bg-yellow-400 text-gray-900'; // Bright Yellow
        case 'inprogress':
            return 'bg-blue-500 text-white';     // Bright Blue
        case 'completed':
            return 'bg-green-500 text-white';    // Bright Green
        case 'onhold':
            return 'bg-gray-500 text-white';     // Medium Gray
        default:
            return 'bg-gray-400 text-gray-900';
    }
};

export default function Dashboard({ 
    users = {}, 
    totalTickets = 0, 
    activeTickets = 0, 
    auth_user,
    viewType = 'user',
    recentUserTickets = [],
}) {
    const userList = users.data || [];
   
    const dashboardTitle = viewType === 'admin' 
        ? <h2 className="text-xl font-semibold leading-tight text-white">Admin Dashboard</h2> 
        : <h2 className="text-xl font-semibold leading-tight text-white">{`Welcome, ${auth_user?.name}`}</h2>;

    return (
        <AuthenticatedLayout 
            
            header={dashboardTitle}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden sm:rounded-lg">
                        
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            
                           
                            {viewType === 'admin' && (
                                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-blue-500 hover:bg-gray-700 transform transition duration-200">
                                    <h3 className="text-lg font-semibold text-blue-400 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20v-2a3 3 0 00-5.356-1.857M9 20v-2a3 3 0 00-5.356-1.857M9 20h5v-2a3 3 0 00-5.356-1.857M11 10a4 4 0 11-8 0 4 4 0 018 0zM17 10a4 4 0 11-8 0 4 4 0 018 0zM12 14a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        Total Users
                                    </h3>
                                    <p className="mt-2 text-3xl font-bold text-white">{users.total || 0}</p>
                                </div>
                            )}
                            
                            
                            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-indigo-500 hover:bg-gray-700 transform transition duration-200">
                                <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    Total Tickets
                                </h3>
                                <p className="mt-2 text-3xl font-bold text-white">{totalTickets}</p>
                            </div>
                            
                          
                            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-red-500 hover:bg-gray-700 transform transition duration-200">
                                <h3 className="text-lg font-semibold text-red-400 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Active Tickets
                                </h3>
                                <p className="mt-2 text-3xl font-bold text-white">{activeTickets}</p>
                            </div>
                            
                            
                            {/* <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-green-500 hover:bg-gray-700 transform transition duration-200">
                                <h3 className="text-lg font-semibold text-green-400 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Solved Today
                                </h3>
                                <p className="mt-2 text-3xl font-bold text-white"></p>
                            </div> */}
                        </div>

                       
                        {viewType === 'admin' && (
                            <div className="bg-gray-800 shadow-2xl rounded-xl p-6 mb-8 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4 text-blue-400">All System Users</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border-collapse text-gray-300">
                                        <thead>
                                            
                                            <tr className="bg-gray-700 text-blue-300 text-sm uppercase">
                                                <th className="px-6 py-3 text-left border-b-2 border-gray-600">Name</th>
                                                <th className="px-6 py-3 text-left border-b-2 border-gray-600">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userList.map(u => (
                                                
                                                <tr key={u.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                                                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                                                    <td className="px-6 py-4">{u.email}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        
                       
                        {viewType === 'user' && recentUserTickets.length > 0 ? (
                            <div className="bg-gray-800 shadow-2xl rounded-xl p-6 border border-gray-700">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-blue-400">My Recent Tickets</h3>
                                    <Link href={route('tickets.index')} className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition">
                                        View All &rarr;
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto border-collapse text-gray-300">
                                        <thead>
                                            <tr className="bg-gray-700 text-gray-300 text-sm uppercase">
                                                <th className="px-6 py-3 text-left border-b-2 border-gray-600">Title</th>
                                                <th className="px-6 py-3 text-left border-b-2 border-gray-600">Status</th>
                                                <th className="px-6 py-3 text-left border-b-2 border-gray-600">Created</th>
                                                <th className="px-6 py-3 text-left border-b-2 border-gray-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentUserTickets.map(ticket => (
                                                <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                                                    <td className="px-6 py-4 font-medium text-white">{ticket.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${getStatusClasses(ticket.status)}`}>
                                                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">{ticket.created_at_formatted || 'N/A'}</td> 
                                                    <td className="px-6 py-4 text-sm">
                                                        <Link href={route('tickets.show', ticket.id)} className="text-blue-400 hover:underline">
                                                            View
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
                                <p className="text-lg text-gray-400 mb-4">You have no recent tickets to display.</p>
                                <Link 
                                    href={route('tickets.create')} 
                                    // Primary Call to Action Button
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition ease-in-out duration-150"
                                >
                                    Create Your First Ticket
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}