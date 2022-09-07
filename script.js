const random_quote_api = 'http://api.quotable.io/random'
const wordElement = document.getElementById('words')
const inputElement = document.getElementById('box-input')
const buttonElement = document.getElementById('skip')
//const audioElement = document.getElementById()

inputElement.addEventListener('input', () => {
  const arrayQuote = wordElement.querySelectorAll('span')
  const inputValue = inputElement.value.split('')
  let correct = true

  arrayQuote.forEach((characterSpan, index) => {
    const character = inputValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })

  if (correct) renderQuote()
})


buttonElement.addEventListener("click", () => {
  renderQuote();
})


function getQuote() {
  return fetch(random_quote_api)
    .then(response => response.json())
    .then(data => data.content)
}

async function renderQuote() {
  const quote = await getQuote()
  wordElement.innerHTML = ''
  quote.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    wordElement.appendChild(characterSpan)
  })
  inputElement.value = null  
}

renderQuote()

