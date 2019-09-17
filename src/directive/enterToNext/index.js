import enterToNext from './enterToNext'

const install = function(Vue) {
  Vue.directive('enterToNext', enterToNext)
}

if (window.Vue) {
  window['enterToNext'] = enterToNext
  Vue.use(install); // eslint-disable-line
}

enterToNext.install = install
export default enterToNext
