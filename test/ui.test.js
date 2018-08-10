import * as ui from '../src/transport/ui'

const TOKEN = [,,,].join('a bunch of data for a qr')

function createButton(text, clickHandler) {
  let button = document.createElement('button')
  button.innerHTML = text
  button.addEventListener('click', clickHandler)
  document.body.appendChild(button)
}

createButton('Push Modal', () => {
  ui.notifyPushSent(() => ui.open(TOKEN, undefined, 'Scan QR Code Instead:'))
})

createButton('QR modal', () => {
  ui.open(TOKEN, ui.close, 'APP')
})

createButton('Success Modal', () => {
  ui.success()
})

createButton('Failure Modal', () => {
  ui.failure()
})