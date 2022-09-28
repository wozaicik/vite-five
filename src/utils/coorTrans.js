import { Cartographic, Math as cesiumMath } from 'cesium'
import proj4 from 'proj4'
import * as turf from '@turf/turf'
import { toRaw } from 'vue'

/**
 * 输出经纬度、国家2000坐标
 * @param {Cesium.Cartesian3} Cartesian3 笛卡尔空间直角坐标系
 * @returns lonLat-角度制-经纬度   gsProj-国家2000投影坐标系下的坐标 （地方坐标系）
 */
export const coorColl = (Cartesian3) => {
  if (!Cartesian3) return

  //  将Cartesian3坐标转换为经纬度
  const lonLat = Cartesian3ToCartographicDegree(Cartesian3)

  // 将经纬度转换为国家2000坐标
  const gsProj = lonLatToCGCS(lonLat)

  return { lonLat, gsProj }
}

/**
 * 将笛卡尔空间直角坐标系转换为角度制-经纬度
 * @param {Cesium.Cartesian3} Cartesian3 笛卡尔空间直角坐标系
 * @returns 角度制-经纬度
 */
const Cartesian3ToCartographicDegree = (Cartesian3) => {
  //  将Cartesian3坐标转换为经纬度——弧度制
  // console.log(Cartesian3)
  const lonLatRadian = Cartographic.fromCartesian(Cartesian3)

  //  将弧度-经度 To 角度-经度
  const longitude = cesiumMath.toDegrees(lonLatRadian.longitude)
  //  将弧度-纬度 To 角度-纬度
  const latitude = cesiumMath.toDegrees(lonLatRadian.latitude)

  //  经纬度的数据格式
  const lonLat = {
    x: longitude,
    y: latitude,
    z: lonLatRadian.height
  }
  return lonLat
}

/**
 * @param {lonLat} lonLat 经纬度
 * @returns 国家2000坐标系下的坐标（X,Y）
 */
const lonLatToCGCS = (lonLat) => {
// proj4.defs('EPSG:CGCS2000', '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs')
// 计算中央经线 除以3表示在第几带
  const N = Math.ceil(lonLat.x / 3)
  // 乘以3的中央经线
  const L = N * 3
  // console.log(L)
  //   设置国家2000坐标系的参数
  proj4.defs([
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
    [
      'EPSG:4547',
      '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs'
    ]
  ])
  proj4.defs('EPSG:CGCS2000', `+proj=tmerc +lat_0=0 +lon_0=${L} +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs`)

  //   计算坐标
  const gsProj = proj4('EPSG:4326', 'EPSG:CGCS2000', [lonLat.x, lonLat.y])

  return { x: gsProj[0], y: gsProj[1], z: lonLat.z }
}

/**
 *  计算两个点的距离和方位
 * @param {Object} disPosition 第一个点
 * @param {lonLat} lonLat   第二个点的经纬度
 * @returns distance, bearing
 */
export const calDisBear = (oneLonLat, twoLonLat) => {
  // 这里主要是为了第一次添加数据时，返回距离和方位角
  if (!oneLonLat) {
    return {
      distance: 0,
      bearing: 0
    }
  }
  // 重命名数据 方便使用
  // const oneLonLat = disPosition.lonLat
  // const twoLonLat = lonLat

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

/**
 *
 * @param {Object} oneLonLat 第一个点的经纬度
 * @param {Object} twoLonLat 第二个点的经纬度
 * @returns 两个点之间的中心坐标
 */
export const calCenter = (oneLonLat, twoLonLat) => {
  if (!oneLonLat) {
    return {
      center: 0
    }
  }
  let center = []
  const points = turf.points([[oneLonLat.x, oneLonLat.y], [twoLonLat.x, twoLonLat.y]])
  const centers = turf.center(points)

  // center.push(centers.geometry.coordinates[0])
  // center.push(centers.geometry.coordinates[1])
  // console.log(center)
  center = centers.geometry.coordinates
  // console.log(center)
  return center
}

export const calArea = (polygon) => {
  const polygonRaw = toRaw(polygon)
  if (!polygonRaw || polygonRaw.length <= 3) {
    return 0
  } else {
    console.log(...polygonRaw, polygonRaw[0])
    const calPolygon = turf.polygon([[...polygonRaw, polygonRaw[0]]])
    const area = turf.area(calPolygon)
    return area
  }
}

export const calCentroid = (polygon) => {
  // 计算中心中，绘制图形所用
  const polygonToRaw = toRaw(polygon)
  if (!polygonToRaw || polygonToRaw.length < 3) {
    return 0
  } else {
    const calPolygon = turf.polygon([[...polygonToRaw, polygonToRaw[0]]])
    const Centroid = turf.centroid(calPolygon)
    console.log(Centroid.geometry.coordinates)
    return Centroid
  }
}

// This example illustrates a Callback Property, a property whose
// value is lazily evaluated by a callback function.
// Use a CallbackProperty when your data can't be pre-computed
// // or needs to be derived from other properties at runtime.
// const viewer = new Cesium.Viewer('cesiumContainer')
// viewer.clock.shouldAnimate = true

// const startLatitude = 35
// const startLongitude = -120
// let endLongitude
// const startTime = Cesium.JulianDate.now()

// // Add a polyline to the scene. Positions are dynamic.
// const isConstant = false
// const redLine = viewer.entities.add({
//   polyline: {
//     // This callback updates positions each frame.
//     positions: new Cesium.CallbackProperty(function (time, result) {
//       endLongitude =
//         startLongitude +
//         0.001 * Cesium.JulianDate.secondsDifference(time, startTime)
//       return Cesium.Cartesian3.fromDegreesArray(
//         [startLongitude, startLatitude, endLongitude, startLatitude],
//         Cesium.Ellipsoid.WGS84,
//         result
//       )
//     }, isConstant),
//     width: 5,
//     material: Cesium.Color.RED
//   }
// })

// const startCartographic = Cesium.Cartographic.fromDegrees(
//   startLongitude,
//   startLatitude
// )

// // use scratch object to avoid new allocations per frame.
// let endCartographic = new Cesium.Cartographic()
// const scratch = new Cesium.Cartographic()
// const geodesic = new Cesium.EllipsoidGeodesic()

// // Calculate the length of the line
// function getLength (time, result) {
//   // Get the end position from the polyLine's callback.
//   const endPoint = redLine.polyline.positions.getValue(time, result)[1]
//   endCartographic = Cesium.Cartographic.fromCartesian(endPoint)

//   geodesic.setEndPoints(startCartographic, endCartographic)
//   const lengthInMeters = Math.round(geodesic.surfaceDistance)
//   return `${(lengthInMeters / 1000).toFixed(1)} km`
// }

// function getMidpoint (time, result) {
//   // Get the end position from the polyLine's callback.
//   const endPoint = redLine.polyline.positions.getValue(time, result)[1]
//   endCartographic = Cesium.Cartographic.fromCartesian(endPoint)

//   geodesic.setEndPoints(startCartographic, endCartographic)
//   const midpointCartographic = geodesic.interpolateUsingFraction(
//     0.5,
//     scratch
//   )
//   return Cesium.Cartesian3.fromRadians(
//     midpointCartographic.longitude,
//     midpointCartographic.latitude
//   )
// }

// // Label the polyline with calculated length.
// const label = viewer.entities.add({
//   position: new Cesium.CallbackProperty(getMidpoint, isConstant),
//   label: {
//     // This callback updates the length to print each frame.
//     text: new Cesium.CallbackProperty(getLength, isConstant),
//     font: '20px sans-serif',
//     pixelOffset: new Cesium.Cartesian2(0.0, 20)
//   }
// })

// // Keep the view centered.
// viewer.trackedEntity = label
