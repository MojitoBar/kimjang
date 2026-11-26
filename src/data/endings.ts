import type { Ending } from '../logic/types';

export const ENDINGS: Ending[] = [
  // ---- 특수 결말 (판정 우선순위 순서) ----
  {
    id: 'battery', kind: 'special', title: '그건 먹는 게 아니다',
    body: '김쳠례가 국자를 내려놓고 조용히 현관을 가리켰다. 오늘 일은 없던 걸로 하자고 했다.',
    face: 'angry', rarity: 'rare', hint: '선반에 넣으면 안 되는 게 하나 섞여 있다',
    quote: '야! 그건 건전지야! 당장 빼! 엄마가 그렇게 가르쳤냐!', cap: 3,
  },
  {
    id: 'salt_none', kind: 'special', title: '배추가 살아서 밭으로 돌아갔다',
    body: '소금을 못 만난 배추는 아직 자기가 살아 있는 줄 알았다. 새벽에 대문이 열려 있었다.',
    face: 'faint', rarity: 'common', hint: '소금을 아끼면 일어나는 일',
    quote: '배추가 숨이 하나도 안 죽었잖아! 소금이 아깝디?', cap: 15,
  },
  {
    id: 'salt_over', kind: 'special', title: '바다가 배추에 들어왔다',
    body: '한 입 먹은 손님이 물을 찾았다. 물을 마시고 나니 또 물이 필요했다.',
    face: 'angry', rarity: 'common', hint: '소금 앞에서 손이 너무 컸던 날',
    quote: '소금이 보였니? 보이는 대로 퍼 넣었니?', cap: 20,
  },
  {
    id: 'fossil', kind: 'special', title: '김치 화석 발굴',
    body: '냉장고 안쪽에서 발견된 김치는 이미 지층이 되어 있었다. 박물관에서 전화가 왔다.',
    face: 'blank', rarity: 'rare', hint: '너무 오래 놔둔 것의 끝',
    quote: '이게 언제 담근 거야. 공룡이 먹던 거 아니니?', cap: 20,
  },
  {
    id: 'rub_zero', kind: 'special', title: '양념은 옆에서 구경만 했다',
    body: '배추는 하얗고 양념은 대접에 얌전했다. 서로 인사도 없이 헤어졌다.',
    face: 'suspicious', rarity: 'common', hint: '손을 안 쓰면 생기는 일',
    quote: '양념이 배추를 만나야지, 그릇에서 뭐 하는 거니!', cap: 30,
  },
  {
    id: 'aging_zero', kind: 'special', title: '담그자마자 심사',
    body: '양념이 마르기도 전에 손님이 숟가락을 들었다. 배추는 아직 긴장하고 있었다.',
    face: 'suspicious', rarity: 'common', hint: '기다림이 하나도 없으면',
    quote: '벌써 꺼냈어? 맛이 들 시간은 줘야지!', cap: 40,
  },
  {
    id: 'no_ingredients', kind: 'special', title: '그냥 절인 배추',
    body: '정성스럽게 소금에 절여 접시에 담았다. 이름은 절인 배추다.',
    face: 'blank', rarity: 'common', hint: '선반을 한 번도 안 열면',
    quote: '이건 그냥 절인 배추잖아. 너 장난하니.', cap: 25,
  },
  {
    id: 'all_weird', kind: 'special', title: '식약처에서 연락이 왔다',
    body: '정체불명 여섯 가지가 한 통에 모였다. 전화벨은 그날 저녁부터 멈추지 않았다.',
    face: 'faint', rarity: 'rare', hint: '선반 아래쪽 이상한 것만 가득 채우면',
    quote: '내가 이걸 먹으라고? 전화 좀 받아 봐, 구청이래.', cap: 15,
  },
  {
    id: 'toothpaste', kind: 'special', title: '치약 김치 탄생',
    body: '양치와 식사를 한 번에 해결했다. 입안이 개운하다 못해 시리다.',
    face: 'suspicious', rarity: 'rare', hint: '개운함의 끝에 가 본 사람',
    quote: '이 하얀 거 뭐니? 거품이 나잖아!', cap: 20,
  },
  {
    id: 'sock', kind: 'special', title: '짝 잃은 양말의 마지막 외출',
    body: '한 짝은 지금도 세탁기 뒤에 있다. 다른 한 짝은 방금 배추 속에 있다.',
    face: 'blank', rarity: 'rare', hint: '세탁기 뒤에서 온 재료',
    quote: '이게 누구 양말이야! 삼촌 거지? 삼촌 거 맞지?', cap: 15,
  },
  {
    id: 'money', kind: 'special', title: '삼촌의 비상금이 비상이 됐다',
    body: '배추 사이로 오만 원권이 보였다. 삼촌이 맨발로 달려오는 소리가 들렸다.',
    face: 'faint', rarity: 'rare', hint: '삼촌이 어딘가에 숨겨 둔 게 선반에 있다',
    quote: '삼촌 돈이잖아! 그걸 왜 담가! 뺏기 전에 꺼내!', cap: 30,
  },
  {
    id: 'mint_oyster', kind: 'special', title: '굴이 도망쳤다',
    body: '민트초코를 만난 굴은 바다로 돌아가겠다는 쪽지를 남겼다. 쪽지가 눅눅했다.',
    face: 'suspicious', rarity: 'rare', hint: '바다에서 온 것과 후식을 만나게 하면',
    quote: '굴이랑 민트초코를 왜 같이 넣니. 굴이 무슨 죄야.', cap: 25,
  },
  {
    id: 'cheese_ramen', kind: 'special', title: '부대찌개행 티켓',
    body: '치즈가 늘어지고 스프가 번졌다. 배추는 조용히 냄비로 옮겨졌다.',
    face: 'proud', rarity: 'rare', hint: '늘어나는 것과 가루가 만나면 갈 곳이 있다',
    quote: '어머, 이거 끓이면 되겠네. 햄 있니?', cap: 55,
  },
  {
    id: 'pine_cheese', kind: 'special', title: '김치가 피자가 되고 싶어 했다',
    body: '파인애플과 치즈가 올라가자 배추가 둥글어지려고 했다. 도우는 없었다.',
    face: 'blank', rarity: 'rare', hint: '남쪽 섬의 과일과 늘어나는 것',
    quote: '김치 피자 같은 소리 하고 있네.', cap: 30,
  },
  {
    id: 'jelly_soda', kind: 'special', title: '냉장고가 스스로 문을 잠갔다',
    body: '탄산과 젤리가 들어간 통이 밤새 쉬익 소리를 냈다. 아침에는 냉장고 문이 열리지 않았다.',
    face: 'faint', rarity: 'rare', hint: '톡 쏘는 것과 말랑한 것',
    quote: '냉장고에서 소리가 나잖아! 누가 좀 열어 봐!', cap: 25,
  },
  {
    id: 'mala', kind: 'special', title: '혀가 얼얼해서 번호를 잃었다',
    body: '한 입 먹은 손님이 119를 누르려다 자기 전화번호를 눌렀다.',
    face: 'faint', rarity: 'common', hint: '빨강보다 얼얼한 것',
    quote: '얼얼해서 아무 말도 못 하겠네. 아, 말했네.', cap: 35,
  },
  {
    id: 'mayo', kind: 'special', title: '배추가 샐러드를 꿈꿨다',
    body: '하얗고 끈적한 이불을 덮은 배추가 포크를 찾았다. 젓가락은 서 있기만 했다.',
    face: 'suspicious', rarity: 'common', hint: '하얗고 부드러운 것이 선반에 있다',
    quote: '마요네즈는 감자한테 가져가라.', cap: 35,
  },
  {
    id: 'banana', kind: 'special', title: '껍질 까고 합석한 바나나',
    body: '바나나는 배추 옆에서 끝까지 어색했다. 아무도 먼저 말을 걸지 않았다.',
    face: 'blank', rarity: 'common', hint: '노란 손님이 한 명 껴 있다',
    quote: '바나나는 후식이야, 후식. 순서도 몰라?', cap: 40,
  },
  {
    id: 'chocolate', kind: 'special', title: '달콤한 배신',
    body: '갈색 양념이 배추를 감싸자 아이는 신나서 달려왔다. 어른은 말없이 물러났다.',
    face: 'suspicious', rarity: 'common', hint: '달콤한 갈색은 어디에 어울릴까',
    quote: '초콜릿이 왜 거기서 나오니? 누가 줬어?', cap: 35,
  },
  {
    id: 'yakgwa', kind: 'special', title: '배추 약과 개업',
    body: '달고 쫀득한 배추가 쟁반에 누웠다. 명절 분위기가 뜬금없이 났다.',
    face: 'proud', rarity: 'rare', hint: '단 것만 모아 놓으면 명절이 온다',
    quote: '이건 약과야 김치야. 김치 맞지? 내가 헷갈리네.', cap: 40,
  },
  {
    id: 'jeotgal3', kind: 'special', title: '젓갈 삼형제 상봉',
    body: '새우와 멸치와 굴이 한 통에 모였다. 냄새가 동네 반을 불렀다.',
    face: 'proud', rarity: 'rare', hint: '바다 것 세 가지가 한 통에',
    quote: '젓갈 향 좋다! 근데 대문 밖까지 나가는구나.',
  },
  {
    id: 'gochugaru_only', kind: 'special', title: '고춧가루 한 줌의 정직함',
    body: '배추는 빨갛게 변했고 할 말은 그뿐이었다. 정직했다. 심심했다.',
    face: 'blank', rarity: 'common', hint: '한 가지만 믿고 승부를 보면',
    quote: '고춧가루만? 마늘은 어디 갔어, 마늘은.',
  },
  {
    id: 'no_gochugaru', kind: 'special', title: '백김치였다고 우김',
    body: '빨갛지 않아서 이름을 바꿨다. 손님은 끝까지 고개를 갸웃했다.',
    face: 'suspicious', rarity: 'common', hint: '빨간 걸 빼먹으면 이름이 바뀐다',
    quote: '이건 백김치야. 원래 하얀 거야. 그렇게 알아.',
  },

  // ---- 일반 결말 (점수·가장 센 맛) ----
  {
    id: 'successor', kind: 'general', title: '김쳠례의 후계자',
    body: '김쳠례가 앞치마를 벗어 조용히 건넸다. 3대째 내려온 척하던 손맛이 오늘부터 진짜가 됐다.',
    face: 'proud', rarity: 'legendary', hint: '모든 게 알맞으면 앞치마를 받는다',
    quote: '됐다. 이 앞치마는 이제 네 거다. 울지 마, 나도 안 울어.',
  },
  {
    id: 'neighborhood', kind: 'general', title: '동네 소문 났다',
    body: '옆 동 사람이 레시피를 물으러 왔다. 알려 주기 아까워서 문을 닫았다.',
    face: 'happy', rarity: 'rare', hint: '맛이 소문으로 번지는 점수대',
    quote: '잘했다, 잘했어. 어디서 배웠니. 나한테 배웠지.',
  },
  {
    id: 'rice_thief', kind: 'general', title: '밥도둑 현행범',
    body: '흰밥이 순식간에 사라졌다. 밥솥이 한 번 더 돌았다.',
    face: 'happy', rarity: 'common', hint: '밥 생각이 나는 맛',
    quote: '밥 한 공기 더 가져와! 이거 밥도둑이다!',
  },
  {
    id: 'aged', kind: 'general', title: '묵은지 찌개 대기번호',
    body: '알맞게 신 김치는 이미 찌개 냄비를 예약했다. 돼지고기가 줄을 섰다.',
    face: 'happy', rarity: 'rare', hint: '오래 기다린 것은 찌개로 간다',
    quote: '신 거 좋지. 이건 찌개 해 먹자.',
  },
  {
    id: 'fresh', kind: 'general', title: '겉절이 파티 개시',
    body: '갓 버무린 김치에 삶은 수육이 따라왔다. 이웃이 현관문 앞에서 서성였다.',
    face: 'happy', rarity: 'common', hint: '당장 꺼내 먹는 맛',
    quote: '바로 먹는 맛이 이런 거지. 수육 삶았니?',
  },
  {
    id: 'decent', kind: 'general', title: '무난하게 김치였다',
    body: '아무도 놀라지 않았고 아무도 남기지 않았다. 그게 김치의 미덕이다.',
    face: 'blank', rarity: 'common', hint: '평범한 것도 실력이다',
    quote: '나쁘지 않네. 이 정도면 먹을 만해.',
  },
  {
    id: 'disaster', kind: 'general', title: '수습이 안 된 하루',
    body: '무엇이 문제였는지 아무도 정리하지 못했다. 정리할 의욕도 없었다.',
    face: 'faint', rarity: 'common', hint: '뭘 해도 안 맞는 날',
    quote: '내가 오늘 뭘 본 거니. 말을 못 하겠다.',
  },
  {
    id: 'spicy_over', kind: 'general', title: '맵기가 말보다 먼저 왔다',
    body: '손님은 한 입 먹고 말을 잃었다. 우유를 찾는 눈빛만 남았다.',
    face: 'angry', rarity: 'common', hint: '빨강이 모든 걸 이긴 날',
    quote: '으으 맵다! 눈물 나잖아! 고춧가루 또 넣었지!',
  },
  {
    id: 'salty_over', kind: 'general', title: '짠맛이 농성을 시작했다',
    body: '젓갈과 소금이 동맹을 맺고 입안에서 천막을 쳤다. 물이 모자랐다.',
    face: 'angry', rarity: 'common', hint: '짠 것끼리 모이면',
    quote: '짜다 짜! 간장을 퍼 먹었니?',
  },
  {
    id: 'sweet_over', kind: 'general', title: '달달해서 서러웠다',
    body: '김치를 먹었는데 후식을 먹은 기분이었다. 밥은 아직 안 먹었는데.',
    face: 'suspicious', rarity: 'common', hint: '단 것이 앞에 나서면',
    quote: '달아! 이게 김치냐 정과냐.',
  },
  {
    id: 'umami_over', kind: 'general', title: '깊어서 국물이 되었다',
    body: '깊은 맛이 너무 깊어서 바닥이 안 보였다. 숟가락이 먼저 들어갔다.',
    face: 'suspicious', rarity: 'common', hint: '깊은 맛만 계속 파면',
    quote: '맛이 깊다 깊어. 근데 이거 김치 맞아?',
  },
  {
    id: 'cool_over', kind: 'general', title: '시원하다 못해 서늘했다',
    body: '무와 배가 겨울을 데려왔다. 입안에서 에어컨이 켜졌다.',
    face: 'blank', rarity: 'common', hint: '시원한 것만 모아 보면',
    quote: '시원하긴 한데 이건 동치미 아니니?',
  },
  {
    id: 'chaos_over', kind: 'general', title: '이건 김치가 아니라 사건이다',
    body: '맛을 설명하려던 손님이 입을 다물었다. 오늘 일은 동네 단톡방에도 올라갔다.',
    face: 'faint', rarity: 'rare', hint: '맛이라 부르기 어려운 게 쌓이면',
    quote: '이건 김치가 아니라 사건이다. 나는 아무것도 못 봤다.',
  },
];

const BY_ID = new Map(ENDINGS.map((e) => [e.id, e]));

export function getEnding(id: string): Ending | undefined {
  return BY_ID.get(id);
}
