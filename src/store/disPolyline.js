import { defineStore } from 'pinia'
import { toRaw } from 'vue'
import { calCenter, calDisBear, coorColl } from '../utils/coorTrans'
import * as Cesium from 'cesium'

export const useDisPolylineStore = defineStore('dispolyline', {
  state: () => ({
    // 存储所有的坐标点
    positions: [],
    // 存所有的entity
    entities: []
  }),
  actions: {
    addPositions (cartesian3) {
      // 根据cartesian3坐标计算经纬度 国家2000投影下的坐标
      const { lonLat, gsProj } = coorColl(cartesian3)
      //   计算与上一点的距离
      const { distance } = calDisBear(this.positions[this.positions.length - 1]?.lonLat, lonLat)
      //   计算与上一个点的中心坐标 格式  [ ]
      const center = calCenter(this.positions[this.positions.length - 1]?.lonLat, lonLat)
      // 计算总距离
      const distanceSum = this.getDistanceSum + distance
      this.positions.push({
        cartesian3, // 笛卡尔空间直角坐标
        lonLat, // 经纬度
        gsProj, // 高斯投影国家2000坐标
        distance: distance.toFixed(2), // 距离
        distanceSum: distanceSum.toFixed(1),
        // distanceSum:this.positions[this.positions.length - 1].distancesum+distance
        center
      })
    },
    draw () {
      const viewer = window.viewer
      // 获得cartesian3的坐标数组
      const car3Array = this.getCar3Array
      //   拿到最后一个点的坐标数据
      const car3ArrayLast = car3Array.slice(-1)
      // 绘制点
      this.entities.push(viewer.entities.add({
        position: toRaw(car3ArrayLast[0]),
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 5,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      }))
      //   console.log(this.positions[this.positions.length - 1])
      //   拿到最后一个点的数据，解构出 距离和中心坐标
      const { distance, center } = this.positions[this.positions.length - 1]
      this.entities.push(viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(center[0], center[1]),
        label: {
          text: distance.toString(),
          font: '16px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BASELINE,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
        }
      }))
      //   每次添加线段之前，都移除 旧的线段，在添加新的线段
      viewer.entities.removeById('dispolyline')
      this.entities.push(viewer.entities.add({
        id: 'dispolyline',
        polyline: {
          positions: toRaw(car3Array),
          width: 3,
          material: Cesium.Color.RED,
          clampToGround: true
        }
      }))
    },
    // 清除所有存储entity数据
    clear () {
      const viewer = window.viewer
      // 遍历存储的entity，通过entitycollection的remove方法移除entity
      this.entities.forEach(item => {
        if (item) {
          viewer.entities.remove(item)
        }
      })
      this.entities = []
    }
  },
  getters: {
    // 返回多个点的cartesian3坐标数组
    getCar3Array () {
      return this.positions.map(item => item.cartesian3)
    },
    // 计算距离的和
    getDistanceSum () {
    //   const initialValue = 0
      const sumWithInitial = this.positions.reduce(
        (previousValue = 0, currentValue) => previousValue + Number(currentValue.distance),
        0
      )
      return sumWithInitial
    }
  }
})

// const initialValue = 0;
// const sumWithInitial = array1.reduce(
//   (previousValue, currentValue) => previousValue + currentValue,
//   initialValue
// );