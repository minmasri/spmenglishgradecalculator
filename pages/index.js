import Head from 'next/head';
import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

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
    const paperNotes = {};
    const results = {};

    let currentPercentage = 0;
    let totalWeightUsed = 0;

    Object.entries(scores).forEach(([paper, value]) => {
      const score = Number(value);
      const max = maxMarks[paper];
      const weight = weights[paper];

      if (value) {
        const percent = (score / max) * weight * 100;
        currentPercentage += percent;
        totalWeightUsed += weight;
      }
    });

    const remainingWeight = 1 - totalWeightUsed;
    const remainingTarget = targetScore - currentPercentage;
    const neededPerWeight = remainingWeight > 0 ? remainingTarget / remainingWeight : 0;

    Object.entries(scores).forEach(([paper, value]) => {
      const max = maxMarks[paper];
      const weight = weights[paper];
      const requiredRaw = (targetScore / 100) * max;
      const actualRaw = value ? Number(value) : null;

      if (value) {
        if (actualRaw >= requiredRaw) {
          paperNotes[paper] = `✅ On track (${actualRaw} / ${requiredRaw.toFixed(1)} needed) in ${capitalize(paper)}`;
        } else if (actualRaw >= requiredRaw * 0.8) {
          paperNotes[paper] = `🟡 Needs improvement (${actualRaw} / ${requiredRaw.toFixed(1)} needed) in ${capitalize(paper)}`;
        } else {
          paperNotes[paper] = `🔴 Far from target (${actualRaw} / ${requiredRaw.toFixed(1)} needed) in ${capitalize(paper)}`;
        }
      } else {
        const estimatedRaw = Math.min((neededPerWeight / 100) * max, max);
        paperNotes[paper] = `🧮 Estimated required: ${estimatedRaw.toFixed(1)} (— / ${estimatedRaw.toFixed(1)} needed) in ${capitalize(paper)}`;
      }

      results[paper] = {
        actual: value ? Number(value) : null,
        required: value ? requiredRaw.toFixed(1) : ((neededPerWeight / 100) * max).toFixed(1)
      };
    });

    const progress = Math.min((currentPercentage / targetScore) * 100, 100);
    results.paperNotes = paperNotes;

    results.overallNote = currentPercentage >= targetScore
      ? `🏆 You have reached your target!`
      : `🔵 You need ${(targetScore - currentPercentage).toFixed(1)}% more to reach your target`;

    results.progress = progress;

    return results;
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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

          <div className="grid gap-4">
            {[
              { label: 'Paper 1 (Reading)', value: reading, setter: setReading, max: 40 },
              { label: 'Paper 2 (Writing)', value: writing, setter: setWriting, max: 60 },
              { label: 'Paper 3 (Speaking)', value: speaking, setter: setSpeaking, max: 24 },
              { label: 'Paper 4 (Listening)', value: listening, setter: setListening, max: 30 }
            ].map(({ label, value, setter, max }) => (
              <div className="relative" key={label}>
  <label className="absolute left-3 top-0 text-sm text-gray-600 bg-white px-1 transform -translate-y-1/2">
    {label}
    {etr && etr.paperNotes[paperKeyMap[label]] && (
      <span className="ml-1 text-xs text-gray-500">({etr.paperNotes[paperKeyMap[label]].split('(')[0].trim()})</span>
    )}
  </label>
  <input
    type="number"
    value={value}
    onChange={(e) => setter(e.target.value)}
    className="w-full mt-5 p-2 border rounded shadow-sm"
    placeholder="Enter marks"
  />
</div>

            ))}
          </div>

          <div className="bg-green-50 p-4 rounded shadow print:block">
            {etr && (
              <div className="bg-blue-100 border border-blue-300 p-4 rounded mb-4">
                <p className="font-bold text-blue-800">ETR — To Reach {target}%</p>
                {['reading', 'writing', 'speaking', 'listening'].map(paper => (
                  <p key={paper}>{etr.paperNotes[paper]}</p>
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

          <footer className="text-center text-sm pt-6 border-t mt-8 print:hidden space-y-2">
            <p className="font-semibold">👩🏻‍🏫 Created by Nur Syahmin Alya Masri</p>
            <p>📧 <a href="mailto:n.syahminalya@gmail.com" className="text-blue-600 underline">n.syahminalya@gmail.com</a></p>
            <a href="https://forms.gle/H6gvWFeAwQCwY9LK7" target="_blank" rel="noopener noreferrer" className="inline-block bg-yellow-500 text-white px-4 py-2 rounded">
              📋 Give Feedback
            </a>
            <div className="text-gray-500 text-xs mt-2">📊 Visitors: <Analytics /></div>
          </footer>
        </div>
      </div>
    </>
  );
}
