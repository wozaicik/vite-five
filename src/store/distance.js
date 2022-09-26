import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { coorColl, calDisBear, calCenter } from '../utils/coorTrans'
import * as Cesium from 'cesium'

//   { number: 0, cartesian3: null, lonLat: null, distance: 0, bearing: 0 }
export const useDistanceStore = defineStore('distance', {

  state: () => ({

    length: 1,

    disPositions: [],

    // 存储所有的entity数据，便于遍历移除
    distanceEntities: []

    // // 存储中心点
    // center: []
  }),

  actions: {
    // 对数据进行计算，添加到state.disPositions中
    addPoint (cartesian3) {
      if (this.length >= 3) {
        this.length = 1
        this.disPositions = []
      }
      if (!cartesian3) return
      const { lonLat, gsProj } = coorColl(cartesian3)
      const { distance, bearing } = calDisBear(this.disPositions[0]?.lonLat, lonLat)

      this.disPositions.push({
        number: this.length, // 序号
        cartesian3, // 笛卡尔空间直角坐标
        lonLat, // 经纬度
        gsProj, // 高斯投影国家2000坐标
        distance: distance.toFixed(2), // 距离
        bearing: bearing.toFixed(2) // 方位角
      })
      this.length++
    },
    // 绘制点和线段
    draw () {
      let viewer = window.viewer
      // 获得cartesian3的坐标数组
      const car3Array = this.getCar3Array
      const toRawcar3Array = toRaw(car3Array)
      // 当只有一个坐标点时，只添加一个点
      if (car3Array.length === 1) {
        // 拿到第一个点的cartesian3的坐标
        const itemCoor = toRaw(car3Array[0])
        this.distanceEntities.push(viewer.entities.add({
          position: itemCoor,
          point: {
            color: Cesium.Color.SKYBLUE,
            pixelSize: 5,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        }))
      }
      // 当只有二个坐标点时，只添加一个点和一条线段

      if (car3Array.length === 2) {
        // 拿到第二点的坐标
        const itemCoor = toRaw(car3Array[1])
        // 拿到中心点坐标
        const center = this.getCenterCoor
        // 需要注释的距离
        const disText = this.disPositions[1].distance.toString()
        // 添加第二个点和线段
        this.distanceEntities.push(viewer.entities.add({
          position: itemCoor,
          point: {
            color: Cesium.Color.SKYBLUE,
            pixelSize: 5,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          },
          polyline: {
            positions: toRawcar3Array,
            width: 3,
            material: Cesium.Color.RED,
            clampToGround: true
          }
        }))
        // 把距离显示在线段的中间
        this.distanceEntities.push(viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(center[0], center[1]),
          label: {
            text: disText,
            font: '16px sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            verticalOrigin: Cesium.VerticalOrigin.BASELINE,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
          }
        }))
      }
      viewer = null
    },
    // 清除所有存储entity数据
    clear () {
      const viewer = window.viewer
      // 遍历存储的entity，通过entitycollection的remove方法移除entity
      this.distanceEntities.forEach(item => {
        if (item) {
          viewer.entities.remove(item)
        }
      })
      this.distanceEntities = []
    }
  },

  getters: {
    // 返回两个点的cartesian3坐标数组
    getCar3Array () {
      return this.disPositions.map(item => item.cartesian3)
    },
    // 返回两个点的中心经纬度
    getCenterCoor () {
      const center = calCenter(this.disPositions[0]?.lonLat, this.disPositions[1]?.lonLat)
      return center
    }
  }

})

// const viewer = window.viewer
// // const entityCollDis = new Cesium.EntityCollection()
// const car3Array = this.getCar3Array
// car3Array.forEach(element => {
//   const itemCoor = toRaw(element)
//   viewer.entities.add({
//     position: itemCoor,
//     point: {
//       color: Cesium.Color.SKYBLUE,
//       pixelSize: 10,
//       outlineColor: Cesium.Color.YELLOW,
//       outlineWidth: 3
//       // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//     }
//   })
//   // entityCollDis.add(new Cesium.Entity({
//   //   position: itemCoor,
//   //   point: {
//   //     color: Cesium.Color.SKYBLUE,
//   //     pixelSize: 10,
//   //     outlineColor: Cesium.Color.YELLOW,
//   //     outlineWidth: 3,
//   //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//   //   }
//   // }))
// })
// // viewer.entities.add({
// //   id: 'distance',
// //   entityCollection: entityCollDis
// // })
// // let pointPolyline = null
// // car3Array.forEach(element => {
// //   pointPolyline = new Cesium.Entity({
// //     position: element,
// //     point: {
// //       color: Cesium.Color.SKYBLUE,
// //       pixelSize: 10,
// //       outlineColor: Cesium.Color.YELLOW,
// //       outlineWidth: 3,
// //       heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
// //     },
// //     polyline: {
// //       positions: car3Array,
// //       width: 5,
// //       material: new Cesium.PolylineOutlineMaterialProperty({
// //         color: Cesium.Color.RED,
// //         outlineWidth: 2,
// //         outlineColor: Cesium.Color.BLACK
// //       }),
// //       clampToGround: true
// //     }
// //   })
// // })
// // entityCollDis.add({
// //   id: 'distance',
// //   pointPolyline
// // })
// // viewer.entities.add({
// //   entityCollDis
// // })
//       循环遍历坐标数组，添加点和线段
//       console.log(car3Array)
//       console.log(viewer)
//       car3Array.forEach(element => {
//         const itemCoor = toRaw(element)
//         // console.log(itemCoor)
//         if (this.length === 2) {
//           this.distanceEntities.push(viewer.entities.add({
//             position: itemCoor,
//             point: {
//               color: Cesium.Color.SKYBLUE,
//               pixelSize: 6,
//               outlineColor: Cesium.Color.YELLOW,
//               outlineWidth: 2,
//               heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//             }
//           }))
//         }
//         if (this.length === 3) {
//           this.distanceEntities.push(viewer.entities.add({
//             position: itemCoor,
//             point: {
//               color: Cesium.Color.SKYBLUE,
//               pixelSize: 6,
//               outlineColor: Cesium.Color.YELLOW,
//               outlineWidth: 2,
//               heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
//             },
//             polyline: {
//               positions: toRaw(car3Array),
//               width: 3,
//               material: Cesium.Color.RED,
//               clampToGround: true
//             }
//           }))
//         }
//       })
