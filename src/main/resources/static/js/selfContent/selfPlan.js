/* 
self 메뉴 제출 이후 계획 완성 페이지 관련 코드임
 */

let currentPlanData = null;
let currentRouteData = null;

/*
TITLE - 계획 완성 페이지 초기화
* sessionStorage에서 planResponseDto를 가져와서 내용 초기화.
*/
export function initPlanContent() {
  console.log("initPlanContent 시작");
  const planResponseDto = JSON.parse(sessionStorage.getItem('planResponseDto'));
  console.log("planResponseDto:", planResponseDto);

  currentPlanData = {
    places: planResponseDto.places.map((place, index) => ({
      name: place.name,
      stayTime: place.time || 60,
      transport: place.transportMode || 'TRANSIT',
      isLast: index === planResponseDto.places.length - 1,
      memo: '',
    })),
    departureTime: planResponseDto.departureTime || new Date().toISOString(),
    totalPlaces: planResponseDto.places.length,
    routeResponse: planResponseDto.routeResponse
  };

  generatePlanContent();
  bindPlanEvents();
}



/*
Title - 계획 내용 생성 
* 장소, 교통수단 카드 생성
*/
function generatePlanContent() {
  if (!currentPlanData) {
    console.error("계획 데이터가 없습니다");
    return;
  }

  const planContainer = document.querySelector('.plan-details-box');
  if (!planContainer) {
    console.error("plan-details-box를 찾을 수 없습니다");
    return;
  }

  // 기존 내용 제거
  planContainer.innerHTML = '';

  // 새로운 계획 리스트 생성
  const planListBox = document.createElement('ol');
  planListBox.className = 'plan-list-box';

  currentPlanData.places.forEach((place, index) => {
    // 장소 카드 생성
    const placeCard = createPlaceCard(place, index);
    planListBox.appendChild(placeCard);

    // 마지막 장소가 아니면 교통수단 카드 생성
    if (index < currentPlanData.places.length - 1) {
      const transportCard = createTransportCard(place, currentPlanData.places[index + 1], index);
      planListBox.appendChild(transportCard);
    }
  });

  planContainer.appendChild(planListBox);
  setTimeout(() => {
    updateSvgBoxes();
  }, 0);

  const dayTitleText = document.querySelector('.dayTitleText');
  if (dayTitleText) {
    dayTitleText.removeAttribute('readonly');
    dayTitleText.classList.add('editable');
    dayTitleText.focus();
    dayTitleText.setSelectionRange(dayTitleText.value.length, dayTitleText.value.length);
  }
}

/* 
Title - svg 수정
* 첫번째 카드랑 마지막 카드 왼쪽에 바 세워둔거 가리기
* TODO: CSS로 하는게 더 좋아보임
*/
function updateSvgBoxes() {
  // 기존 스타일 시트가 있다면 제거
  const existingStyle = document.getElementById('dynamic-svg-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  const daySvgBoxes = document.querySelectorAll('.day-svg-box');
  if (daySvgBoxes.length === 0) return
    ;

  // 클래스 초기화
  daySvgBoxes.forEach(box => {
    box.classList.remove('first-svg-box', 'last-svg-box', 'single-svg-box');
  });

  // 새로운 클래스 부여
  if (daySvgBoxes.length === 1) {
    daySvgBoxes[0].classList.add('single-svg-box');
  } else if (daySvgBoxes.length > 1) {
    daySvgBoxes[0].classList.add('first-svg-box');
    daySvgBoxes[daySvgBoxes.length - 1].classList.add('last-svg-box');
  }

  // 동적 스타일 생성
  const style = document.createElement('style');
  style.id = 'dynamic-svg-styles';
  document.head.appendChild(style);
  const sheet = style.sheet;

  const firstCard = document.querySelector('.first-svg-box');
  if (firstCard) {
    const parentCard = firstCard.closest('.plan-card');
    if (parentCard) {
      const cardHeight = parentCard.offsetHeight;
      const halfHeight = cardHeight / 2;
      sheet.insertRule(`
        .first-svg-box::before {
          height: ${halfHeight * 1.1}px !important;
          bottom: 15px !important;
        }
      `, sheet.cssRules.length);
    }
  }

  const lastCard = document.querySelector('.last-svg-box');
  if (lastCard) {
    const parentCard = lastCard.closest('.plan-card');
    if (parentCard) {
      const cardHeight = parentCard.offsetHeight;
      const halfHeight = cardHeight / 2;
      sheet.insertRule(`
        .last-svg-box::before {
          height: ${halfHeight * 1.1}px !important;
          top: 15px !important;
        }
      `, sheet.cssRules.length);
    }
  }
  const singleCard = document.querySelector('.single-svg-box');
  if (singleCard) {
    sheet.insertRule(`
        .single-svg-box::before {
          height: ${cardHeight * 1.1} !important;
          background-color: #121212 !important;
          content: '' !important;
          position: absolute !important;
          width: 4px !important;
          z-index: -1 !important;
        }
      `, sheet.cssRules.length);
  }
}


/* 
Title - 장소 카드 생성 
* generatePlanContent에서 사용
* html 생성임
TODO: 한 장소에서의 체류시간 계산하고(서버에서 받아오기) element 추가
 */
function createPlaceCard(place, index) {
  const li = document.createElement('li');
  li.className = 'plan-card place-card';

  // 메모가 있으면 표시
  const memoHtml = place.memo ? `<div class="memo-content">${place.memo.replace(/\n/g, '<br>')}</div>` : '';

  // const visitTime = calculateVisitTime(index);
  const keyword = place.keyword || getPlaceKeyword(place.name); // 서버에서 키워드 받아오거나 추정
  // <div class="visiting-time">${visitTime}</div>
  li.innerHTML = `
        <div div class="day-card-body" >
            <span class="day-svg-box">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                        <g fill="#c7d5ef">
                            <circle cx="24" cy="24" r="12" fill-opacity="0.5" />
                        </g>
                        <g fill="#575757">
                            <circle cx="24" cy="24" r="6" />
                        </g>
                    </svg>
                </div>


            </span>
            <div class="day-card-content">
                <span class="keyword-badge">${keyword}</span>
                <div class="main-content">${place.name}</div>
                <div class="sub-content">체류시간: ${place.stayTime}분</div>
                ${memoHtml}
                <button class="open-cardEdit-box" data-place-index="${index}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                        <circle cx="12" cy="2" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="22" r="2"/>
                    </svg>
                </button>
                <dialog class="card-edit-box">
                    <div class="card-edit-set">
                        <button type="button" class="addMemo" data-action="addMemo" data-place-index="${index}">
                            <span>메모</span>
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <dialog class="memo-dialog">
                        </dialog>
                        <button type="button" class="edit-card" data-action="editCard" data-place-index="${index}">
                            <span>수정</span>
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <dialog class="edit-dialog">
                        </dialog>
                        <button type="button" class="delete-card" data-action="deleteCard" data-place-index="${index}">
                            <span>삭제</span>
                            <svg width="16" height="16" viewBox="0 0 24 24">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                </dialog>
            </div>
        </div>
        `;

  return li;
}

/*
Title - 교통수단 카드 생성
* element 생성
TODO: 교통수단마다 예상 소요시간이 구성된 방식이 다름.
* Transit는 단순히 route[0].leg[0](맞나? 구조는 봐야됨)처럼 순서대로 가져오면 되지만,
* Drive는 경유지라는 개념이 있어서 한 route안에 여러 leg를 가지기 때문에 각 leg마다 이동시간을 뽑아야 함.
* 만약 Transit과 Drive가 혼합된 경우
* ex) Transit(1개) : Drive(2개 장소) : Transit(1개) = route[0] -> route[1].leg[0] -> route[1].leg[1] -> route[2]
* 위와 같이 route의 index가 장소의 수와 일치하지 않음. (위에서 장소는 4개 but route는 3개)
*/
function createTransportCard(fromPlace, toPlace, index) {
  const li = document.createElement('li');
  li.className = 'plan-card transport-card';

  const transportIcon = getTransportIcon(fromPlace.transport);
  const responseData = JSON.parse(sessionStorage.getItem('routePlanData'));
  console.log("responseData:", responseData);

  const duration = Math.floor(parseInt(responseData.routes[0].legs[0].duration, 10) / 60); // 초 단위에서 분 단위로 변환
  //TODO: ComputeRoutesResponse에서 예상 소요시간을 가져올 때, 만약 Drive모드가 연속적이라면,
  //responseData[index]의 index는 연속으로 같아야 하고, 각 leg의 duration을 뽑아야 함
  //아 몰랑 존나 이상해
  //애초에 index는 responseData의 index가 아니고 request데이터 index임 -> 근데 상관 없는듯 ㅇㅅㅇ

  // <div class="visiting-time">${visitTime}</div>
  li.innerHTML = `
        <div div class="day-card-body" >
            <span class="day-svg-box">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
                        <g fill="#c7d5ef">
                            <circle cx="24" cy="24" r="12" fill-opacity="0.5" />
                        </g>
                        <g fill="#575757">
                            <circle cx="24" cy="24" r="6" />
                        </g>
                    </svg>
                </div>


            </span>
            <div class="day-card-content">
                <div class="transport-icon-box">
                    ${transportIcon}
                </div>
                <div class="transport-details">
                    <div class="transport-mode">${fromPlace.transport}</div>
                    <div class="transport-route">${fromPlace.name} → ${toPlace.name}</div>
                    <div class="transport-time">예상 소요시간: ${duration}분</div>
                </div>
            </div>
        </div>
        `;

  return li;
}

/*
Title - 장소 키워드 추정
TODO: 이건 나중에 서버에서 키워드를 리스트를 받아오도록 함
*/
function getPlaceKeyword(placeName) {  //다 서버 값으로 할거임 키워드 추정 안함
  const keywords = {
    '역': '교통',
    '공원': '자연',
    '카페': '휴식',
    '식당': '맛집',
    '쇼핑': '쇼핑',
    '박물관': '문화',
    '극장': '문화'
  };

  for (const [key, value] of Object.entries(keywords)) {
    if (placeName.includes(key)) {
      return value;
    }
  }
  return '관광';
}

/* 
Title - 교통수단 아이콘 가져오기 
* svg 모음집
*/
export function getTransportIcon(transport) {
  const icons = {
    DRIVE: `< svg width = "20" height = "20" viewBox = "0 0 24 24" fill = "#c154ec" >
        <path d="M22.357,8A34.789,34.789,0,0,0,19.21,3.245a4.4,4.4,0,0,0-2.258-1.54A15.235,15.235,0,0,0,12,1a19.175,19.175,0,0,0-5.479.713A4.382,4.382,0,0,0,4.29,3.245,23.466,23.466,0,0,0,1.464,8H0V20H3v3H7V20H17v3h4V20h3V8ZM5.5,17A1.5,1.5,0,1,1,7,15.5,1.5,1.5,0,0,1,5.5,17ZM12,11a64.834,64.834,0,0,0-8.8.711A23.405,23.405,0,0,1,6.671,5.07a1.394,1.394,0,0,1,.714-.484A16.164,16.164,0,0,1,12,4a12.3,12.3,0,0,1,4.115.586,1.4,1.4,0,0,1,.714.483,27.139,27.139,0,0,1,3.956,6.64A64.92,64.92,0,0,0,12,11Zm6.5,6A1.5,1.5,0,1,1,20,15.5,1.5,1.5,0,0,1,18.5,17Z" />
        <svg> `,
    TRANSIT: `<svg svg width = "20" height = "20" viewBox = "0 0 24 24" fill = "#c154ec" >
        <path d="M22,10V4.229a2.987,2.987,0,0,0-1.821-2.76c-3.673-1.9-12.695-1.893-16.358,0A2.986,2.986,0,0,0,2,4.229V10H0v3a2,2,0,0,0,2,2v7H4v2H9V22h6v2h5V22h2V15a2,2,0,0,0,2-2V10ZM4,13V7H20v6Zm.6-9.688A19.013,19.013,0,0,1,12,2a19.018,19.018,0,0,1,7.4,1.311.99.99,0,0,1,.6.918V5H15V4H9V5H4V4.229A.989.989,0,0,1,4.6,3.312ZM4,20V15H6v1a1,1,0,0,0,2,0V15h8v1a1,1,0,0,0,2,0V15h2v5Z" />
        </svg> `,
    WALK: `<svg svg width = "20" height = "20" viewBox = "0 0 24 24" fill = "#c154ec" >
        <path d="m11,2.5c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5-1.119,2.5-2.5,2.5-2.5-1.119-2.5-2.5Zm9.171,9.658l-2.625-1.312s-2.268-3.592-2.319-3.651c-.665-.76-1.625-1.195-2.634-1.195-1.274,0-2.549.301-3.688.871l-2.526,1.263c-.641.321-1.114.902-1.298,1.596l-.633,2.387c-.212.801.265,1.622,1.065,1.834.802.213,1.622-.264,1.834-1.065l.575-2.168,1.831-.916-.662,2.83c-.351,1.5.339,3.079,1.679,3.84l3.976,2.258c.156.089.253.256.253.436v3.336c0,.829.672,1.5,1.5,1.5s1.5-.671,1.5-1.5v-3.336c0-1.256-.679-2.422-1.771-3.043l-2.724-1.547.849-3.165.875,1.39c.146.232.354.42.599.543l3,1.5c.216.107.444.159.67.159.55,0,1.08-.304,1.343-.83.37-.741.07-1.642-.671-2.013Zm-10.312,5.465c-.812-.161-1.6.378-1.754,1.192l-.039.2-1.407,2.814c-.37.741-.07,1.642.671,2.013.215.107.444.159.67.159.55,0,1.08-.304,1.343-.83l1.5-3c.062-.123.106-.254.131-.39l.077-.404c.156-.813-.378-1.599-1.192-1.754Z" />
        </svg> `
  };
  return icons[transport] || icons.TRANSIT;
}

/* 
Title - 이벤트 바인딩( dialog, modal 등 )
* addMemo, editCard, deleteCard 버튼에 이벤트 바인딩
* TODO: editCard는 경로 계산, 장소 검색과 같은 추가 요청이 너무 쓸데없이 많이 필요해서 삭제 고려대상
*/
function bindPlanEvents() {
  // 카드 편집 버튼 이벤트
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return
      ;

    const action = target.dataset.action;
    const placeIndex = parseInt(target.dataset.placeIndex);

    switch (action) {
      case 'addMemo':
        handleAddMemo(placeIndex);
        break;
      case 'editCard':
        handleEditCard(placeIndex);
        break;
      case 'deleteCard':
        handleDeleteCard(placeIndex);
        break;
    }

  });

  // 카드 편집 다이얼로그 열기/닫기
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('open-cardEdit-box')) {
      const dialog = event.target.nextElementSibling;
      if (dialog && dialog.tagName === 'DIALOG') {
        const targetRect = event.target.getBoundingClientRect(); // 다이얼로그 위치 조정
        const dialogRect = dialog.getBoundingClientRect();

        let left = targetRect.left + window.scrollX;
        let top = targetRect.bottom + window.scrollY;

        dialog.style.top = `${top}px`;
        dialog.style.left = `214px`;
        // dialog.style.left = `${left}px`;

        dialog.showModal();
      }
    }

    // 다이얼로그 외부 클릭시 닫기
    if (event.target.tagName === 'DIALOG') {
      event.target.close();
    } else if (event.target.closest('.card-edit-box')) {
      event.target.closest('.card-edit-box').close();
      return;
    }
  });

  // 키워드 선택 이벤트
  const keywordBtns = document.querySelectorAll('.keyword-btn');
  keywordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  // 저장 버튼
  const saveBtn = document.getElementById('savePlanBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', handleSavePlan);
  }

  // 제목 수정 이벤트 바인딩
  EditTitle();

  // 키워드 추가 with #hashtag#
  const editor = document.getElementById('hashtag-editor');
  if (editor) {
    editor.addEventListener('keyup', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        requestAnimationFrame(() => {
          hashtaggingver5(editor);
        });
      }
    });

    // --- 해시태그 추천 기능 ---
    const suggestionsContainer = document.getElementById('hashtag-suggestions');

    if (suggestionsContainer) {
      editor.addEventListener('input', async () => {
        const { word } = getWordAtCaret(editor);

        if (word && word.startsWith('#')) {
          const searchTerm = word.substring(1);

          if (searchTerm.length > 0) {
            try {
              const response = await fetch(`/api/public/keywords/search?prefix=${encodeURIComponent(searchTerm)}`);
              if (!response.ok) {
                throw new Error('Server response was not ok');
              }
              const keywords = await response.json();
              displaySuggestions(keywords, editor);
            } catch (error) {
              console.error('Error fetching keywords:', error);
              displaySuggestions([], editor); // 오류 발생 시 추천 목록 숨기기
            }
          } else {
            displaySuggestions([], editor); // 검색어가 없으면 추천 목록 숨기기
          }
        } else {
          displaySuggestions([], editor); // 해시태그가 아니면 추천 목록 숨기기
        }
      });

      // 에디터 외부를 클릭하여 포커스를 잃었을 때 추천 목록을 숨깁니다.
      editor.addEventListener('blur', () => {
        // 추천 항목 클릭 시 blur 이벤트가 먼저 발생하는 것을 막기 위해 약간의 지연을 줍니다.
        // 이 지연 시간 동안 추천 항목의 mousedown/click 이벤트가 먼저 처리될 수 있습니다.
        setTimeout(() => {
          if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
          }
        }, 150);
      });
    }
    // --- 해시태그 추천 기능 끝 ---
  }

}
//Title - 해시태그 fragment 생성
function createHashtagFragment(textContent, matches, hashtagRegex) {
  let lastIndex = 0;

  const fragment = document.createDocumentFragment();
  for (const match of matches) {
    const hashtag = match[0];
    const start = match.index; //해시태그 시작 인덱스

    if (start > lastIndex) {// textBefore 추가
      fragment.appendChild(
        document.createTextNode(textContent.slice(lastIndex, start))
      );
    }

    const span = document.createElement('span');
    span.textContent = hashtag;
    span.className = 'hashtag';
    span.contentEditable = 'false';
    fragment.appendChild(span);

    lastIndex = start + hashtag.length; //해시태그 끝 인덱스
  }

  // textAfter 추가 (빈 경우에도 빈 TextNode)
  const textAfter = textContent.slice(lastIndex);
  const textAfterNode = document.createTextNode(textAfter || '');
  fragment.appendChild(textAfterNode);

  return { fragment, textAfterNode };
}

//Title - 커서 위치 재설정
function setNewRangeVer2(editor2, selection, textAfterNode) {
  const newRange = document.createRange();

  if (textAfterNode.textContent.trim() === '') {
    console.log('true: textAfterNode is empty string');
    newRange.setStart(textAfterNode, textAfterNode.length);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    console.log('false: textAfterNode is NOT empty string');
    newRange.setStart(textAfterNode, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  requestAnimationFrame(() => {
    editor2.focus();
  });
}

/* 
Title - 해시태그 강조 표시
*/
function hashtaggingver5(editor2) {
  console.log('--function hashtaggingver5--');
  console.log('--function hashtaggingver5--');
  console.log('--function hashtaggingver5--');

  const selection = window.getSelection();
  const currentNode = selection.getRangeAt(0).commonAncestorContainer;
  const currentNodeParentElement = currentNode.parentElement.nodeName;
  console.log('currentNode:', currentNode);
  console.log('currentNode parent nodeName:', currentNode.parentElement.nodeName, '&& currentNode parentElement:', currentNode.parentElement);
  const hashtagRegex = /#[^\s]+(?=\s|$|[.,!?;:\)\]\}])/g;

  if (currentNodeParentElement === 'DIV' && currentNode.parentElement.parentNode === editor2) {
    console.log('current node is DIV under editor2');

    //1. 몇번째 줄인지 파악하기 (줄은 div로 구분)
    const cloneRange = selection.getRangeAt(0).cloneRange();
    const editorChildren = Array.from(editor2.childNodes);
    console.log('editorChildren:', editorChildren);

    //여기에 div태그들을 담아줌 (2번째 줄은 index 0)
    let divList = [];
    for (const node of editorChildren) {
      if (node.nodeName === 'DIV') {
        divList.push(node);
        console.log('divList:', divList);
      }
    }
    //divList에서 현재 노드가 몇번째 div인지 파악
    const currentDivIndex = divList.findIndex(divNode =>
      divNode.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
    console.log('currentDivIndex:', currentDivIndex);
    //2. 그 줄에서 몇번째 노드인지 파악하기 (노드는 textNode or spanNode)

    //div 하위 노드들
    const ArrayChildrenUnderDiv = Array.from(currentNode.parentElement.childNodes);
    console.log('currentNode.parentElement:', currentNode.parentElement);
    console.log('ArrayChildrenUnderDiv:', ArrayChildrenUnderDiv);
    //div 하위 노드들 중 현재 노드가 몇번째인지(index반환)
    const currentNodeInDivIndex = ArrayChildrenUnderDiv.findIndex(node =>
      node.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
    console.log('currentNodeInDivIndex:', currentNodeInDivIndex);

    //3. 그 노드에서 해시태그 파악, createFragment생성
    const currentNodeTextContent = currentNode.textContent;
    console.log('currentNodeTextContent:', currentNodeTextContent);
    const matches = Array.from(currentNodeTextContent.matchAll(hashtagRegex));
    if (matches.length === 0) {
      console.log('No hashtags found in the current node.');
      return;
    }
    console.log('matches:', matches);
    // const fragment = document.createDocumentFragment();
    const { fragment, textAfterNode } = createHashtagFragment(currentNodeTextContent, matches, hashtagRegex);
    console.log('fragment:', fragment, 'is Node?', fragment instanceof Node, 'is DocumentFragment?', fragment instanceof DocumentFragment);

    //4. 노드 교체 (replaceChild)
    const afterCurrentDiv = divList[currentDivIndex];
    afterCurrentDiv.replaceChild(fragment, ArrayChildrenUnderDiv[currentNodeInDivIndex]);
    editor2.normalize();

    //5. 커서 위치 재설정 (기존 노드는 파괴됐으니, 기존 줄, 기존 노드 인덱스로 넘기기)
    setNewRangeVer2(editor2, selection, textAfterNode);
    //6. sex
  } else {
    console.log('current node is NOT DIV under editor2');
    const cloneRange = selection.getRangeAt(0).cloneRange();
    //div 하위 노드들
    const ArrayChildren = Array.from(currentNode.parentElement.childNodes);
    const currentNodeIndex = ArrayChildren.findIndex(node =>
      node.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
    console.log('ArrayChildren:', ArrayChildren);
    console.log('current node index in DIV:', currentNodeIndex);

    const textContent = currentNode.textContent;//text 반환
    const matches = Array.from(textContent.matchAll(hashtagRegex));
    console.log('currentNode', currentNode);
    console.log('textContent', textContent);
    console.log('matches:', matches);

    if (matches.length === 0) {
      console.log('No hashtags found in the current node.');
      return;
    }
    console.log('matches:', matches);

    const { fragment, textAfterNode } = createHashtagFragment(textContent, matches, hashtagRegex);

    currentNode.parentElement.replaceChild(fragment, currentNode);

    editor2.normalize();

    const afterArrayChildren = Array.from(editor2.childNodes)
    console.log('afterArrayChildren:', afterArrayChildren);
    setNewRangeVer2(editor2, selection, textAfterNode);
  }
}

/*
Title - 해시태그 추천 관련 헬퍼 함수
*/

// 현재 캐럿(커서) 위치의 단어와 그 시작 인덱스를 찾습니다.
function getWordAtCaret(editor) {
  const selection = window.getSelection(); //선택 객체, 커서 위치 불러오기
  if (selection.rangeCount === 0) return {};

  const range = selection.getRangeAt(0); //첫번째 range 가져오기
  const textNode = range.startContainer; //커서가 위치한 노드
  const caretPos = range.startOffset; //컨테이너에서의 커서 위치

  // 캐럿이 텍스트 노드 안에 있을 때만 작동
  if (textNode.nodeType !== Node.TEXT_NODE) {
    // 만약 editor의 자식으로 바로 span이 있는 경우, 그 안의 텍스트 노드를 찾아 들어갑니다.
    if (range.startContainer.childNodes.length > 0 && range.startContainer.childNodes[range.startOffset] && range.startContainer.childNodes[range.startOffset].nodeType === Node.TEXT_NODE) {
      textNode = range.startContainer.childNodes[range.startOffset];
      caretPos = 0;
    } else {
      return {};
    }
  }

  const content = textNode.textContent; //div에 생성된 텍스트 content 전부(span포함X 이미 생성된 키워드는 제외됨)
  const wordStartIndex = content.lastIndexOf(' ', caretPos - 1) + 1; //단어 앞에 공백을 찾아서 시작 위치로
  let wordEndIndex = content.indexOf(' ', caretPos); //단어 끝 위치
  if (wordEndIndex === -1) {
    wordEndIndex = content.length;
  }

  const word = content.substring(wordStartIndex, wordEndIndex);
  return { word, textNode, wordStartIndex, wordEndIndex };
}

/*
Title - 추천 키워드를 화면에 표시합니다.
 */
function displaySuggestions(keywords, editor) {
  const suggestionsContainer = document.getElementById('hashtag-suggestions');
  suggestionsContainer.innerHTML = '';

  if (keywords.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  keywords.forEach(keyword => {
    const suggestionEl = document.createElement('div');
    suggestionEl.className = 'suggestion-item';
    suggestionEl.textContent = keyword;
    suggestionEl.addEventListener('mousedown', (e) => {
      e.preventDefault(); // editor의 blur 이벤트를 막기 위해 mousedown 사용
      replaceHashtag(editor, keyword);
    });
    suggestionsContainer.appendChild(suggestionEl);
  });

  suggestionsContainer.style.display = 'block';
}

/*
Title - 추천 키워드를 클릭했을 때, 에디터의 내용을 교체합니다.
 */
function replaceHashtag(editor, selectedKeyword) {
  const { textNode, wordStartIndex, wordEndIndex } = getWordAtCaret(editor);
  if (!textNode) return;

  const originalContent = textNode.textContent;

  // #을 포함하여 교체될 새 단어
  const newWord = `#${selectedKeyword} `;
  const newContent = originalContent.substring(0, wordStartIndex) + newWord + originalContent.substring(wordEndIndex);

  textNode.textContent = newContent;

  // 추천 목록 숨기기
  const suggestionsContainer = document.getElementById('hashtag-suggestions');
  suggestionsContainer.innerHTML = '';
  suggestionsContainer.style.display = 'none';

  // 중요: highlightHashtagsInEditor를 호출하기 전에 캐럿 위치를 먼저 설정합니다.
  // 이렇게 해야 highlight 함수가 올바른 최신 캐럿 위치를 저장할 수 있습니다.
  const selection = window.getSelection();
  const range = document.createRange();
  const newCaretPosition = wordStartIndex + newWord.length;

  if (textNode && textNode.textContent) {
    range.setStart(textNode, Math.min(newCaretPosition, textNode.textContent.length));
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

/* 
Title - 제목 수정
*/
function EditTitle() {
  const titleEditBtn = document.querySelector('.editDayPlan');
  const titleInput = document.querySelector('.dayTitleText');

  if (titleEditBtn && titleInput) {
    const switchToReadOnly = () => {
      titleInput.setAttribute('readonly', true);
      titleInput.classList.remove('editable');
    };

    const switchToEdit = () => {
      titleInput.removeAttribute('readonly');
      titleInput.classList.add('editable');
      titleInput.focus();
      titleInput.setSelectionRange(titleInput.value.length, titleInput.value.length);
    };

    titleEditBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });

    titleEditBtn.addEventListener('click', () => {
      if (titleInput.hasAttribute('readonly')) {
        switchToEdit();
      } else {
        switchToReadOnly();
      }
    });

    titleInput.addEventListener('blur', () => {
      switchToReadOnly();
    });

    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        switchToReadOnly();
        titleInput.blur();
      }
    });
  }
}


/*
Title - 메모 추가 처리
*/
function handleAddMemo(placeIndex) {
  const memo = currentPlanData.places[placeIndex].memo || '';
  const modalBase = document.querySelector('.modal-base');

  modalBase.innerHTML = '';
  modalBase.style.display = 'block';

  const modalContent = document.createElement('div');
  modalContent.className = 'memo-modal-content';
  modalContent.innerHTML = `
      <p>메모를 추가하세요:</p>
      <textarea class="memoInput" rows="4" cols="50">${memo}</textarea>
      <div class="modal-buttons">
        <button data-action="save" class="modal-btn">저장</button>
        <button data-action="close" class="modal-btn">취소</button>
      </div>
  `;
  modalBase.appendChild(modalContent);

  const memoInput = document.querySelector('.memoInput');
  setTimeout(() => {
    memoInput.focus();
    memoInput.setSelectionRange(memoInput.value.length, memoInput.value.length);
  }, 0);

  const cleanupAndClose = () => {
    modalBase.removeEventListener('click', handleModalClick);
    memoInput.removeEventListener('keydown', handleKeyDown);
    closeModal(modalBase);
  };

  const saveAndClose = () => {
    currentPlanData.places[placeIndex].memo = memoInput.value;
    generatePlanContent(); // 화면 다시 그리기
    cleanupAndClose();
  };

  const handleModalClick = (event) => {
    const target = event.target.closest('[data-action]');
    let action = null;
    if (target) {
      action = target.dataset.action;
    } else if (event.target === modalBase) {
      action = 'close'; // modal 밖 영역 클릭
    }

    if (action === 'save') {
      saveAndClose();
    } else if (action === 'close') {
      cleanupAndClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveAndClose();
    }
  }
  modalBase.addEventListener('click', handleModalClick);
  memoInput.addEventListener('keydown', handleKeyDown);
}

/* 
Title - 카드 편집 처리 
TODO: 기능 삭제 고려 대상
*/
function handleEditCard(placeIndex) {
  // const place = currentPlanData.places[placeIndex];
  // const newName = prompt('장소명을 수정하세요:', place.name);
  // const newStayTime = prompt('체류시간을 수정하세요(분):', place.stayTime);
  const modalBsse = document.querySelector('.modal-base');

  modalBsse.innerHTML = '';
  modalBsse.style.display = 'block';

  const place = currentPlanData.places[placeIndex];
  const modalContent = document.createElement('div');
  modalContent.className = 'edit-modal-content';
  modalContent.innerHTML = `
      <div class="edit-place">
        <p>장소명:</p> 
        <input type="text" class="placeNameInput" value="${place.name}" />
      </div>
      <div class="edit-stayTime">
        <p>체류시간):</p>
        <input type="number" class="stayTimeInput" value="${place.stayTime}" min="1" />
      </div>
      <div class="modal-buttons">
        <button data-action="save" class="modal-btn">저장</button>
        <button data-action="close" class="modal-btn">취소</button>
      </div>
  `;
  modalBsse.appendChild(modalContent);
  const placeNameInput = modalContent.querySelector('.placeNameInput');
  const stayTimeInput = modalContent.querySelector('.stayTimeInput');
  const saveBtn = modalContent.querySelector('[data-action="save"]');
  const cancelBtn = modalContent.querySelector('[data-action="close"]');
  //닫기
  const cleanupAndClose = () => {
    modalBsse.removeEventListener('click', handleModalClick);
    closeModal(modalBsse);
  }
  //저장
  const saveAndClose = () => {
    if (place.name !== placeNameInput.value) {
      place.name = placeNameInput.value;

      //TODO: 서버에 route요청 다시 보내기
      //문제가 좀 있다면... 장소명 수정은 장소 검색 기능을 추가해야 하는게 아닐까?
    }
    if (place.stayTime !== stayTimeInput.value) {
      place.stayTime = parseInt(stayTimeInput.value, 10);
      //TODO: visitingTime 업데이트(이동 시간이 변경될 수 있으니까)
    }
    generatePlanContent();
    cleanupAndClose();
  };
  //이벤트 구분
  const handleModalClick = (event) => {
    const target = event.target.closest('[data-action]');
    let action = null;

    if (target) {
      action = target.dataset.action;
    } else if (event.target === modalBsse) {
      action = 'close'; // modal 밖 영역 클릭
    }

    if (action === 'save') {
      saveAndClose();
    } else if (action === 'close') {
      cleanupAndClose();
    }
  }
  modalBsse.addEventListener('click', handleModalClick);
}

/* 
Title - 카드 삭제 처리 
TODO: 카드 편집과 동일하게 경로 계산이 다시 필요함.
* 체크박스 형식으로 다중 삭제가 가능하게 해서 경로 계산을 줄이는 방식으로 기능을 유지하는게 어떨까?
*/
function handleDeleteCard(placeIndex) {
  const modalBase = document.querySelector('.modal-base');

  modalBase.innerHTML = '';
  modalBase.style.display = 'block';

  const modalContent = document.createElement('div');
  modalContent.className = 'delete-modal-content';
  modalContent.innerHTML = `
    <p> 선택 항목이 삭제됩니다.삭제하시겠습니까 ?</p>
      <button data-action="close" class="close-btn">
        <svg viewBox="0 0 24 24" width="16" height="16"">
        <polygon xmlns="http://www.w3.org/2000/svg" points="24.061 2.061 21.939 -0.061 12 9.879 2.061 -0.061 -0.061 2.061 9.879 12 -0.061 21.939 2.061 24.061 12 14.121 21.939 24.061 24.061 21.939 14.121 12 24.061 2.061"></polygon>
      </svg>
      </button >
    <div class="modal-buttons">
      <button id="confirmDeleteBtn" data-action="confirm" class="modal-btn">삭제</button>
      <button id="cancelDeleteBtn" data-action="close" class="modal-btn">취소</button>
    </div>
  `;
  modalBase.appendChild(modalContent);

  const handleModalClick = (event) => {
    const target = event.target.closest('[data-action]');
    let action = null;

    if (target) {
      action = target.dataset.action;
    } else if (event.target === modalBase) {
      action = 'close'; // modal 밖 영역 클릭
    }

    if (action === 'confirm') {
      currentPlanData.places.splice(placeIndex, 1);
      generatePlanContent();
      modalBase.removeEventListener('click', handleModalClick);
      closeModal(modalBase);
    } else if (action === 'close') {
      modalBase.removeEventListener('click', handleModalClick);
      closeModal(modalBase);
    }
  };

  // 이벤트 리스너를 추가합니다.
  modalBase.addEventListener('click', handleModalClick);
}

/* 
Title - 로그인 확인 후, 계획 저장함수 호출
*/
async function handleSavePlan() {
  // 1. 서버에 현재 로그인 상태 확인
  const authStatusResponse = await fetch('/status');
  const authStatus = await authStatusResponse.json();

  // 2. 로그인 상태에 따라 분기
  if (authStatus.loggedIn) {
    // 로그인 상태이면, 바로 저장 진행
    proceedToSavePlan();
  } else {
    // 비로그인 상태이면, 로그인 유도 모달 표시
    showLoginModal();
  }
}

/* 
Title - 실제 계획 저장을 진행하는 함수 
*/
function proceedToSavePlan() {

  // 사용자가 직접 입력한 해시태그 추출
  const editor = document.getElementById('hashtag-editor');
  const hashtagText = editor ? editor.textContent : '';
  // 정규식을 사용하여 #으로 시작하는 모든 단어를 찾습니다.
  const hashtagMatches = hashtagText.match(/#(\S+)/g) || [];
  // '#' 문자를 제거하여 순수 키워드만 추출합니다.
  const userKeywords = hashtagMatches.map(tag => tag.substring(1));

  //계획 데이터 생성
  const selectedPurposeKeywords = Array.from(document.querySelectorAll('#purposeKeywords .keyword-btn.selected'))
    .map(btn => btn.dataset.keyword);
  const selectedMoodKeywords = Array.from(document.querySelectorAll('#moodKeywords .keyword-btn.selected'))
    .map(btn => btn.dataset.keyword);
  const initialPlanResponse = JSON.parse(sessionStorage.getItem('planResponseDto'));
  const placeIdMap = new Map(initialPlanResponse.places.map(place => [place.name, place.placeId]));
  /*
  * legs{distanceMeters, duration, polyline{encodedPolyline}} 
  */
  const routeLegs = currentPlanData.routeResponse.routes && currentPlanData.routeResponse.routes.length > 0 ?
    currentPlanData.routeResponse.routes[0].legs : [];

  const titleInput = document.querySelector('.dayTitleText');
  let finalTitle = titleInput.value;

  // 사용자가 제목을 수정하지 않은 경우, 날짜를 제목으로 설정
  if (finalTitle === '여행 계획 완성') {
    const date = new Date(currentPlanData.departureTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    finalTitle = `${year}.${month}.${day}`;
  }

  /* 
  *Route 데이터 매핑 
  */
  const routes = currentPlanData.places.map((place, index) => {
    // index가 0보다 크면 routeLegs
    const previousLeg = index > 0 ? routeLegs[index - 1] : null;
    console.log(`${routeLegs[index]}:`, routeLegs[index]);
    const currentLeg = routeLegs[index] || {};
    return {
      placeId: placeIdMap.get(place.name) || null,
      sequence: index + 1,
      transportMode: place.transport || 'TRANSIT',
      stayTime: place.stayTime || 60,
      memo: place.memo || '',
      travelTime: Math.floor(parseInt(currentLeg.duration, 10) / 60) || 0,
      travelDistance: currentLeg.distanceMeters || 0,
      polyline: currentLeg.polyline ? currentLeg.polyline.encodedPolyline : '',
    }
  });

  /*
  * Plan데이터 매핑 
  */
  const planData = {
    regionName: null,
    title: finalTitle,
    startTime: currentPlanData.departureTime,
    endTime: null, //TODO: 도착 시간 계산 필요
    purposeKeywords: selectedPurposeKeywords,
    moodKeywords: selectedMoodKeywords,
    keywords: userKeywords,
    routes: routes,
  };

  console.log("저장할 계획 데이터:", JSON.stringify(planData, null, 2));

  fetch('/api/private/plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(planData)
  })
    .then(response => {
      if (response.ok) {
        alert('계획이 성공적으로 저장되었습니다!');
      } else {
        alert('계획 저장 중 오류가 발생했습니다.');
      }
    })
    .catch(error => {
      console.error('Error saving plan:', error);
      alert('계획 저장 중 오류가 발생했습니다.');
    });
}

/* 
Title - 로그인 유도 모달 
* 갑자기 됨;;;
*/
function showLoginModal() {
  const modalBase = document.querySelector('.modal-base');
  if (!modalBase) {
    console.error('.modal-base 요소를 찾을 수 없습니다.');
    return;
  }

  modalBase.innerHTML = ''; // 기존 내용 초기화
  modalBase.style.display = 'block';

  const modalContent = document.createElement('div');
  modalContent.className = 'login-prompt-modal';
  modalContent.innerHTML = `
        <h3>Auto Plan</h3>
        <div id="login-error-message" style="color: red; margin-bottom: 10px;"></div>
        <input type="text" id="loginEmail" placeholder="이메일" />
        <input type="password" id="loginPassword" placeholder="비밀번호" />
        <div class="modal-buttons">
            <button id="loginSubmitBtn" class="modal-btn">로그인</button>
        </div>
        <a href="/members/new" class="create-account">회원가입</a>
    `;
  modalBase.appendChild(modalContent);

  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const loginBtn = document.getElementById('loginSubmitBtn');
  const errorMessageDiv = document.getElementById('login-error-message');

  const attemptLogin = () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      errorMessageDiv.textContent = '이메일과 비밀번호를 모두 입력해주세요.';
      return;
    }

    loginBtn.disabled = true;
    errorMessageDiv.textContent = '';

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => {
        if (response.ok) {
          closeModal(modalBase);
          proceedToSavePlan(); // 로그인 성공 시, 원래 하려던 계획 저장 실행
        } else {
          errorMessageDiv.textContent = '아이디 또는 비밀번호가 잘못되었습니다.';
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        errorMessageDiv.textContent = '로그인 중 오류가 발생했습니다.';
      })
      .finally(() => {
        loginBtn.disabled = false;
      });
  };

  loginBtn.addEventListener('click', attemptLogin);
  passwordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      attemptLogin();
    }
  });

  modalBase.addEventListener('click', (event) => {
    if (event.target === modalBase) {
      closeModal(modalBase);
    }
  });
}

/*
Title - 모달 닫기
 */
function closeModal(modalBase) {
  if (!modalBase) return
    ;
  modalBase.style.display = 'none';
  modalBase.innerHTML = ''; // 모달 내용 초기화
};

/*
Title - 편집 모드로 돌아가기
TODO: 돌아가지 말고 처리할까
*/
function handleEditPlan() {
  const loadContent = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('응답 안함')
        ;
      const data = await response.text();
      document.querySelector('#collapseBody').innerHTML = data;

      if (url === '/selfContent') {
        const { initSelfContent, initRouteFormHandler, getDynamicElements } = await import('./selfContent.js');
        const { initializeSearchEvents } = await import('./selfFind.js');
        const { bindDynamicElements } = await import('../ui/dom-elements.js');
        initSelfContent();
        initializeSearchEvents();
        bindDynamicElements(getDynamicElements());
        initRouteFormHandler();
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  loadContent('/selfContent');
}