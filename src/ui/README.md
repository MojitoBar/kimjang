# 화면 모양 규칙 (2000년대 초 플래시풍)
- 글꼴: 눈에 띄는 글자는 `var(--font-title)`(흑백사진체, 굵기 400뿐), 본문·작은 글은 `var(--font-body)`(나눔고딕 700/800, 작은 글 13px 이상). 둘 다 `쳠` 포함.
- 색 변수: --red #f30 --yellow #fc0 --green #3c3 --blue #06c --sky #9cf --navy #008 --paper #ffc --gray #c0c0c0 --ink #000. 그라데이션·blur·글로우·이모지 금지.
- 테두리: 카드·말풍선은 1px 검은 선, 각진 모서리. 누르는 것(`.btn`, `.cell`, `.bcell`)은 3px 입체 선(`--hi` 왼쪽·위, `--lo` 오른쪽·아래), 눌리면 뒤집힘. 들어간 곳(`.gauge`)은 반대로.
- 버튼: `.btn` + `.btn-red/green/sky/blue/yellow`, `.btn-big/.btn-small`. 누를 것 44px 이상.
- 말풍선 `.bubble`: 흰 바탕 1px 선 + ::before(검정)·::after(흰색) 꼬리.
- 움직임: 깜빡임·까딱(`nod`·`blink`·`blink-bg`·`wobble`)만 `steps()`, 나머지는 `ease-out`/`linear`. 캐릭터(.gm-portrait 등)는 2프레임 까딱.
- 공통 틀: `stage.ts`의 siteFrame이 PC(481px↑)에서 창틀·옆 장식을 두르고, 모바일은 무대만 꽉 채운다. 문구는 `data/copy.ts`의 SITE_COPY.
- 제목 그림 `/assets/ui/logo.png`가 없으면 글자 제목으로 대체.
- 화면 CSS는 `css/screens.css`, 입체 테두리 덧입힘은 파일 맨 아래.
