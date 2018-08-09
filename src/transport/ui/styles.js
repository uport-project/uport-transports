
/**
 *  animateCSS CSS
 */
const animateCSS = `
<style>
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animated {
    animation-duration: 1s;
    animation-fill-mode: both;
  }
  .fadeIn {
    animation-name: fadeIn;
  }
</style>
`

/**
 *  uportQRCSS CSS
 */
const uportQRCSS = `
  position:fixed;
  top: 0;
  width:100%;
  height:100%;
  z-index:100;
  background-color:rgba(0,0,0,0.5);
  text-align:center;
  display: block;
`

/**
 *  uportModalCSS CSS
 */
const uportModalCSS = `
  position:relative;
  top:50%;
  display:inline-block;
  z-index:101;
  background:#fff;
  transform:translateY(-50%);
  margin:0 auto;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 24px 0 rgba(0,0,0,0.1);
  min-width: 400px;
`

/**
 *  uportModalHeaderCSS CSS
 */
const uportModalHeaderCSS = `
  width: 100%;
  height: 45px;
`

/**
 *  uportModalHeaderCloseCSS CSS
 */
const uportModalHeaderCloseCSS = `
  float: right;
  height: 25px;
  width: 25px;
  margin: 15px;
  cursor: pointer;
`

/**
 *  uportModalNewUserFooterCSS CSS
 */
const uportModalNewUserFooterCSS = `
  background-color: #F6F7F8;
  padding: 26px 0;
  min-height: 110px;
`

/**
 *  uportModalNewUserFooterTitleCSS CSS
 */
const uportModalNewUserFooterTitleCSS = `
  font-size: 14px;
  color: #7C828B;
  font-family: Avenir;
`

/**
 *  uportModalNewUserFooterAppStoresCSS CSS
 */
const uportModalNewUserFooterAppStoresCSS = `
  padding: 10px 42px;
`

/**
 *  uportModalNewUserFooterAppStoresAndroidCSS CSS
 */
const uportModalNewUserFooterAppStoresAndroidCSS = `
  width: 128px;
  height: 40px;
  margin-right: 20px;
  display: inline-block;
`

/**
 *  uportModalNewUserFooterAppStoresiOSCSS CSS
 */
const uportModalNewUserFooterAppStoresiOSCSS = `
  width: 128px;
  height: 40px;
  display: inline-block;
`

/**
 *  uportModalLogo CSS
 */
const uportModalLogo = `
  display:inline-block;
  max-width: 50px;
  vertical-align: middle;
`

/**
 *  uportAppName CSS
 */
const uportAppName = `
  font-weight: 700;
`

/**
 *  uportQRTextWithAppName CSS
 */
const uportQRTextWithAppName = `
  font-size: 18px;
  color: #7C828B;
  font-family: Avenir;
`

/**
 *  uportLogoWithBg CSS
 */
const uportLogoWithBg = `
  width: 60px;
  height: 60px;
  margin: 0 auto 0 auto;
`

/**
 *  uportQRInstructions CSS
 */
const uportQRInstructions = `
  color: #7C828B;
  font-family: Avenir;
  font-size: 18px;
  text-align: center;
  margin-top: 0;
`

/**
 *  uportModalIntroWrapper CSS
 */
const uportModalIntroWrapper = `
  text-align: center;
  display: inline-block;
  width: 100%;"
`

/**
 *  uportQRIMG CSS
 */
const uportQRIMG = `
  z-index:102;
  margin-bottom: 35px;
`

/**
 *  uportModalContinueBtn CSS
 */
const uportModalContinueBtn = `
  text-align: center;
  padding: 17px 25px 17px 25px;
  border-radius: 6px;
  color: #fff;
  margin: 75px auto 80px 0;
  font-family: arial, sans-serif;
  font-weight: 500;
  letter-spacing: 0.8px;
  border-color: #4f45af;
  text-shadow: none;
  background-color: #5C50CA;
  background-position: left 18px bottom 11px;
  background-repeat: no-repeat;
  border: 1px solid #ccc;
  cursor: pointer;
  display: inline-block;
  position: relative;
  white-space: nowrap;
  box-sizing: border-box;
  font-size: 16px;
  text-decoration: noneuser-select: none;
  transition: border-color 0.1s linear,background 0.1s linear,color 0.1s linear;
  -o-transition: border-color 0.1s linear,background 0.1s linear,color 0.1s linear;
  -ms-transition: border-color 0.1s linear,background 0.1s linear,color 0.1s linear;
`

export {uportModalNewUserFooterCSS, uportModalNewUserFooterTitleCSS, uportModalNewUserFooterAppStoresCSS, animateCSS, uportQRIMG, uportModalHeaderCloseCSS, uportModalHeaderCSS, uportQRInstructions, uportQRCSS, uportAppName, uportModalLogo, uportModalCSS, uportModalContinueBtn, uportModalIntroWrapper, uportModalNewUserFooterAppStoresiOSCSS, uportModalNewUserFooterAppStoresAndroidCSS, uportQRTextWithAppName}