/* 플립북 — 쪽 넘김 (키보드 ◀ ▶ + 버튼 + 쪽 입력 + 섹션 nav) */
(function() {
  const book = document.querySelector('.book');
  if (!book) return;
  const sheets = Array.from(book.querySelectorAll('.sheet'));
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  const pageInput = document.querySelector('.page-counter .page-input');
  const sectionBtns = document.querySelectorAll('.section-nav button');
  let current = 0;

  function render() {
    sheets.forEach((s, i) => s.classList.toggle('active', i === current));
    book.setAttribute('data-current', current + 1);
    if (pageInput) pageInput.value = current + 1;
    if (prevBtn) prevBtn.disabled = (current === 0);
    if (nextBtn) nextBtn.disabled = (current === sheets.length - 1);
    history.replaceState(null, '', `#p${current + 1}`);
  }

  function goTo(pageNumber) {
    const n = parseInt(pageNumber, 10) - 1;
    if (isNaN(n) || n < 0 || n >= sheets.length) return;
    current = n;
    render();
    sheets[current].scrollTop = 0;
  }

  function go(delta) {
    const next = current + delta;
    if (next < 0 || next >= sheets.length) return;
    current = next;
    render();
    sheets[current].scrollTop = 0;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => go(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => go(1));

  if (pageInput) {
    pageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        goTo(pageInput.value);
        pageInput.blur();
      }
    });
    pageInput.addEventListener('change', () => goTo(pageInput.value));
  }

  sectionBtns.forEach(btn => {
    btn.addEventListener('click', () => goTo(btn.dataset.page));
  });

  document.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
    if (e.key === 'Home') { current = 0; render(); }
    if (e.key === 'End') { current = sheets.length - 1; render(); }
  });

  const hash = location.hash.match(/^#p(\d+)$/);
  if (hash) {
    const n = parseInt(hash[1], 10) - 1;
    if (n >= 0 && n < sheets.length) current = n;
  }

  render();
})();

/* 프롬프트 블록에 복사 버튼 자동 삽입 */
(function() {
  function initCopyButtons() {
    document.querySelectorAll('.prompt').forEach(block => {
      if (block.querySelector('.copy-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.setAttribute('aria-label', '프롬프트 복사');
      btn.textContent = '⧉';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // 복사 버튼과 라벨 span을 제외한 텍스트 추출
        const clone = block.cloneNode(true);
        clone.querySelectorAll('.copy-btn, .prompt-label').forEach(el => el.remove());
        const text = clone.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          btn.classList.add('copied');
          btn.textContent = '복사됨';
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = '⧉';
          }, 1500);
        }).catch(() => {
          btn.textContent = '!';
          setTimeout(() => { btn.textContent = '⧉'; }, 1500);
        });
      });
      block.appendChild(btn);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
  } else {
    initCopyButtons();
  }
})();

/* 모듈 4 STEP 2 — 앱 선택 카드 (카드 클릭 → active + 슬롯 텍스트 변경) */
(function(){
  var cards = document.querySelectorAll('.app-card');
  if (!cards.length) return;
  var slot = document.querySelector('.app-slot');
  cards.forEach(function(card){
    card.addEventListener('click', function(){
      cards.forEach(function(c){ c.classList.remove('active'); });
      card.classList.add('active');
      if (slot) slot.textContent = card.dataset.app;
    });
  });
})();
