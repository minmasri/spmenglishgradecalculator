import { useState } from 'react';

export default function Home() {
  const [writing, setWriting] = useState('');
  const [reading, setReading] = useState('');
  const [listening, setListening] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [target, setTarget] = useState('');
  const [studentName, setStudentName] = useState('');

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
    const totalScore = Number(current.percentage);
    const scores = { writing, reading, listening, speaking };
    const paperNotes = {};

    const totalReachedTarget = totalScore >= targetScore;
    
    Object.entries(scores).forEach(([paper, val]) => {
      const actual = Number(val) || 0;
      const max = maxMarks[paper];
      const weight = weights[paper];
      const required = (targetScore / 100) * max * weight * 100 / (weight * 100);
      const diff = required - actual;

      // Format notes
      if (totalReachedTarget) {
        paperNotes[paper] = `✅ On track (${actual} / ${max})`;
      } else {
        if (actual === 0) {
          paperNotes[paper] = `⚪ Not taken (need ${required.toFixed(1)})`;
        } else if (diff > max * 0.3) {
          paperNotes[paper] = `🔴 Far from target (${actual} / ${required.toFixed(1)})`;
        } else if (diff > max * 0.1) {
          paperNotes[paper] = `🟠 Needs improvement (${actual} / ${required.toFixed(1)})`;
        } else {
          paperNotes[paper] = `🟢 Close to target (${actual} / ${required.toFixed(1)})`;
        }
      }
    });

    return {
      paperNotes,
      overallNote: totalReachedTarget 
        ? `🎉 You've reached your target of ${targetScore}%!`
        : `You need ${(targetScore - totalScore).toFixed(1)}% more to reach your target`
    };
  };

  const resetAll = () => {
    setStudentName('');
    setWriting('');
    setReading('');
    setListening('');
    setSpeaking('');
    setTarget('');
  };

  const score = calculate();
  const scores = { writing, reading, listening, speaking };
  const etr = target ? getETR() : null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6 print:bg-white print:text-black">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <div className="flex justify-between items-center space-x-2">
          <h1 className="text-xl font-bold">🎯 SPM CEFR English Grade Calculator</h1>
          <div className="flex space-x-2">
            <button onClick={resetAll} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Reset All</button>
            <button onClick={() => window.print()} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Print Report</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <input className="p-2 border rounded" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
        </div>

        <div className="relative">
          <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full p-2 pr-40 border rounded shadow-sm" placeholder="Enter target %" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Target (ETR %)</span>
        </div>

        {etr && (
          <div className="bg-blue-50 print:bg-blue-50 p-4 rounded-lg print:rounded-lg shadow-md print:shadow-md space-y-2 print:block">
            <p className="font-semibold text-blue-900 print:text-blue-900">ETR — To Reach {target}%</p>
            {['reading', 'writing', 'speaking', 'listening'].map((paper) => (
              <p key={paper} className="print:text-black">
                {etr.paperNotes[paper]} in <span className="font-medium capitalize">{paper}</span>
              </p>
            ))}
            <p className={`mt-2 font-semibold ${
              score.percentage >= Number(target) ? 'text-green-600 print:text-green-600' : 'text-blue-600 print:text-blue-600'
            }`}>
              {etr.overallNote}
            </p>
            {score.percentage < Number(target) && (
              <div className="w-full bg-gray-200 rounded-full h-4 mt-4 print:block">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all print:bg-green-500" 
                  style={{ width: `${Math.min(score.percentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: 'Paper 1 (Reading)', value: reading, setValue: setReading, max: 40 },
            { label: 'Paper 2 (Writing)', value: writing, setValue: setWriting, max: 60 },
            { label: 'Paper 3 (Speaking)', value: speaking, setValue: setSpeaking, max: 24 },
            { label: 'Paper 4 (Listening)', value: listening, setValue: setListening, max: 30 }
          ].map(({ label, value, setValue, max }) => (
            <div className="relative" key={label}>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 pr-40 border rounded shadow-sm"
                placeholder="Enter marks"
                max={max}
                min={0}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {label} /{max}
              </span>
            </div>
          ))}
        </div>

        <div className="print-only">
          <div className="bg-green-50 p-4 rounded-lg shadow-md mt-4 space-y-2">
            <p><strong>Student Name:</strong> {studentName || "—"}</p>
            <p className="mt-2 font-semibold underline">Paper Scores:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Paper 1 (Reading): {reading || "—"} / 40</li>
              <li>Paper 2 (Writing): {writing || "—"} / 60</li>
              <li>Paper 3 (Speaking): {speaking || "—"} / 24</li>
              <li>Paper 4 (Listening): {listening || "—"} / 30</li>
            </ul>
            <p className="mt-2"><strong>Current Estimated Total:</strong> {score.percentage}%</p>
            <p><strong>Estimated Grade:</strong> {score.grade}</p>
            {etr && (
              <>
                <p className="mt-2 font-semibold underline">ETR Analysis:</p>
                <ul className="ml-4 list-disc space-y-1">
                  {['reading', 'writing', 'speaking', 'listening'].map((paper) => (
                    <li key={paper} className="capitalize">{paper}: {etr.paperNotes[paper]}</li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold">{etr.overallNote}</p>
              </>
            )}
          </div>
        </div>

        <footer className="pt-6 border-t mt-8 text-center space-y-2 text-sm print:hidden">
          <h2 className="text-lg font-semibold">👩🏻‍🏫 Created By</h2>
          <p className="font-semibold">Nur Syahmin Alya Masri</p>
          <p>PPPDG10</p>
          <p>📧 <a className="text-blue-600 hover:underline" href="mailto:n.syahminalya@gmail.com">n.syahminalya@gmail.com</a></p>
          <div className="mt-4">
            <a
              href="https://forms.gle/H6gvWFeAwQCwY9LK7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded text-sm"
            >
              📋 Give Feedback
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
