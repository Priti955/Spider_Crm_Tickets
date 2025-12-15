import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // <-- Import the Layout

export default function Create({ auth }) { // <-- Accept the auth prop if needed for layout

  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    file: null,
  });

  function submit(e) {
    e.preventDefault();
    // Setting forceFormData: true is correct for file uploads
    post(route('tickets.store'), { forceFormData: true });
  }

  return (
    // --- WRAPPER ADDED HERE ---
    <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Create New Ticket</h2>}
    >
        <Head title="Create Ticket" />

        {/* The main content area of the layout */}
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="bg-white p-6 overflow-hidden shadow-sm sm:rounded-lg">
                
                    {/* The original content is now placed inside the layout's content area */}
                    <h1 className="text-3xl font-bold mb-6 text-blue-900">Ticket Submission Form</h1>

                    <form
                        onSubmit={submit}
                        // encType is usually handled by Inertia's forceFormData but harmless to keep.
                        className="bg-white p-6 rounded-lg max-w-2xl mx-auto space-y-4"
                    >
                        {/* Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-blue-800">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                required
                            />
                            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1 font-semibold text-blue-800">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full p-2 rounded border border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                rows={4}
                            />
                            {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description}</div>}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block mb-1 font-semibold text-blue-800">Attachment (File)</label>
                            <input
                                type="file"
                                // Important: We use the second argument of setData for files
                                onChange={e => setData('file', e.target.files[0])}
                                className="w-full file:p-2 file:border-0 file:rounded-md file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.file && <div className="text-red-600 text-sm mt-1">{errors.file}</div>}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-6 justify-end">
                            <Link
                                href={route('tickets.index')}
                                className="bg-white border border-gray-400 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded font-semibold transition flex items-center"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition flex items-center ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Submitting...' : 'Create Ticket'}
                            </button>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
    // --- WRAPPER ENDS HERE ---
  );
}