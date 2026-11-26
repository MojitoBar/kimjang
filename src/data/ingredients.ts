import { fv, type Ingredient } from '../logic/types';

export const MAX_INGREDIENTS = 6;

export const INGREDIENTS: Ingredient[] = [
  { id: 'gochugaru', name: '고춧가루', kind: 'normal', flavor: fv(4, 0, 0, 1, 0, 0), desc: '빨간 건 일단 넣고 본다' },
  { id: 'garlic', name: '마늘', kind: 'normal', flavor: fv(2, 0, 0, 2, 0, 0), desc: '다음 날 아침까지 책임지는 맛' },
  { id: 'ginger', name: '생강', kind: 'normal', flavor: fv(1, 0, 0, 1, 1, 0), desc: '조용한데 빠지면 티 나는 사람' },
  { id: 'saeujeot', name: '새우젓', kind: 'normal', flavor: fv(0, 4, 0, 2, 0, 0), desc: '작은 새우 여럿이 한 통에 사는 중' },
  { id: 'myeolchi', name: '멸치액젓', kind: 'normal', flavor: fv(0, 3, 0, 3, 0, 0), desc: '냄새는 뒷집까지, 맛은 우리 집까지' },
  { id: 'radish', name: '무채', kind: 'normal', flavor: fv(0, 0, 1, 0, 3, 0), desc: '가늘고 길게 사는 시원함' },
  { id: 'scallion', name: '쪽파', kind: 'normal', flavor: fv(1, 0, 0, 1, 1, 0), desc: '초록색이라 믿음이 간다' },
  { id: 'pear', name: '배', kind: 'normal', flavor: fv(0, 0, 2, 0, 2, 0), desc: '달기만 한 게 아니라 시원하기도 한 과일' },
  { id: 'ricepaste', name: '찹쌀풀', kind: 'normal', flavor: fv(0, 0, 1, 1, 0, 0), desc: '양념을 배추에 붙여 주는 풀 한 그릇' },
  { id: 'oyster', name: '굴', kind: 'normal', flavor: fv(0, 1, 0, 3, 1, 0), desc: '바다에서 온 말랑한 손님' },
  { id: 'mustleaf', name: '갓', kind: 'normal', flavor: fv(2, 0, 0, 1, 0, 0), desc: '코끝이 먼저 알아채는 잎' },
  { id: 'sugar', name: '설탕', kind: 'normal', flavor: fv(0, 0, 4, 0, 0, 0), desc: '한 숟갈이 두 숟갈이 되는 마법' },

  { id: 'mintchoco', name: '민트초코', kind: 'weird', flavor: fv(0, 0, 2, 0, 3, 3), desc: '호불호 따위 안 보이는 초록 갈색' },
  { id: 'soda', name: '탄산음료', kind: 'weird', flavor: fv(0, 0, 2, 0, 2, 2), desc: '넣는 순간 통이 숨을 쉬기 시작한다' },
  { id: 'cheese', name: '치즈', kind: 'weird', flavor: fv(0, 1, 0, 2, 0, 1), desc: '늘어나는 건 마음뿐이 아니다' },
  { id: 'mala', name: '마라 소스', kind: 'weird', flavor: fv(4, 1, 0, 1, 0, 2), desc: '매운데 혀가 먼저 가출한다' },
  { id: 'jelly', name: '젤리', kind: 'weird', flavor: fv(0, 0, 3, 0, 0, 3), desc: '쫀득해서 씹다가 인생을 생각한다' },
  { id: 'banana', name: '바나나', kind: 'weird', flavor: fv(0, 0, 3, 0, 0, 2), desc: '껍질 까고 들어온 불청객' },
  { id: 'chocolate', name: '초콜릿', kind: 'weird', flavor: fv(0, 0, 4, 0, 0, 3), desc: '녹으면 책임질 수 없다' },
  { id: 'ramen', name: '라면 스프', kind: 'weird', flavor: fv(1, 3, 0, 3, 0, 2), desc: '가루만 넣었는데 이미 야식 냄새' },
  { id: 'pineapple', name: '파인애플', kind: 'weird', flavor: fv(0, 0, 3, 0, 1, 2), desc: '새콤달콤하니까 일단 믿어 본다' },
  { id: 'mayo', name: '마요네즈', kind: 'weird', flavor: fv(0, 1, 0, 1, 0, 3), desc: '하얗고 부드럽게 모든 걸 덮는다' },
  { id: 'money', name: '삼촌의 비상금', kind: 'weird', flavor: fv(0, 0, 0, 0, 0, 4), desc: '접어서 양말 속에 숨겨 둔 그 돈' },
  { id: 'battery', name: '건전지', kind: 'weird', flavor: fv(0, 1, 0, 0, 0, 5), desc: '리모컨 건전지가 왜 여기 있을까' },
  { id: 'sock', name: '양말', kind: 'weird', flavor: fv(0, 1, 0, 0, 0, 4), desc: '한 짝만 남아서 외로운 중이다' },
  { id: 'toothpaste', name: '치약', kind: 'weird', flavor: fv(0, 0, 0, 0, 4, 4), desc: '쓰고 나면 입이 시원해지는 그것' },
];

const BY_ID = new Map(INGREDIENTS.map((i) => [i.id, i]));

export function getIngredient(id: string): Ingredient | undefined {
  return BY_ID.get(id);
}
