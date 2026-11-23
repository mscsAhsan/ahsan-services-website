import { useCallback, useEffect, useState } from "react";
import { Mail, MailOpen, MessageSquare, BarChart3, LogOut, Trash2, Search, RefreshCw, Lock, ShieldCheck, AlertTriangle } from "lucide-react";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/Reveal";

const TOKEN_KEY = "ahsan_services_admin_token";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const [tab, setTab] = useState("messages");
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [queries, setQueries] = useState([]);
  const [messageSearch, setMessageSearch] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dbMissing, setDbMissing] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setStats(null);
    setMessages([]);
    setQueries([]);
    setPassword("");
    setLoginError("");
  }, []);

  const authFetch = useCallback(
    async (path, options = {}) => {
      const token = localStorage.getItem(TOKEN_KEY);
      const res = await fetch(path, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });
      if (res.status === 401) {
        logout();
        throw new Error("Your session expired. Please log in again.");
      }
      return res;
    },
    [logout]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    setDbMissing(false);
    try {
      const [statsRes, messagesRes, queriesRes] = await Promise.all([
        authFetch("/api/admin/stats"),
        authFetch(`/api/admin/messages${unreadOnly ? "?unread_only=1" : ""}`),
        authFetch("/api/admin/queries"),
      ]);
      if (statsRes.status === 503 || messagesRes.status === 503 || queriesRes.status === 503) {
        setDbMissing(true);
        setStats(null);
        setMessages([]);
        setQueries([]);
        return;
      }
      if (!statsRes.ok || !messagesRes.ok || !queriesRes.ok) {
        throw new Error("Could not load the dashboard. Please try again.");
      }
      const statsData = await statsRes.json();
      const messagesData = await messagesRes.json();
      const queriesData = await queriesRes.json();
      setStats(statsData);
      setMessages(messagesData.messages || []);
      setQueries(queriesData.queries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the dashboard.");
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

  async function login(e) {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError("");
    setNotConfigured(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 503) {
        setNotConfigured(true);
        return;
      }
      if (!res.ok || !data.token) {
        setLoginError("Wrong password. Please try again.");
        return;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setAuthed(true);
      setPassword("");
    } catch {
      setLoginError("Could not reach the server. Please try again.");
    } finally {
      setLoginBusy(false);
    }
  }

  async function markRead(id, isRead) {
    try {
      const res = await authFetch(`/api/admin/messages?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_read: isRead }),
      });
      if (!res.ok) throw new Error("Could not update the message.");
      setMessages((list) => list.map((m) => (m.id === id ? { ...m, is_read: isRead ? 1 : 0 } : m)));
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message? This cannot be undone.")) return;
    try {
      const res = await authFetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the message.");
      setMessages((list) => list.filter((m) => m.id !== id));
      setNotice("Message deleted.");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteQuery(id) {
    if (!window.confirm("Delete this chat query? This cannot be undone.")) return;
    try {
      const res = await authFetch(`/api/admin/queries?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete the query.");
      setQueries((list) => list.filter((q) => q.id !== id));
      setNotice("Query deleted.");
      loadAll();
    } catch (err) {
      setError(err.message);
    }
  }

  const filteredMessages = messages.filter((m) => {
    const q = messageSearch.trim().toLowerCase();
    if (!q) return true;
    return `${m.name} ${m.email} ${m.message}`.toLowerCase().includes(q);
  });
  const filteredQueries = queries.filter((q) => {
    const s = querySearch.trim().toLowerCase();
    if (!s) return true;
    return `${q.question} ${q.answer}`.toLowerCase().includes(s);
  });

  if (!authed) {
    return (
      <div className="container page-top">
        <SectionHead kicker="Admin" title="Admin dashboard" sub="Sign in to read contact messages and chatbot questions." />
        <Reveal className="admin-login">
          {notConfigured ? (
            <div className="admin-setup">
              <ShieldCheck size={44} />
              <h3 className="h3">Admin is not set up yet</h3>
              <p className="muted">The dashboard needs two things before it can work:</p>
              <ol className="admin-steps">
                <li>Set <code>ADMIN_PASSWORD</code> in your hosting environment variables (Vercel: Project Settings, Environment Variables, all environments).</li>
                <li>Connect Turso and set <code>TURSO_DATABASE_URL</code> and <code>TURSO_AUTH_TOKEN</code> the same way.</li>
                <li>Redeploy the site so the new variables take effect.</li>
              </ol>
              <p className="muted">The contact form keeps working without these; only the dashboard needs them.</p>
              <button className="btn btn-ghost" onClick={() => setNotConfigured(false)}>Back to login</button>
            </div>
          ) : (
            <form className="form" onSubmit={login}>
              <label>Admin password
                <div className="admin-pass">
                  <Lock size={18} />
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your admin password" autoComplete="current-password" />
                </div>
              </label>
              {loginError && <div className="form-err">{loginError}</div>}
              <button className="btn btn-primary block" disabled={loginBusy}>
                {loginBusy ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    );
  }

  const statCards = [
    { icon: Mail, label: "Messages", value: stats ? stats.messages : "-" },
    { icon: MailOpen, label: "Unread", value: stats ? stats.unreadMessages : "-" },
    { icon: MessageSquare, label: "Chat queries", value: stats ? stats.queries : "-" },
    { icon: BarChart3, label: "Queries today", value: stats ? stats.queriesToday : "-" },
  ];

  return (
    <div className="container page-top">
      <div className="admin-head">
        <SectionHead kicker="Admin" title="Dashboard" sub="Contact messages and chatbot questions, newest first." />
        <div className="admin-actions">
          <button className="btn btn-ghost sm" onClick={loadAll} disabled={loading}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-ghost sm" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </div>

      {error && <div className="form-err admin-err">{error} <button onClick={() => setError("")}>Dismiss</button></div>}
      {notice && <div className="admin-notice">{notice} <button onClick={() => setNotice("")}>Dismiss</button></div>}

      {dbMissing ? (
        <Reveal className="admin-setup">
          <AlertTriangle size={44} />
          <h3 className="h3">Database is not connected</h3>
          <p className="muted">The admin login worked, but Turso is not configured, so there are no stored messages to show. Set <code>TURSO_DATABASE_URL</code> and <code>TURSO_AUTH_TOKEN</code> in your hosting environment variables and redeploy. Locally, contact messages are saved to <code>server/messages.jsonl</code> instead.</p>
        </Reveal>
      ) : (
        <>
          <div className="admin-stats">
            {statCards.map((s) => (
              <Reveal key={s.label} className="admin-stat">
                <s.icon size={26} />
                <div className="admin-stat-num">{loading && stats === null ? "..." : s.value}</div>
                <div className="muted">{s.label}</div>
              </Reveal>
            ))}
          </div>

          <div className="admin-tabs">
            <button className={tab === "messages" ? "active" : ""} onClick={() => setTab("messages")}>
              <Mail size={16} /> Messages ({messages.length})
            </button>
            <button className={tab === "queries" ? "active" : ""} onClick={() => setTab("queries")}>
              <MessageSquare size={16} /> Chat queries ({queries.length})
            </button>
          </div>

          {tab === "messages" && (
            <div className="admin-list">
              <div className="admin-toolbar">
                <div className="admin-search">
                  <Search size={16} />
                  <input value={messageSearch} onChange={(e) => setMessageSearch(e.target.value)} placeholder="Search name, email or message..." />
                </div>
                <label className="admin-check">
                  <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} /> Unread only
                </label>
              </div>
              {loading && <p className="muted">Loading...</p>}
              {!loading && filteredMessages.length === 0 && <p className="muted">No messages yet.</p>}
              {filteredMessages.map((m) => (
                <article key={m.id} className={`admin-item ${m.is_read ? "" : "unread"}`}>
                  <div className="admin-item-head">
                    <strong>{m.name}</strong>
                    <a href={`mailto:${m.email}`}>{m.email}</a>
                    <span className="muted">{formatDate(m.created_at)}</span>
                    {!m.is_read && <span className="admin-badge">New</span>}
                  </div>
                  <p>{m.message}</p>
                  <div className="admin-item-actions">
                    <button onClick={() => markRead(m.id, !m.is_read)}>
                      {m.is_read ? <><Mail size={15} /> Mark unread</> : <><MailOpen size={15} /> Mark read</>}
                    </button>
                    <button className="danger" onClick={() => deleteMessage(m.id)}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {tab === "queries" && (
            <div className="admin-list">
              <div className="admin-toolbar">
                <div className="admin-search">
                  <Search size={16} />
                  <input value={querySearch} onChange={(e) => setQuerySearch(e.target.value)} placeholder="Search questions or answers..." />
                </div>
              </div>
              {loading && <p className="muted">Loading...</p>}
              {!loading && filteredQueries.length === 0 && <p className="muted">No chat queries yet.</p>}
              {filteredQueries.map((q) => (
                <article key={q.id} className="admin-item">
                  <div className="admin-item-head">
                    <strong>Q: {q.question}</strong>
                    <span className="muted">{formatDate(q.created_at)}</span>
                  </div>
                  <p className="muted">A: {q.answer}</p>
                  <div className="admin-item-actions">
                    <button className="danger" onClick={() => deleteQuery(q.id)}>
                      <Trash2 size={15} /> Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
