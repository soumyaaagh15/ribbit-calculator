
//  FROG CALCULATOR — script.js
// ============================================

const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const restartBtn = document.querySelector('.res');
const frogSound = new Audio("ribbit.mp3");

frogSound.volume = 0.15;

let currentInput  = '';   // what the user is currently typing
let previousInput = '';   // the stored first operand
let operator      = null; // pending operator
let justEvaluated = false;// true right after pressing "="

// ── Update the display ──────────────────────
function updateDisplay(value) {
  // Clamp to 12 characters to avoid overflow
  const text = String(value);
  display.textContent = text.length > 12 ? parseFloat(text).toExponential(4) : text;
}

// ── Handle number / decimal input ───────────
function inputDigit(digit) {
  // After an evaluation, start fresh
  if (justEvaluated) {
    currentInput  = '';
    justEvaluated = false;
  }

  // Prevent multiple decimals
  if (digit === '.' && currentInput.includes('.')) return;

  // Prevent leading zeros like "007"
  if (digit !== '.' && currentInput === '0') {
    currentInput = digit;
  } else {
    currentInput += digit;
  }

  updateDisplay(currentInput);
}

// ── Handle operator input ────────────────────
function inputOperator(op) {
  if (currentInput === '' && previousInput === '') return;

  // Chain operations: evaluate before storing new operator
  if (currentInput !== '' && previousInput !== '') {
    evaluate();
    // evaluate() sets currentInput to result & clears previousInput
    updateDisplay(previousInput);

  }

  operator      = op;
  previousInput = currentInput !== '' ? currentInput : previousInput;
  currentInput  = '';
  justEvaluated = false;
}

// ── Evaluate the expression ──────────────────
function evaluate() {
  if (operator === null || previousInput === '') return;

  // If user pressed "=" without typing a second number, reuse previousInput
  const a = parseFloat(previousInput);
  const b = currentInput !== '' ? parseFloat(currentInput) : a;

  let result;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/':
      if (b === 0) {
        updateDisplay('Error');
        currentInput  = '';
        previousInput = '';
        operator      = null;
        return;
      }
      result = a / b;
      break;
    default: return;
  }

  // Round floating-point noise (e.g. 0.1+0.2 = 0.3 not 0.30000...4)
  result = parseFloat(result.toPrecision(10));

  updateDisplay(result);
  currentInput  = String(result);
  previousInput = '';
  operator      = null;
  justEvaluated = true;
}

// ── Clear / Reset ────────────────────────────
function clearAll() {
  currentInput  = '';
  previousInput = '';
  operator      = null;
  justEvaluated = false;
  updateDisplay('0');
}

// ── Button click handler ─────────────────────
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Ripple animation
    btn.classList.remove('pressed');
    void btn.offsetWidth; // reflow trick to restart animation
    btn.classList.add('pressed');

    const value = btn.dataset.value;
    if (soundEnabled) {
    frogSound.currentTime = 0;
    frogSound.play();
}

    if (btn.classList.contains('eq')) {
      evaluate();
      return;
    }

    if (btn.classList.contains('op')) {
      inputOperator(value);
      return;
    }

    // Number or decimal
    inputDigit(value);
    restartBtn.addEventListener('click', () => {
  clearAll();
});
  });
});

// ── Keyboard support ─────────────────────────
document.addEventListener('keydown', e => {
  const key = e.key;

  if (key >= '0' && key <= '9') { inputDigit(key); return; }
  if (key === '.')               { inputDigit('.'); return; }
  if (key === '+')               { inputOperator('+'); return; }
  if (key === '-')               { inputOperator('-'); return; }
  if (key === '*')               { inputOperator('*'); return; }
  if (key === '/')               { e.preventDefault(); inputOperator('/'); return; }
  if (key === 'Enter' || key === '=') { evaluate(); return; }
  if (key === 'Escape' || key === 'c' || key === 'C') { clearAll(); return; }
  if (key === 'Backspace') {
    if (justEvaluated) { clearAll(); return; }
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || '0');
  }
});
//sound button
const soundToggle =
document.getElementById("soundToggle");
let soundEnabled = true;
soundToggle.addEventListener("click", () => {

    soundEnabled = !soundEnabled;

    if (soundEnabled) {
        soundToggle.textContent =
        "🔊 Sound ON";
    } else {
        soundToggle.textContent =
        "🔇 Sound OFF";
    }
});
