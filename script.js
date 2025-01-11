let timeLeft;
let timerId = null;
let isWorkTime = true;

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const toggleButton = document.getElementById('toggle-mode');
const modeText = document.getElementById('mode-text');
const subtitle = document.createElement('div');

const WORK_TIME = 25 * 60; // Change 25 to your desired work minutes
const BREAK_TIME = 5 * 60; // Change 5 to your desired break minutes

const breakMusic = new Audio('./audio/musicvideo.mp3');
breakMusic.loop = false;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    // Update the page title with the current time and mode
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const modeString = isWorkTime ? 'Work' : 'Break';
    document.title = `${timeString} - ${modeString} - Pomodoro`;
}

function toggleMode() {
    isWorkTime = !isWorkTime;
    toggleButton.classList.toggle('active');
    
    // Toggle dark mode
    document.body.classList.toggle('dark-mode', isWorkTime);
    
    // Handle music
    if (!isWorkTime) {
        // Break time - start music
        breakMusic.pause();  // Stop any existing playback
        breakMusic.currentTime = 0;  // Reset to start
        breakMusic.loop = false;  // Extra guarantee of no looping
        breakMusic.play()
            .then(() => {
                console.log('Music started successfully');
            })
            .catch(error => {
                console.error("Audio play failed:", error);
            });
    } else {
        // Work time - stop music
        breakMusic.pause();
        breakMusic.currentTime = 0;
    }
    
    // Update text and time
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    subtitle.textContent = isWorkTime ? 'Time to focus!' : 'Time to rest!';
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    updateDisplay();
}

function startTimer() {
    if (timerId === null) {
        if (!timeLeft) {
            timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
        }
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                celebrateCompletion();
                toggleMode();
                startTimer();
            }
        }, 1000);
        startButton.disabled = true;
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
    startButton.disabled = false;
    celebrateCompletion();
}

function celebrateCompletion() {
    const fireworksCount = 10; // Reduced to 10 fireworks
    
    const fireworksContainer = document.createElement('div');
    fireworksContainer.style.position = 'fixed'; // Back to fixed for full-screen coverage
    fireworksContainer.style.top = '0';
    fireworksContainer.style.left = '0';
    fireworksContainer.style.width = '100%';
    fireworksContainer.style.height = '100%';
    fireworksContainer.style.pointerEvents = 'none';
    document.body.appendChild(fireworksContainer);

    for (let i = 0; i < fireworksCount; i++) {
        const particle = document.createElement('div');
        // Random position
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 60 + 20; // Keep within visible area
        const randomSize = Math.random() * 1.5 + 0.5; // Random size between 0.5 and 2
        
        particle.className = 'firework-particle';
        particle.style.left = `${randomX}%`;
        particle.style.top = `${randomY}%`;
        particle.style.transform = `scale(${randomSize})`;
        fireworksContainer.appendChild(particle);

        // Create random number of particles for each firework
        const particleCount = Math.floor(Math.random() * 20) + 10;
        for (let j = 0; j < particleCount; j++) {
            const subParticle = document.createElement('div');
            subParticle.className = 'firework-particle';
            subParticle.style.setProperty('--rotation', `${(360 / particleCount) * j}deg`);
            particle.appendChild(subParticle);
        }
    }

    setTimeout(() => {
        fireworksContainer.remove();
    }, 1000);
}

function createFirework(x, y, isBig = false) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    
    // More particles for the big firework
    const particleCount = isBig ? 90 : 60;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firework-particle';
        if (isBig) {
            particle.classList.add('big-particle');
        }
        
        const rotation = (360 / particleCount) * i;
        particle.style.setProperty('--rotation', `${rotation}deg`);
        
        firework.appendChild(particle);
    }
    
    document.body.appendChild(firework);
    
    setTimeout(() => {
        firework.remove();
    }, 800);
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
toggleButton.addEventListener('click', toggleMode);

// Initialize with work mode
isWorkTime = true;
timeLeft = WORK_TIME;
modeText.textContent = 'Work Time';
toggleButton.textContent = "";
updateDisplay();

subtitle.className = 'subtitle';
modeText.parentNode.insertBefore(subtitle, modeText.nextSibling);

subtitle.textContent = 'Time to focus!'; 