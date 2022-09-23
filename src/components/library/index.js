
// const importFn = require.context('./', false, /\.vue$/)
// const importFn = import.meta.globEager('./', false, /\.vue$/)
const importFn = import.meta.glob('./*.vue')

// console.log(importFn)
// const model = null

export default {
  install (app) {
    // importFn.keys().forEach(path => {
    //   const component = importFn(path)
    //   app.component(component.name, component)
    // })
    for (const path in importFn) {
      importFn[path]().then((mod) => {
        app.component(mod.default.name, mod.default)
        // console.log(path)
        // console.log(mod.default.name)
      })
    }
  }
}
