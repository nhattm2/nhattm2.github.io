(function(){
  const aEl = document.getElementById('a');
  const bEl = document.getElementById('b');
  const opEl = document.getElementById('op');
  const choicesEl = document.getElementById('choices');
  const newBtn = document.getElementById('new-problem');
  const resetBtn = document.getElementById('reset-score');
  const feedback = document.getElementById('feedback');
  const correctEl = document.getElementById('correct');
  const wrongEl = document.getElementById('wrong');
  const streakEl = document.getElementById('streak');
  const starsEl = document.getElementById('stars');
  const progressEl = document.getElementById('progress');
  const settingsSection = document.querySelector('.settings');
  const settingsForm = document.getElementById('settings-form');
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsSummary = document.getElementById('settings-summary');
  const summaryRange = document.getElementById('summary-range');
  const summaryOp = document.getElementById('summary-op');
  const themeSelect = document.getElementById('theme-select');
  // History & session elements
  const historySection = document.querySelector('.history');
  const historyList = document.getElementById('history-list');
  const newSessionBtn = document.getElementById('new-session');

  let correct = 0, wrong = 0, streak = 0;
  let current = { a:0, b:0, op:'+', answer:0 };
  let qTotal = 10; // total questions in a session (default 10)
  let qIndex = 0;  // current question index (1-based during session)
  let finished = false;
  // History state
  let sessionHistory = [];
  let wrongTriesForCurrent = 0;

  function getSettings(){
    const range = Number((document.querySelector('input[name="range"]:checked')||{}).value || 10);
    const op = (document.querySelector('input[name="op"]:checked')||{}).value || '+';
    const count = Number((document.querySelector('select[name="count"]')||{}).value || 10);
    return { range, op, count };
  }

  function getRangeLabel(v){
    switch(String(v)){
      case '10': return '< 10';
      case '20': return '20';
      case '100': return '100';
      case '1000': return '> 100';
      default: return String(v);
    }
  }
  function getOpLabel(v){
    switch(v){
      case '+': return 'Cộng (+)';
      case '-': return 'Trừ (−)';
      case 'mix': return 'Cả hai (±)';
      default: return v;
    }
  }
  function updateSettingsSummary(){
    if(!settingsSummary) return;
    const { range, op } = getSettings();
    if(summaryRange) summaryRange.textContent = getRangeLabel(range);
    if(summaryOp) summaryOp.textContent = getOpLabel(op);
  }
  function setSettingsCollapsed(collapsed){
    if(!settingsSection) return;
    settingsSection.classList.toggle('collapsed', !!collapsed);
    if(settingsToggle){
      settingsToggle.setAttribute('aria-expanded', String(!collapsed));
      settingsToggle.textContent = collapsed ? 'Mở cài đặt' : 'Thu gọn';
    }
    if(settingsSummary){
      settingsSummary.hidden = !collapsed ? true : false;
    }
  }

  function randInt(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
  }

  function shuffle(arr){
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildChoices(correctAnswer, max){
    const set = new Set();
    set.add(correctAnswer);
    // Try to generate plausible distractors near the correct answer
    const candidates = [];
    for(let d=-3; d<=3; d++){
      if(d===0) continue;
      const v = correctAnswer + d;
      if(v >= 0 && v <= max) candidates.push(v);
    }
    // Add some random candidates across range too
    while(candidates.length < 8){
      const v = randInt(0, max);
      if(!candidates.includes(v) && v !== correctAnswer) candidates.push(v);
    }
    shuffle(candidates);
    for(const v of candidates){
      if(set.size >= 4) break;
      set.add(v);
    }
    const options = Array.from(set);
    return shuffle(options);
  }

  function renderChoices(){
    const { range } = getSettings();
    const max = range === 10 ? 9 : range;
    const options = buildChoices(current.answer, max);
    choicesEl.innerHTML = '';
    options.forEach((opt)=>{
      const btn = document.createElement('button');
      btn.className = 'btn choice-btn';
      btn.type = 'button';
      btn.textContent = String(opt);
      btn.setAttribute('aria-label', `Chọn ${opt}`);
      btn.addEventListener('click', ()=>{
        if(finished) return;
        if(opt === current.answer){
          // record this question result (correct selection)
          sessionHistory.push({
            a: current.a,
            b: current.b,
            op: current.op,
            correct: current.answer,
            wrongTries: wrongTriesForCurrent
          });
          onCorrect();
          // brief highlight
          btn.classList.add('correct');
          setTimeout(()=>{
            btn.classList.remove('correct');
            nextQuestion();
          }, 600);
        }else{
          // count wrong tries for current question
          wrongTriesForCurrent++;
          onWrong();
          btn.classList.add('wrong');
          setTimeout(()=>btn.classList.remove('wrong'), 400);
        }
      });
      choicesEl.appendChild(btn);
    });
  }

  function updateProgress(){
    if(progressEl){
      const total = Math.max(1, qTotal||10);
      const cur = Math.min(qIndex, total);
      progressEl.textContent = `${cur}/${total}`;
    }
  }
  function disableChoices(){
    const buttons = choicesEl.querySelectorAll('button');
    buttons.forEach(b=>{ b.disabled = true; b.setAttribute('aria-disabled','true'); });
  }
  function enableChoices(){
    const buttons = choicesEl.querySelectorAll('button');
    buttons.forEach(b=>{ b.disabled = false; b.removeAttribute('aria-disabled'); });
  }
  function renderHistory(){
    if(!historyList) return;
    historyList.innerHTML = '';
    sessionHistory.forEach((item, idx)=>{
      const li = document.createElement('li');
      const wrongTxt = item.wrongTries > 0 ? ` • Sai ${item.wrongTries} lần trước khi đúng` : '';
      li.textContent = `${idx+1}) ${item.a} ${item.op} ${item.b} = ${item.correct} ${wrongTxt}`;
      historyList.appendChild(li);
    });
  }
  function showHistory(){
    if(historySection){ historySection.hidden = false; }
    renderHistory();
  }
  function hideHistory(){
    if(historySection){ historySection.hidden = true; }
    if(historyList){ historyList.innerHTML = ''; }
  }
  function finishSession(){
    finished = true;
    updateProgress();
    disableChoices();
    feedback.textContent = `🎯 Hoàn thành ${qTotal} câu!`; 
    feedback.style.color = '#2e7d32';
    // Show history and new-session button
    showHistory();
    if(newSessionBtn){ newSessionBtn.hidden = false; }
  }
  function nextQuestion(){
    if(finished) return;
    if(qIndex === 0){
      qIndex = 1;
    }else{
      qIndex++;
    }
    updateProgress();
    if(qIndex > qTotal){
      finishSession();
      return;
    }
    generateProblem();
  }

  function resetProgressFromSettings(){
    const { count } = getSettings();
    qTotal = Number(count)||10;
    qIndex = 0;
    finished = false;
    updateProgress();
  }

  function generateProblem(){
    if(finished){
      disableChoices();
      return;
    }
    const { range, op } = getSettings();
    const max = range === 10 ? 9 : range; // <10 uses 0..9

    let chosenOp = op;
    if(op === 'mix') chosenOp = Math.random() < 0.5 ? '+' : '-';
    // reset wrong tries counter at the start of a new question
    wrongTriesForCurrent = 0;

    // For first graders, avoid negative in subtraction and keep sums inside range.
    let a, b;
    if(chosenOp === '+'){
      // ensure a + b <= max (for range 10 uses <=9 to keep within <10 scope)
      const sumMax = max;
      const s = randInt(0, sumMax);
      a = randInt(0, s);
      b = s - a;
    }else{
      // subtraction: ensure a >= b and both within 0..max
      a = randInt(0, max);
      b = randInt(0, a);
    }

    current.a = a; current.b = b; current.op = chosenOp;
    current.answer = chosenOp === '+' ? (a + b) : (a - b);

    aEl.textContent = a;
    bEl.textContent = b;
    opEl.textContent = chosenOp;
    feedback.textContent = 'Hãy chọn đáp án đúng nhé!';
    feedback.style.color = '#7A6A7B';

    enableChoices();
    renderChoices();
  }

  function updateStars(){
    // up to 5 stars based on streak relative to total questions
    // Ensure that a full-correct run (streak === qTotal) yields 5/5 stars
    const total = Math.max(1, qTotal || 1);
    const ratio = Math.max(0, Math.min(1, streak / total));
    const filled = Math.min(5, Math.max(0, Math.ceil(ratio * 5)));
    let s = '';
    for(let i=0;i<5;i++) s += i < filled ? '⭐️' : '☆';
    starsEl.textContent = s;
  }

  function onCorrect(){
    correct++; streak++;
    correctEl.textContent = String(correct);
    streakEl.textContent = String(streak);
    updateStars();
    feedback.textContent = '🎉 Tuyệt vời! Chính xác rồi!';
    feedback.style.color = '#2e7d32';
  }

  function onWrong(){
    wrong++; streak = 0;
    wrongEl.textContent = String(wrong);
    streakEl.textContent = String(streak);
    updateStars();
    feedback.textContent = `😺 Chưa đúng rồi, thử lại nhé!`;
    feedback.style.color = '#b00020';
  }

  newBtn.addEventListener('click', ()=>{
    if(finished){
      // If finished, allow continuing with same scores but new session of questions
      resetProgressFromSettings();
      // Do not clear history automatically here to preserve previous run until user clicks "Làm bài mới"
      nextQuestion();
    }else{
      nextQuestion();
    }
  });
  if(newSessionBtn){
    newSessionBtn.hidden = true;
    newSessionBtn.addEventListener('click', ()=>{
      // Full new session: reset everything
      correct = 0; wrong = 0; streak = 0;
      correctEl.textContent = '0';
      wrongEl.textContent = '0';
      streakEl.textContent = '0';
      updateStars();
      sessionHistory = [];
      hideHistory();
      finished = false;
      resetProgressFromSettings();
      feedback.textContent = 'Bắt đầu bài mới! Chúc con học tốt!';
      feedback.style.color = '#7A6A7B';
      if(newSessionBtn){ newSessionBtn.hidden = true; }
      nextQuestion();
    });
  }
  resetBtn.addEventListener('click', ()=>{
    correct = 0; wrong = 0; streak = 0;
    correctEl.textContent = '0';
    wrongEl.textContent = '0';
    streakEl.textContent = '0';
    updateStars();
    feedback.textContent = 'Đã đặt lại điểm. Cùng làm tiếp nào!';
    feedback.style.color = '#7A6A7B';
    // Re-render current problem's choices
    renderChoices();
  });

  // Toggle settings collapse
  if(settingsToggle){
    settingsToggle.addEventListener('click', ()=>{
      const collapsed = settingsSection.classList.contains('collapsed');
      setSettingsCollapsed(!collapsed);
      if(!collapsed){
        // when expanding back, keep summary up-to-date
        updateSettingsSummary();
      }
    });
  }

  // Theme handling
  function applyTheme(theme){
    if(!theme) return;
    document.documentElement.setAttribute('data-theme', theme);
    try{ localStorage.setItem('theme', theme); }catch(e){}
  }
  (function initTheme(){
    let saved = 'pink';
    try{ saved = localStorage.getItem('theme') || 'pink'; }catch(e){ saved = 'pink'; }
    applyTheme(saved);
    if(themeSelect){ themeSelect.value = saved; }
  })();
  if(themeSelect){
    themeSelect.addEventListener('change', (e)=>{
      applyTheme(e.target.value);
    });
  }

  // When settings change, create new problem, update summary and collapse
  settingsForm.addEventListener('change', (e)=>{
    if(e && e.target && e.target.name === 'theme'){
      // theme handled above; avoid unnecessary collapse toggling? still proceed for consistency
    }
    // changing settings starts a new session context (but does not touch scores unless user wants)
    sessionHistory = [];
    hideHistory();
    if(newSessionBtn){ newSessionBtn.hidden = true; }
    finished = false;
    resetProgressFromSettings();
    updateSettingsSummary();
    setSettingsCollapsed(true);
    nextQuestion();
  });

  // First load
  updateStars();
  updateSettingsSummary();
  setSettingsCollapsed(false);
  hideHistory();
  if(newSessionBtn){ newSessionBtn.hidden = true; }
  resetProgressFromSettings();
  nextQuestion();
})();