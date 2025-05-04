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
