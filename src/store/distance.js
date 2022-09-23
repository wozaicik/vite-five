import { defineStore } from 'pinia'
import { coorColl, calDisBear } from '../utils/coorTrans'

//   { number: 0, cartesian3: null, lonLat: null, distance: 0, bearing: 0 }
export const useDistanceStore = defineStore('distance', {

  state: () => ({

    length: 1,

    disPositions: []

  }),

  actions: {
    // 对数据进行计算，添加到state.disPositions中
    addPoint (cartesian3) {
      if (this.length >= 3) {
        this.length = 1
        this.disPositions = []
      }

      const { lonLat, gsProj } = coorColl(cartesian3)
      const { distance, bearing } = calDisBear(this.disPositions[0]?.lonLat, lonLat)

      this.disPositions.push({
        number: this.length,
        cartesian3,
        lonLat,
        gsProj,
        distance: distance.toFixed(3),
        bearing: bearing.toFixed(3)
      })
      this.length++
    }

  },

  getters: {
    // 返回两个点的cartesian3坐标数组
    getCar3Array (state) {
      this.state.disPositions.map(item => item.cartesian3)
    }
  }
})
