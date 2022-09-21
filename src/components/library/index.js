
const importFn = require.context('./', false, /\.vue$/)
export default {
  install (app) {
    importFn.keys().forEach(path => {
      const component = importFn(path).default
      app.component(component.name, component)
    })
  }
}
