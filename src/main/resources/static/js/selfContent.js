let placeCount = 2; // 초기 장소 개수
const MAX_PLACES = 7; // 최대 장소 개수
const MIN_PLACES = 2; //최소 장소 개수

function addPlace() {
    const placeContainer = document.getElementById("placeContainer");

    if (placeCount < MAX_PLACES) {
        const newPlaceDiv = document.createElement("div");
        newPlaceDiv.className = "placeInput";
        newPlaceDiv.id = `place${placeCount}`;
        newPlaceDiv.innerHTML = `
                <button type="button" class="removePlaceBtn" onclick="removePlace('${placeCount}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            <div class="placeInput-row">
                <input type="text" id="placeName${placeCount}" name="placeNames[${placeCount}].name" placeholder="장소명">
                <input type="hidden" id="placeId${placeCount}" name="placeNames[${placeCount}].placeId">
            </div>

            <div class="transport-buttons">
                <button class="transport-btn" data-transport="DRIVE" onclick="selectTransport('place${placeCount}', 'DRIVE')">
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M22.357,8A34.789,34.789,0,0,0,19.21,3.245a4.4,4.4,0,0,0-2.258-1.54A15.235,15.235,0,0,0,12,1a19.175,19.175,0,0,0-5.479.713A4.382,4.382,0,0,0,4.29,3.245,23.466,23.466,0,0,0,1.464,8H0V20H3v3H7V20H17v3h4V20h3V8ZM5.5,17A1.5,1.5,0,1,1,7,15.5,1.5,1.5,0,0,1,5.5,17ZM12,11a64.834,64.834,0,0,0-8.8.711A23.405,23.405,0,0,1,6.671,5.07a1.394,1.394,0,0,1,.714-.484A16.164,16.164,0,0,1,12,4a12.3,12.3,0,0,1,4.115.586,1.4,1.4,0,0,1,.714.483,27.139,27.139,0,0,1,3.956,6.64A64.92,64.92,0,0,0,12,11Zm6.5,6A1.5,1.5,0,1,1,20,15.5,1.5,1.5,0,0,1,18.5,17Z"/>
                    </svg>
                </button>
                <button class="transport-btn" data-transport="TRANSIT" onclick="selectTransport('place${placeCount}', 'TRANSIT')">
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M22,10V4.229a2.987,2.987,0,0,0-1.821-2.76c-3.673-1.9-12.695-1.893-16.358,0A2.986,2.986,0,0,0,2,4.229V10H0v3a2,2,0,0,0,2,2v7H4v2H9V22h6v2h5V22h2V15a2,2,0,0,0,2-2V10ZM4,13V7H20v6Zm.6-9.688A19.013,19.013,0,0,1,12,2a19.018,19.018,0,0,1,7.4,1.311.99.99,0,0,1,.6.918V5H15V4H9V5H4V4.229A.989.989,0,0,1,4.6,3.312ZM4,20V15H6v1a1,1,0,0,0,2,0V15h8v1a1,1,0,0,0,2,0V15h2v5Z"/>
                    </svg>
                </button>
                <button class="transport-btn" data-transport="WALK" onclick="selectTransport('place${placeCount}', 'WALK')">
                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" width="16" height="16">
                        <path d="m11,2.5c0-1.381,1.119-2.5,2.5-2.5s2.5,1.119,2.5,2.5-1.119,2.5-2.5,2.5-2.5-1.119-2.5-2.5Zm9.171,9.658l-2.625-1.312s-2.268-3.592-2.319-3.651c-.665-.76-1.625-1.195-2.634-1.195-1.274,0-2.549.301-3.688.871l-2.526,1.263c-.641.321-1.114.902-1.298,1.596l-.633,2.387c-.212.801.265,1.622,1.065,1.834.802.213,1.622-.264,1.834-1.065l.575-2.168,1.831-.916-.662,2.83c-.351,1.5.339,3.079,1.679,3.84l3.976,2.258c.156.089.253.256.253.436v3.336c0,.829.672,1.5,1.5,1.5s1.5-.671,1.5-1.5v-3.336c0-1.256-.679-2.422-1.771-3.043l-2.724-1.547.849-3.165.875,1.39c.146.232.354.42.599.543l3,1.5c.216.107.444.159.67.159.55,0,1.08-.304,1.343-.83.37-.741.07-1.642-.671-2.013Zm-10.312,5.465c-.812-.161-1.6.378-1.754,1.192l-.039.2-1.407,2.814c-.37.741-.07,1.642.671,2.013.215.107.444.159.67.159.55,0,1.08-.304,1.343-.83l1.5-3c.062-.123.106-.254.131-.39l.077-.404c.156-.813-.378-1.599-1.192-1.754Z"/>
                    </svg>
                </button>
                <input type="hidden" id="transport${placeCount}" name="placeNames[${placeCount}].transport" value="TRANSIT">
            </div>
            <div class="placeInput-row">
                <label for="placeTime${placeCount}">체류시간:</label>
                <input type="number" id="placeTime${placeCount}" name="placeNames[${placeCount}].time" min="1" placeholder="분" required>
            </div>
        `;
        const secPlaceInput = document.getElementById("placeEnd")
        placeContainer.insertBefore(newPlaceDiv, secPlaceInput);
        placeCount++;
    } else {
        placeCount++;
        alert("최대 7개 장소까지 추가 가능합니다.");
    }
}

function removeAutoComplete() {
    const autoComplete = document.getElementById("autocomplete");
    autoComplete.classList.add("autoComplete_displayNone");
}

const selfButton = document.getElementById("selfButton");
selfButton.addEventListener("click", () => {
    removeAutoComplete();
})

function removePlace(placeId) {
    const placeDiv = document.getElementById(`place${placeId}`);
    if (placeCount > MIN_PLACES) { // 최소 2개 유지
        placeDiv.remove();
        placeCount--;
        delete transportSelections[placeId];
    }
}
let transportSelections = {}; // 각 placeInput의 교통 수단 선택 저장

function selectTransport(placeId, transport) {
    // 선택된 교통 수단 저장
    transportSelections[placeId] = transport;

    // 버튼 스타일 업데이트
    const buttons = document.getElementById(placeId).querySelectorAll(".transport-btn");
    buttons.forEach(btn => {
        if (btn.dataset.transport === transport) {
            btn.classList.add("selected_transport");
        } else {
            btn.classList.remove("selected_transport");
        }
    });

    // console.log(`Selected transport for ${placeId}: ${transport}`);
}

// 출발/도착 시간 기본값 설정 (MutationObserver로 프래그먼트 로드 감지)
document.addEventListener("DOMContentLoaded", () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const selfContent = document.querySelector(".selfContent");
                if (selfContent) {
                    const departureTimeInput = document.getElementById("departureTime");

                    const now = new Date();
                    const year = now.getFullYear();
                    const month = (now.getMonth() + 1).toString().padStart(2, '0');
                    const day = now.getDate().toString().padStart(2, '0');
                    const hours = now.getHours().toString().padStart(2, '0');
                    const minutes = now.getMinutes().toString().padStart(2, '0');
                    departureTimeInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;

                    observer.disconnect(); // 관찰 중단 (한 번만 실행)
                }
            }
        });
    });

    // 문서 전체를 관찰 (selfContent 프래그먼트 추가 감지)
    observer.observe(document.body, { childList: true, subtree: true });
});