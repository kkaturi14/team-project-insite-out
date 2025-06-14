// js/character-manager.js

const STORAGE_KEY = 'selectedCharacter';

export const CharacterManager = {
  // 로컬스토리지에서 캐릭터 데이터 가져오기
  get() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  // 캐릭터 데이터 저장하기
  save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // 점수 증가시키기 (변화된 데이터를 저장하고 사용자 패널 리렌더링)
  incrementScore(delta = 1) {
    const char = this.get();
    if (!char) return null;
    char.score = (char.score || 0) + delta;
    this.save(char);
    // 전역 이벤트로 알려주기 (UI 갱신용)
    document.dispatchEvent(new CustomEvent('scoreChanged', { detail: char.score }));
    return char.score;
  }
};
