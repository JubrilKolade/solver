import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';


interface CollabModeProps {
  currentProblem: string;
  onSolveProblem: (problem: string) => void;
}

interface ChatMessage {
  id: string;
  user: string;
  color: string;
  text: string;
  type: 'text' | 'problem' | 'solution';
  time: number;
}

const funNames = ['MathWizard', 'NumberNinja', 'AlgebraAce', 'CalcKing', 'GeoGuru', 'TrigTitan', 'StatsStar', 'ProbPro'];
const userColors = ['#ef4444', '#3b82f6', '#22c55e', '#a855f7', '#eab308', '#ec4899', '#14b8a6', '#f97316'];

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function CollabMode({ currentProblem, onSolveProblem }: CollabModeProps) {
  const { isDark } = useTheme();
  const [roomCode, setRoomCode] = useState('');
  const [joined, setJoined] = useState(false);
  const [joinInput, setJoinInput] = useState('');
  const [username] = useState(() => funNames[Math.floor(Math.random() * funNames.length)] + Math.floor(Math.random() * 100));
  const [userColor] = useState(() => userColors[Math.floor(Math.random() * userColors.length)]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [copyToast, setCopyToast] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    setJoined(true);
    setMessages([{
      id: Date.now().toString(),
      user: '🤖 System',
      color: 'var(--accent)',
      text: `Room ${code} created! Share this code with friends to collaborate.`,
      type: 'text',
      time: Date.now(),
    }]);
  };

  const joinRoom = () => {
    if (!joinInput.trim()) return;
    setRoomCode(joinInput.toUpperCase());
    setJoined(true);
    setMessages([{
      id: Date.now().toString(),
      user: '🤖 System',
      color: 'var(--accent)',
      text: `${username} joined room ${joinInput.toUpperCase()}!`,
      type: 'text',
      time: Date.now(),
    }]);
  };

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: username,
      color: userColor,
      text: inputMsg,
      type: 'text',
      time: Date.now(),
    }]);
    setInputMsg('');
  };

  const shareProblem = () => {
    if (!currentProblem) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: username,
      color: userColor,
      text: currentProblem,
      type: 'problem',
      time: Date.now(),
    }]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const leaveRoom = () => {
    setJoined(false);
    setRoomCode('');
    setMessages([]);
  };

  // Not joined yet
  if (!joined) {
    return (
      <div className="animate-fade-in-up">
        <div className="glass-card p-6 sm:p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-display mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
            👥 Collaborative Mode
          </h2>
          <p className="text-sm text-center mb-8" style={{ color: 'var(--text-muted)' }}>
            Solve math problems together with friends in real-time!
          </p>

          <div className="space-y-4">
            {/* Create room */}
            <button
              onClick={createRoom}
              className="w-full py-4 rounded-2xl font-display text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'var(--accent)',
                color: isDark ? '#0a0a0a' : '#fff',
                boxShadow: '0 4px 25px var(--accent-glow-strong)',
              }}
            >
              🏠 Create New Room
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-faint)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            </div>

            {/* Join room */}
            <div className="flex gap-2">
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && joinRoom()}
                placeholder="Enter room code..."
                maxLength={6}
                className="flex-1 px-4 py-3 rounded-xl text-base font-mono text-center uppercase tracking-widest focus:outline-none"
                style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
              <button
                onClick={joinRoom}
                disabled={!joinInput.trim()}
                className="px-6 py-3 rounded-xl font-display transition-all hover:scale-105 disabled:opacity-40"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
              >
                Join →
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 p-4 rounded-xl border" style={{ background: 'var(--bg-subtle)', borderColor: 'var(--border-color)' }}>
            <p className="text-sm font-display mb-2" style={{ color: 'var(--text-primary)' }}>ℹ️ How it works</p>
            <ul className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
              <li>• Create a room and share the code with friends</li>
              <li>• Chat and discuss math problems together</li>
              <li>• Share problems from the solver</li>
              <li>• Anyone can click to solve shared problems</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Chat room
  return (
    <div className="animate-fade-in-up">
      <div className="glass-card overflow-hidden" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Room header */}
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">👥</span>
            <div>
              <p className="font-display text-sm" style={{ color: 'var(--text-primary)' }}>Room: {roomCode}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your name: <span style={{ color: userColor }}>{username}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
            >
              {copyToast ? '✓ Copied!' : '📋 Copy Code'}
            </button>
            <button
              onClick={shareProblem}
              disabled={!currentProblem}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105 disabled:opacity-40"
              style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--border-accent)' }}
            >
              📤 Share Problem
            </button>
            <button
              onClick={leaveRoom}
              className="px-3 py-1.5 rounded-lg text-xs transition-all hover:scale-105"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
            >
              Leave
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 h-96 overflow-y-auto custom-scrollbar space-y-3" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)' }}>
          {messages.map((msg) => (
            <div key={msg.id} className="animate-fade-in-up">
              {msg.type === 'problem' ? (
                <div className="p-3 rounded-xl border" style={{ background: 'var(--accent-glow)', borderColor: 'var(--border-accent)' }}>
                  <p className="text-xs mb-1" style={{ color: msg.color }}>
                    {msg.user} shared a problem:
                  </p>
                  <p className="font-mono text-sm mb-2" style={{ color: 'var(--text-primary)' }}>{msg.text}</p>
                  <button
                    onClick={() => onSolveProblem(msg.text)}
                    className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                    style={{ background: 'var(--accent)', color: isDark ? '#0a0a0a' : '#fff' }}
                  >
                    Solve this →
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${msg.color}20`, color: msg.color }}>
                    {msg.user[0]}
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: msg.color }}>
                      {msg.user}
                      <span className="ml-2" style={{ color: 'var(--text-faint)' }}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>{msg.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t flex gap-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-subtle)' }}>
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-body focus:outline-none"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={sendMessage}
            disabled={!inputMsg.trim()}
            className="px-5 py-2.5 rounded-xl font-display text-sm transition-all hover:scale-105 disabled:opacity-40"
            style={{ background: 'var(--accent)', color: isDark ? '#0a0a0a' : '#fff' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
