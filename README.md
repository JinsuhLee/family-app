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
4. 루트에 `firebase-config.js` 파일 생성 (`firebase-config.example.js` 참고)

```js
window.FIREBASE_CONFIG={
	apiKey:"...",
	authDomain:"...",
	projectId:"...",
	storageBucket:"...",
	messagingSenderId:"...",
	appId:"..."
}
```

`firebase-config.js`는 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다.

## 권장 보안 규칙(개발용)

테스트 단계에서는 간단히 열어둘 수 있지만, 운영 시에는 인증/권한 규칙을 반드시 설정하세요.

## 운영 배포 전 GitHub 보안 체크

1. GitHub 저장소 Settings > Security에서 Secret scanning Alerts 활성화
2. Push protection 활성화
3. Branch protection rule 설정 (main 직접 push 제한, PR 필수)
4. Actions 탭에서 `Secret Scan` 워크플로우(gitleaks) 성공 확인