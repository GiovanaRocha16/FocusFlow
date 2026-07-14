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

let focusTime = 25;
let breakTime = 5;
let totalCycles = 4;

let currentCycle = 1;
let isBreak = false;

let timeLeft = focusTime * 60;

let interval = null;
let sessionStarted = false;

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
            sessionStarted = false;

            mascotMessage.textContent =
                "🎉 Miau! Parabéns! Você concluiu todos os ciclos!";

            currentCycle = 1;
            isBreak = false;
            timeLeft = focusTime * 60;

            startButton.disabled = false;

            pauseButton.textContent = "Pausar";

            endSessionButton.style.display = "none";

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

    modal.style.display = "none";

});

updateTimer();
updateSessionInfo();

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