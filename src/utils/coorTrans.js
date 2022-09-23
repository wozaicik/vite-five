import { Cartographic, Math as cesiumMath } from 'cesium'
import proj4 from 'proj4'
import * as turf from '@turf/turf'

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
