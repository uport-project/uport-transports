import SVG from './assets'
import modalCSS from './style.css'

const apppleStoreLink = 'https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8'
const googleStoreLink = 'https://play.google.com/store/apps/details?id=com.uportMobile'

/**
 *  Modal skeleton
 *
 *  @param    {String}     innerHTML    content of modal
 */
export const uportModal = (innerHTML) => `
  <div id="uport__modal-bg">
    <div id="uport__modal-content" class="animated fadeIn">
      <div id="uport__modal-header">
        <div id="uport__modal-x">
          <img src="${SVG.close}" />
        </div>
      </div>
      ${innerHTML}
    </div>
    <style>
      ${modalCSS}
    </style>
  </div>
`

// Helper for formatting 'Login to x' -- Currently not used, not sure what to do with it
const loginText = (appName) => appName && appName !== 'uport-connect-app'
  ? `<span>Login to </span><span style="${uportAppName}">${appName}</span>`
  : `<span>Login</span>`

/**
 *  The first content you will see in the modal
 *
 *  @param    {String}     appNamme  Name of users uPort App
 *  @return   {Object}     populated modal
 */
export const qrModal = (qrImageUri, message = "Login") => uportModal(`
  <div id="uport__modal-main">
    <h2 id="uport__qr-text">${message}</h2>
    <div class="uport__modal-section">
      <img src="${qrImageUri}" />
      <p>Scan QR code with uPort Mobile App</p>
    </div>
  </div>

  <div class="uport__modal-section uport__grey">
    <p>Don't have uPort? Get it here!</p>
    <div>
      <a href="${googleStoreLink}" target="_blank"><img src="${SVG.androidApp}"/></a>
      <a href="${apppleStoreLink}" target="_blank"><img src="${SVG.appleApp}"/></a>
    </div>
  </div>
`)

/**
 * Modal content for
 */
export const pushModal = uportModal(`
  <div id="uport__modal-main">
    <h2>Check Your Device</h2>
    <div class="uport__modal-section">
      <img src="${SVG.push}" style=""/>
    </div>
    <div class="uport__modal-section">
      <a href="#" id="uport__push-not-received">Not Receiving the Request?</a>
    </div>
  </div>
`)

export const successModal = uportModal(`
  <div id="uport__modal-main">
    <div class="uport__modal-section">
      Success!
    </div>
    <div class="uport__modal-section">
      <img src="${SVG.success}" />
    </div>
  </div>
`)

export const failureModal = uportModal(`
  <div id="uport__modal-main">
    <div class="uport__modal-section">
      Hmm, something went wrong...
    </div>
    <div class="uport__modal-section">
      <img src="${SVG.failure}" />
    </div>
    <div class="uport__modal-section">
      <button id="uport__failure-retry">Try again?</button>
    </div>
  </div>
`)
