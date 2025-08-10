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
  const settingsSection = document.querySelector('.settings');
  const settingsForm = document.getElementById('settings-form');
  const settingsToggle = document.getElementById('settings-toggle');
  const settingsSummary = document.getElementById('settings-summary');
  const summaryRange = document.getElementById('summary-range');
  const summaryOp = document.getElementById('summary-op');

  let correct = 0, wrong = 0, streak = 0;
  let current = { a:0, b:0, op:'+', answer:0 };

  function getSettings(){
    const range = Number((document.querySelector('input[name="range"]:checked')||{}).value || 10);
    const op = (document.querySelector('input[name="op"]:checked')||{}).value || '+';
    return { range, op };
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
        if(opt === current.answer){
          onCorrect();
          // brief highlight
          btn.classList.add('correct');
          setTimeout(()=>{
            btn.classList.remove('correct');
            generateProblem();
          }, 600);
        }else{
          onWrong();
          btn.classList.add('wrong');
          setTimeout(()=>btn.classList.remove('wrong'), 400);
        }
      });
      choicesEl.appendChild(btn);
    });
  }

  function generateProblem(){
    const { range, op } = getSettings();
    const max = range === 10 ? 9 : range; // <10 uses 0..9

    let chosenOp = op;
    if(op === 'mix') chosenOp = Math.random() < 0.5 ? '+' : '-';

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

    renderChoices();
  }

  function updateStars(){
    // up to 5 stars based on streak
    const filled = Math.min(5, Math.floor(streak/3) + (streak>0?1:0));
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

  newBtn.addEventListener('click', generateProblem);
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

  // When settings change, create new problem, update summary and collapse
  settingsForm.addEventListener('change', ()=>{
    generateProblem();
    updateSettingsSummary();
    setSettingsCollapsed(true);
  });

  // First load
  updateStars();
  updateSettingsSummary();
  setSettingsCollapsed(false);
  generateProblem();
})();