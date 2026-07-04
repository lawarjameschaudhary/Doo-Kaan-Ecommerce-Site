import { useState, useEffect } from 'react';
import { Mail, MailOpen } from 'lucide-react';
import { contactAPI } from '../../services/api';
import { formatDate } from '../../utils/format';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactAPI.list().then((res) => setMessages(res.data.results || res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="card p-4">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  {m.is_read ? <MailOpen size={16} className="text-gray-400" /> : <Mail size={16} className="text-primary" />}
                  <p className="font-semibold">{m.name}</p>
                  <span className="text-xs text-gray-400">({m.email})</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(m.created_at)}</span>
              </div>
              {m.subject && <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{m.subject}</p>}
              <p className="text-sm text-gray-600 dark:text-gray-300">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
