
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
export function hashtaggingver5(editor2) {

  const selection = window.getSelection();
  const currentNode = selection.getRangeAt(0).commonAncestorContainer;
  const currentNodeParentElement = currentNode.parentElement.nodeName;
  // console.log('currentNode:', currentNode);
  // console.log('currentNode parent nodeName:', currentNode.parentElement.nodeName, '&& currentNode parentElement:', currentNode.parentElement);
  const hashtagRegex = /#[^\s]+(?=\s|$|[.,!?;:\)\]\}])/g;

  if (currentNodeParentElement === 'DIV' && currentNode.parentElement.parentNode === editor2) {
    console.log('current node is DIV under editor2');

    //1. 몇번째 줄인지 파악하기 (줄은 div로 구분)
    const cloneRange = selection.getRangeAt(0).cloneRange();
    const editorChildren = Array.from(editor2.childNodes);
    // console.log('editorChildren:', editorChildren);

    //여기에 div태그들을 담아줌 (2번째 줄은 index 0)
    let divList = [];
    for (const node of editorChildren) {
      if (node.nodeName === 'DIV') {
        divList.push(node);
        // console.log('divList:', divList);
      }
    }
    //divList에서 현재 노드가 몇번째 div인지 파악
    const currentDivIndex = divList.findIndex(divNode =>
      divNode.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
    // console.log('currentDivIndex:', currentDivIndex);
    //2. 그 줄에서 몇번째 노드인지 파악하기 (노드는 textNode or spanNode)

    //div 하위 노드들
    const ArrayChildrenUnderDiv = Array.from(currentNode.parentElement.childNodes);
    // console.log('currentNode.parentElement:', currentNode.parentElement);
    // console.log('ArrayChildrenUnderDiv:', ArrayChildrenUnderDiv);
    //div 하위 노드들 중 현재 노드가 몇번째인지(index반환)
    const currentNodeInDivIndex = ArrayChildrenUnderDiv.findIndex(node =>
      node.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
    // console.log('currentNodeInDivIndex:', currentNodeInDivIndex);

    //3. 그 노드에서 해시태그 파악, createFragment생성
    const currentNodeTextContent = currentNode.textContent;
    // console.log('currentNodeTextContent:', currentNodeTextContent);
    const matches = Array.from(currentNodeTextContent.matchAll(hashtagRegex));
    if (matches.length === 0) {
      // console.log('No hashtags found in the current node.');
      return;
    }
    // console.log('matches:', matches);
    // const fragment = document.createDocumentFragment();
    const { fragment, textAfterNode } = createHashtagFragment(currentNodeTextContent, matches, hashtagRegex);
    // console.log('fragment:', fragment, 'is Node?', fragment instanceof Node, 'is DocumentFragment?', fragment instanceof DocumentFragment);

    //4. 노드 교체 (replaceChild)
    const afterCurrentDiv = divList[currentDivIndex];
    afterCurrentDiv.replaceChild(fragment, ArrayChildrenUnderDiv[currentNodeInDivIndex]);
    editor2.normalize();

    //5. 커서 위치 재설정 (기존 노드는 파괴됐으니, 기존 줄, 기존 노드 인덱스로 넘기기)
    setNewRangeVer2(editor2, selection, textAfterNode);
    //6. sex
  } else {
    // console.log('current node is NOT DIV under editor2');
    const cloneRange = selection.getRangeAt(0).cloneRange();
    //div 하위 노드들
    const ArrayChildren = Array.from(currentNode.parentElement.childNodes);
    const currentNodeIndex = ArrayChildren.findIndex(node =>
      node.contains(selection.getRangeAt(0).commonAncestorContainer)
    );
    // console.log('ArrayChildren:', ArrayChildren);
    // console.log('current node index in DIV:', currentNodeIndex);

    const textContent = currentNode.textContent;//text 반환
    const matches = Array.from(textContent.matchAll(hashtagRegex));
    // console.log('currentNode', currentNode);
    // console.log('textContent', textContent);
    // console.log('matches:', matches);

    if (matches.length === 0) {
      // console.log('No hashtags found in the current node.');
      return;
    }
    // console.log('matches:', matches);

    const { fragment, textAfterNode } = createHashtagFragment(textContent, matches, hashtagRegex);

    currentNode.parentElement.replaceChild(fragment, currentNode);

    editor2.normalize();

    const afterArrayChildren = Array.from(editor2.childNodes)
    // console.log('afterArrayChildren:', afterArrayChildren);
    setNewRangeVer2(editor2, selection, textAfterNode);
  }
}

/*
Title - 해시태그 추천 관련 헬퍼 함수
*/

// 현재 캐럿(커서) 위치의 단어와 그 시작 인덱스를 찾습니다.
export function getWordAtCaret(editor) {
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
export function displaySuggestions(keywords, editor) {
  const suggestionsContainer = document.getElementById('hashtag-suggestions');
  suggestionsContainer.innerHTML = '';

  if (keywords.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const containerRect = editor.closest('.plan-description-area').getBoundingClientRect();

  const top = rect.bottom - containerRect.top + editor.closest('.plan-description-area').scrollTop;//

  suggestionsContainer.style.top = `${top}px`;

  keywords.forEach(keyword => {
    const suggestionEl = document.createElement('div');
    suggestionEl.className = 'suggestion-item';
    suggestionEl.textContent = `#${keyword}`;
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
Title - 키워드 저장
*/
export function extractKeywords(editor) {
  const content = editor.innerText;
  const hashtagRegex = content.match(/#([^\s#]+)/g) || [];
  const keywords = hashtagRegex.map(tag => tag.slice(1)); // '#' 제거
  return Array.from(new Set(keywords)); // 중복 제거
}