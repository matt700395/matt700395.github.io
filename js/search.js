/**
 * 클라이언트 사이드 검색 기능
 * - 제목, 내용, 태그 검색
 * - 실시간 필터링
 */

// 검색용 게시글 데이터 (app.js의 allPosts 참조)
let searchPosts = [];

/**
 * 검색어로 게시글 필터링
 * @param {string} query - 검색어
 * @returns {Array} 필터링된 게시글 배열
 */
function searchByQuery(query) {
  if (!query || query.trim() === '') {
    return searchPosts;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  return searchPosts.filter(post => {
    // 제목 검색
    if (post.title && post.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // 설명 검색
    if (post.description && post.description.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // 발췌문 검색
    if (post.excerpt && post.excerpt.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // 태그 검색
    if (post.tags && Array.isArray(post.tags)) {
      if (post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }
    }
    
    // 카테고리 검색
    if (post.category && post.category.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    return false;
  });
}

/**
 * 검색 결과 렌더링
 * @param {Array} results - 검색 결과 배열
 */
function renderSearchResults(results) {
  const container = document.getElementById('posts-container');
  if (!container) return;
  
  if (results.length === 0) {
    container.innerHTML = '<p class="no-posts">검색 결과가 없습니다.</p>';
    return;
  }
  
  // app.js의 createPostCard 함수 사용
  if (typeof createPostCard === 'function') {
    container.innerHTML = results.map(createPostCard).join('');
  }
}

/**
 * 검색 실행 (디바운스 적용)
 * @param {string} query - 검색어
 */
let searchTimeout = null;

function executeSearch(query) {
  // 기존 타이머 취소
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // 300ms 디바운스
  searchTimeout = setTimeout(() => {
    const results = searchByQuery(query);
    renderSearchResults(results);
    console.log('[Search] 검색:', query || '(전체)', '-', results.length, '개');
  }, 300);
}

/**
 * 검색 초기화
 */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  // 검색 입력 이벤트
  searchInput.addEventListener('input', function(e) {
    executeSearch(e.target.value);
  });
  
  // Enter 키 방지 (폼 제출 방지)
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });
  
  // Escape 키로 검색어 초기화
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchInput.value = '';
      executeSearch('');
    }
  });
  
  console.log('[Search] 초기화 완료');
}

/**
 * 게시글 데이터 동기화 (app.js에서 호출)
 * @param {Array} posts - 게시글 배열
 */
function syncSearchPosts(posts) {
  searchPosts = posts || [];
  console.log('[Search] 게시글 동기화:', searchPosts.length, '개');
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initSearch();
    // app.js의 allPosts가 로드될 때까지 대기
    setTimeout(() => {
      if (typeof allPosts !== 'undefined') {
        syncSearchPosts(allPosts);
      }
    }, 100);
  });
} else {
  initSearch();
  if (typeof allPosts !== 'undefined') {
    syncSearchPosts(allPosts);
  }
}

