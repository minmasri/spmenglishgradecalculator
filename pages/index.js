import { useState } from 'react';

export default function Home() {
  const [writing, setWriting] = useState('');
  const [reading, setReading] = useState('');
  const [listening, setListening] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [target, setTarget] = useState('');
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');

  const weights = {
    writing: 0.25,
    reading: 0.25,
    listening: 0.25,
    speaking: 0.25
  };

  const maxMarks = {
    writing: 60,
    reading: 40,
    listening: 30,
    speaking: 24
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'A-';
    if (percentage >= 65) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 55) return 'C+';
    if (percentage >= 50) return 'C';
    if (percentage >= 45) return 'D';
    if (percentage >= 40) return 'E';
    return 'G';
  };

  const calculate = () => {
    const scores = { writing, reading, listening, speaking };
    let total = 0;
    Object.entries(scores).forEach(([key, val]) => {
      if (val) {
        const percent = (Number(val) / maxMarks[key]) * weights[key] * 100;
        total += percent;
      }
    });
    return {
      percentage: total.toFixed(2),
      grade: getGrade(total)
    };
  };

  const getETR = () => {
    const targetScore = Number(target);
    const current = calculate();
    const remainingPapers = [];

    if (!writing) remainingPapers.push('writing');
    if (!reading) remainingPapers.push('reading');
    if (!listening) remainingPapers.push('listening');
    if (!speaking) remainingPapers.push('speaking');

    const remaining = targetScore - current.percentage;

    if (remainingPapers.length === 0) {
      return current.percentage >= targetScore
        ? { message: "🎉 You've already reached your target! Great job!" }
        : { message: `⚠️ Your target is out of reach. You can score up to ${current.percentage}%. Keep trying — you're doing great!` };
    }

    const neededPerPaper = (remaining / remainingPapers.length) / 0.25;
    const results = {};
    let impossible = false;

    remainingPapers.forEach(paper => {
      const raw = (neededPerPaper / 100) * maxMarks[paper];
      const capped = Math.min(raw, maxMarks[paper]);
      results[paper] = {
        required: capped.toFixed(1),
        note: raw > maxMarks[paper]
          ? `⚠️ Max for ${paper} is ${maxMarks[paper]}. Give it your best shot!`
          : null
      };
      if (raw > maxMarks[paper]) impossible = true;
    });

    if (impossible) {
      results.overallNote = `🚫 You can no longer reach ${targetScore}%. But you can still aim for your personal best! 💪`;
    }

    return results;
  };

  const resetAll = () => {
    setStudentName('');
    setDate('');
    setWriting('');
    setReading('');
    setListening('');
    setSpeaking('');
    setTarget('');
  };

  const score = calculate();
  const etr = target ? getETR() : null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">

        {/* Header with Reset + Print buttons */}
        <div className="flex justify-between items-center space-x-2">
          <h1 className="text-xl font-bold">🎯 SPM CEFR English Grade Estimator</h1>
          <div className="flex space-x-2">
            <button
              onClick={resetAll}
              className="text-sm bg-red-500 text-white px-3 py-1 rounded"
            >
              Reset All
            </button>
            <button
              onClick={() => window.print()}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
            >
              Print Report
            </button>
          </div>
        </div>

        {/* Student info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="p-2 border rounded" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Date (e.g. 9 April 2025)" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {/* Target */}
        <input className="w-full p-2 border rounded" placeholder="Target (ETR) % (e.g. 85)" type="number" value={target} onChange={(e) => setTarget(e.target.value)} />

        {/* ETR Results */}
        {target && (
          <div className="bg-blue-50 p-4 rounded-lg shadow-md space-y-2">
            <p className="font-semibold text-blue-900">ETR — To Reach {target}%</p>
            {etr.message ? (
              <p>{etr.message}</p>
            ) : (
              <>
                {Object.entries(etr).filter(([k]) => k !== 'overallNote').map(([paper, val]) => (
                  <div key={paper}>
                    <p className="text-lg font-semibold">
                      You need <strong>{val.required}</strong> marks in <em>{paper}</em>
                    </p>
                    {val.note && <p className="text-red-500 text-sm">{val.note}</p>}
                  </div>
                ))}
                {etr.overallNote && <p className="text-red-600 font-semibold">{etr.overallNote}</p>}
              </>
            )}
          </div>
        )}

        <div className="h-4" />

        {/* Paper Inputs in Correct Order */}
        <div className="space-y-4">
          <input className="w-full p-2 border rounded shadow-sm" placeholder="Paper 1 (Reading) /40" type="number" value={reading} onChange={(e) => setReading(e.target.value)} />
          <input className="w-full p-2 border rounded shadow-sm" placeholder="Paper 2 (Writing) /60" type="number" value={writing} onChange={(e) => setWriting(e.target.value)} />
          <input className="w-full p-2 border rounded shadow-sm" placeholder="Paper 3 (Speaking) /24" type="number" value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
          <input className="w-full p-2 border rounded shadow-sm" placeholder="Paper 4 (Listening) /30" type="number" value={listening} onChange={(e) => setListening(e.target.value)} />
        </div>

        {/* Score Summary */}
        <div className="bg-green-50 p-4 rounded-lg shadow-md mt-4 space-y-2">
          <p><strong>Student Name:</strong> {studentName || "—"}</p>
          <p><strong>Date:</strong> {date || "—"}</p>
          <p><strong>Current Estimated Total:</strong> {score.percentage}%</p>
          <p><strong>Estimated Grade:</strong> {score.grade}</p>
        </div>

        {/* Footer */}
        <footer className="text-xs text-center pt-4 border-t">
          <p>Made with 💙 for SPM candidates</p>
          <p>Created by Nur Syahmin Alya Masri · SMKA Kuala Lipis · PPPDG10 · <a className="text-blue-500" href="mailto:n.syahminalya@gmail.com">n.syahminalya@gmail.com</a></p>
        </footer>
      </div>
    </div>
  );
}
