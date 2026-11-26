# 김쳠례 김장김치 설계

로직은 `src/logic`(순수 함수, DOM 없음), 데이터는 `src/data`, 화면은 `src/ui`(비어 있음). 문구는 전부 `src/data/copy.ts`.

## 흐름
order(손님 주문) → salt(절이기, 게이지 0~1) → mix(재료 최대 6개) → rub(문지르기 0~1) → age(숙성 0~1) → result(판정).
`newRound` → `advance`를 부르며 단계를 넘기고, age에서 advance하면 result 단계로 가며 `state.result`에 판정이 들어간다.

## 맛 수치 (재료마다 0~5, 6개 합산)
spicy 매운맛 / salty 짠맛 / sweet 단맛 / umami 감칠맛 / cool 시원함 / chaos 혼돈(정상 재료는 0).
손님은 `target`(원하는 합계)과 `weight`(그 맛에 얼마나 까다로운지)를 가진다. 그래프 값은 합계/10(0~1).

## 점수 (0~100, 반올림)
`100 * (0.1*절이기 + 0.1*버무리기 + 0.2*숙성 + 0.6*양념)`, 이후 결말의 `cap`이 있으면 `min(점수, cap)`.
- 절이기: 소금 0.55 기준 ±0.1은 만점, 벗어나면 0.45당 1점 감소.
- 버무리기: `min(1, rub/0.7)`.
- 숙성: 손님 `agePref` ±0.12는 만점, 벗어나면 0.5당 1점 감소.
- 양념: `1 - sqrt(Σ weight*(합계-target)^2) / 10` (최소 0). 재료 0개면 0.
- 등급: S 90+, A 75+, B 60+, C 40+, D 20+, F.
- 단계 라벨: 소금 alive<0.3, light<0.45, good<=0.65, salty<=0.85, brine / 숙성 fresh<0.25, right<0.6, old<0.85, fossil.

## 결말 우선순위 (위에서부터 처음 맞는 것, `judge.ts`의 `RULES`)
| 순위 | id | 조건 |
|---|---|---|
| 1 | battery | 건전지 |
| 2-6 | salt_none, salt_over, fossil, rub_zero, aging_zero | 소금 <=0.08, 소금 >=0.92, 숙성 >=0.95, 버무리기 <=0.05, 숙성 <=0.05 |
| 7-8 | no_ingredients, all_weird | 재료 0개, 괴식만 6개 |
| 9-19 | toothpaste, sock, money, mint_oyster, cheese_ramen, pine_cheese, jelly_soda, mala, mayo, banana, chocolate | 해당 재료 또는 조합 |
| 20-22 | yakgwa, jeotgal3, gochugaru_only | 설탕+배+찹쌀풀(고춧가루 없음), 새우젓+멸치액젓+굴, 고춧가루 하나만 |
| 23 | no_gochugaru | 고춧가루 없음 + 점수 85 미만 |
| 일반 | successor 95+, neighborhood 88+, rice_thief 75+, aged(55+ & 숙성>=0.7), fresh(55+ & 숙성<0.25), decent 60+, disaster 15 미만 | 점수 |
| 나머지 | spicy_over, salty_over, sweet_over, umami_over, cool_over, chaos_over | 합계가 가장 큰 맛 |
특수 23개 + 일반 13개 = 36개. 난수는 손님 뽑기와 대사 변주(`aside`, `reaction`)에만 쓴다.

## 화면용 함수
- `src/logic/round.ts`: `newRound(rng, customerId?)`, `advance(state, rng)`, `setSalt/setRub/setAging(state, v)`, `addIngredient/removeIngredient/toggleIngredient(state, id)`, `canAddIngredient(state, id)`, `pickCustomer(rng)`
- `src/logic/judge.ts`: `judge(input, rng?) => JudgeResult`, `saltStage(v)`, `agingStage(v)`, `gradeOf(score)`, `flavorSum(ids)`
- `src/logic/save.ts`: `loadSave(storage)`, `writeSave(storage, data)`, `recordResult(save, result, 'YYYY-MM-DD') => {save,newEnding,newBest}`, `collectionProgress(save, total)`
- `src/data/*`: `INGREDIENTS`, `MAX_INGREDIENTS`, `CUSTOMERS`, `ENDINGS`, `getIngredient/getCustomer/getEnding(id)`, `copy.ts`의 문구 전부
- 저장 키 `kimjang:save`, 버전 1. 표정 키 happy/angry/faint/suspicious/proud/blank는 `ending.face`.
