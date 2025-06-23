let saldo = 100000;
let multiplier = 1.00;
let crashPoint;
let interval;
let isRunning = false;
let isTaruh = false;
let taruhan = 0;

const saldoEl = document.getElementById("saldoValue");
const multiplierEl = document.getElementById("multiplier");
const taruhanInput = document.getElementById("taruhan");
const autoCashInput = document.getElementById("autoCash");
const messageEl = document.getElementById("message");
const riwayatEl = document.getElementById("riwayatList");
const taruhBtn = document.getElementById("taruhBtn");
const ambilBtn = document.getElementById("ambilBtn");
const winSound = document.getElementById("winSound");
const crashSound = document.getElementById("crashSound");
const spacemanEl = document.querySelector(".spaceman");
const botList = document.getElementById("botList");

const bots = ["Andi", "Budi", "Rina", "Dewi", "Agus"];

function updateSaldo() {
  saldoEl.innerText = saldo.toLocaleString("id-ID");
}

function startGame() {
  isRunning = true;
  multiplier = 1.00;
  crashPoint = (Math.random() * 8 + 1).toFixed(2); // antara 1.00 - 9.00
  multiplierEl.innerText = `${multiplier.toFixed(2)}x`;
  messageEl.innerText = "";

  interval = setInterval(() => {
    multiplier += 0.01;
    multiplierEl.innerText = `${multiplier.toFixed(2)}x`;
    spacemanEl.style.bottom = `${(multiplier * 10)}px`;

    if (isTaruh && parseFloat(autoCashInput.value) <= multiplier) {
      cashout();
    }

    if (multiplier >= crashPoint) {
      endGame();
    }
  }, 100);
}

function endGame() {
  clearInterval(interval);
  isRunning = false;

  if (isTaruh) {
    spacemanEl.classList.add("crash");
    crashSound.play();
    messageEl.innerText = `Crash! Gagal di ${multiplier.toFixed(2)}x`;
    isTaruh = false;
    ambilBtn.disabled = true;

    setTimeout(() => {
      spacemanEl.classList.remove("crash");
    }, 800);
  }

  updateRiwayat(multiplier.toFixed(2));
  setTimeout(startGame, 3000);
}

function cashout() {
  if (!isRunning || !isTaruh) return;
  const menang = Math.floor(taruhan * multiplier);
  saldo += menang;
  updateSaldo();
  messageEl.innerText = `Menang! Ambil di ${multiplier.toFixed(2)}x = Rp ${menang.toLocaleString("id-ID")}`;
  winSound.play();
  isTaruh = false;
  ambilBtn.disabled = true;
}

function updateRiwayat(val) {
  const span = document.createElement("span");
  span.innerText = `${val}x`;
  riwayatEl.prepend(span);
  if (riwayatEl.children.length > 10) {
    riwayatEl.removeChild(riwayatEl.lastChild);
  }
}

function placeBet() {
  if (isTaruh || isRunning) return;

  taruhan = parseInt(taruhanInput.value);
  if (isNaN(taruhan) || taruhan < 1000 || taruhan > saldo) {
    messageEl.innerText = "Taruhan tidak valid!";
    return;
  }

  saldo -= taruhan;
  updateSaldo();
  isTaruh = true;
  messageEl.innerText = `Taruhan Rp ${taruhan.toLocaleString("id-ID")} ditempatkan!`;
  ambilBtn.disabled = false;
}

function generateBots() {
  botList.innerHTML = "";
  bots.forEach(bot => {
    const el = document.createElement("li");
    el.innerText = `${bot} memasang taruhan Rp ${((Math.random() * 5000) + 1000).toFixed(0)}`;
    botList.appendChild(el);
  });
}

taruhBtn.addEventListener("click", placeBet);
ambilBtn.addEventListener("click", cashout);

updateSaldo();
generateBots();
startGame();