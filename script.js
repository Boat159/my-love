/* ============================================
   Valentine's Day Surprise — Script
   ============================================ */

// --- Password Logic ---
const SECRET_CODE = '05022026';
let currentInput = '';
const maxLength = 8;

const codeDisplay = document.getElementById('codeDisplay');
const codeDots = Array.from(codeDisplay.querySelectorAll('.code-dot'));
const errorMsg = document.getElementById('errorMsg');
const numpad = document.getElementById('numpad');
const passwordPage = document.getElementById('password-page');
const surprisePage = document.getElementById('surprise-page');
const heartBurst = document.getElementById('heartBurst');

// --- Numpad Event ---
numpad.addEventListener('click', (e) => {
    const btn = e.target.closest('.numpad-btn');
    if (!btn) return;

    const val = btn.dataset.val;

    if (val === 'back') {
        // Remove last digit
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
            clearError();
        }
    } else if (val === 'enter') {
        // Check password
        checkPassword();
    } else {
        // Add digit
        if (currentInput.length < maxLength) {
            currentInput += val;
            updateDisplay();
            clearError();

            // Auto-submit when 8 digits entered
            if (currentInput.length === maxLength) {
                setTimeout(() => checkPassword(), 300);
            }
        }
    }

    // Button press animation
    btn.style.transform = 'translate(2px, 2px)';
    setTimeout(() => {
        btn.style.transform = '';
    }, 100);
});

function updateDisplay() {
    codeDots.forEach((dot, i) => {
        if (i < currentInput.length) {
            dot.textContent = currentInput[i];
            dot.classList.add('filled');
            dot.classList.remove('error');
        } else {
            dot.textContent = '';
            dot.classList.remove('filled', 'error');
        }
    });
}

function clearError() {
    errorMsg.textContent = '';
    errorMsg.style.opacity = '0';
}

function checkPassword() {
    if (currentInput === SECRET_CODE) {
        // Correct! 🎉
        codeDots.forEach(d => {
            d.classList.add('filled');
            d.style.borderColor = '#4caf50';
            d.style.background = '#e8f5e9';
        });

        // Trigger heart burst
        triggerHeartBurst();

        // Transition to surprise page
        setTimeout(() => {
            passwordPage.classList.remove('active');
            surprisePage.classList.add('active');
            // Smooth fade in
            setTimeout(() => {
                surprisePage.style.opacity = '1';
            }, 100);
            // Scroll to top
            window.scrollTo(0, 0);
        }, 1200);

    } else {
        // Wrong password
        errorMsg.textContent = 'Try again, my love 💔';
        errorMsg.style.opacity = '1';
        codeDots.forEach(d => d.classList.add('error'));

        // Shake animation
        codeDisplay.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            codeDisplay.style.animation = '';
            currentInput = '';
            updateDisplay();
        }, 800);
    }
}

// --- Heart Burst Effect ---
function triggerHeartBurst() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '♥️', '🌹', '✨'];
    const count = 20;

    for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.className = 'burst-heart';
        el.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const angle = (Math.PI * 2 * i) / count;
        const distance = 120 + Math.random() * 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        el.style.setProperty('--tx', tx + 'px');
        el.style.setProperty('--ty', ty + 'px');
        el.style.animationDelay = (Math.random() * 0.3) + 's';
        el.style.fontSize = (20 + Math.random() * 20) + 'px';

        heartBurst.appendChild(el);
    }

    // Clean up
    setTimeout(() => {
        heartBurst.innerHTML = '';
    }, 1500);
}

// --- Floating Hearts Background ---
function createFloatingHeart() {
    const container = document.getElementById('heartsContainer');
    const heart = document.createElement('span');
    heart.className = 'floating-heart';

    const hearts = ['♥', '♡', '💕', '💗'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

    heart.style.left = Math.random() * 100 + '%';
    heart.style.fontSize = (14 + Math.random() * 18) + 'px';
    heart.style.color = `hsl(${340 + Math.random() * 30}, ${60 + Math.random() * 30}%, ${60 + Math.random() * 20}%)`;

    const duration = 6 + Math.random() * 8;
    heart.style.animationDuration = duration + 's';

    container.appendChild(heart);

    // Remove after animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Spawn hearts at interval
setInterval(createFloatingHeart, 800);

// Create initial batch
for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingHeart, i * 300);
}

// --- Background Music (Auto-play) ---
const bgMusic = document.getElementById('bgMusic');

function playMusic() {
    bgMusic.play().then(() => {
        // Auto-play started
    }).catch(() => {
        // Auto-play blocked, wait for interaction
        document.body.addEventListener('click', () => {
            bgMusic.play();
        }, { once: true });
    });
}

// Try to play immediately
playMusic();

// --- Keyboard Support ---
document.addEventListener('keydown', (e) => {
    if (!passwordPage.classList.contains('active')) return;

    if (e.key >= '0' && e.key <= '9') {
        if (currentInput.length < maxLength) {
            currentInput += e.key;
            updateDisplay();
            clearError();
            if (currentInput.length === maxLength) {
                setTimeout(() => checkPassword(), 300);
            }
        }
    } else if (e.key === 'Backspace') {
        if (currentInput.length > 0) {
            currentInput = currentInput.slice(0, -1);
            updateDisplay();
            clearError();
        }
    } else if (e.key === 'Enter') {
        checkPassword();
    }
});

// ============================================
//   CAROUSEL
// ============================================
const carouselTrack = document.getElementById('carouselTrack');
const carouselSlides = carouselTrack ? Array.from(carouselTrack.children) : [];
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const carouselDotsContainer = document.getElementById('carouselDots');
let currentSlide = 0;

function initCarousel() {
    if (!carouselTrack || carouselSlides.length === 0) return;

    // Create dots
    carouselSlides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        carouselDotsContainer.appendChild(dot);
    });

    carouselPrev.addEventListener('click', () => {
        goToSlide(currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1);
    });

    carouselNext.addEventListener('click', () => {
        goToSlide(currentSlide === carouselSlides.length - 1 ? 0 : currentSlide + 1);
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left → next
                goToSlide(currentSlide === carouselSlides.length - 1 ? 0 : currentSlide + 1);
            } else {
                // Swipe right → prev
                goToSlide(currentSlide === 0 ? carouselSlides.length - 1 : currentSlide - 1);
            }
        }
    }, { passive: true });
}

function goToSlide(index) {
    currentSlide = index;
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    const dots = carouselDotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
    });
}

initCarousel();

