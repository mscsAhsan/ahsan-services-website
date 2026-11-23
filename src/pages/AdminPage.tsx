import { useCallback, useEffect, useState } from 'react';
import {
  Envelope,
  EnvelopeOpen,
  ChatCircle,
  ChartBar,
  SignOut,
  Trash,
  MagnifyingGlass,
  ArrowClockwise,
  Lock,
  ShieldCheck,
  WarningCircle,
} from 'phosphor-react';
import { PageGlow, SectionDivider } from '../components/SiteFX';

const TOKEN_KEY = 'portfolio_admin_token';

type AdminMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: number;
};

type ChatQuery = {
  id: number;
  question: string;
  answer: string;
  created_at: string;
};

type Stats = {
  messages: number;
  unreadMessages: number;
  queries: number;
  queriesToday: number;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AdminPage = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [notConfigured, setNotConfigured] = useState(false);
  const [tab, setTab] = useState<'messages' | 'queries'>('messages');
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [queries, setQueries] = useState<ChatQuery[]>([]);
  const [messageSearch, setMessageSearch] = useState('');
  const [querySearch, setQuerySearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setStats(null);
    setMessages([]);
    setQueries([]);
    setPassword('');
    setLoginError('');
  }, []);

  const authFetch = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(path, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });
      if (res.status === 401) {
        logout();
        throw new Error('Your session expired. Please log in again.');
      }
      return res;
    },
    [logout]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, messagesRes, queriesRes] = await Promise.all([
        authFetch('/api/admin/stats'),
        authFetch(`/api/admin/messages${unreadOnly ? '?unread_only=1' : ''}`),
        authFetch('/api/admin/queries'),
      ]);
      if (!statsRes.ok || !messagesRes.ok || !queriesRes.ok) {
        throw new Error('Could not load the dashboard. Please try again.');
      }
      const statsData = await statsRes.json();
      const messagesData = await messagesRes.json();
      const queriesData = await queriesRes.json();
      setStats(statsData);
      setMessages(messagesData.messages || []);
      setQueries(queriesData.queries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the dashboard.');
    } finally {
      setLoading(false);
    }
  }, [authFetch, unreadOnly]);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    setAuthed(true);
  }, []);

  useEffect(() => {
    if (authed) loadAll();
  }, [authed, loadAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError('');
    setNotConfigured(false);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 && data.error === 'ADMIN_NOT_CONFIGURED') {
        setNotConfigured(true);
        return;
      }
      if (res.status === 401) {
        setLoginError('Wrong password. Please try again.');
        return;
      }
      if (!res.ok || !data.token) {
        setLoginError('Login failed. Please try again.');
        return;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setPassword('');
      setAuthed(true);
    } catch {
      setLoginError('Could not reach the server. Please check your connection and try again.');
    } finally {
      setLoginBusy(false);
    }
  };

  const markRead = async (id: number, isRead: boolean) => {
    try {
      const res = await authFetch(`/api/admin/messages?id=${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_read: isRead }),
      });
      if (!res.ok) throw new Error('Could not update the message.');
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: isRead ? 1 : 0 } : m))
      );
      setStats((prev) =>
        prev ? { ...prev, unreadMessages: prev.unreadMessages + (isRead ? -1 : 1) } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the message.');
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    try {
      const res = await authFetch(`/api/admin/messages?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete the message.');
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setNotice('Message deleted.');
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the message.');
    }
  };

  const deleteQuery = async (id: number) => {
    if (!window.confirm('Delete this chat query? This cannot be undone.')) return;
    try {
      const res = await authFetch(`/api/admin/queries?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete the query.');
      setQueries((prev) => prev.filter((q) => q.id !== id));
      setNotice('Chat query deleted.');
      loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the query.');
    }
  };

  const filteredMessages = messages.filter((m) => {
    const q = messageSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  const filteredQueries = queries.filter((q) => {
    const s = querySearch.trim().toLowerCase();
    if (!s) return true;
    return (
      q.question.toLowerCase().includes(s) || q.answer.toLowerCase().includes(s)
    );
  });

  if (!authed) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <PageGlow />
        <div className="container mx-auto max-w-lg px-6 py-24 relative z-10">
          <div className="text-center mb-10">
            <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Admin
            </p>
            <h1 data-reveal data-delay="0.05" className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              Admin <span className="text-primary">Dashboard</span>
            </h1>
            <p data-reveal data-delay="0.1" className="text-muted-foreground leading-relaxed">
              Sign in to view contact messages and chatbot queries.
            </p>
          </div>

          <form
            data-reveal
            data-delay="0.15"
            onSubmit={handleLogin}
            className="glass rounded-2xl p-6 md:p-8 space-y-6"
          >
            <div>
              <label htmlFor="admin-password" className="block text-foreground mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  id="admin-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3 bg-input glass border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Enter your admin password"
                />
              </div>
            </div>

            {loginError && (
              <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                <WarningCircle size={18} />
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginBusy}
              className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-primary text-primary-foreground rounded-full font-medium hover:shadow-glow-primary transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              <ShieldCheck size={20} />
              {loginBusy ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {notConfigured && (
            <div data-reveal className="glass rounded-2xl p-6 mt-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">
                Admin access is not set up yet
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground leading-relaxed">
                <li>Open your Vercel project, then Settings - Environment Variables.</li>
                <li>Add a variable named ADMIN_PASSWORD with a strong password.</li>
                <li>Redeploy the project so the new variable takes effect.</li>
                <li>Come back here and sign in with that password.</li>
              </ol>
              <p className="text-sm text-muted-foreground/80 mt-4">
                The database connection comes from the Turso Vercel integration
                (TURSO_DATABASE_URL and TURSO_AUTH_TOKEN).
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total messages', value: stats ? stats.messages : '-', icon: Envelope },
    { label: 'Unread messages', value: stats ? stats.unreadMessages : '-', icon: EnvelopeOpen },
    { label: 'Chat queries', value: stats ? stats.queries : '-', icon: ChatCircle },
    { label: 'Queries today', value: stats ? stats.queriesToday : '-', icon: ChartBar },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PageGlow />
      <div className="container mx-auto max-w-6xl px-6 py-12 md:py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <p data-reveal className="font-mono text-xs tracking-[0.25em] uppercase text-primary mb-3">
              <span aria-hidden="true" className="mr-2 inline-block h-px w-8 shrink-0 bg-gradient-primary align-middle" />Admin Dashboard
            </p>
            <h1 data-reveal data-delay="0.05" className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              Inbox <span className="text-primary">&amp; Queries</span>
            </h1>
            <p data-reveal data-delay="0.1" className="text-muted-foreground mt-3">
              Contact messages from the site and questions asked to the chatbot.
            </p>
          </div>
          <button
            data-reveal
            onClick={logout}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 glass border border-border rounded-full font-medium text-foreground hover:shadow-glow-primary transition-all duration-300 hover:scale-105 self-start md:self-auto"
          >
            <SignOut size={18} />
            Log out
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              data-reveal
              data-delay={String(i * 0.08)}
              className="glass rounded-2xl px-4 py-5 md:px-6 md:py-6"
            >
              <div className="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center mb-3">
                <card.icon size={22} className="text-primary-foreground" />
              </div>
              <p className="font-display text-3xl md:text-4xl font-semibold text-primary">
                {card.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm font-medium text-destructive mb-6">
            <WarningCircle size={18} />
            {error}
          </p>
        )}
        {notice && (
          <p className="text-sm font-medium text-secondary mb-6">{notice}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => setTab('messages')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              tab === 'messages'
                ? 'bg-gradient-primary text-primary-foreground shadow-glow-primary'
                : 'glass border border-border text-foreground hover:scale-105'
            }`}
          >
            Messages {stats ? `(${stats.messages})` : ''}
          </button>
          <button
            onClick={() => setTab('queries')}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              tab === 'queries'
                ? 'bg-gradient-primary text-primary-foreground shadow-glow-primary'
                : 'glass border border-border text-foreground hover:scale-105'
            }`}
          >
            Chat Queries {stats ? `(${stats.queries})` : ''}
          </button>
          <button
            onClick={loadAll}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-3 glass border border-border rounded-full font-medium text-foreground hover:shadow-glow-primary transition-all duration-300 disabled:opacity-60"
          >
            <ArrowClockwise size={18} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {tab === 'messages' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <MagnifyingGlass
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-input glass border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  placeholder="Search by name, email or message..."
                />
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-3 glass border border-border rounded-lg cursor-pointer text-foreground text-sm font-medium">
                <input
                  type="checkbox"
                  checked={unreadOnly}
                  onChange={(e) => setUnreadOnly(e.target.checked)}
                  className="accent-primary"
                />
                Unread only
              </label>
            </div>

            {loading && messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Loading messages...</p>
            ) : filteredMessages.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <Envelope size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-foreground font-medium">No messages yet</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Messages sent through the contact form will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((m) => (
                  <article
                    key={m.id}
                    data-reveal
                    className={`glass rounded-2xl p-5 md:p-6 ${
                      m.is_read ? '' : 'ring-2 ring-primary/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <p className="font-display text-xl font-semibold text-foreground">
                          {m.name}
                          {!m.is_read && (
                            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full align-middle">
                              New
                            </span>
                          )}
                        </p>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-sm text-primary hover:underline break-all"
                        >
                          {m.email}
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground shrink-0">
                        {formatDate(m.created_at)}
                      </p>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-4">
                      {m.message}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => markRead(m.id, !m.is_read)}
                        className="inline-flex items-center gap-2 px-4 py-2 glass border border-border rounded-full text-sm font-medium text-foreground hover:shadow-glow-primary transition-all duration-300"
                      >
                        <EnvelopeOpen size={16} />
                        {m.is_read ? 'Mark unread' : 'Mark read'}
                      </button>
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 glass border border-border rounded-full text-sm font-medium text-destructive hover:shadow-glow-primary transition-all duration-300"
                      >
                        <Trash size={16} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'queries' && (
          <div>
            <div className="relative mb-6">
              <MagnifyingGlass
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-input glass border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="Search questions or answers..."
              />
            </div>

            {loading && queries.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">Loading chat queries...</p>
            ) : filteredQueries.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center">
                <ChatCircle size={32} className="mx-auto mb-3 text-muted-foreground" />
                <p className="text-foreground font-medium">No chat queries yet</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Questions asked to the chatbot will be logged here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQueries.map((q) => (
                  <article key={q.id} data-reveal className="glass rounded-2xl p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <p className="font-display text-lg font-semibold text-foreground">
                        {q.question}
                      </p>
                      <p className="text-sm text-muted-foreground shrink-0">
                        {formatDate(q.created_at)}
                      </p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-4">
                      {q.answer}
                    </p>
                    <button
                      onClick={() => deleteQuery(q.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 glass border border-border rounded-full text-sm font-medium text-destructive hover:shadow-glow-primary transition-all duration-300"
                    >
                      <Trash size={16} />
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        <SectionDivider />
      </div>
    </div>
  );
};

export default AdminPage;
