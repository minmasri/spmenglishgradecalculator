import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [writing, setWriting] = useState('');
  const [reading, setReading] = useState('');
  const [listening, setListening] = useState('');
  const [speaking, setSpeaking] = useState('');
  const [target, setTarget] = useState('');
  const [studentName, setStudentName] = useState('');
  const [visits, setVisits] = useState(0);

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

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

  const calculate = () => {
    const scores = { writing, reading, listening, speaking };
    let total = 0;
    const paperPercentages = {};
    Object.entries(scores).forEach(([key, val]) => {
      if (val) {
        const percent = (Number(val) / maxMarks[key]) * weights[key] * 100;
        total += percent;
        paperPercentages[key] = percent.toFixed(2);
      }
    });
    return {
      percentage: total.toFixed(2),
      grade: getGrade(total),
      paperPercentages
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

  const resetAll = () => {
    setStudentName('');
    setWriting('');
    setReading('');
    setListening('');
    setSpeaking('');
    setTarget('');
  };

  useEffect(() => {
    const count = localStorage.getItem('visit-count');
    const updated = count ? Number(count) + 1 : 1;
    localStorage.setItem('visit-count', updated);
    setVisits(updated);
  }, []);

  const score = calculate();
  const etr = target ? getETR() : null;
  return (
  <>
    <Head>
      <title>SPM CEFR English Grade Calculator</title>
    </Head>
    <div className="container" style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h1>🎯 <b>SPM CEFR English Grade Calculator</b></h1>

      <div className="input-group">
        <label>Student Name</label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter name"
        />
      </div>

      <div className="input-group">
        <label>Enter target %</label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target %"
        />
      </div>

      <div className="input-group">
        <label>Paper 1 (Reading)</label>
        <input
          type="number"
          value={reading}
          onChange={(e) => setReading(e.target.value)}
          placeholder="Enter marks"
        />
      </div>

      <div className="input-group">
        <label>Paper 2 (Writing)</label>
        <input
          type="number"
          value={writing}
          onChange={(e) => setWriting(e.target.value)}
          placeholder="Enter marks"
        />
      </div>

      <div className="input-group">
        <label>Paper 3 (Speaking)</label>
        <input
          type="number"
          value={speaking}
          onChange={(e) => setSpeaking(e.target.value)}
          placeholder="Enter marks"
        />
      </div>

      <div className="input-group">
        <label>Paper 4 (Listening)</label>
        <input
          type="number"
          value={listening}
          onChange={(e) => setListening(e.target.value)}
          placeholder="Enter marks"
        />
      </div>

      <div style={{ background: '#e6fff3', padding: 15, marginTop: 20 }}>
        <p><b>Student Name:</b> {studentName || '—'}</p>
        <p><b>Paper Scores:</b></p>
        <ul>
          <li>Paper 1 (Reading): {reading || '—'} / 40 ({score.paperPercentages.reading || '—'}% of total)</li>
          <li>Paper 2 (Writing): {writing || '—'} / 60 ({score.paperPercentages.writing || '—'}% of total)</li>
          <li>Paper 3 (Speaking): {speaking || '—'} / 24 ({score.paperPercentages.speaking || '—'}% of total)</li>
          <li>Paper 4 (Listening): {listening || '—'} / 30 ({score.paperPercentages.listening || '—'}% of total)</li>
        </ul>
        <p><b>Current Estimated Total:</b> {score.percentage}%</p>
        <p><b>Estimated Grade:</b> {score.grade}</p>
      </div>

      {etr && (
        <div style={{ marginTop: 20 }}>
          <h4>🎯 Target Analysis:</h4>
          {Object.entries(etr.paperNotes).map(([paper, note]) => (
            <p key={paper}>{note}</p>
          ))}
          <p><b>{etr.overallNote}</b></p>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={resetAll} style={{ marginRight: 10, backgroundColor: 'red', color: 'white' }}>Reset</button>
        <button onClick={() => window.print()}>Print</button>
      </div>

      <footer style={{ marginTop: 40, fontSize: 14 }}>
        <p>🛠️ Created by Nur Syahmin Alya Masri</p>
        <p><a href="mailto:n.syahminalya@gmail.com">n.syahminalya@gmail.com</a></p>
        <button style={{ backgroundColor: '#ffcc00', padding: '6px 12px', borderRadius: 4 }}>💬 Give Feedback</button>
        <p style={{ marginTop: 10 }}>👁️ Visitors (local count): {visits}</p>
      </footer>
    </div>
  </>
);}
