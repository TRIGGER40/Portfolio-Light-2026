import { useState, useCallback, useRef } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Insight {
  summary: string;
  keyword: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insight, setInsight] = useState<Insight | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const send = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || loading) return;

    // Cancel any ongoing typing animation
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Replace previous exchange — only show the latest Q&A
    const newMessages: Message[] = [
      { role: 'user', content: userMessage },
    ];

    setMessages(newMessages);
    setInsight(null);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const data = await res.json();
      const fullReply: string = data.reply ?? data.content ?? 'No response received.';

      // Add empty assistant bubble and stop loading spinner
      const withPlaceholder: Message[] = [...newMessages, { role: 'assistant', content: '' }];
      setMessages(withPlaceholder);
      setLoading(false);

      // Reveal the reply character-by-character via setInterval
      let i = 0;
      const CHARS_PER_TICK = 4;
      intervalRef.current = setInterval(() => {
        i += CHARS_PER_TICK;
        const slice = fullReply.slice(0, i);
        setMessages([...withPlaceholder.slice(0, -1), { role: 'assistant', content: slice }]);

        if (i >= fullReply.length) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          // Show final full content and insight
          setMessages([...withPlaceholder.slice(0, -1), { role: 'assistant', content: fullReply }]);
          if (data.insight?.summary && data.insight?.keyword) {
            setInsight(data.insight);
          }
        }
      }, 16);

    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setError("I'm having trouble connecting right now. Please try again.");
      setMessages([
        ...messages,
        { role: 'user', content: userMessage },
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Try asking me again, or reach out to Midhun directly at midhun2k14@gmail.com.",
        },
      ]);
      setLoading(false);
    }
  }, [messages, loading]);

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMessages([]);
    setError(null);
    setInsight(null);
  }, []);

  return { messages, loading, error, insight, send, clear };
}
