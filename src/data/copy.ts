import type { AgingStage, Face, Flavor, Grade, Rarity, SaltStage } from '../logic/types';

export const TITLE = '김쳠례 김장김치';
export const TAGLINE = '3대째 내려온 척하는 손맛';
export const SINCE = 'since 어제';
export const PHONE_LINE = '전화 주문 환영 · 배달은 안 함';
export const START_BUTTON = '김장 시작';
export const RETRY_BUTTON = '한 판 더 담근다';
export const NEXT_BUTTON = '다음';
export const BACK_TO_TITLE = '처음으로';
export const COLLECTION_BUTTON = '결말 도감';
export const FOOTER = '이 게임은 실존 인물, 단체와 아무 관련이 없습니다. 김쳠례는 가상의 인물입니다.';

export const INTRO = [
  '어서 와라. 오늘 손님이 오신다.',
  '배추는 내가 사다 놨다. 솜씨는 네가 보여라.',
  '소금, 양념, 버무리기, 숙성. 순서대로 하면 된다. 대충 해도 된다. 결과는 책임 안 진다.',
];

export const STEPS = [
  { id: 'order', title: '손님 맞이', guide: '손님이 뭘 원하는지 잘 들어라.', button: '알겠어요' },
  { id: 'salt', title: '1. 절이기', guide: '소금을 얼마나 칠까. 게이지를 멈춰라.', button: '소금 끝' },
  { id: 'mix', title: '2. 양념 고르기', guide: '재료는 최대 6개. 뭐든 넣어도 된다.', button: '양념 완성' },
  { id: 'rub', title: '3. 버무리기', guide: '배추를 문질러서 양념을 발라라.', button: '다 버물렸다' },
  { id: 'age', title: '4. 숙성', guide: '며칠이나 묵힐까. 손님 입맛을 떠올려라.', button: '꺼내 본다' },
  { id: 'result', title: '5. 심사', guide: '결과가 나온다. 침 한 번 삼켜라.', button: '결과 보기' },
] as const;

export const SALT_LABEL: Record<SaltStage, string> = {
  alive: '배추가 살아 있음',
  light: '싱거운 편',
  good: '알맞게 절여짐',
  salty: '짭짤하다 못해 짠 편',
  brine: '소태',
};

export const SALT_QUOTES: Record<SaltStage, string[]> = {
  alive: ['아직 배추가 꼿꼿하잖아.', '이러면 배추가 도망간다.'],
  light: ['조금만 더 뿌려 봐라.', '싱거우면 나중에 후회한다.'],
  good: ['옳지. 숨이 딱 죽었다.', '저 정도면 손맛이 든 거다.'],
  salty: ['슬슬 짜지는데?', '소금 자루 좀 내려놔라.'],
  brine: ['이건 소금에 배추를 절인 게 아니라 배추에 소금을 절였다.', '바닷물을 길어 왔니?'],
};

export const AGING_LABEL: Record<AgingStage, string> = {
  fresh: '겉절이',
  right: '알맞게 익음',
  old: '묵은지',
  fossil: '화석',
};

export const AGING_QUOTES: Record<AgingStage, string[]> = {
  fresh: ['바로 먹는 맛도 있지.', '아직 풋내가 난다.'],
  right: ['딱 이 정도가 맛 들었다.', '냉장고에서 눈치 보며 익는 중이다.'],
  old: ['신 냄새가 제법이다.', '찌개 끓일 준비를 해라.'],
  fossil: ['이건 김치가 아니라 유적이다.', '삽 가져와라.'],
};

export const MIX_COPY = {
  shelfTitle: '양념 선반',
  normalTab: '정상 재료',
  weirdTab: '이상한 재료',
  bowlTitle: '양념 그릇',
  bowlEmpty: '그릇이 비었다. 배추가 쳐다보고 있다.',
  counter: (n: number, max: number) => `${n} / ${max}`,
  full: '6개까지만 담긴다. 그릇이 터진다.',
  removeHint: '다시 누르면 뺀다',
  flavorTitle: '지금 양념 맛',
  addedNormal: ['그래, 그건 들어가야지.', '오, 쓸 줄 아네.', '그건 맞다. 김치엔 그게 들어간다.'],
  addedWeird: ['잠깐, 그건 왜 넣니.', '허, 그걸 넣겠다고?', '내가 못 본 걸로 하마.'],
  removed: ['빼려고? 잘 생각했다.', '넣었다 뺐다 정신 사납다.'],
};

export const RUB_COPY = {
  instruction: '배추를 손가락으로 문질러 하얀 데 없이 끝까지 다 발라라.',
  progress: (pct: number) => `양념 ${pct}%`,
  low: ['더 문질러라. 하얀 데가 보인다.', '살살 하지 말고 팍팍.'],
  mid: ['슬슬 빨개진다.', '조금만 더. 손목 아프니?'],
  high: ['됐다. 아주 골고루다.', '양념이 구석구석 갔다.'],
  start: ['자, 문질러라. 시간 없다.'],
  idle: ['손이 안 움직이니? 배추가 하얗다.', '가만히 있으면 양념이 저절로 가니?'],
  time: '남은 시간',
  done: '다 버무렸다',
  end: '끝!',
};

export const AGING_COPY = {
  instruction: '독이 익는 걸 지켜보다가 초록 칸에서 지금 꺼낸다를 눌러라.',
  zoneTag: '꺼낼 때',
  left: '방금 담금',
  right: '화석',
  take: '지금 꺼낸다',
  calendar: '숙성 일수',
  elapsed: '지남',
  start: '뚜껑 닫고 기다린다. 언제 꺼낼지는 네 맘이다.',
  customer: '손님 주문',
};

/** 숙성 값이 from 이상이면 달력에 보이는 글자(뒤에서부터 처음 맞는 것). */
export const AGE_DAYS: [number, string][] = [
  [0, '방금 담근 날'],
  [0.08, '하루'],
  [0.16, '사흘'],
  [0.25, '일주일'],
  [0.35, '보름'],
  [0.45, '한 달'],
  [0.6, '석 달'],
  [0.72, '반 년'],
  [0.85, '일 년'],
  [0.93, '십 년'],
  [0.99, '백 년'],
];

export const FLAVOR_LABEL: Record<Flavor, string> = {
  spicy: '매운맛',
  salty: '짠맛',
  sweet: '단맛',
  umami: '감칠맛',
  cool: '시원함',
  chaos: '혼돈',
};

export const GRADE_LABEL: Record<Grade, string> = {
  S: '김쳠례 인정',
  A: '동네 맛집',
  B: '먹을 만함',
  C: '애매함',
  D: '곤란함',
  F: '신고 접수',
};

export const GRADE_ASIDES: Record<Grade, string[]> = {
  S: ['내가 이런 말 안 하는데, 잘했다.', '손맛은 못 속이는 거다.', '이 맛은 가보로 하자.'],
  A: ['어디 가서 내 제자라고 말해도 된다.', '밥상에 올려도 부끄럽진 않구나.', '다음엔 더 잘할 수 있겠다.'],
  B: ['먹을 만하다. 말은 이렇게 해도.', '김치는 김치다. 그것만은 인정.', '내 입엔 좀 아쉽다.'],
  C: ['이게 뭐니. 아, 김치라고?', '정성은 있는데 결과는 모르겠다.', '다음번엔 레시피부터 봐라.'],
  D: ['얘야, 우리 이야기 좀 하자.', '내가 어디서부터 말해야 할지 모르겠다.', '이 김치는 조용히 땅에 묻자.'],
  F: ['내가 오늘 본 건 못 본 걸로 하겠다.', '신고하기 전에 치워라.', '다시는 부엌에 들어오지 마라.'],
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: '흔함',
  rare: '드묾',
  legendary: '전설',
};

export const FACE_LABEL: Record<Face, string> = {
  happy: '흐뭇',
  angry: '버럭',
  faint: '기절',
  suspicious: '의심',
  proud: '뿌듯',
  blank: '멍',
};

export const RESULT_COPY = {
  scoreLabel: '맛 점수',
  gradeLabel: '등급',
  graphTitle: '맛 그래프',
  graphMine: '내 김치',
  graphWant: '손님이 원한 맛',
  customerSays: '손님 반응',
  momSays: '김쳠례 여사',
  newEnding: '도감에 새로 등록!',
  seenEnding: '이미 본 결말',
  newBest: '최고 기록 갱신',
  bite: '김쳠례 여사가 한 입 먹는다...',
  silence: '......',
  again: '한 판 더',
  remix: (n: number) => `재료를 바꾸면 결말이 바뀐다. 결말은 ${n}가지!`,
  skipHint: '화면을 톡 치면 건너뛴다',
  bestLine: (n: number) => `최고 ${n}점`,
  partLabels: { salt: '절이기', seasoning: '양념', rub: '버무리기', aging: '숙성' },
};

export const COLLECTION_COPY = {
  title: '결말 도감',
  progress: (n: number, total: number) => `${n} / ${total} 수집`,
  locked: '???',
  lockedBody: '아직 못 본 결말이다.',
  firstSeen: (date: string) => `처음 본 날 ${date}`,
  stats: (plays: number, best: number) => `담근 횟수 ${plays}번 · 최고 점수 ${best}점`,
  empty: '아직 아무것도 못 모았다. 일단 담가라.',
  complete: '전부 모았다. 이제 진짜 후계자다.',
  back: '돌아가기',
  close: '닫기',
  hintLabel: '힌트',
  quoteLabel: '김쳠례 여사',
};

export const MESSAGES = {
  saveBroken: '저장 기록이 이상해서 새로 시작한다.',
  resetConfirm: '기록을 전부 지울까.',
  customerWants: '손님이 원하는 건',
  agePrefLabel: '좋아하는 숙성',
};

export const LOADING_LINES = ['배추 씻는 중', '소금 찾는 중', '김쳠례 여사 깨우는 중', '양념 갈아 넣는 중', '장독 뚜껑 여는 중'];
export const LOADING_TAP = '화면을 톡 치면 건너뛴다';
export const TITLE_COPY = {
  marquee: '어서 오세요 ★ 김쳠례 김장김치 ★ 3대째 내려온 척하는 손맛 ★ 배달은 안 함 ★ 대충 해도 책임 안 짐 ★ ',
  visitors: '방문자',
  startBlink: 'START',
  sound: ['소리 켜짐', '소리 꺼짐'],
  book: (n: number, total: number) => `${COLLECTION_BUTTON} ${n}/${total}`,
};
export const ORDER_COPY = {
  stepGuide: '손님 말을 잘 들어라. 다 들었으면 아래 버튼을 눌러라.',
  momAsides: ['저 손님 까다롭다. 정신 차려라.', '입맛 맞추는 게 반이다.', '잘 들어 둬라. 두 번 말 안 한다.'],
  wants: '이 손님 주문',
};
export const SALT_COPY = {
  guide: '소금 버튼을 꾹 누르고 있다가 초록 칸에서 손을 떼라.',
  zoneTag: '여기서 멈춰',
  hold: '소금 뿌리기',
  done: '다 절였다',
  gauge: '소금',
  start: '자, 소금부터 쳐 봐라.',
};
export const MIX_UI = {
  guide: '눌러서 넣고, 다시 눌러서 뺀다. 최대 6개까지. 설명은 ? 버튼.',
  hint: '재료 칸의 ? 를 누르면 설명이 나온다.',
  start: '자, 골라 담아 봐라.',
  wants: '손님 주문',
  legend: '검은 눈금 = 손님이 원한 맛',
  more: '아래에 더 있다',
  go: '버무리러 가기',
  locked: '선반 잠김',
  empty: '비었다',
};
export const SOON = '이 화면은 준비 중이다. 곧 열린다.';

export const SITE_COPY = {
  winTitle: '김쳠례 김장김치 - 플래시 게임',
  visitors: '방문자 수',
  best: '이 홈페이지는 1024x768 해상도에 최적화되어 있습니다',
  reload: '게임이 안 보이면 새로고침을 누르세요',
  copyright: 'Copyright 2003 김쳠례 All rights reserved',
  newTag: 'NEW',
  newText: '김장 시즌 업데이트!',
  ticker: '★ 방명록에 글 남기고 가세요 ★ 상업적 이용 금지 ★ 퍼가실 땐 꼭 쪽지 주세요 ★ 배추는 국산 ★ ',
};
export const LOGO_ALT = TITLE;
export const TITLE_FOOT = '※ 불법 복제 시 김쳠례 여사가 찾아갑니다';
export const LOADING_NOW = 'LOADING';

export const GUIDE_COPY = {
  button: '게임 방법',
  title: '게임 방법',
  start: '알았다, 시작',
  close: '닫기',
  steps: [
    { name: '주문 듣기', line: '손님이 원하는 맛을 듣는다.', art: '/assets/customer/banjang.png' },
    { name: '절이기', line: '소금 버튼을 꾹 누르다가 초록 칸에서 뗀다.', art: '/assets/prop/salt-scoop.png' },
    { name: '양념', line: '재료를 눌러 넣는다. 최대 6개까지.', art: '/assets/ing/gochugaru.png' },
    { name: '버무리기', line: '배추를 문질러 빨갛게 만든다.', art: '/assets/prop/cabbage-red.png' },
    { name: '숙성', line: '저절로 익는다. 좋을 때 꺼낸다.', art: '/assets/prop/onggi.png' },
    { name: '판정', line: '여사가 점수와 결말을 매긴다.', art: '/assets/grandma/proud.png' },
  ],
  foot: (n: number) => `결말은 ${n}가지다. 재료를 바꿔 다 모아 봐라.`,
};

export const ARROW_COPY = {
  start: '여기 눌러',
  salt: '꾹 눌러',
  saltMore: '더 뿌려',
  saltDone: '다 절였으면',
  gochugaru: '이것부터',
  mixDone: '다 넣었으면',
  rub: '여기 문질러',
  rubDone: '다 발랐으면',
  take: '지금 꺼내',
  again: '한 판 더',
};
