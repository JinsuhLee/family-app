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
- Firebase 없이 Cloudinary만 설정 시: 사진은 Cloudinary에 업로드되고, 링크 목록은 브라우저 `localStorage`에 저장
- Firebase 없이 Cloudinary + Supabase 설정 시: 여러 기기에서 같은 사진 목록을 무료로 공유

## Firebase 없이 무료 사진 업로드(Cloudinary)

1. Cloudinary 계정 생성(무료)
2. Upload Preset을 `Unsigned`로 생성
3. 루트에 `cloudinary-config.js` 파일 생성 (`cloudinary-config.example.js` 참고)

```js
window.CLOUDINARY_CONFIG={
	cloudName:"...",
	uploadPreset:"..."
}
```

주의: 이 모드에서는 이미지 파일은 Cloudinary에 올라가지만, 앱의 사진 목록(순서/목록 데이터)은 기기별 `localStorage`에 저장됩니다.

보안: `cloudinary-config.js`는 로컬 전용 파일로 두고 Git에 커밋하지 마세요.

## Firebase 없이 무료 기기 간 사진 목록 동기화(Cloudinary + Supabase)

1. 위 Cloudinary 설정을 먼저 완료
2. Supabase 프로젝트 생성(무료)
3. SQL Editor에서 `supabase-photos.sql` 실행
4. 루트에 `supabase-config.js` 파일 생성 (`supabase-config.example.js` 참고)

```js
window.SUPABASE_CONFIG={
	url:"https://YOUR_PROJECT_REF.supabase.co",
	anonKey:"YOUR_SUPABASE_ANON_KEY"
}
```

동작 방식:

- 이미지 파일: Cloudinary 저장
- 사진 목록 데이터(URL/시간): Supabase `photos` 테이블 저장
- 앱 우선순위: Firebase 사용 가능 시 Firebase, 아니면 Supabase, 둘 다 없으면 로컬 저장
- 사진 카드의 `삭제` 버튼으로 목록에서 제거 가능
- 최근 업로드 사진은 `삭제` 시 Cloudinary 원본 파일 삭제도 함께 시도
- Cloudinary 원본 삭제가 실패하면 실패 이유를 알림으로 표시하고, 목록 삭제는 계속 진행

주의: Cloudinary 원본 삭제는 `delete_token` 유효시간 안에서만 동작합니다(보통 업로드 직후 짧은 시간). 시간이 지난 사진은 앱 목록에서만 제거될 수 있습니다.

보안: `supabase-config.js`는 로컬 전용 파일로 두고 Git에 커밋하지 마세요.

이미 Supabase를 먼저 구성했다면 `supabase-photos.sql`을 다시 실행해 `delete_token` 컬럼/삭제 정책(`allow delete photos`)을 반영하세요.

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

보안: 실제 설정 파일은 `*.example.js`가 아니라 `*-config.js` 파일들입니다. 예시 파일만 저장소에 두고, 실제 값은 로컬 파일에만 보관하세요.

## 권장 보안 규칙(개발용)

테스트 단계에서는 간단히 열어둘 수 있지만, 운영 시에는 인증/권한 규칙을 반드시 설정하세요.

## 운영 배포 전 GitHub 보안 체크

1. GitHub 저장소 Settings > Security에서 Secret scanning Alerts 활성화
2. Push protection 활성화
3. Branch protection rule 설정 (main 직접 push 제한, PR 필수)
4. Actions 탭에서 `Secret Scan` 워크플로우(gitleaks) 성공 확인

## 운영용 Firebase 보안 적용(인증 필수)

이 프로젝트는 Firebase 설정이 있으면 익명 인증으로 로그인 후 클라우드 모드로 동작합니다.

1. Firebase Console > Authentication > Sign-in method에서 `Anonymous` 활성화
2. Firestore Rules에 `firestore.rules` 내용 적용
3. Storage Rules에 `storage.rules` 내용 적용
4. 배포 후 사진 업로드/조회 정상 동작 확인

주의: 인증을 켜지 않고 규칙만 인증 필수로 바꾸면 클라우드 업로드가 차단됩니다.

## 배포 직전 최종 체크리스트

### Firebase Console

1. Build > Authentication > Sign-in method > `Anonymous`가 Enabled인지 확인
2. Firestore Database > Rules에 `firestore.rules` 적용 후 Publish
3. Storage > Rules에 `storage.rules` 적용 후 Publish
4. Project settings > Your apps에서 웹 앱의 `apiKey/authDomain/projectId`가 `firebase-config.js`와 일치하는지 확인

### GitHub

1. Settings > Security > Code security and analysis > Secret scanning: Enabled
2. Settings > Security > Secret scanning > Push protection: Enabled
3. Settings > Branches > `main` 보호 규칙(PR 필수, 직접 push 제한)
4. Actions 탭에서 `Secret Scan` 워크플로우 최근 실행이 Success인지 확인

### 배포 후 검증

1. 첫 접속 시 앱 정상 로딩 및 말씀 데이터 표시 확인
2. 사진 업로드 1건 실행 후 다른 기기/브라우저에서 동일 사진 조회 확인
3. 브라우저 개발자도구 콘솔에 Firebase 권한 오류(`permission-denied`)가 없는지 확인