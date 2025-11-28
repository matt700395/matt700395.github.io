/**
 * 게시글 상세 페이지 로더
 * - 마크다운 파일 로딩 및 파싱
 * - Front Matter 처리
 * - Giscus 댓글 로드
 */

/**
 * URL에서 파일명 파라미터 추출
 * @returns {string|null} 파일명
 */
function getFileParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('file');
}

/**
 * Front Matter 파싱
 * @param {string} content - 마크다운 내용
 * @returns {Object} { metadata, content }
 */
function parseFrontMatter(content) {
  // UTF-8 BOM 제거
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  
  const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  
  if (!frontMatterMatch) {
    return { metadata: {}, content: content };
  }
  
  const frontMatter = frontMatterMatch[1];
  const postContent = frontMatterMatch[2];
  const metadata = {};
  
  // 라인별 파싱
  const lines = frontMatter.split(/\r?\n/);
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // 따옴표 제거
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // 배열 파싱 (tags)
      if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
        try {
          value = JSON.parse(value);
        } catch {
          value = value.slice(1, -1).split(',').map(tag => 
            tag.trim().replace(/^['"]|['"]$/g, '')
          );
        }
      }
      
      metadata[key] = value;
    }
  });
  
  return { metadata, content: postContent };
}

/**
 * 날짜 포맷팅
 * @param {string} dateStr - ISO 날짜 문자열
 * @returns {string} 포맷된 날짜
 */
function formatPostDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 게시글 헤더 HTML 생성
 * @param {Object} metadata - 메타데이터
 * @returns {string} HTML 문자열
 */
function createPostHeader(metadata) {
  const tagsHtml = metadata.tags && Array.isArray(metadata.tags)
    ? metadata.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
    : '';
  
  return `
    <header class="post-header">
      <h1 class="post-title">${metadata.title || '제목 없음'}</h1>
      <div class="post-meta">
        ${metadata.date ? `<span>📅 ${formatPostDate(metadata.date)}</span>` : ''}
        ${metadata.category ? `<span>📁 ${metadata.category}</span>` : ''}
      </div>
      ${tagsHtml ? `<div class="post-tags">${tagsHtml}</div>` : ''}
    </header>
  `;
}

/**
 * 마크다운을 HTML로 변환
 * @param {string} markdown - 마크다운 내용
 * @returns {string} HTML 문자열
 */
function convertMarkdown(markdown) {
  if (typeof marked === 'undefined') {
    console.error('[PostLoader] marked.js가 로드되지 않았습니다.');
    return `<p>${markdown}</p>`;
  }
  
  // marked 옵션 설정
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
  });
  
  return marked.parse(markdown);
}

/**
 * 코드 하이라이팅 적용
 */
function highlightCode() {
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
    console.log('[PostLoader] 코드 하이라이팅 적용 완료');
  }
}

/**
 * Giscus 댓글 로드
 */
function loadGiscus() {
  const commentsContainer = document.getElementById('comments');
  if (!commentsContainer) return;
  
  // 현재 테마 감지
  const theme = document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light';
  
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'matt700395/matt700395.github.io');
  script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // TODO: 실제 값으로 교체
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // TODO: 실제 값으로 교체
  script.setAttribute('data-mapping', 'pathname');
  script.setAttribute('data-strict', '0');
  script.setAttribute('data-reactions-enabled', '1');
  script.setAttribute('data-emit-metadata', '1');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', theme);
  script.setAttribute('data-lang', 'ko');
  script.setAttribute('data-loading', 'lazy');
  script.crossOrigin = 'anonymous';
  script.async = true;
  
  commentsContainer.appendChild(script);
  console.log('[PostLoader] Giscus 로드 시작');
}

/**
 * 페이지 제목 업데이트
 * @param {string} title - 게시글 제목
 */
function updatePageTitle(title) {
  document.title = title ? `${title} - Matt's Blog` : "Matt's Blog";
}

/**
 * 게시글 로드 및 렌더링
 */
async function loadPost() {
  const filename = getFileParam();
  
  if (!filename) {
    showError('게시글을 찾을 수 없습니다.');
    return;
  }
  
  console.log('[PostLoader] 게시글 로드 시작:', filename);
  
  try {
    const response = await fetch(`pages/${filename}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawContent = await response.text();
    const { metadata, content } = parseFrontMatter(rawContent);
    
    // 페이지 제목 업데이트
    updatePageTitle(metadata.title);
    
    // HTML 생성
    const headerHtml = createPostHeader(metadata);
    const bodyHtml = convertMarkdown(content);
    
    // 렌더링
    const container = document.getElementById('post-content');
    if (container) {
      container.innerHTML = `
        ${headerHtml}
        <div class="post-body">${bodyHtml}</div>
      `;
    }
    
    // 코드 하이라이팅
    setTimeout(highlightCode, 100);
    
    // Giscus 로드
    loadGiscus();
    
    console.log('[PostLoader] 게시글 로드 완료:', metadata.title);
    
  } catch (error) {
    console.error('[PostLoader] 게시글 로드 실패:', error);
    showError('게시글을 불러오는 중 오류가 발생했습니다.');
  }
}

/**
 * 에러 메시지 표시
 * @param {string} message - 에러 메시지
 */
function showError(message) {
  const container = document.getElementById('post-content');
  if (container) {
    container.innerHTML = `<p class="error">${message}</p>`;
  }
}

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPost);
} else {
  loadPost();
}

// 테마 변경 시 Giscus 테마도 업데이트
document.addEventListener('DOMContentLoaded', function() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'data-theme') {
        const iframe = document.querySelector('iframe.giscus-frame');
        if (iframe) {
          const theme = document.documentElement.getAttribute('data-theme') === 'dark'
            ? 'dark'
            : 'light';
          iframe.contentWindow.postMessage(
            { giscus: { setConfig: { theme: theme } } },
            'https://giscus.app'
          );
        }
      }
    });
  });
  
  observer.observe(document.documentElement, { attributes: true });
});

