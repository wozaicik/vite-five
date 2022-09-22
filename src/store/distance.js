import { defineStore } from 'pinia'
import { coorColl } from '../utils/coorTrans'
import * as turf from '@turf/turf'

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
      const { distance, bearing } = calDisBear(this.disPositions[0], lonLat)

      this.disPositions.push({
        number: this.length,
        cartesian3,
        lonLat,
        gsProj,
        distance,
        bearing
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

/**
 *  计算两个点的距离和方位
 * @param {Object} disPosition 第一个点
 * @param {lonLat} lonLat   第二个点的经纬度
 * @returns distance, bearing
 */
const calDisBear = (disPosition, lonLat) => {
  // 这里主要是为了第一次添加数据时，返回距离和方位角
  if (!disPosition) {
    return {
      distance: 0,
      bearing: 0
    }
  }
  // 重命名数据 方便使用
  const oneLonLat = disPosition.lonLat
  const twoLonLat = lonLat

  // 将坐标数据转换为turf的Geojson个数
  // 将数据转为turf格式
  const from = turf.point([oneLonLat.x, oneLonLat.y])
  const to = turf.point([twoLonLat.x, twoLonLat.y])

  // 使用经纬度 计算距离
  const distance = turf.distance(from, to) * 1000
  // 使用经纬度 计算方位
  const bearing = turf.bearing(from, to)

  return { distance, bearing }
}
