import { defineStore } from 'pinia'
import { calArea, calCentroid, coorColl } from '../utils/coorTrans'
// import * as turf from '@turf/turf'
import * as Cesium from 'cesium'
import { toRaw } from 'vue'

export const useDisArea = defineStore('area', {
  state: () => ({
    // 统计有多少个点
    number: 0,
    // 存放car3坐标
    cartesian3Arr: [],
    // 存放entity的ID
    entityArrId: [],
    // 存放显示的数据 经纬度，国家2000投影坐标
    positions: [],
    // 存放计算面积的经纬度
    polygon: [],
    // 存放添加最新点后的面积
    newArea: 0
  }),
  actions: {
    addPositions (cartesian3) {
      this.number++
      this.cartesian3Arr.push(cartesian3)
      // 根据cartesian3坐标计算经纬度 国家2000投影下的坐标
      const { lonLat, gsProj } = coorColl(cartesian3)
      //   console.log(lonLat, gsProj)
      // 处理计算好的经纬度
      this.polygon.push([lonLat.x, lonLat.y])
      //   console.log(this.polygon)
      //   计算面积
      const area = calArea(this.polygon).toFixed(2)
      this.newArea = area
      //   将数据添加到positions中
      this.positions.push({
        lonLat,
        gsProj,
        area
      })
    },
    draw () {
      let viewer = window.viewer
      const idNumber = toRaw(this.number)
      const cartesian3ArrToraw = toRaw(this.cartesian3Arr[this.cartesian3Arr.length - 1])
      console.log(cartesian3ArrToraw)
      const id = 'areaPoint' + idNumber
      this.entityArrId.push(id)
      viewer.entities.add({
        id,
        position: cartesian3ArrToraw,
        point: {
          color: Cesium.Color.SKYBLUE,
          pixelSize: 5,
          outlineColor: Cesium.Color.YELLOW,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        label: {
          text: idNumber.toString(),
          font: '16px sans-serif',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          verticalOrigin: Cesium.VerticalOrigin.BASELINE,
          pixelOffset: new Cesium.Cartesian2(0, -10),
          disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
        }
      })

      if (this.cartesian3Arr.length >= 4) {
        const centroid = calCentroid(this.polygon)
        viewer.entities.removeById('areaPolygon')
        viewer.entities.add({
          id: 'areaPolygon',
          position: Cesium.Cartesian3.fromDegrees(centroid.geometry.coordinates[0], centroid.geometry.coordinates[1]),
          polygon: {
            hierarchy: toRaw(this.cartesian3Arr),
            material: Cesium.Color.RED
          },
          label: {
            text: toRaw(this.newArea).toString(),
            font: '16px sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            verticalOrigin: Cesium.VerticalOrigin.BASELINE,
            pixelOffset: new Cesium.Cartesian2(0, -10),
            disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
          }
        })
      }

      viewer = null
    }
  },
  getters: {

  }
})

// const polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]])

// const centroid = turf.centroid(polygon)
