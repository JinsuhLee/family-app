# family-app

가족용 PWA 앱입니다.

## GitHub Pages 공개 배포 기본 원칙

- GitHub Pages는 정적 호스팅이라 브라우저에 내려가는 값은 숨길 수 없습니다.
- 그래서 이 저장소는 공개 가능한 설정만 [public-config.js](public-config.js)에 두고 동작하도록 정리했습니다.
- 기본값은 `읽기 전용 공유 사진 목록`입니다.
- 사진 업로드/삭제 같은 쓰기 기능은 공개 배포에서 기본 비활성화되어 있습니다.

## 현재 하단 메뉴

- 홈
- 기도
- 일정
- 생일
- 사진

## 사진 기능

- 기본: 브라우저 `localStorage`에 사진 저장 (기기별 저장)
- GitHub Pages 공개 배포 기본값: Supabase 공유 사진 목록 읽기 전용
- Supabase 설정이 없으면: 브라우저 `localStorage`에 사진 저장 (기기별 저장)

## GitHub Pages용 공개 설정

이 프로젝트는 [public-config.js](public-config.js)를 GitHub Pages용 공개 설정 파일로 사용합니다.

```js
window.PUBLIC_APP_CONFIG={
	supabase:{
		url:"https://YOUR_PROJECT_REF.supabase.co",
		anonKey:"YOUR_SUPABASE_PUBLISHABLE_KEY"
	},
	photos:{
		enableSharedGallery:true,
		readOnly:true,
		allowDirectUpload:false
	},
	schedule:{
		sheetUrl:"https://sheetdb.io/api/v1/YOUR_SHEET_ID",
		fields:{
			date:"date",
			title:"title",
			detail:"detail"
		}
	},
	verse:{
		sheetUrl:"https://sheetdb.io/api/v1/YOUR_VERSE_SHEET_ID",
		fields:{
			date:"date",
			text:"verse"
		}
	},
	cloudinary:{
		cloudName:"",
		uploadPreset:""
	}
}
```

의미:

- `supabase`: 공개 가능한 프로젝트 URL / publishable key
- `readOnly:true`: 공유 사진 목록은 누구나 조회만 가능
- `allowDirectUpload:false`: 브라우저에서 직접 업로드 비활성화
- `schedule.sheetUrl`: 일정 탭 클릭 시 불러올 SheetDB API 주소
- `schedule.fields`: 일정 데이터 컬럼명 매핑
- `verse.sheetUrl`: 홈 화면 말씀을 불러올 SheetDB API 주소
- `verse.fields`: 말씀 데이터 컬럼명 매핑

권장 SheetDB 응답 형식:

일정 시트:

```json
[
	{
		"date": "2026-04-15",
		"title": "가족 저녁식사",
		"detail": "오후 7시"
	}
]
```

말씀 시트:

```json
[
	{
		"date": "2026-04-15",
		"verse": "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라"
	}
]
```

## Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 [supabase-photos.sql](supabase-photos.sql) 실행
3. [public-config.js](public-config.js)의 `supabase.url`, `supabase.anonKey` 값 확인

동작 방식:

- 사진 목록 데이터(URL/시간): Supabase `photos` 테이블에서 조회
- GitHub Pages 기본값: 읽기 전용
- Supabase 설정이 없으면 로컬 저장 모드로 동작

## 보안 판단 기준

- 공개 가능: Supabase project URL, Supabase publishable key
- 공개 비권장: Cloudinary unsigned upload preset
- 절대 비공개: Cloudinary API secret, Supabase service role key

## 왜 업로드/삭제를 기본 비활성화했는가

- GitHub Pages는 서버가 없어서 비밀키를 숨길 수 없습니다.
- 클라이언트에서 직접 업로드/삭제를 열어두면 제3자가 악용할 수 있습니다.
- 그래서 공개 배포 기본값은 `조회만 가능`한 구조로 바꿨습니다.

## 쓰기 기능이 꼭 필요하면

다음 둘 중 하나가 필요합니다.

1. 인증이 있는 Supabase 정책 설계
2. 서버리스 함수로 서명 업로드/삭제 API 제공

현재 저장소는 그 전 단계로, GitHub Pages에 안전하게 올릴 수 있는 읽기 전용 공개 구성을 기본값으로 둡니다.

## 배포 후 검증

1. 첫 접속 시 앱 정상 로딩 확인
2. 사진 탭에서 공유 사진 목록이 읽기 전용으로 보이는지 확인
3. 브라우저 콘솔에 Supabase 권한 오류가 없는지 확인