const base_url = 'https://nbaserver-q21u.onrender.com/api/filter';

const positionSelecter = document.querySelector('#positionSelecter') as HTMLSelectElement;//פוזישן סלקטור
const pointsRange = document.querySelector('#pointsRange') as HTMLInputElement;//טווח נקודות
const FGRange = document.querySelector('#FGRange') as HTMLInputElement;//טווח FG
const threePRange = document.querySelector('#threePRange') as HTMLInputElement;//3PE טווח
const searchBTN = document.querySelector('#searchBTN') as HTMLButtonElement;//כפתור חיפוש
const tbody = document.querySelector('#tbody') as HTMLTableSectionElement;

const pointsValue = document.querySelector('#pointsValue') as HTMLElement;//נקודות
const FGValue = document.querySelector('#FGValue') as HTMLElement;
const threePValue = document.querySelector('#threePValue') as HTMLElement;

interface Player {
    playerName: string;
    points: number;
    position: string;
    threePercent: number;
    twoPercent: number;
}
//הבקשה לשלוח
interface FilterData {
    name?:string
    position: string;
    points: number;
    twoPercent: number;
    threePercent: number;
}

// מציג את הערך בקלטים של הטווח
pointsRange.addEventListener('input', () => pointsValue.textContent = pointsRange.value);
FGRange.addEventListener('input', () => FGValue.textContent = FGRange.value);
threePRange.addEventListener('input', () => threePValue.textContent = threePRange.value);

// שולח בקשה לשרת עם הנתונים של הטווח
async function fetchPlayers(): Promise<void> {
    const filterData: FilterData = {
        position: positionSelecter.value,
        points: parseInt(pointsRange.value),
        twoPercent: parseInt(FGRange.value),
        threePercent: parseInt(threePRange.value)
    };

    try {
        const response = await fetch(base_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterData)
        });
        const data = await response.json();
        displayTable(data);
        console.log(data);
        (data);
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

// מציג את הנתונים שחזרו בטבלה
function displayTable(players: Player[]): void {
    tbody.innerHTML = ''; 

    players.forEach((player: Player) => {
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
function selectPlayer(player: Player): void {
    const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
    const index = positions.indexOf(player.position);
    const playerBox = document.querySelector(`#playerBox${index + 1}`) as HTMLElement;

    if (playerBox) {
        const nameP = playerBox.querySelector(`#playerNameP${index + 1}`) as HTMLElement;
        const fgP = playerBox.querySelector(`#threePercentP${index + 1}`) as HTMLElement;
        const pointsP = playerBox.querySelector(`#pointsP${index + 1}`) as HTMLElement;

        nameP.textContent = player.playerName;
        fgP.textContent = `FG%: ${player.twoPercent}`;
        pointsP.textContent = `Points: ${player.points}`;

        saveToLocalStorage(player, index);
    }
}

// שמירה בלוקאל סטוראז
function saveToLocalStorage(player: Player, index: number): void {
    localStorage.setItem(`player${index + 1}`, JSON.stringify(player));
}

// מחזיר מהלוקאל לתוך הטבלה
function loadFromLocalStorage(): void {
    for (let i = 1; i <= 5; i++) {
        const savedPlayer = localStorage.getItem(`player${i}`);
        if (savedPlayer) {
            const player: Player = JSON.parse(savedPlayer);
            const playerBox = document.querySelector(`#playerBox${i}`) as HTMLElement;

            const nameP = playerBox.querySelector(`#playerNameP${i}`) as HTMLElement;
            const fgP = playerBox.querySelector(`#threePercentP${i}`) as HTMLElement;
            const pointsP = playerBox.querySelector(`#pointsP${i}`) as HTMLElement;

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
