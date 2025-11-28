/**
 * 메인 애플리케이션 로직
 * - 게시글 목록 로딩 및 렌더링
 * - 태그 필터링
 */

// 전역 변수
let allPosts = [];
let selectedTag = null;

/**
 * posts.json에서 게시글 목록 가져오기
 * @returns {Promise<Array>} 게시글 배열
 */
async function fetchPosts() {
  try {
    const response = await fetch('posts.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    console.log('[App] 게시글 로드 완료:', posts.length, '개');
    return posts;
  } catch (error) {
    console.error('[App] 게시글 로드 실패:', error);
    return [];
  }
}

/**
 * 날짜 포맷팅
 * @param {string} dateStr - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}. ${month}. ${day}`;
}

/**
 * 게시글 카드 HTML 생성
 * @param {Object} post - 게시글 데이터
 * @returns {string} HTML 문자열
 */
function createPostCard(post) {
  const tagsHtml = post.tags && post.tags.length > 0
    ? post.tags.map(tag => `<span class="post-card-tag">${tag}</span>`).join('')
    : '';
  
  const categoryHtml = post.category
    ? `<span class="post-card-category">${post.category}</span>`
    : '';
  
  return `
    <article class="post-card">
      <h2 class="post-card-title">
        <a href="post.html?file=${encodeURIComponent(post.file)}">${post.title}</a>
      </h2>
      <div class="post-card-meta">
        <span class="post-card-date">📅 ${formatDate(post.date)}</span>
        ${categoryHtml}
      </div>
      ${post.excerpt ? `<p class="post-card-excerpt">${post.excerpt}</p>` : ''}
      ${tagsHtml ? `<div class="post-card-tags">${tagsHtml}</div>` : ''}
    </article>
  `;
}

/**
 * 게시글 목록 렌더링
 * @param {Array} posts - 렌더링할 게시글 배열
 */
function renderPosts(posts) {
  const container = document.getElementById('posts-container');
  if (!container) return;
  
  if (posts.length === 0) {
    container.innerHTML = '<p class="no-posts">게시글이 없습니다.</p>';
    return;
  }
  
  container.innerHTML = posts.map(createPostCard).join('');
  console.log('[App] 게시글 렌더링 완료:', posts.length, '개');
}

/**
 * 모든 태그 추출
 * @param {Array} posts - 게시글 배열
 * @returns {Array} 고유 태그 배열
 */
function extractAllTags(posts) {
  const tagSet = new Set();
  posts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagSet.add(tag));
    }
  });
  return Array.from(tagSet).sort();
}

/**
 * 태그 필터 렌더링
 * @param {Array} tags - 태그 배열
 */
function renderTags(tags) {
  const container = document.getElementById('tags-container');
  if (!container || tags.length === 0) return;
  
  const allTagHtml = `<span class="tag ${!selectedTag ? 'active' : ''}" data-tag="">전체</span>`;
  const tagsHtml = tags.map(tag => 
    `<span class="tag ${selectedTag === tag ? 'active' : ''}" data-tag="${tag}">${tag}</span>`
  ).join('');
  
  container.innerHTML = allTagHtml + tagsHtml;
  
  // 태그 클릭 이벤트 추가
  container.querySelectorAll('.tag').forEach(tagEl => {
    tagEl.addEventListener('click', function() {
      const tag = this.dataset.tag;
      selectedTag = tag || null;
      filterByTag();
      
      // active 클래스 업데이트
      container.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  console.log('[App] 태그 렌더링 완료:', tags.length, '개');
}

/**
 * 태그로 필터링
 */
function filterByTag() {
  let filtered = allPosts;
  
  if (selectedTag) {
    filtered = allPosts.filter(post => 
      post.tags && post.tags.includes(selectedTag)
    );
  }
  
  renderPosts(filtered);
  console.log('[App] 태그 필터링:', selectedTag || '전체', '-', filtered.length, '개');
}

/**
 * 초기화
 */
async function initApp() {
  console.log('[App] 초기화 시작');
  
  // 게시글 로드
  allPosts = await fetchPosts();
  
  // 게시글 렌더링
  renderPosts(allPosts);
  
  // 태그 렌더링
  const tags = extractAllTags(allPosts);
  renderTags(tags);
  
  console.log('[App] 초기화 완료');
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

