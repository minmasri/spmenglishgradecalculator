import { useState } from 'react';
import Head from 'next/head';

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
    const scores = { writing, reading, listening, speaking };
    const results = {};
    const notes = {};
    let currentTotal = 0;
    let targetTotal = Number(target);

    let completedWeight = 0;

    Object.entries(scores).forEach(([paper, val]) => {
      const actual = Number(val);
      const max = maxMarks[paper];
      const weight = weights[paper];
      const needed = (targetTotal * weight) / 100 * max;

      if (val) {
        const percent = (actual / max) * 100;
        completedWeight += weight;
        currentTotal += (actual / max) * weight * 100;

        if (actual >= needed) {
          notes[paper] = `🟢 On track (${actual} / ${needed.toFixed(1)} needed)`;
        } else {
          notes[paper] = `🟠 Close to target (${actual} / ${needed.toFixed(1)} needed)`;
        }
      } else {
        notes[paper] = `⚪ Not taken (— / ${needed.toFixed(1)} needed)`;
      }

      results[paper] = { required: needed.toFixed(1), actual: val || "—" };
    });

    const difference = targetTotal - currentTotal;
    const requiredPct = ((difference / targetTotal) * 100).toFixed(1);

    results.notes = notes;
    results.remaining = difference;
    results.progress = ((currentTotal / targetTotal) * 100).toFixed(1);
    results.overallNote =
      currentTotal >= targetTotal
        ? `🏆 You have reached your target!`
        : `🔵 You need ${requiredPct}% more to reach your target`;

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

  const scores = { writing, reading, listening, speaking };
  const score = calculate();
  const etr = target ? getETR() : null;

  return (
    <>
      <Head>
        <title>SPM CEFR English Grade Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100 text-gray-900 p-6 print:bg-white print:text-black">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
          <div className="flex justify-between items-center space-x-2">
            <h1 className="text-xl font-bold">🎯 SPM CEFR English Grade Calculator</h1>
            <div className="flex space-x-2">
              <button onClick={resetAll} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Reset All</button>
              <button onClick={() => window.print()} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Print Report</button>
            </div>
          </div>

          <input className="p-2 border rounded w-full" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />

          <div className="relative">
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)} className="w-full p-2 pr-40 border rounded shadow-sm" placeholder="Enter target %" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">Target (ETR %)</span>
          </div>

          {etr && (
            <div className="bg-blue-50 print:bg-blue-50 p-4 rounded-lg print:rounded-lg shadow-md print:shadow-md space-y-2 print:block">
              <p className="font-semibold text-blue-900 print:text-blue-900">ETR — To Reach {target}%</p>
              {['reading', 'writing', 'speaking', 'listening'].map((paper) => (
                <p key={paper} className="print:text-black">{etr.notes[paper]}</p>
              ))}
              <p className={`mt-2 font-semibold ${score.percentage >= target ? 'text-green-600' : 'text-blue-700'} print:text-black`}>
                {etr.overallNote}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 mt-2 print:block">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${etr.progress}%` }}></div>
              </div>
            </div>
          )}

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
            </div>
          </div>

          <footer className="pt-6 border-t mt-8 text-center space-y-2 text-sm print:hidden">
            <h2 className="text-lg font-semibold">👩🏻‍🏫 Created By</h2>
            <p className="font-semibold">Nur Syahmin Alya Masri PPPDG10</p>
            <p>SMK AGAMA KUALA LIPIS</p>
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
