
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

  
const getETR = () => {{
  const targetScore = Number(target);
  const scores = {{ writing, reading, listening, speaking }};
  const paperNotes = {{}};
  const results = {{}};

  let currentTotal = 0;
  let totalWeightUsed = 0;
  const remainingPapers = [];

  Object.entries(scores).forEach(([paper, val]) => {{
    const score = Number(val);
    const max = maxMarks[paper];
    const weight = weights[paper];

    if (val) {{
      const contribution = (score / max) * weight * 100;
      currentTotal += contribution;
      totalWeightUsed += weight;
    }} else {{
      remainingPapers.push(paper);
    }}
  }});

  const remainingTarget = targetScore - currentTotal;
  const remainingWeight = 1 - totalWeightUsed;

  if (remainingPapers.length === 0) {{
    results.overallNote = currentTotal >= targetScore
      ? "🏆 You have reached your target!"
      : `⛔ You can no longer reach ${{targetScore}}%. But you can still aim for your personal best.`;
  }}

  remainingPapers.forEach(paper => {{
    const max = maxMarks[paper];
    const weight = weights[paper];

    const neededPercentage = (remainingTarget * weight) / remainingWeight;
    const neededMark = (neededPercentage / 100) * max;
    results[paper] = {{
      required: neededMark.toFixed(1)
    }};
    paperNotes[paper] = `🧮 Estimated required: ${{neededMark.toFixed(1)}}`;
  }});

  Object.entries(scores).forEach(([paper, val]) => {{
    const max = maxMarks[paper];
    if (val) {{
      const score = Number(val);
      const targetMark = (targetScore / 100) * max;
      if (score >= targetMark) {{
        paperNotes[paper] = `✅ On track`;
      }} else if (score >= targetMark * 0.8) {{
        paperNotes[paper] = `🟡 Needs improvement`;
      }} else {{
        paperNotes[paper] = `🔴 Far from target`;
      }}
      results[paper] = {{ ...results[paper], actual: score, required: targetMark.toFixed(1) }};
    }}
  }});

  results.paperNotes = paperNotes;

  const current = calculate();
  if (current.percentage >= targetScore) {{
    results.overallNote = `🏆 You have reached your target!`;
  }} else {{
    const diff = targetScore - current.percentage;
    results.overallNote = `🔵 You need ${{diff.toFixed(1)}}% more to reach your target`;
  }}

  return results;
}};


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
    <>
      <Head>
        <title>SPM CEFR English Grade Calculator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100 text-gray-900 p-6 print:bg-white print:text-black">
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
          <div className="flex justify-between items-center space-x-2">
            <h1 className="text-xl font-bold">🎯 SPM CEFR English Grade Calculator</h1>
            <div className="flex space-x-2">
              <button onClick={resetAll} className="text-sm bg-red-500 text-white px-3 py-1 rounded">Reset</button>
              <button onClick={() => window.print()} className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Print</button>
            </div>
          </div>

          <input className="p-2 border rounded w-full" placeholder="Student Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <input type="number" className="p-2 border rounded w-full" placeholder="Enter target %" value={target} onChange={(e) => setTarget(e.target.value)} />

          {etr && (
            <div className="bg-blue-50 p-4 rounded shadow print:hidden">
              <p className="font-bold text-blue-800">ETR — To Reach {target}%</p>
              {['reading', 'writing', 'speaking', 'listening'].map(paper => (
                <p key={paper}>
                  {etr.paperNotes[paper]} ({etr[paper]?.actual ?? '—'} / {etr[paper]?.required} needed) in <em>{paper}</em>
                </p>
              ))}
              <p className="mt-2 font-bold text-blue-700">{etr.overallNote}</p>
            </div>
          )}

          <div className="grid gap-4">
            {[
              { label: 'Paper 1 (Reading)', value: reading, setter: setReading, max: 40 },
              { label: 'Paper 2 (Writing)', value: writing, setter: setWriting, max: 60 },
              { label: 'Paper 3 (Speaking)', value: speaking, setter: setSpeaking, max: 24 },
              { label: 'Paper 4 (Listening)', value: listening, setter: setListening, max: 30 }
            ].map(({ label, value, setter, max }) => (
              <div className="relative" key={label}>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full p-2 pr-32 border rounded shadow-sm"
                  placeholder="Enter marks"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">{label} /{max}</span>
              </div>
            ))}
          </div>

          <div className="bg-green-50 p-4 rounded shadow print-only">
            {etr && (
              <div className="bg-blue-100 border border-blue-300 p-4 rounded mb-4 hidden print:block">
                <p className="font-bold text-blue-800">ETR — To Reach {target}%</p>
                {['reading', 'writing', 'speaking', 'listening'].map(paper => (
                  <p key={paper}>
                    {etr.paperNotes[paper]} ({etr[paper]?.actual ?? '—'} / {etr[paper]?.required} needed) in <em>{paper}</em>
                  </p>
                ))}
                <p className="mt-2 font-bold text-blue-700">{etr.overallNote}</p>
              </div>
            )}
            <p><strong>Student Name:</strong> {studentName || '—'}</p>
            <p className="underline font-semibold mt-2">Paper Scores:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Paper 1 (Reading): {reading || '—'} / 40</li>
              <li>Paper 2 (Writing): {writing || '—'} / 60</li>
              <li>Paper 3 (Speaking): {speaking || '—'} / 24</li>
              <li>Paper 4 (Listening): {listening || '—'} / 30</li>
            </ul>
            <p className="mt-2"><strong>Current Estimated Total:</strong> {score.percentage}%</p>
            <p><strong>Estimated Grade:</strong> {score.grade}</p>
          </div>

          <footer className="text-center text-sm pt-6 border-t mt-8 print:hidden">
            <p className="font-semibold">👩🏻‍🏫 Created by Nur Syahmin Alya Masri</p>
            <p>📧 <a href="mailto:n.syahminalya@gmail.com" className="text-blue-600 underline">n.syahminalya@gmail.com</a></p>
            <a href="https://forms.gle/H6gvWFeAwQCwY9LK7" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block bg-yellow-500 text-white px-4 py-2 rounded">
              📋 Give Feedback
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}
