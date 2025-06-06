const random_quote_api = 'http://api.quotable.io/random'
const wordElement = document.getElementById('words')
const cursorElement = document.getElementById('cursor')
const buttonElement = document.getElementById('skip')
const dropdownButton = document.getElementById('dropdown-button')
const dropdownContent = document.querySelector('.dropdown-content')

let currentSound = null
let currentIndex = 0
let currentQuote = ''
let isTyping = false

// Sound effects
const sounds = {
  key1: document.getElementById('key1'),
  key2: document.getElementById('key2'),
  key3: document.getElementById('key3'),
  key4: document.getElementById('key4'),
  enter: document.getElementById('enter'),
  backspace: document.getElementById('backspace'),
  space: document.getElementById('space')
}

// Prevent spacebar from scrolling
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault()
  }
})

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (!isTyping) return

  const key = e.key
  const characterSpans = wordElement.querySelectorAll('span')
  
  if (key === 'Backspace') {
    if (currentIndex > 0) {
      currentIndex--
      characterSpans[currentIndex].classList.remove('correct', 'incorrect')
      playSound('backspace')
      updateCursorPosition(characterSpans[currentIndex])
    }
  } else if (key === 'Enter') {
    if (currentIndex === currentQuote.length) {
      renderQuote()
      playSound('enter')
    }
  } else if (key.length === 1) {
    if (currentIndex < currentQuote.length) {
      const character = characterSpans[currentIndex]
      if (key === currentQuote[currentIndex]) {
        character.classList.add('correct')
        character.classList.remove('incorrect')
        playSound(key === ' ' ? 'space' : getRandomKeySound())
      } else {
        character.classList.add('incorrect')
        character.classList.remove('correct')
        playSound(key === ' ' ? 'space' : getRandomKeySound())
      }
      currentIndex++
      if (currentIndex < characterSpans.length) {
        updateCursorPosition(characterSpans[currentIndex])
      } else {
        // If we're at the end, position cursor after the last character
        const lastSpan = characterSpans[characterSpans.length - 1]
        updateCursorPosition(lastSpan, true)
      }
    }
  }
})

function updateCursorPosition(element, isEnd = false) {
  const rect = element.getBoundingClientRect()
  const wordRect = wordElement.getBoundingClientRect()
  
  if (isEnd) {
    cursorElement.style.left = `${rect.right - wordRect.left}px`
  } else {
    cursorElement.style.left = `${rect.left - wordRect.left}px`
  }
  cursorElement.style.top = `${rect.top - wordRect.top}px`
}

// Handle dropdown selection
dropdownContent.addEventListener('click', (e) => {
  e.preventDefault()
  if (e.target.tagName === 'A') {
    const soundType = e.target.dataset.sound
    dropdownButton.textContent = e.target.textContent
    currentSound = soundType
  }
})

function getRandomKeySound() {
  const keySounds = ['key1', 'key2', 'key3', 'key4']
  return keySounds[Math.floor(Math.random() * keySounds.length)]
}

function playSound(soundType) {
  if (sounds[soundType]) {
    sounds[soundType].currentTime = 0
    sounds[soundType].play()
  }
}

buttonElement.addEventListener("click", () => {
  renderQuote()
})

function getQuote() {
  return fetch(random_quote_api)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderQuote() {
  const quote = await getQuote()
  currentQuote = quote
  currentIndex = 0
  wordElement.innerHTML = ''
  
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    wordElement.appendChild(characterSpan)
  })
  
  // Position cursor at the start
  const firstSpan = wordElement.querySelector('span')
  if (firstSpan) {
    updateCursorPosition(firstSpan)
  }
  
  isTyping = true
}

renderQuote()

