

import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
       
        return null; 
    }
    
    return (
        <nav className="flex items-center justify-end">
            <div className="flex -space-x-px rounded-md shadow-sm">
                {links.map((link, key) => {
                   
                    const label = link.label
                        .replace('&laquo; Previous', '← Previous')
                        .replace('Next &raquo;', 'Next →');

                    return (
                        <Link
                            key={key}
                            href={link.url || '#'} 
                            className={`
                                relative inline-flex items-center px-4 py-2 text-sm font-medium border
                                ${link.active
                                    ? 'z-10 bg-blue-600 text-white border-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }
                                ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                                ${key === 0 ? 'rounded-l-md' : ''}
                                ${key === links.length - 1 ? 'rounded-r-md' : ''}
                            `}
                            
                            dangerouslySetInnerHTML={{ __html: label }}
                            preserveScroll 
                        />
                    );
                })}
            </div>
        </nav>
    );
}