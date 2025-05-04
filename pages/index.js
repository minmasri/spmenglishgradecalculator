
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

  const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedVisits = localStorage.getItem('visits') || 0;
      const newVisits = Number(storedVisits) + 1;
      localStorage.setItem('visits', newVisits);
      setVisits(newVisits);
    }
  }, []);
