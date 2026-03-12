# family-app

가족용 PWA 앱입니다.

## 현재 하단 메뉴

- 홈
- 기도
- 일정
- 생일
- 사진

## 사진 기능

- 기본: 브라우저 `localStorage`에 사진 저장 (기기별 저장)
- Firebase 설정 시: 여러 사람이 같은 사진 목록을 공유

## Firebase 공유 사진 설정

1. Firebase 프로젝트 생성
2. Firestore Database 생성
3. Storage 생성
4. `index.html`의 `FIREBASE_CONFIG` 값 입력

```js
const FIREBASE_CONFIG={
	apiKey:"...",
	authDomain:"...",
	projectId:"...",
	storageBucket:"...",
	messagingSenderId:"...",
	appId:"..."
}
```

## 권장 보안 규칙(개발용)

테스트 단계에서는 간단히 열어둘 수 있지만, 운영 시에는 인증/권한 규칙을 반드시 설정하세요.