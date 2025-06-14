// // js/word-quiz.js
import {CharacterManager}  from './character-manager.js';

export async function initWordQuiz(dictPath, containerId, numQ = 5) {
  const res  = await fetch(dictPath);
  const dict = await res.json();
  let items = dict.sort(() => Math.random() - 0.5).slice(0, Math.min(numQ, dict.length));

  let idx = 0, score = 0;
  const container = document.getElementById(containerId);
  const PASS_THRESHOLD = 3; // 3문제 이상이면 성공

  function makeChoices(correct) {
    const others = dict
      .map(d => d.term)
      .filter(t => t !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }

  function render(item) {
    const choices = makeChoices(item.term);
    container.innerHTML = `
      <div class="quiz-card">
        <p class="quiz-question">"${item.definition}"에 해당하는 용어는?</p>
        <div class="button-group">
          ${choices.map(c => `<button class="ans-btn">${c}</button>`).join('')}
        </div>
      </div>
    `;
    container.querySelectorAll('.ans-btn').forEach(btn => {
      btn.onclick = () => {
        if (btn.textContent === item.term) score++;
        next();
      };
    });
  }

  function renderResult() {
    const pass = score >= PASS_THRESHOLD;
    container.innerHTML = `
      <div class="quiz-result">
        <p class="result-title">${pass ? '🎉 성공!' : '😢 실패'}</p>
        <p class="result-score">당신의 점수: ${score} / ${items.length}</p>
        <button id="retry" class="retry-btn">Try Again</button>
      </div>
    `;
    if (pass) {
      const newScore = CharacterManager.incrementScore(1);
    
      // app.js를 건드리지 않고도, 직접 패널의 .score 요소를 찾아서 업데이트
      const scoreEl = document.querySelector('#characterDisplay .score');
      if (scoreEl) {
        scoreEl.textContent = `Score: ${newScore}`;
      }
    }
    document.getElementById('retry').onclick = () => {
        items = dict.sort(() => Math.random() - 0.5).slice(0, Math.min(numQ, dict.length));
      score = 0;
      idx = 0;
      next();
    };
  }

  function next() {
    if (idx < items.length) {
      render(items[idx++]);
    } else {
      renderResult();
    }
  }

  next();
}
