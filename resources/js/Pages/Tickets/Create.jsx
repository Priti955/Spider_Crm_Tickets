import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        file: null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('tickets.store'), { 
            forceFormData: true,
            onSuccess: () => {
                // Optional: add any success logic here
            }
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('tickets.index')} className="text-slate-400 hover:text-white transition">
                        🎫 Tickets
                    </Link>
                    <span className="text-slate-600">/</span>
                    <h2 className="text-xl font-semibold text-white">New Submission</h2>
                </div>
            }
        >
            <Head title="Create Ticket" />

            <div className="max-w-4xl mx-auto py-4">
                <form onSubmit={submit} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 border-b border-slate-800 bg-slate-800/30">
                        <h1 className="text-2xl font-bold text-white">Ticket Submission Form</h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Fill out the details below to open a new support request.
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="p-8 space-y-6">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Ticket Name / Subject
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all ${
                                    errors.name ? 'border-red-500/50 ring-red-500/10' : 'border-slate-700 hover:border-slate-600'
                                }`}
                                placeholder="Brief summary of the issue"
                                required
                            />
                            {errors.name && <p className="text-red-400 text-xs mt-2 font-medium">{errors.name}</p>}
                        </div>

                        {/* Description Input */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Detailed Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={6}
                                className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all ${
                                    errors.description ? 'border-red-500/50 ring-red-500/10' : 'border-slate-700 hover:border-slate-600'
                                }`}
                                placeholder="Explain the problem in detail so we can help..."
                            />
                            {errors.description && <p className="text-red-400 text-xs mt-2 font-medium">{errors.description}</p>}
                        </div>

                        {/* File Upload Section */}
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl">
                            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                                Attachment (Optional)
                            </label>
                            <input
                                type="file"
                                onChange={e => setData('file', e.target.files[0])}
                                className="block w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/10 file:text-indigo-400 hover:file:bg-indigo-600/20 cursor-pointer transition-all"
                            />
                            <p className="mt-2 text-[11px] text-slate-500">Supported formats: Images, PDF, Zip (Max 10MB)</p>
                            {errors.file && <p className="text-red-400 text-xs mt-2">{errors.file}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-8 bg-slate-800/30 border-t border-slate-800 flex items-center justify-end gap-4">
                        <Link
                            href={route('tickets.index')}
                            className="text-slate-400 hover:text-white text-sm font-medium transition px-4 py-2"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Create Ticket'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}