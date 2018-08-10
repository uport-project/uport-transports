import * as ui from '../src/transport/ui'

function createButton(text, clickHandler) {
  let button = document.createElement('button')
  button.innerHTML = text
  button.addEventListener('click', clickHandler)
  document.body.appendChild(button)
}

createButton('Push Modal', () => {
  ui.notifyPushSent('abc', 'def')
})

createButton('QR modal', () => {
  ui.open([,,,].join('a bunch of data for a qr'), ui.close, 'APP')
})

createButton('Success Modal', () => {
  ui.success()
})

createButton('Failure Modal', () => {
  ui.failure()
})