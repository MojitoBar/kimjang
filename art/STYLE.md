# 화풍 (김쳠례 김장김치)
공통 스타일 문장(Codex imagegen, 모든 프롬프트 끝에 붙임):
"Art style: early-2000s Korean Flash web cartoon / Flash animation. Thick uniform black outlines, flat solid color fills with a single-step cel shadow, primary colors (red, yellow, green, peach). STRICTLY no gradients, no realism, no 3D render, no watercolor, no glow, no soft shading, no modern illustration detail, no text, no letters, no numbers, no logos."
캐릭터: "elderly Korean grandmother Kim Cheomrye: tight curly gray-brown perm hair, round wrinkled face, red-and-yellow floral vest over green long-sleeve shirt, bright red rubber gloves, confident slightly shady vibe, waist up, big head 2-3 heads tall".
투명 배경: 순마젠타(#FF00FF) 단색 배경으로 생성 -> art/slice.py로 키잉(3x2 시트 512셀 분할).
실행: codex exec --skip-git-repo-check (stdin 프롬프트), 결과는 ~/.codex/generated_images/에서 복사(워크스페이스 읽기전용).
원본: art/sheet_expressions.png, kitchen_raw.png, title_raw.png
