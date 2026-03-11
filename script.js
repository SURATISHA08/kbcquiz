// Question Database by Levels
const questionsByLevel = {
    1: [ // Easy
        {q:"What is the capital of India?",options:["Delhi","Mumbai","Kolkata","Chennai"],answer:0},
        {q:"Which animal is known as 'Ship of the Desert'?",options:["Horse","Camel","Elephant","Cow"],answer:1},
        {q:"How many days are there in a week?",options:["5","6","7","8"],answer:2},
        {q:"Which color is obtained by mixing Red and Blue?",options:["Purple","Green","Orange","Yellow"],answer:0},
        {q:"What is 5 + 3?",options:["6","7","8","9"],answer:2}
    ],
    2: [ // Medium
        {q:"Which language runs in a browser?",options:["Java","Python","JavaScript","C++"],answer:2},
        {q:"Who is Prime Minister of India?",options:["Narendra Modi","Rahul Gandhi","Amit Shah","Arvind Kejriwal"],answer:0},
        {q:"Which company created JavaScript?",options:["Microsoft","Netscape","Google","Apple"],answer:1},
        {q:"What is the largest planet in our solar system?",options:["Earth","Mars","Jupiter","Saturn"],answer:2},
        {q:"Which festival is known as Festival of Lights?",options:["Holi","Diwali","Eid","Christmas"],answer:1}
    ],
    3: [ // Hard
        {q:"Who is the CEO of Tesla?",options:["Jeff Bezos","Elon Musk","Bill Gates","Steve Jobs"],answer:1},
        {q:"What is the chemical symbol for Gold?",options:["Go","Gd","Au","Ag"],answer:2},
        {q:"Which planet is known as the Red Planet?",options:["Venus","Mars","Jupiter","Mercury"],answer:1},
        {q:"What is the square root of 144?",options:["10","11","12","13"],answer:2},
        {q:"Who wrote 'Romeo and Juliet'?",options:["Charles Dickens","William Shakespeare","Jane Austen","Mark Twain"],answer:1}
    ],
    4: [ // Expert
        {q:"What is the speed of light?",options:["3×10⁶ m/s","3×10⁸ m/s","3×10⁴ m/s","3×10² m/s"],answer:1},
        {q:"Which programming language is known as the 'language of the web'?",options:["Python","Java","JavaScript","C"],answer:2},
        {q:"What is the capital of Australia?",options:["Sydney","Melbourne","Canberra","Perth"],answer:2},
        {q:"Who discovered penicillin?",options:["Marie Curie","Alexander Fleming","Isaac Newton","Albert Einstein"],answer:1},
        {q:"What is the powerhouse of the cell?",options:["Nucleus","Ribosome","Mitochondria","Golgi body"],answer:2}
    ],
    5: [ // Champion
        {q:"What is the value of Pi (approximately)?",options:["3.14","3.41","2.14","4.13"],answer:0},
        {q:"Which gas do plants absorb from the atmosphere?",options:["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"],answer:2},
        {q:"Who developed the Theory of Relativity?",options:["Newton","Einstein","Hawking","Bohr"],answer:1},
        {q:"What is the hardest natural substance on Earth?",options:["Gold","Iron","Diamond","Platinum"],answer:2},
        {q:"In what year did World War II end?",options:["1943","1944","1945","1946"],answer:2}
    ]
};

const levelNames = ["Beginner", "Apprentice", "Expert", "Master", "Champion"];
const moneyLevels = [1000, 5000, 10000, 25000, 50000];

let currentLevel = 1;
let currentQuestionIndex = 0;
let currentMoney = 0;
let fiftyFiftyUsed = false;
let skipUsed = false;
let questions = [];

// DOM Elements
const questionElement = document.getElementById("questionText");
const qNumElement = document.getElementById("qNum");
const resultElement = document.getElementById("result");
const moneyLadder = document.getElementById("moneyLadder");
const levelNumber = document.getElementById("levelNumber");
const progressBar = document.getElementById("progressBar");
const levelModal = document.getElementById("levelModal");
const gameOverModal = document.getElementById("gameOverModal");
const victoryModal = document.getElementById("victoryModal");
const fiftyFiftyBtn = document.getElementById("fiftyFifty");
const skipBtn = document.getElementById("skipBtn");

// Initialize Game
function initGame() {
    currentLevel = 1;
    currentQuestionIndex = 0;
    currentMoney = 0;
    fiftyFiftyUsed = false;
    skipUsed = false;
    questions = [...questionsByLevel[1]];
    
    fiftyFiftyBtn.disabled = false;
    skipBtn.disabled = false;
    
    loadLevel();
    createParticles();
}

// Load Level
function loadLevel() {
    levelNumber.innerText = currentLevel;
    questions = [...questionsByLevel[currentLevel]];
    currentQuestionIndex = 0;
    
    // Update progress bar
    const progress = (currentLevel / 5) * 100;
    progressBar.style.width = progress + "%";
    
    buildMoneyLadder();
    loadQuestion();
}

// Build Money Ladder
function buildMoneyLadder() {
    moneyLadder.innerHTML = "";
    for(let i = moneyLevels.length - 1; i >= 0; i--) {
        let div = document.createElement("div");
        div.innerText = "₹" + moneyLevels[i];
        div.id = "money-" + i;
        if(i === currentQuestionIndex) {
            div.classList.add("active");
        }
        if(i < currentQuestionIndex) {
            div.classList.add("reached");
        }
        moneyLadder.appendChild(div);
    }
}

// Load Question
function loadQuestion() {
    const data = questions[currentQuestionIndex];
    
    // Animate question
    const questionContainer = document.getElementById("question");
    questionContainer.style.animation = "none";
    questionContainer.offsetHeight; // Trigger reflow
    questionContainer.style.animation = "slideIn 0.5s ease-out";
    
    questionElement.innerText = data.q;
    qNumElement.innerText = (currentQuestionIndex + 1);
    
    // Reset and animate options
    for(let i = 0; i < 4; i++) {
        const btn = document.getElementById("opt" + i);
        btn.innerText = data.options[i];
        btn.style.display = "block";
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
        
        // Re-trigger animation
        btn.style.animation = "none";
        btn.offsetHeight;
        btn.style.animation = `fadeInUp 0.5s ease-out backwards`;
        btn.style.animationDelay = (i * 0.1) + "s";
    }
    
    resultElement.innerText = "";
    resultElement.className = "result";
}

// Check Answer
function checkAnswer(selectedIndex) {
    const data = questions[currentQuestionIndex];
    const correctIndex = data.answer;
    const buttons = document.querySelectorAll(".option");
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    if(selectedIndex === correctIndex) {
        // Correct Answer
        buttons[selectedIndex].classList.add("correct");
        currentMoney = moneyLevels[currentQuestionIndex];
        resultElement.innerText = "Correct! You won ₹" + currentMoney;
        resultElement.className = "result correct";
        
        // Update money ladder
        document.getElementById("money-" + currentQuestionIndex).classList.add("reached");
        
        // Confetti for correct answer
        createConfetti();
        
        setTimeout(() => {
            currentQuestionIndex++;
            
            if(currentQuestionIndex >= questions.length) {
                // Level Complete
                if(currentLevel < 5) {
                    showLevelComplete();
                } else {
                    // Victory!
                    showVictory();
                }
            } else {
                loadQuestion();
            }
        }, 1500);
    } else {
        // Wrong Answer
        buttons[selectedIndex].classList.add("wrong");
        buttons[correctIndex].classList.add("correct");
        resultElement.innerText = "Wrong Answer! Game Over.";
        resultElement.className = "result wrong";
        
        setTimeout(() => {
            showGameOver();
        }, 1500);
    }
}

// 50:50 Lifeline
function fiftyFifty() {
    if(fiftyFiftyUsed) return;
    
    fiftyFiftyUsed = true;
    fiftyFiftyBtn.disabled = true;
    
    const data = questions[currentQuestionIndex];
    const correctIndex = data.answer;
    const buttons = document.querySelectorAll(".option");
    
    // Get indices to hide (wrong answers)
    let indices = [0, 1, 2, 3].filter(i => i !== correctIndex);
    // Shuffle and take 2
    indices = indices.sort(() => Math.random() - 0.5).slice(0, 2);
    
    indices.forEach(i => {
        buttons[i].style.display = "none";
    });
}

// Skip Question
function skipQuestion() {
    if(skipUsed) return;
    
    skipUsed = true;
    skipBtn.disabled = true;
    
    // Mark current as reached but don't add money
    document.getElementById("money-" + currentQuestionIndex).classList.add("reached");
    
    currentQuestionIndex++;
    
    if(currentQuestionIndex >= questions.length) {
        if(currentLevel < 5) {
            showLevelComplete();
        } else {
            showVictory();
        }
    } else {
        loadQuestion();
    }
}

// Show Level Complete Modal
function showLevelComplete() {
    document.getElementById("levelTitle").innerText = `Level ${currentLevel} Complete! 🎉`;
    document.getElementById("levelMessage").innerText = `You've earned ₹${currentMoney}. Get ready for Level ${currentLevel + 1}!`;
    levelModal.classList.add("show");
    createConfetti();
}

// Continue to Next Level
function continueGame() {
    levelModal.classList.remove("show");
    currentLevel++;
    fiftyFiftyUsed = false;
    skipUsed = false;
    fiftyFiftyBtn.disabled = false;
    skipBtn.disabled = false;
    loadLevel();
}

// Show Game Over Modal
function showGameOver() {
    document.getElementById("finalScore").innerText = `You won: ₹${currentMoney}`;
    gameOverModal.classList.add("show");
}

// Show Victory Modal
function showVictory() {
    document.getElementById("totalWinnings").innerText = `Total: ₹${moneyLevels[4] * 5}`;
    victoryModal.classList.add("show");
    createConfetti();
}

// Restart Game
function restartGame() {
    gameOverModal.classList.remove("show");
    victoryModal.classList.remove("show");
    initGame();
}

// Create Floating Particles
function createParticles() {
    const container = document.getElementById("particles");
    container.innerHTML = "";
    
    for(let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.animationDelay = Math.random() * 15 + "s";
        particle.style.animationDuration = (10 + Math.random() * 10) + "s";
        
        // Random colors
        const colors = ["rgba(255,215,0,0.6)", "rgba(255,165,0,0.6)", "rgba(255,255,255,0.4)", "rgba(46,204,113,0.5)"];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
    }
}

// Create Confetti
function createConfetti() {
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti";
    document.body.appendChild(confettiContainer);
    
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    
    for(let i = 0; i < 50; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = Math.random() * 0.5 + "s";
        piece.style.animationDuration = (2 + Math.random() * 2) + "s";
        
        // Random shapes
        const shapes = ["50%", "0"];
        piece.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
        
        confettiContainer.appendChild(piece);
    }
    
    // Remove after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 4000);
}

// Add click handlers to options
for(let i = 0; i < 4; i++) {
    document.getElementById("opt" + i).onclick = function() {
        checkAnswer(i);
    };
}

// Start the game
initGame();
