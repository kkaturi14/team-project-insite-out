// js/image-quiz.js
import { CharacterManager } from './character-manager.js';

export async function initImageQuiz(jsonPath, containerId, numQ = 5) {
  const res  = await fetch(jsonPath);
  const data = await res.json();

  // 문제 순서 섞고 numQ 개만 사용
  let items = data
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(numQ, data.length));

  let idx = 0;
  let score = 0;
  const PASS_THRESHOLD = 3;    // 3문제 이상이면 성공
  const container = document.getElementById(containerId);

  // 보기 생성 (정답(correct) 제외한 랜덤 3개 + 정답 셔플)
  function makeChoices(correct) {
    const others = data
      .map(d => d.answer)
      .filter(a => a !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    return [correct, ...others].sort(() => Math.random() - 0.5);
  }

  // 개별 문제 렌더
  function render(item) {
    const choices = makeChoices(item.answer);
    container.innerHTML = `
      <div class="quiz-card">
        <img src="${item.imageUrl}" alt="quiz-img" class="quiz-img"/>
        <div class="button-group">
          ${choices.map(c => `<button class="ans-btn">${c}</button>`).join('')}
        </div>
      </div>
    `;
    container.querySelectorAll('.ans-btn').forEach(btn => {
      btn.onclick = () => {
        if (btn.textContent === item.answer) score++;
        next();
      };
    });
  }

  // 결과 화면 렌더 & 점수 처리
  function renderResult() {
    const pass = score >= PASS_THRESHOLD;
    container.innerHTML = `
      <div class="quiz-result">
        <p class="result-title">${pass ? '🎉 성공!' : '😢 실패'}</p>
        <p class="result-score">당신의 점수: ${score} / ${items.length}</p>
        <button id="retry" class="retry-btn">Try Again</button>
      </div>
    `;

    // 성공 시 전역 점수 증가 & 패널 갱신
    if (pass) {
      const newScore = CharacterManager.incrementScore(1);
      const scoreEl = document.querySelector('#characterDisplay .score');
      if (scoreEl) scoreEl.textContent = `Score: ${newScore}`;
    }

    // 다시 시작
    document.getElementById('retry').onclick = () => {
      items = data
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numQ, data.length));
      idx = 0;
      score = 0;
      next();
    };
  }

  // 다음 문제 또는 결과
  function next() {
    if (idx < items.length) {
      render(items[idx++]);
    } else {
      renderResult();
    }
  }

  // 시작
  next();
}
