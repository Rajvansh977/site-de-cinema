
const messages = [
  "Welcome To Site De Cinema",
  "Bienvenido al sitio de cine",
  "Bienvenue sur le site de cinéma",
  "Willkommen auf der Kino-Website",
  "साइट दे सिनेमा में आपका स्वागत है",
  "サイトのシネマへようこそ",
  "欢迎来到电影网站",
  "مرحباً بكم في موقع السينما",
  "시네마 사이트에 오신 것을 환영합니다",
  "bem-vindo ao site de cinema"
];

let index = 0;
let charIndex = 0;
let typingSpeed = 70;
let erasingSpeed = 80;
let delayBetweenWords = 1000;
const typedText = document.getElementById("typed-text");

function type() {
  if (charIndex < messages[index].length) {
    typedText.textContent += messages[index].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase, delayBetweenWords);
  }
}

function erase() {
  if (charIndex > 0) {
    typedText.textContent = messages[index].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingSpeed);
  } else {
    index = (index + 1) % messages.length;
    setTimeout(type, typingSpeed);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  if (messages.length) setTimeout(type, 1000);
});


  document.querySelector('.login-btn').addEventListener('click', async () => {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const response = await fetch('https://7d9ecfef-ccd0-4fe4-beee-1ec5386fd651-00-2w01rh6qni9wb.sisko.replit.dev/login.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      alert('Login successful!');
      window.location.href = '/home.html'; // redirect to home/dashboard page (make one)
    } else {
      alert(data.message || 'Login failed');
    }
  });

