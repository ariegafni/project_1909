"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const base_url = 'https://nbaserver-q21u.onrender.com/api/filter';
const positionSelecter = document.querySelector('#positionSelecter'); //פוזישן סלקטור
const pointsRange = document.querySelector('#pointsRange'); //טווח נקודות
const FGRange = document.querySelector('#FGRange'); //טווח FG
const threePRange = document.querySelector('#threePRange'); //3PE טווח
const searchBTN = document.querySelector('#searchBTN'); //כפתור חיפוש
const tbody = document.querySelector('#tbody');
const pointsValue = document.querySelector('#pointsValue'); //נקודות
const FGValue = document.querySelector('#FGValue');
const threePValue = document.querySelector('#threePValue');
// מציג את הערך בקלטים של הטווח
pointsRange.addEventListener('input', () => pointsValue.textContent = pointsRange.value);
FGRange.addEventListener('input', () => FGValue.textContent = FGRange.value);
threePRange.addEventListener('input', () => threePValue.textContent = threePRange.value);
// שולח בקשה לשרת עם הנתונים של הטווח
function fetchPlayers() {
    return __awaiter(this, void 0, void 0, function* () {
        const filterData = {
            position: positionSelecter.value,
            points: parseInt(pointsRange.value),
            twoPercent: parseInt(FGRange.value),
            threePercent: parseInt(threePRange.value)
        };
        try {
            const response = yield fetch(base_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(filterData)
            });
            const data = yield response.json();
            displayTable(data);
            console.log(data);
            (data);
        }
        catch (error) {
            console.error('Error fetching players:', error);
        }
    });
}
// מציג את הנתונים שחזרו בטבלה
function displayTable(players) {
    tbody.innerHTML = '';
    players.forEach((player) => {
        const row = document.createElement('tr');
        const playerTD = document.createElement('td');
        const positionTD = document.createElement('td');
        const fgTD = document.createElement('td');
        const threePTD = document.createElement('td');
        const actionTD = document.createElement('td');
        const selectPlayerBTN = document.createElement('button');
        selectPlayerBTN.textContent = 'בחר שחקן';
        playerTD.textContent = player.playerName;
        positionTD.textContent = player.position;
        fgTD.textContent = player.twoPercent.toString();
        threePTD.textContent = player.threePercent.toString();
        selectPlayerBTN.addEventListener('click', () => selectPlayer(player));
        actionTD.appendChild(selectPlayerBTN);
        row.appendChild(playerTD);
        row.appendChild(positionTD);
        row.appendChild(fgTD);
        row.appendChild(threePTD);
        row.appendChild(actionTD);
        tbody.appendChild(row);
    });
}
// לוקח שחקן שנבחר ושולח לקופסה
function selectPlayer(player) {
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const index = positions.indexOf(player.position);
    const playerBox = document.querySelector(`#playerBox${index + 1}`);
    if (playerBox) {
        const nameP = playerBox.querySelector(`#playerNameP${index + 1}`);
        const fgP = playerBox.querySelector(`#threePercentP${index + 1}`);
        const pointsP = playerBox.querySelector(`#pointsP${index + 1}`);
        nameP.textContent = player.playerName;
        fgP.textContent = `FG%: ${player.twoPercent}`;
        pointsP.textContent = `Points: ${player.points}`;
        saveToLocalStorage(player, index);
    }
}
// שמירה בלוקאל סטוראז
function saveToLocalStorage(player, index) {
    localStorage.setItem(`player${index + 1}`, JSON.stringify(player));
}
// מחזיר מהלוקאל לתוך הטבלה
function loadFromLocalStorage() {
    for (let i = 1; i <= 5; i++) {
        const savedPlayer = localStorage.getItem(`player${i}`);
        if (savedPlayer) {
            const player = JSON.parse(savedPlayer);
            const playerBox = document.querySelector(`#playerBox${i}`);
            const nameP = playerBox.querySelector(`#playerNameP${i}`);
            const fgP = playerBox.querySelector(`#threePercentP${i}`);
            const pointsP = playerBox.querySelector(`#pointsP${i}`);
            nameP.textContent = player.playerName;
            fgP.textContent = `FG%: ${player.twoPercent}`;
            pointsP.textContent = `Points: ${player.points}`;
        }
    }
}
window.onload = () => {
    loadFromLocalStorage();
    searchBTN.addEventListener('click', fetchPlayers);
};
