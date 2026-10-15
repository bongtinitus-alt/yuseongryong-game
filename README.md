# 전시재상 유성룡 (웹 프로토타입 v0.1)
- 플레이: `index.html` (= `web/index.html`, 단일 파일)
- 기획서: `design.md`
- 빌드: `python3 tools/build_data.py && python3 tools/build.py && cp web/index.html index.html`
- 시뮬: `node sim/sim.js 3000` (루트별 탐욕 정책 생존율)
- 테스트: `python3 tests/test_web.py file://$PWD/web/index.html` (Playwright 390x844)
