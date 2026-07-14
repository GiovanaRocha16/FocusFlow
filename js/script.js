const timer = document.getElementById("timer");
const startButton = document.getElementById("start-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");
const customizeButton = document.getElementById("customize-button");
const modal = document.getElementById("settings-modal");
const cancelSettings = document.getElementById("cancel-settings");
const saveSettings = document.getElementById("save-settings");
const focusInput = document.getElementById("focus-time");
const breakInput = document.getElementById("break-time");
const cycleInput = document.getElementById("cycle-count");
const sessionTitle = document.getElementById("session-title");
const cycleInfo = document.getElementById("cycle-info");
const mascotMessage = document.getElementById("mascot-message");
const endSessionButton = document.getElementById("end-session-button");
const confirmModal = document.getElementById("confirm-modal");
const cancelEnd = document.getElementById("cancel-end");
const confirmEnd = document.getElementById("confirm-end");
const progressRing = document.getElementById("progress-ring");
const radius = 145;
const circumference = 2 * Math.PI * radius;
const rainAudio = new Audio("assets/audio/rain.mp3");
const cafeAudio = new Audio("assets/audio/cafe.mp3");
const oceanAudio = new Audio("assets/audio/ocean.mp3");
const forestAudio = new Audio("assets/audio/forest.mp3");
const rainButton = document.getElementById("rain-button");
const cafeButton = document.getElementById("cafe-button");
const oceanButton = document.getElementById("ocean-button");
const forestButton = document.getElementById("forest-button");
const volumeSlider = document.getElementById("volume-slider");
const missionsList = document.getElementById("missions-list");
const addMissionButton = document.getElementById("add-mission-button");
const missionModal = document.getElementById("mission-modal");
const missionInput = document.getElementById("mission-input");
const cancelMission = document.getElementById("cancel-mission");
const saveMission = document.getElementById("save-mission");
const nori = document.getElementById("nori");
const levelModal = document.getElementById("level-modal");
const levelMessage = document.getElementById("level-message");
const closeLevelModal = document.getElementById("close-level-modal");

rainAudio.loop = true;
cafeAudio.loop = true;
oceanAudio.loop = true;
forestAudio.loop = true;

const volume = volumeSlider.value / 100;

rainAudio.volume = volume;
cafeAudio.volume = volume;
oceanAudio.volume = volume;
forestAudio.volume = volume;

progressRing.style.strokeDasharray = circumference;

progressRing.style.strokeDashoffset = 0;

let focusTime = 25;
let breakTime = 5;
let totalCycles = 4;

let currentCycle = 1;
let isBreak = false;

let timeLeft = focusTime * 60;

let interval = null;
let sessionStarted = false;

let level = 1;
let xp = 0;

function updateXP() {

    const maxXP = level * 50 + 50;

    document.getElementById("level-title").textContent =
        `Nível ${level}`;

    document.getElementById("xp-text").textContent =
        `${xp} / ${maxXP} XP`;

    document.getElementById("xp-bar").style.width =
        `${(xp / maxXP) * 100}%`;

}

function startTimer() {

    interval = setInterval(() => {

        timeLeft--;

        if (timeLeft < 0) {

            nextPhase();

        } else {

            updateTimer();

        }

    }, 1000);

}

function updateTimer() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    updateProgress();

}

function updateProgress() {

    const totalTime = isBreak
        ? breakTime * 60
        : focusTime * 60;

    const progress = timeLeft / totalTime;

    progressRing.style.strokeDashoffset =
        circumference * (1 - progress);

}

function updateSessionInfo() {

    sessionTitle.textContent = isBreak
        ? "☕ Descanso"
        : "🍅 Foco";

    cycleInfo.textContent =
        `Ciclo ${currentCycle} de ${totalCycles}`;

}

function nextPhase() {

    if (!isBreak) {

        // Ganha XP proporcional ao tempo de foco
        const earnedXP = Math.round((focusTime / 60) * 50);

        addXP(earnedXP);

        // Vai para o descanso
        isBreak = true;
        timeLeft = breakTime * 60;

    } else {

        // Volta para o foco
        isBreak = false;
        currentCycle++;

        if (currentCycle > totalCycles) {

            clearInterval(interval);
            interval = null;

            mascotMessage.textContent =
                "🎉 Miau! Parabéns! Você concluiu todos os ciclos!";

            currentCycle = 1;
            isBreak = false;
            timeLeft = focusTime * 60;

            startButton.disabled = false;

            pauseButton.textContent = "Pausar";

            endSessionButton.style.display = "none";

        } else {

            timeLeft = focusTime * 60;

        }

    }

    updateTimer();
    updateSessionInfo();

}

startButton.addEventListener("click", () => {

    if (interval) return;

    sessionStarted = true;

    startButton.disabled = true;

    endSessionButton.style.display = "block";

    startTimer();

});

pauseButton.addEventListener("click", () => {

    if (!sessionStarted) return;

    if (interval) {

        clearInterval(interval);

        interval = null;

        pauseButton.textContent = "Continuar";

    } else {

        startTimer();

        pauseButton.textContent = "Pausar";

    }

});

resetButton.addEventListener("click", () => {

    clearInterval(interval);
    interval = null;

    sessionStarted = false;

    if (isBreak) {

        timeLeft = breakTime * 60;

    } else {

        timeLeft = focusTime * 60;

    }

    updateTimer();

    startButton.disabled = false;

    pauseButton.textContent = "Pausar";

});

customizeButton.addEventListener("click", () => {

    modal.style.display = "flex";

});

cancelSettings.addEventListener("click", () => {

    modal.style.display = "none";

});

saveSettings.addEventListener("click", () => {

    focusTime = Number(focusInput.value);
    breakTime = Number(breakInput.value);
    totalCycles = Number(cycleInput.value);

    currentCycle = 1;
    isBreak = false;
    timeLeft = focusTime * 60;

    updateTimer();
    updateSessionInfo();

    saveData();


    modal.style.display = "none";

});

loadData();

updateTimer();
updateSessionInfo();
updateVolumeSlider();
updateXP();

endSessionButton.addEventListener("click", () => {

    confirmModal.style.display = "flex";

});

cancelEnd.addEventListener("click", () => {

    confirmModal.style.display = "none";

});

confirmEnd.addEventListener("click", () => {

    clearInterval(interval);

    interval = null;

    sessionStarted = false;

    currentCycle = 1;

    isBreak = false;

    timeLeft = focusTime * 60;

    startButton.disabled = false;

    pauseButton.textContent = "Pausar";

    // Esconde o botão
    endSessionButton.style.display = "none";

    mascotMessage.textContent =
        "Miau! Vamos focar mais um pouquinho? 🐾";

    updateTimer();

    updateSessionInfo();

    confirmModal.style.display = "none";

});

function stopAllAudios() {

    rainAudio.pause();
    cafeAudio.pause();
    oceanAudio.pause();
    forestAudio.pause();

    rainAudio.currentTime = 0;
    cafeAudio.currentTime = 0;
    oceanAudio.currentTime = 0;
    forestAudio.currentTime = 0;

}

rainButton.addEventListener("click", () => {

    if (!rainAudio.paused) {

        stopAllAudios();

    } else {

        stopAllAudios();
        rainAudio.play();

    }

});

cafeButton.addEventListener("click", () => {

    if (!cafeAudio.paused) {

        stopAllAudios();
    
    } else {

        stopAllAudios();
        cafeAudio.play();
    }

});

oceanButton.addEventListener("click", () => {

    if (!oceanAudio.paused) {

        stopAllAudios();
    
    } else {

        stopAllAudios();
        oceanAudio.play();
    }

});

forestButton.addEventListener("click", () => {

    if (!forestAudio.paused) {

        stopAllAudios();
    
    } else {

        stopAllAudios();
        forestAudio.play();
    }

});

volumeSlider.addEventListener("input", () => {

    const volume = volumeSlider.value / 100;

    rainAudio.volume = volume;
    cafeAudio.volume = volume;
    oceanAudio.volume = volume;
    forestAudio.volume = volume;

    updateVolumeSlider();

});

function updateVolumeSlider() {

    const value = volumeSlider.value;

    volumeSlider.style.background = `
        linear-gradient(
            to right,
            #939C6E 0%,
            #939C6E ${value}%,
            #C9D0AE ${value}%,
            #C9D0AE 100%
        )
    `;

}

addMissionButton.addEventListener("click", () => {

    missionInput.value = "";

    missionModal.style.display = "flex";

});

cancelMission.addEventListener("click", () => {

    missionModal.style.display = "none";

});

saveMission.addEventListener("click", () => {

    const missionName = missionInput.value.trim();

    if (missionName === "") return;

    const mission = document.createElement("label");

    mission.className = "mission";

    mission.innerHTML = `
        <input type="checkbox">

        <span>${missionName}</span>

        <button class="delete-mission">
        🗑️
        </button>
    `;

    missionsList.appendChild(mission);

    const checkbox = mission.querySelector("input");

    checkbox.addEventListener("change", () => {

        if (checkbox.checked && !checkbox.dataset.rewarded) {

            addXP(10);

            checkbox.dataset.rewarded = "true";

        }

        });

    const deleteButton = mission.querySelector(".delete-mission");

    deleteButton.addEventListener("click", () => {

        mission.remove();

    });

    missionModal.style.display = "none";

});

closeLevelModal.addEventListener("click", () => {

    levelModal.style.display = "none";

});

function addXP(amount) {

    xp += amount;

    let maxXP = level * 50 + 50;

    while (xp >= maxXP) {

        xp -= maxXP;

        level++;

        nori.classList.add("level-up");

        setTimeout(() => {

            nori.classList.remove("level-up");

        }, 800);

        levelMessage.textContent =
            `🎉 Nori alcançou o nível ${level}! Continue estudando para evoluir ainda mais!`;

        levelModal.style.display = "flex";

        maxXP = level * 50 + 50;

    }

    updateXP();
    saveData();

}

function saveData() {

    const data = {

        level: level,
        xp: xp,

        focusTime: focusTime,
        breakTime: breakTime,
        totalCycles: totalCycles

    };


    localStorage.setItem(
        "focusflow-data",
        JSON.stringify(data)
    );

}

function loadData() {

    const savedData = localStorage.getItem("focusflow-data");


    if (!savedData) return;


    const data = JSON.parse(savedData);


    level = data.level;
    xp = data.xp;

    focusTime = data.focusTime;
    breakTime = data.breakTime;
    totalCycles = data.totalCycles;


    updateXP();

}