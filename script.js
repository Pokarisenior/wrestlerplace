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

// ランダムなプロレスラーを表示する関数
function displayRandomWrestler() {
    const randomIndex = Math.floor(Math.random() * wrestlers.length);
    currentWrestler = wrestlers[randomIndex];
    document.getElementById('wrestler-name').innerText = currentWrestler.name;
}

// 地図をクリックしたときの処理
function handleMapClick(event) {
    const clickedElement = event.target;
    if (clickedElement.classList.contains('prefecture')) {
        selectedPrefecture = clickedElement.querySelector('title').textContent.split(' / ')[0];
        document.getElementById('result').innerText = `選択したのは ${selectedPrefecture}`;
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

// SVG地図を読み込む関数
async function loadSVGMap() {
    const response = await fetch('https://raw.githubusercontent.com/geolonia/japanese-prefectures/master/map-mobile.svg');
    const svgText = await response.text();
    document.getElementById('map-container').innerHTML = svgText;

    // 都道府県のクリックイベントを設定
    const svgElement = document.querySelector('#map-container svg');
    const prefectures = svgElement.querySelectorAll('g.prefecture');
    prefectures.forEach(prefecture => {
        prefecture.addEventListener('click', handleMapClick);
    });
}

// ページが読み込まれたときに実行する処理
window.onload = function() {
    loadSVGMap();
    displayRandomWrestler();
    document.getElementById('judge-button').addEventListener('click', judge);
};
