/**
 * 다크/라이트 모드 토글 기능
 * - localStorage에 테마 설정 저장
 * - 시스템 테마 감지 지원
 */

(function() {
  'use strict';
  
  const THEME_KEY = 'blog-theme';
  const DARK = 'dark';
  const LIGHT = 'light';
  
  /**
   * 시스템 테마 감지
   * @returns {string} 'dark' 또는 'light'
   */
  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK;
    }
    return LIGHT;
  }
  
  /**
   * 저장된 테마 또는 시스템 테마 가져오기
   * @returns {string} 'dark' 또는 'light'
   */
  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === DARK || saved === LIGHT) {
      return saved;
    }
    return getSystemTheme();
  }
  
  /**
   * 테마 적용
   * @param {string} theme - 'dark' 또는 'light'
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    console.log('[Theme] 테마 적용:', theme);
  }
  
  /**
   * 테마 토글
   */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getSavedTheme();
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
  }
  
  /**
   * 초기화
   */
  function init() {
    // 초기 테마 적용
    const initialTheme = getSavedTheme();
    applyTheme(initialTheme);
    
    // 토글 버튼 이벤트 리스너
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
    
    // 시스템 테마 변경 감지
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        // 사용자가 직접 테마를 설정하지 않은 경우에만 자동 변경
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
    }
    
    console.log('[Theme] 초기화 완료');
  }
  
  // DOM 로드 완료 후 초기화
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

