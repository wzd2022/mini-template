const {
  envVersion: env,
  appId
} = wx.getAccountInfoSync().miniProgram;

let apiUrl = 'https://xxx.xxx.xxx'

export {
  appId,
  apiUrl,
  env
}