import SVG from './assets'
import { uportModalNewUserFooterAppStoresCSS, uportModalNewUserFooterCSS, uportModalNewUserFooterTitleCSS, animateCSS, uportQRIMG, uportModalHeaderCloseCSS, uportModalHeaderCSS, uportQRInstructions, uportQRCSS, uportAppName, uportQRTextWithAppName, uportModalLogo, uportModalCSS, uportModalContinueBtn, uportModalIntroWrapper, uportModalNewUserFooterAppStoresiOSCSS, uportModalNewUserFooterAppStoresAndroidCSS } from './styles'

const apppleStoreLink = 'https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8'
const googleStoreLink = 'https://play.google.com/store/apps/details?id=com.uportMobile'

/**
 *  Modal skeleton
 *
 *  @param    {String}     innerHTML    content of modal
 */
export const uportModal = (innerHTML) => `
  <div id="uport-qr" style="${uportQRCSS}">
    <div style="${uportModalCSS}" class="animated fadeIn">
      <div style="${uportModalHeaderCSS}">
        <div id="uport-qr-cancel" style="${uportModalHeaderCloseCSS}">
          <img src="${SVG.close}" />
        </div>
      </div>
      <div>
        ${innerHTML}
      </div>
    </div>
    ${animateCSS}
  </div>
`

const loginText = (appName) => appName && appName !== 'uport-connect-app'
  ? `<span>Login to </span><span style="${uportAppName}">${appName}</span>`
  : `<span>Login</span>`

/**
 *  The first content you will see in the modal
 *
 *  @param    {String}     appNamme  Name of users uPort App
 *  @return   {Object}     populated modal
 */
export const loginModal = (appName) => uportModal(`
  <div style="${uportModalIntroWrapper}">
    <div>
      <p id="uport-qr-text" style="${uportQRTextWithAppName}">
        ${loginText(appName)}
      </p>
    </div>
    <div id="uport-continue-btn" style="${uportModalContinueBtn}">
      <span style="${uportModalLogo}"><img src="${SVG.logo}"/></span>
      <span>&nbsp;&nbsp;</span>
      <span>Continue with uPort</span>
    </div>
  </div>

  <div style="${uportModalNewUserFooterCSS}">
    <p style="${uportModalNewUserFooterTitleCSS}">Don't have uPort? Get it here!</p>
    <div style="${uportModalNewUserFooterAppStoresCSS}">
      <a href="${googleStoreLink}" target="_blank"><div style="${uportModalNewUserFooterAppStoresAndroidCSS}"><img src="${SVG.androidApp}"/></div></a>
      <a href="${apppleStoreLink}" target="_blank"><div style="${uportModalNewUserFooterAppStoresiOSCSS}"><img src="${SVG.appleApp}"/></div></a>
    </div>
  </div>
`)

/**
 *  A html pop over QR display template
 *
 *  @param    {Object}     args
 *  @param    {String}     args.qrImageUri    a image URI for the QR code
 */
export const qrModal = ({qrImageUri}) => uportModal(`
  <div>
    <div style="${uportLogoWithBg}"><img src="${SVG.logoWithBG}"/></div>
    <p id="uport-qr-text" style="${uportQRInstructions}">Scan QR code with uPort Mobile App</p>
    <img src="${qrImageUri}" style="${uportQRIMG}" />
  </div>
`)

/**
 * Modal content for
 */
export const pushModal= uportModal(`
  <div>
    <p style="${uportQRTextWithAppName}">Check Your Device</p><br/>
    <img src="${SVG.push}" style="${uportQRCSS}"/>
    <a href="#" id="push-not-received">Not Receiving the Request?</a>
  </div>
`)

export const successModal = uportModal(`
  <div>
    Success!
    <img src="${SVG.success}" />
  </div>
`)

export const failureModal = uportModal(`
  <div>
    Hmm, something went wrong...
    <img src="${SVG.failure}" />
  </div>
`)
