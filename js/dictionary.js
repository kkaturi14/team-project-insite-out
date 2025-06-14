
// js/dictionary.js
const PAGE_SIZE = 12;               // ← 12개로 변경
const gridEl       = document.getElementById('flashcard-grid');
const paginationEl = document.getElementById('pagination');

let dict = [];
let currentPage = 1;

// 1) JSON 로드
async function loadDict() {
  const res = await fetch('/data/word-dictionary.json');
  dict = await res.json();
}

// 2) 페이지 단위로 카드 렌더링 (3×4 레이아웃 자동 적용)
function renderPage(page) {
  const start = (page - 1) * PAGE_SIZE;
  const slice = dict.slice(start, start + PAGE_SIZE);

  gridEl.innerHTML = '';  // 기존 카드 모두 제거

  slice.forEach(item => {
    const card = document.createElement('div');
    card.className = 'flashcard';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${item.term}</div>
        <div class="card-back">${item.definition}</div>
      </div>`;
    card.addEventListener('click', () => {
      card.querySelector('.card-inner').classList.toggle('is-flipped');
    });
    gridEl.appendChild(card);
  });

  currentPage = page;
  renderPagination();
}

// 3) 페이지네이션 버튼 생성
function renderPagination() {
  const totalPages = Math.ceil(dict.length / PAGE_SIZE);
  let html = '';

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
  }
  paginationEl.innerHTML = html;

  paginationEl.querySelectorAll('.page-btn').forEach(btn => {
    btn.onclick = () => {
      const page = Number(btn.dataset.page);
      if (page !== currentPage) renderPage(page);
    };
  });
}

// 4) 초기 실행
(async function init() {
  await loadDict();
  renderPage(1);
})();
