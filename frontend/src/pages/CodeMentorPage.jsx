import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { askCodeMentor } from '../api/ai.js';
import { Button } from '../components/ui/Button.jsx';


const LANGUAGES = ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'Other'];


export default function CodeMentorPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    try {
      const res = await askCodeMentor({ code, language, question });
      setAnswer(res.data.answer);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-brand-500" />
        <h1 className="text-2xl font-bold text-ink-900">Code Mentor AI</h1>
      </div>
      <p className="mt-1 text-sm text-ink-600">
        Paste your code and get an explanation, feedback, or answers to your questions.
      </p>

     <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-card bg-surface-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <label className="text-sm font-medium text-ink-900">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-control border border-border-muted px-3 py-1.5 text-sm outline-none sm:w-auto"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code here…"
          rows={10}
          required
          className="w-full rounded-control border border-border-muted bg-surface-page px-3 py-2.5 font-mono text-sm outline-none focus:border-brand-500"
        />


        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Optional: ask a specific question (e.g. 'why does this loop twice?')"
          className="w-full rounded-control border border-border-muted px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />


        <Button type="submit" disabled={loading || !code.trim()}>
          {loading ? 'Thinking…' : 'Ask Code Mentor'}
        </Button>
      </form>


      {error && (
        <p className="mt-4 rounded-control bg-red-50 p-4 text-sm text-danger-500">{error}</p>
      )}


      {answer && (
        <div className="mt-6 rounded-card bg-surface-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-ink-900">Mentor's response</h2>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

