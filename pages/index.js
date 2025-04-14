const getETR = () => {
  const targetScore = Number(target);
  const scores = { writing, reading, listening, speaking };
  const paperNotes = {};
  const results = {};

  let currentTotal = 0;
  let totalWeightUsed = 0;
  const remainingPapers = [];

  Object.entries(scores).forEach(([paper, val]) => {
    const score = Number(val);
    const max = maxMarks[paper];
    const weight = weights[paper];

    if (val) {
      const contribution = (score / max) * weight * 100;
      currentTotal += contribution;
      totalWeightUsed += weight;
    } else {
      remainingPapers.push(paper);
    }
  });

  const remainingTarget = targetScore - currentTotal;
  const remainingWeight = 1 - totalWeightUsed;

  if (remainingPapers.length === 0) {
    results.overallNote = currentTotal >= targetScore
      ? "🏆 You have reached your target!"
      : `⛔ You can no longer reach ${targetScore}%. But you can still aim for your personal best.`;
  }

  remainingPapers.forEach(paper => {
    const max = maxMarks[paper];
    const weight = weights[paper];

    const neededPercentage = (remainingTarget * weight) / remainingWeight;
    const neededMark = (neededPercentage / 100) * max;
    results[paper] = {
      required: neededMark.toFixed(1)
    };
    paperNotes[paper] = `🧮 Estimated required: ${neededMark.toFixed(1)}`;
  });

  Object.entries(scores).forEach(([paper, val]) => {
    const max = maxMarks[paper];
    if (val) {
      const score = Number(val);
      const targetMark = (targetScore / 100) * max;
      if (score >= targetMark) {
        paperNotes[paper] = `✅ On track`;
      } else if (score >= targetMark * 0.8) {
        paperNotes[paper] = `🟡 Needs improvement`;
      } else {
        paperNotes[paper] = `🔴 Far from target`;
      }
      results[paper] = { ...results[paper], actual: score, required: targetMark.toFixed(1) };
    }
  });

  results.paperNotes = paperNotes;

  const current = calculate();
  if (current.percentage >= targetScore) {
    results.overallNote = `🏆 You have reached your target!`;
  } else {
    const diff = targetScore - current.percentage;
    results.overallNote = `🔵 You need ${diff.toFixed(1)}% more to reach your target`;
  }

  return results;
};
