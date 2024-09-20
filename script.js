// プロレスラーのリスト
const wrestlers = [
    { name: "鷹木慎吾", prefecture: "山梨県" },
    { name: "田口隆祐", prefecture: "宮城県" }
];

// 都道府県の豆知識
const trivia = {
    "山梨県": "武田信玄で有名",
    "宮城県": "会場夢メッセMIYAGI キャパ：5人"
};

let selectedPrefecture = "";
let currentWrestler = {};
let scale = 1;
let startX = 0;
let startY = 0;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;

// ランダムなプロレスラーを表示する関数
function displayRandomWrestler() {
    const randomIndex = Math.floor(Math.random() * wrestlers.length);
    currentWrestler = wrestlers[randomIndex];
    document.getElementById('wrestler-name').innerText = currentWrestler.name;
}

// 地図をクリックしたときの処理
function handleMapClick(data) {
    if (!isDragging) {
        const mapContainer = document.getElementById('map-container');
        const rect = mapContainer.getBoundingClientRect();
        const x = (data.pageX - rect.left - offsetX) / scale;
        const y = (data.pageY - rect.top - offsetY) / scale;

        // クリック位置に基づいて都道府県を特定する
        const clickedPrefecture = jpmap.getPrefectureByPoint(x, y);
        if (clickedPrefecture) {
            selectedPrefecture = clickedPrefecture.name;
            document.getElementById('result').innerText = `選択したのは ${selectedPrefecture}`;
        }
    }
}

// 判定ボタンをクリックしたときの処理
function judge() {
    const resultElement = document.getElementById('result');
    const triviaElement = document.getElementById('trivia');
    if (selectedPrefecture === currentWrestler.prefecture) {
        resultElement.innerText = '正解です！';
    } else {
        resultElement.innerText = '不正解です。';
    }
    triviaElement.innerText = trivia[selectedPrefecture] || "豆知識がありません。";
}

// 地図を生成する関数
function generateMap() {
    new jpmap.japanMap(document.getElementById('map'), {
        showsPrefectureName: false,
        width: 800,
        height:800,
        movesIslands: true,
        lang: 'ja',
        onSelect: handleMapClick
    });
}

// ピンチイン・アウトとスワイプを有効にする関数
function enablePinchZoomAndSwipe() {
    const mapContainer = document.getElementById('map-container');
    const map = document.getElementById('map');

    mapContainer.addEventListener('touchstart', (event) => {
        if (event.touches.length === 2) {
            startX = (event.touches[0].pageX + event.touches[1].pageX) / 2;
            startY = (event.touches[0].pageY + event.touches[1].pageY) / 2;
            startDistance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY
            );
        } else if (event.touches.length === 1) {
            startX = event.touches[0].pageX - offsetX;
            startY = event.touches[0].pageY - offsetY;
            isDragging = true;
        }
    });

    mapContainer.addEventListener('touchmove', (event) => {
        if (event.touches.length === 2) {
            const currentDistance = Math.hypot(
                event.touches[0].pageX - event.touches[1].pageX,
                event.touches[0].pageY - event.touches[1].pageY
            );
            const zoomFactor = currentDistance / startDistance;
            scale *= zoomFactor;
            map.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
            startDistance = currentDistance;
        } else if (event.touches.length === 1) {
            offsetX = event.touches[0].pageX - startX;
            offsetY = event.touches[0].pageY - startY;
            map.style.transform = `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`;
        }
    });

    mapContainer.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// ページが読み込まれたときに実行する処理
window.onload = function() {
    generateMap();
    displayRandomWrestler();
    document.getElementById('judge-button').addEventListener('click', judge);
    enablePinchZoomAndSwipe();
};
