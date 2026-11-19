# Seedance 프롬프트 가이드 (프리비즈 레퍼런스용)

프롬프트는 영어로 쓴다. 아래 다섯 블록을 이 순서로 모두 넣는다. 예문은 "주유소에 선 로우라이더와 네 인물" 장면을 기준으로 한 것이며, 문형을 빌려 쓰되 내용은 실제 프리비즈 분석 결과로 채운다.

`@video1`은 프리비즈 영상, `@image1…`은 애셋 시트이다. 번호는 생성 요청에 첨부한 순서와 일치해야 한다.

## 1. 프리비즈 추종 지시 + 룩 방어

프리비즈를 따르라는 말만 하면 Seedance가 회색 로우폴리 스타일까지 따라 그린다. "움직임은 가져오되 룩은 가져오지 말라"를 한 블록에 같이 적는다.

```
Follow @video1 exactly: match its camera moves, its cut points,
and the position of every figure second by second.
@video1 is a grey low-poly previsualization.
Copy only its camera, timing and blocking; take all looks from the
photo references, never from @video1's style.
```

## 2. 색 ↔ 인물·물체 매핑

AI는 캡슐이 누구인지 모른다. 블렌더에서 칠한 색을 역할 이름에 묶고, 각 역할이 어느 이미지 레퍼런스인지도 함께 적는다.

```
Lime-green torso = RIDER A (@image1). Sky-blue torso = RIDER B (@image2).
Pink torso = PASSENGER (@image3). Tan torso = DRIVER (@image4).
Purple car = the royal-blue lowrider (@image5).
```

## 3. 컷별 초 단위 액션 + 화면 위치

컷마다 구간, 카메라, 그리고 **그 컷에 나오는 모든 인물의 화면상 위치**를 다시 쓴다. 앞 컷에서 한 번 썼다고 생략하면 그 컷에서 인물이 사라지거나 엉뚱한 사람이 등장한다. 컷 전환은 초를 명시한다.

```
0.0-8.0s - 63 degree wide from across the road, slow dolly-in.
DRIVER left of centre by the front fender, PASSENGER and RIDER B
left of centre by the pump, RIDER A right of centre.
8.0s HARD CUT
8.0-9.5s - rear three-quarter wide: taillights toward the camera,
nose away toward the road. RIDER A walks to the trunk at frame-centre.
```

## 4. 포지티브 락 (POSITIVE LOCKS)

자주 틀리는 것을 단정문으로 못 박는다. 인원수, 소품의 소지자와 손, 방향성 있는 물체의 앞뒤, 컷 시점이 대표적이다. "~하지 마라"보다 "항상 ~이다" 형태가 잘 지켜진다.

```
Exactly four people in the whole video and never a fifth.
The camcorder is only ever in RIDER B's right hand.
The grille and headlights stay at the nose, taillights and trunk at the tail.
Cuts only at the stated seconds, matching @video1.
```

## 5. 스타일

룩의 방향을 한두 문장으로 적는다. 변주할 때는 이 블록과 애셋만 바꾼다.

```
Photoreal live-action, muted desaturated editorial grade
with fine film grain, real-time.
```

애니메이션 변주 예: `1990s hand-painted cel animation, flat shading, visible line work.` (이때 캐릭터·배경 시트도 같은 스타일로 새로 만든다.)

## 치환 지시 (형태가 다른 물체로 바꿀 때)

프리비즈의 물체와 실루엣이 크게 다른 물체로 바꾸면, 어느 부위가 어느 부위에 대응하는지 알려줘야 위치와 방향이 유지된다.

```
Where @video1 shows a low car, render the lifted monster truck
of @image5 in the same position and orientation; where @video1
shows the trunk, render the truck's open tailgate and cargo bed.
```

## 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| 없는 사람이 추가로 등장 | 프리비즈에서 그 부분이 잘 안 보임 | 인물이 프레임에 크게 보이도록 블렌더 카메라 조정 후 재렌더. 인원수 락 추가 |
| 인물이 사라짐 | 그 컷 설명에 위치를 안 씀 | 컷마다 인물 위치를 다시 명시 |
| 차 앞뒤가 뒤집힘 | 레퍼런스에 한쪽 면만 넣음 | 정면·후면 이미지를 둘 다 넣고, 방향 락 추가 |
| 등판 그래픽이 안 나옴 | 뒷모습 레퍼런스가 없음 | 뒷모습 시트를 별도로 추가 |
| 소품을 엉뚱한 사람이 들고 있음 | 소품이 인물과 분리되어 서술됨 | 락에 "이 소품은 오직 B의 오른손에만" 명시 |
| 컷이 뭉개짐 | 한 컷이 0.8초 미만 | 블렌더에서 컷 길이를 1.5초 이상으로 늘려 재렌더 |
| 결과가 회색 로우폴리처럼 나옴 | 룩 방어 문장 누락 | 1번 블록의 방어 문장과 스타일 블록 확인 |

마지막 행은 원 매뉴얼의 표에는 없고 1번 블록의 취지에서 도출한 항목이다.
