import { extractKeywords } from '../../../core/hashtag.js';

/**
 * Title - myPlanDetails 페이지의 모든 이벤트를 설정하고 관리합니다.
 * @param {HTMLElement} container - .planDetail-container 요소
 * @param {object} callbacks - 이벤트 발생 시 호출될 콜백 함수 객체
 * @param {Function} callbacks.onTitleChange - 제목 변경 시 호출. (planId, title)
 * @param {Function} callbacks.onStayTimeChange - 체류시간 변경 시 호출. (planId, routeSequence, stayTime)
 * @param {Function} callbacks.onMemoChange - 메모 변경 시 호출. (planId, routeSequence, memo)
 * @param {Function} callbacks.onDescriptionChange - 설명 변경 시 호출. (planId, description)
 * @param {Function} callbacks.onKeywordsChange - 키워드 변경 시 호출. (planId, keywords)
 * @param {Function} callbacks.onDeleteRouteClick - 경로 삭제 버튼 클릭 시 호출. (planId, routeSequence, routeElement)
 * @param {Function} callbacks.onOrderSave - 순서 변경 저장 시 호출. (orderedIds: string[])
 * @param {Function} callbacks.onModalSearch - 모달 내에서 장소 검색 시 호출. (query)
 * @param {Function} callbacks.onModalResultClick - 모달 검색 결과 클릭 시 호출. (index)
 * @param {Function} callbacks.onModalRemoveClick - 모달 선택된 장소 제거 버튼 클릭 시 호출. (index, element)
 * @param {Function} callbacks.onModalConfirm - 모달 장소 추가 확정 시 호출.
 * @returns {Function} - 등록된 모든 이벤트 리스너를 제거하는 정리 함수
 */
export function setupDetailsEventListeners(container, callbacks) {
  const listeners = [];

  // 상태 저장을 위한 변수들
  let previousValue = '';
  let previousKeywords = [];
  let draggingElement = null;
  let associatedTransportCard = null; // 드래그 중인 장소와 연결된 교통수단 카드

  // ------------------- 메인 컨테이너 이벤트 핸들러 -------------------

  const handleFocusIn = (event) => {
    const target = event.target;
    if (target.matches('[contenteditable="true"]')) {
      previousValue = target.innerHTML;
      if (target.matches('#myPlanDescription')) {
        previousKeywords = extractKeywords(target);
      }
    }
  };

  const handleFocusOut = (event) => {
    const target = event.target;
    if (!target.matches('[contenteditable="true"]') || previousValue === target.innerHTML) {
      return;
    }

    const planId = container.dataset.planId;

    //제목 변동시
    if (target.matches('#planDetail-title')) {
      callbacks.onTitleChange?.(planId, target.innerText);
    }
    //체류시간 변동시
    else if (target.matches('[id^="planDetail-stay-time"]')) {
      const sequence = target.closest('.planDetail-day-card-content-grid').dataset.routeId;
      callbacks.onStayTimeChange?.(planId, sequence, target.innerText);
    }
    //장소별 메모 변동시
    else if (target.matches('.planDetail-memo-display')) {
      const sequence = target.closest('.planDetail-day-card-content-grid').dataset.routeId;
      callbacks.onMemoChange?.(planId, sequence, target.innerText);
    }
    //계획 통합 설명 변동시
    else if (event.target.matches('#myPlanDescription')) {
      callbacks.onDescriptionChange?.(planId, target.innerHTML);
      const currentKeywords = extractKeywords(target);
      // 키워드 변동시
      if (JSON.stringify(previousKeywords) !== JSON.stringify(currentKeywords)) {
        callbacks.onKeywordsChange?.(planId, currentKeywords);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && event.target.matches('[contenteditable="true"]')) {
      event.target.blur();
    }
  };

  const handleMainContainerClick = (event) => {
    const target = event.target;

    // 삭제 버튼 클릭 처리
    const deleteButton = target.closest('.delete-route-button');
    if (deleteButton) {
      event.stopPropagation(); // 부모 요소로의 이벤트 버블링 방지
      const planId = container.dataset.planId;
      const routeElement = deleteButton.closest('.planDetail-card');
      const routeSequence = routeElement?.querySelector('.planDetail-day-card-content-grid')?.dataset.routeId;

      if (planId && routeSequence && routeElement) {
        callbacks.onDeleteRouteClick?.(planId, routeSequence, routeElement);
      }
    }
  };

  // 이벤트 리스너 등록
  container.addEventListener('focusin', handleFocusIn, true);
  container.addEventListener('focusout', handleFocusOut, true); // 'blur'는 버블링되지 않으므로 'focusout' 사용
  container.addEventListener('keydown', handleKeyDown);
  container.addEventListener('click', handleMainContainerClick); // 메인 클릭 핸들러 등록

  listeners.push({ type: 'focusin', handler: handleFocusIn, capture: true });
  listeners.push({ type: 'focusout', handler: handleFocusOut, capture: true });
  listeners.push({ type: 'keydown', handler: handleKeyDown });
  listeners.push({ type: 'click', handler: handleMainContainerClick });

  // ------------------- 드래그 앤 드롭 이벤트 핸들러 -------------------

  const listBox = container.querySelector('.planDetail-list-box');
  let scrollInterval = null;
  const scrollSpeed = 10;
  const edgeSize = 60;

  const stopScrolling = () => {
    clearInterval(scrollInterval);
    scrollInterval = null;
  };

  const startScrolling = (direction) => {
    if (scrollInterval) return;
    scrollInterval = setInterval(() => {
      listBox.scrollTop += (direction === 'up' ? -scrollSpeed : scrollSpeed);
    }, 15);
  };

  const handleDragStart = (event) => {
    const targetCard = event.target.closest('.planDetail-place-card[draggable="true"]');
    if (!targetCard) {
      event.preventDefault();
      return;
    }
    draggingElement = targetCard;

    // 드래그하는 장소 카드 바로 다음에 오는 교통수단 카드 찾기
    associatedTransportCard = draggingElement.nextElementSibling;
    if (associatedTransportCard && !associatedTransportCard.classList.contains('planDetail-transport-card')) {
      associatedTransportCard = null;
    }

    if (associatedTransportCard) {
      associatedTransportCard.classList.add('dragging-associated');
    }
    
    // 장소 정보 카드(grid)만 드래그 이미지로 설정
    const contentGrid = targetCard.querySelector('.planDetail-day-card-content-grid');
    if (contentGrid) {
      const rect = contentGrid.getBoundingClientRect();
      // 마우스 위치를 고려하여 드래그 이미지의 오프셋 설정 (중앙 부근)
      event.dataTransfer.setDragImage(contentGrid, event.clientX - rect.left, event.clientY - rect.top);
    }

    setTimeout(() => draggingElement.classList.add('dragging'), 0);
  };

  const handleDragEnd = () => {
    stopScrolling();
    if (draggingElement) {
      draggingElement.classList.remove('dragging');
      draggingElement = null;
    }
    if (associatedTransportCard) {
      associatedTransportCard.classList.remove('dragging-associated');
      associatedTransportCard = null;
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (!draggingElement) return;

    const containerRect = listBox.getBoundingClientRect();
    if (event.clientY < containerRect.top + edgeSize) {
      startScrolling('up');
    } else if (event.clientY > containerRect.bottom - edgeSize) {
      startScrolling('down');
    } else {
      stopScrolling();
    }

    const afterElement = getDragAfterElement(listBox, event.clientY);
    const sentinel = document.getElementById('add-place-sentinel');

    if (afterElement == null) {
      listBox.insertBefore(draggingElement, sentinel);
      if (associatedTransportCard) {
        listBox.insertBefore(associatedTransportCard, sentinel);
      }
    } else {
      // afterElement가 associatedTransportCard인 경우 무한 루프 방지를 위해 삽입 위치 조정 불필요
      if (afterElement !== associatedTransportCard) {
        listBox.insertBefore(draggingElement, afterElement);
        if (associatedTransportCard) {
          listBox.insertBefore(associatedTransportCard, draggingElement.nextSibling);
        }
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    stopScrolling();
    if (draggingElement) {
      const orderedElements = [...listBox.querySelectorAll('li.planDetail-place-card .planDetail-day-card-content-grid')];
      const orderedRouteIds = orderedElements.map(el => el.dataset.routeId);
      const convertedOrderedIds = orderedRouteIds.map(id => parseInt(id, 10));
      callbacks.onOrderSave?.(convertedOrderedIds);
    }
  };

  function getDragAfterElement(container, y) {
    const cards = [...container.querySelectorAll('.planDetail-card:not(.dragging):not(.dragging-associated)')];
    
    // 1. 현재 마우스가 직접 위에 있는 카드를 먼저 찾습니다.
    const cardUnderMouse = cards.find(card => {
      const box = card.getBoundingClientRect();
      return y >= box.top && y <= box.bottom;
    });

    if (cardUnderMouse) {
      // 만약 마우스가 교통수단 카드 위에 있다면, 
      // 해당 카드는 앞 장소와 한 세트이므로 무조건 그 다음 요소를 반환하여 '세트 뒤'로 가게 합니다.
      if (cardUnderMouse.classList.contains('planDetail-transport-card')) {
        return cardUnderMouse.nextElementSibling;
      }

      const box = cardUnderMouse.getBoundingClientRect();
      // 장소 카드인 경우: 위쪽 절반이면 그 앞으로, 아래쪽 절반이면 그 세트(교통카드 포함) 뒤로.
      if (y < (box.top + box.height / 2)) {
        return cardUnderMouse;
      } else {
        // 아래쪽 절반일 때, 바로 다음에 교통카드가 있다면 그 다음 요소를 반환
        const next = cardUnderMouse.nextElementSibling;
        if (next && next.classList.contains('planDetail-transport-card')) {
          return next.nextElementSibling;
        }
        return next;
      }
    }

    // 2. 마우스가 카드 사이에 있거나 범위를 벗어난 경우 기존 로직
    return cards.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  if (listBox) {
    listBox.addEventListener('dragstart', handleDragStart);
    listBox.addEventListener('dragend', handleDragEnd);
    listBox.addEventListener('dragover', handleDragOver);
    listBox.addEventListener('drop', handleDrop);
    listeners.push({ target: listBox, type: 'dragstart', handler: handleDragStart });
    listeners.push({ target: listBox, type: 'dragend', handler: handleDragEnd });
    listeners.push({ target: listBox, type: 'dragover', handler: handleDragOver });
    listeners.push({ target: listBox, type: 'drop', handler: handleDrop });
  }
  // ------------------- 장소 추가 모달 이벤트 핸들러 -------------------

  const modal = document.querySelector('#myPlanDetail-add-place-modal');
  if (modal) {
    const handleModalEvents = (event) => {
      const target = event.target;

      // 검색창 Enter 키
      if (event.type === 'keydown' && target.matches('#myPlanDetail-add-place-input') && event.key === 'Enter') {
        event.preventDefault();
        if (event.isComposing) return;
        callbacks.onModalSearch?.(target.value);
      }

      // 클릭 이벤트 처리
      if (event.type === 'click') {
        // 검색 결과 아이템 클릭
        const resultItem = target.closest('[id^="myPlanDetail-add-place-result-item-"]');
        if (resultItem) {
          callbacks.onModalResultClick?.(resultItem.dataset.index);
        }
        // 선택된 아이템 제거 버튼 클릭
        const removeBtn = target.closest('.myPlanDetail-add-place-remove-btn');
        if (removeBtn) {
          callbacks.onModalRemoveClick?.(removeBtn.dataset.index, removeBtn.parentElement);
        }
        // 최종 추가 버튼 클릭
        const confirmBtn = target.closest('#myPlanDetail-add-place-confirm-btn');
        if (confirmBtn) {
          callbacks.onModalConfirm?.();
        }
      }
    };

    modal.addEventListener('click', handleModalEvents);
    modal.addEventListener('keydown', handleModalEvents);
    listeners.push({ type: 'click', handler: handleModalEvents, target: modal });
    listeners.push({ type: 'keydown', handler: handleModalEvents, target: modal });
  }

  // ------------------- 정리 함수 -------------------

  return () => {
    console.log('myPlanDetails 이벤트 리스너를 정리합니다.');
    listeners.forEach(({ type, handler, capture, target }) => {
      const element = target || container;
      element.removeEventListener(type, handler, capture);
    });
  };
}
