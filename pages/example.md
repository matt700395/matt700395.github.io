---
title: "GitHub Pages 블로그 시작하기"
date: 2025-11-28
tags: ["GitHub", "블로그", "마크다운"]
category: "Tutorial"
description: "GitHub Pages를 사용하여 정적 블로그를 만드는 방법을 알아봅니다."
---

# 환영합니다!

이 블로그는 **GitHub Pages**를 사용하여 만든 정적 블로그입니다.

## 주요 기능

- 🌓 **다크/라이트 모드** - 눈이 편한 테마를 선택하세요
- 🔍 **검색 기능** - 게시글을 빠르게 찾아보세요
- 🏷️ **태그 필터링** - 관심 있는 주제만 필터링하세요
- 💬 **댓글 시스템** - Giscus를 통한 GitHub Discussions 기반 댓글
- 📱 **반응형 디자인** - 모바일에서도 편하게 읽으세요

## 코드 하이라이팅

JavaScript 코드 예시:

```javascript
// Hello World 출력
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
  return `환영합니다!`;
}

greet('방문자');
```

Python 코드 예시:

```python
# 간단한 함수
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))  # 55
```

## 마크다운 문법

### 목록

- 순서 없는 목록 항목 1
- 순서 없는 목록 항목 2
  - 중첩된 항목

1. 순서 있는 목록 항목 1
2. 순서 있는 목록 항목 2

### 인용문

> "가장 좋은 시작은 지금이다."
> 
> — 작자 미상

### 링크와 이미지

[GitHub](https://github.com)로 이동하기

### 표

| 기능 | 설명 |
|------|------|
| 마크다운 | 게시글 작성 |
| Prism.js | 코드 하이라이팅 |
| Giscus | 댓글 시스템 |

## 새 게시글 작성하기

1. `pages/` 폴더에 새 `.md` 파일을 생성합니다
2. Front Matter(메타데이터)를 작성합니다:

```markdown
---
title: "게시글 제목"
date: 2025-01-01
tags: ["태그1", "태그2"]
category: "카테고리"
description: "게시글 설명"
---

내용을 작성합니다...
```

3. Git에 커밋하고 푸시하면 자동으로 배포됩니다!

---

즐거운 블로깅 되세요! 🎉

