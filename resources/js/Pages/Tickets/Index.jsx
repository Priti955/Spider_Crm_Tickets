import React from 'react';
import { Link } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import './tickets.css';

export default function Index({ tickets }) {

  function deleteTicket(id) {
    if (confirm("Are you sure you want to delete this ticket?")) {
      Inertia.delete(`/tickets/${id}`);
    }
  }

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h1>Tickets</h1>
        <Link href="/tickets/create" className="btn btn-create">
          Create Ticket
        </Link>
      </div>

      <table className="ticket-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Author</th>
            <th>Assigne</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.data.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>
                <span className={`status ${t.status}`}>{t.status}</span>
              </td>
              <td>{t.author?.name ?? '-'}</td>
              <td>{t.assignee?.name ?? '-'}</td>
              <td>
                {t.file_url ? (
                  <a href={t.file_url} target="_blank" rel="noreferrer" className="btn btn-file">
                    View
                  </a>
                ) : (
                  '-'
                )}
              </td>
              <td>
                <Link href={`/tickets/${t.id}`} className="btn btn-view">
                  View
                </Link>

                <Link href={`/tickets/${t.id}/edit`} className="btn btn-edit">
                  Edit
                </Link>

                <button
                  onClick={() => deleteTicket(t.id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tickets.links && (
        <div className="pagination">
          {tickets.links.map((link, idx) => (
            <span
              key={idx}
              className={link.active ? 'page active' : 'page'}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
