import Head from 'next/head';
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
    const scores = { writing, reading, listening, speaking };
    const current = calculate();
    const results = {};
    let totalWeighted = 0;

    Object.entries(scores).forEach(([key, val]) => {
      const score = Number(val);
      const max = maxMarks[key];
      const weight = weights[key];
      const needed = ((targetScore * weight) / 100) * max;

      results[key] = {
        actual: val ? score : null,
        needed: needed.toFixed(1)
      };

      if (!val) {
        results[key].status = 'not-taken';
      } else if (score >= needed) {
        results[key].status = 'on-track';
      } else if (score >= needed * 0.8) {
        results[key].status = 'needs-improvement';
      } else {
        results[key].status = 'far';
      }

      if (val) {
        totalWeighted += ((score / max) * weight * 100);
      }
    });

    results.total = totalWeighted.toFixed(2);
    results.remaining = Math.max(0, (targetScore - totalWeighted)).toFixed(1);
    return results;
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
  const etr = target ? getETR() : null;

  const statusEmoji = {
    'on-track': '✅',
    'needs-improvement': '🟡',
    'far': '🔴',
    'not-taken': '⚪'
  };

  const labelText = {
    'on-track': 'On track',
    'needs-improvement': 'Needs improvement',
    'far': 'Far from target',
    'not-taken': 'Not taken'
  };

  return (
    <>
      <Head>
        <title>SPM CEFR English Grade Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100 text-gray-900 p-6 print:bg-white print:text-black">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">

          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">🎯 SPM CEFR English Grade Calculator</h1>
            <div className="space-x-2">
              <button onClick={resetAll} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Reset</button>
              <button onClick={() => window.print()} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Print</button>
            </div>
          </div>

          <input
            type="text"
            className="p-2 border rounded w-full"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />

          <input
            type="number"
            className="p-2 border rounded w-full"
            placeholder="Target ETR %"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />

          {/* ETR SCREEN VIEW */}
          {etr && (
            <div className="bg-blue-50 p-4 rounded print:hidden">
              <p className="font-bold text-blue-800 mb-2">ETR — To Reach {target}%</p>
              {['reading', 'writing', 'speaking', 'listening'].map((paper) => (
                <p key={paper}>
                  {statusEmoji[etr[paper].status]} {labelText[etr[paper].status]} (
                  {etr[paper].actual ?? '—'} / {etr[paper].needed}) in <em>{paper}</em>
                </p>
              ))}
              <p className="mt-2 font-semibold text-blue-600">🔵 You need {etr.remaining}% more to reach your target</p>
            </div>
          )}

          {/* Paper Input Fields */}
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
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {label} /{max}
              </span>
            </div>
          ))}

          {/* PRINT BOX */}
          {etr && (
            <div className="bg-green-50 p-4 rounded print:block hidden shadow-md">
              <div className="bg-blue-100 p-4 rounded mb-3">
                <p className="font-bold text-blue-800 mb-2">ETR — To Reach {target}%</p>
                {['reading', 'writing', 'speaking', 'listening'].map((paper) => (
                  <p key={paper}>
                    {statusEmoji[etr[paper].status]} {labelText[etr[paper].status]} (
                    {etr[paper].actual ?? '—'} / {etr[paper].needed}) in <em>{paper}</em>
                  </p>
                ))}
                <p className="mt-2 font-semibold text-blue-700">🔵 You need {etr.remaining}% more to reach your target</p>
              </div>

              <p><strong>Student Name:</strong> {studentName || "—"}</p>
              <p className="mt-2 font-semibold underline">Paper Scores:</p>
              <ul className="ml-4 list-disc">
                <li>Paper 1 (Reading): {reading || "—"} / 40</li>
                <li>Paper 2 (Writing): {writing || "—"} / 60</li>
                <li>Paper 3 (Speaking): {speaking || "—"} / 24</li>
                <li>Paper 4 (Listening): {listening || "—"} / 30</li>
              </ul>
              <p className="mt-2"><strong>Current Estimated Total:</strong> {score.percentage}%</p>
              <p><strong>Estimated Grade:</strong> {score.grade}</p>
            </div>
          )}

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
    </>
  );
}
