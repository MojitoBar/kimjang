# 화풍 v2 (김쳠례 김장김치) — 2000년대 아마추어 플래시 병맛
기준 시트: art/v2/sheet_expressions.png (표정 6종, 마젠타 배경). 새 그림은 이것을 -i 로 넣고 만든다. 예전 v1 그림은 기준으로 넣지 말 것.

## 화풍 문장 (프롬프트 끝에 붙임, 실제로 먹힌 것)
"Art style: amateur early-2000s Korean Flash animation drawn with a mouse in Flash. Wobbly shaky hand-drawn vector lines of uneven thickness, thin black-brown outlines, line ends slightly unclosed or overshooting. Very simple shapes. Flat solid fills with 6-8 plain primary-ish colors, fills slightly misregistered outside the lines. NO shading, NO shadows, NO highlights, NO gloss, NO texture, NO gradients, NO fine detail, NO leaf veins. Crudely drawn but cute, goofy comic feel. Not polished, not a clean sticker, not 3D, no text, no letters, no numbers, no logos."
캐릭터: "elderly Korean grandmother Kim Cheomrye: big scribbled cloud-shaped perm hair (doodled curly loops), potato-shaped big head, dot eyes, two or three forehead wrinkle lines only, flower-pattern vest (just a few dots and simple flower shapes) over a green sleeve shirt, bright red rubber gloves drawn as simple mitten shapes, confident slightly shady vibe."
배경: "Everything below the top 38% must be one single perfectly flat solid ... color with absolutely nothing drawn" — 그래도 미세 톤차가 남으므로 후처리로 y>=440을 단색(231,213,163)으로 덮음.
투명 키잉: 순마젠타 배경 생성 → art/v2/slice2.py (가장자리 flood fill, scipy 없이 PIL만). 주의: 옛 slice.py의 mag>90 방식은 보라 조끼를 지울 수 있어 쓰지 않음.

## 피해야 할 표현
- "thick uniform black outlines", "cel shadow"(v1 문구) — 매끈한 스티커풍이 나온다.
- 조끼 색을 안 정하면 보라색이 나옴(현재 기준 시트는 보라 조끼+분홍/노랑 꽃). 이후 그림도 이 색을 따른다. 머리는 짙은 갈색.
- 한글 글자 그림은 모델이 ㅕ의 획 방향(오른쪽 두 획)을 못 지킨다: 3번 시도 모두 첨/참 계열로 틀림(쳠 실패).

## 알려진 한계
- 선이 v1보다 가늘고 면이 납작하지만 여전히 꽤 깔끔하다. 더 거칠게 하려면 "crude", "wobbly" 강조·획 수 제한을 더 세게.
