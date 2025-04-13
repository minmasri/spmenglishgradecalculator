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
    speaking: 0.25,
  };

  const maxMarks = {
    writing: 60,
    reading: 40,
    listening: 30,
    speaking: 24,
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
      grade: getGrade(total),
    };
  };

  const getETR = () => {
    const targetScore = Number(target);
    const current = calculate();
    const scores = { writing, reading, listening, speaking };
    const paperNotes = {};
    const results = {};

    const remainingPapers = [];
    if (!writing) remainingPapers.push('writing');
    if (!reading) remainingPapers.push('reading');
    if (!listening) remainingPapers.push('listening');
    if (!speaking) remainingPapers.push('speaking');

    // Calculate required marks for each paper (accounting for weights)
    Object.entries(scores).forEach(([paper, val]) => {
      const actualScore = Number(val) || 0;
      const max = maxMarks[paper];
      const weight = weights[paper];
      
      // Required marks to reach target (considering weight)
      const requiredForTarget = ((targetScore / 100) * max) / weight;
      
      results[paper] = {
        required: requiredForTarget.toFixed(1),
        actual: actualScore,
      };

      if (actualScore === 0 && remainingPapers.includes(paper)) {
        paperNotes[paper] = `⚪ Not taken (need ${requiredForTarget.toFixed(1)})`;
      } else {
        const percentOfRequired = actualScore / requiredForTarget;
        if (percentOfRequired >= 1) {
          paperNotes[paper] = `✅ On track (${actualScore} / ${requiredForTarget.toFixed(1)})`;
        } else if (percentOfRequired >= 0.8) {
          paperNotes[paper] = `🟢 Close (${actualScore} / ${requiredForTarget.toFixed(1)})`;
        } else if (percentOfRequired >= 0.6) {
          paperNotes[paper] = `🟡 Needs work (${actualScore} / ${requiredForTarget.toFixed(1)})`;
        } else {
          paperNotes[paper] = `🔴 Far (${actualScore} / ${requiredForTarget.toFixed(1)})`;
        }
      }
    });

    results.paperNotes = paperNotes;

    if (remainingPapers.length > 0) {
      const remainingPercentage = targetScore - current.percentage;
      const neededPerPaper = (remainingPercentage / remainingPapers.length) / 0.25;
      let impossible = false;

      remainingPapers.forEach((paper) => {
        const raw = (neededPerPaper / 100) * maxMarks[paper];
        if (raw > maxMarks[paper]) impossible = true;
      });

      if (impossible) {
        results.overallNote = `🚫 Target ${targetScore}% not possible. Aim for personal best!`;
      } else {
        results.overallNote = `You need ${remainingPercentage.toFixed(1)}% more from remaining papers`;
      }
    } else {
      results.overallNote = current.percentage >= targetScore
        ? `🏆 Target achieved! (${current.percentage}%)`
        : `You're ${(targetScore - current.percentage).toFixed(1)}% short of target`;
    }

    return results;
  };

  // ... rest of the code remains the same until the return statement ...

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6 print:bg-white print:text-black">
      {/* ... other components remain the same ... */}

      {/* Updated input fields with validation */}
      {[
        { label: 'Paper 1 (Reading)', value: reading, setValue: setReading, max: 40 },
        { label: 'Paper 2 (Writing)', value: writing, setValue: setWriting, max: 60 },
        { label: 'Paper 3 (Speaking)', value: speaking, setValue: setSpeaking, max: 24 },
        { label: 'Paper 4 (Listening)', value: listening, setValue: setListening, max: 30 },
      ].map(({ label, value, setValue, max }) => (
        <div className="relative" key={label}>
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const val = Math.min(Math.max(Number(e.target.value), 0), max);
              setValue(isNaN(val) ? '' : val);
            }}
            className="w-full p-2 pr-40 border rounded shadow-sm"
            placeholder="Enter marks"
            min="0"
            max={max}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {label} /{max}
          </span>
        </div>
      ))}

      {/* Updated print view to include ETR analysis */}
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
                  <li key={paper} className="capitalize">
                    {paper}: {etr.paperNotes?.[paper] || `—`}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold">{etr.overallNote}</p>
            </>
          )}
        </div>
      </div>

      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
}
