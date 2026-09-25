
export function ScoreGauge({ score }) {
  const color =
    score >= 75 ? 'text-success-text bg-success-bg' :
    score >= 50 ? 'text-brand-600 bg-brand-100' :
    'text-danger-500 bg-red-100';


  return (
    <div className={`flex size-24 flex-col items-center justify-center rounded-full ${color}`}>
      <span className="font-mono text-2xl font-bold">{score}</span>
      <span className="text-[10px] font-medium uppercase">ATS Score</span>
    </div>
  );
}
