import { defineStore } from 'pinia'

export const useViewerStore = defineStore('viewerData', {
  state: () => {
    return {
      isViewer: false // 三维初始化标志
    }
  },
  actions: {
    setIsViewer () {
      this.isViewer = !this.isViewer
    }
  },
  getters: {

  }
})
