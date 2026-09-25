
import { useState } from 'react';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { analyzeResume } from '../api/ai.js';
import { Button } from '../components/ui/Button.jsx';
import { ScoreGauge } from '../components/ai/ScoreGauge.jsx';


export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await analyzeResume(resumeText);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex items-center gap-2">
        <FileText className="size-5 text-brand-500" />
        <h1 className="text-2xl font-bold text-ink-900">AI Resume Analyzer</h1>
      </div>
      <p className="mt-1 text-sm text-ink-600">
        Paste your resume text below and get AI-powered feedback on strengths and areas to improve.
      </p>


      <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-card bg-surface-card p-4 shadow-sm sm:p-6">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text here (at least 50 characters)…"
          rows={12}
          required
          className="w-full rounded-control border border-border-muted bg-surface-page px-3 py-2.5 text-sm outline-none focus:border-brand-500"
        />
        <p className="text-xs text-ink-400">{resumeText.length} / 10,000 characters</p>


        <Button type="submit" disabled={loading || resumeText.trim().length < 50}>
          {loading ? 'Analyzing…' : 'Analyze my resume'}
        </Button>
      </form>


      {error && (
        <p className="mt-4 rounded-control bg-red-50 p-4 text-sm text-danger-500">{error}</p>
      )}


     {result && (
        <div className="mt-6 rounded-card bg-surface-card p-4 shadow-sm sm:p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <ScoreGauge score={result.atsScore} />
            <div>
              <h2 className="text-sm font-semibold text-ink-900">Your ATS Score</h2>
              <p className="mt-1 text-xs text-ink-600">
                How likely this resume is to pass an Applicant Tracking System scan.
              </p>
            </div>
          </div>


          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase text-success-text">
                <CheckCircle2 className="size-3.5" />
                Strengths
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-ink-600">
                {result.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-success-text">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>


            <div>
              <h3 className="flex items-center gap-1.5 text-xs font-semibold uppercase text-brand-600">
                <AlertCircle className="size-3.5" />
                Improvements
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-ink-600">
                {result.improvements.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-brand-500">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


