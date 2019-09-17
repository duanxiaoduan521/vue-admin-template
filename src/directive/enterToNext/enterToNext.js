/**
 * How to use
 * el-dilalog，只需在el-form中指定v-enterToNext，后面的【=”true"】其实可能省略
 * <el-from :model ="form" v-enterToNext="true">
 * */

export default {
  inserted: function(el) {
    // let frm = el.querySelector('.el-form');
    const inputs = el.querySelectorAll('input')
    // 绑定回写事件
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].setAttribute('keyfocusindex', i)
      inputs[i].addEventListener('keyup', (ev) => {
        if (ev.keyCode === 13) {
          const targetTo = ev.srcElement.getAttribute('keyfocusto')
          console.log(ev.srcElement)
          if (targetTo) {
            var ctlJ = parseInt(targetTo)
            if (ctlJ < inputs.length) { inputs[ctlJ].focus() }
          } else {
            var attrIndex = ev.srcElement.getAttribute('keyfocusindex')
            var ctlI = parseInt(attrIndex)
            if (ctlI < inputs.length - 1) { inputs[ctlI + 1].focus() }
          }
        }
      })
    }
  }
}
