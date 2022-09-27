import * as Cesium from 'cesium'

/**
 * let data = [[里程, 高程]];
 * @param {Object} oneLonLat 第一个点经纬度
 * @param {Object} twoLonLat 第二个点的经纬
 * @param {Number} distance 第一个点与第二点之间的距离
 * @param {Number} arrayLength 数组的长度
 * @param {Number} lastDistance 距离的总和
 * @returns
 */
export const terrainPositions = async (oneLonLat, twoLonLat, distance, arrayLength, distanceSum) => {
  if (!oneLonLat) {
    return []
  }
  // 存储插值的到的里程和高程点 [[里程,高程]]
  const data = []
  const length = 10
  const mileage = calMileage(distance)
  /// ////////
  // 计算每个插值点的坐标和高程
  const viewer = window.viewer
  //   开始经度
  const startLon = Cesium.Math.toRadians(oneLonLat.x)
  //   结束经度
  const endLon = Cesium.Math.toRadians(twoLonLat.x)
  //   开始纬度
  const startLat = Cesium.Math.toRadians(oneLonLat.y)
  //   结束纬度
  const endLat = Cesium.Math.toRadians(twoLonLat.y)
  // 存储插值后的坐标
  const terrainSamplePositions = []
  // 存储计算出高程后的值
  //   const samplesPositions = []
  // 进行插值计算
  for (let i = 0; i < length; ++i) {
  // lerp函数 计算插值
    const lon = Cesium.Math.lerp(
      startLon,
      endLon,
      i / (length - 1)
    )
    const lat = Cesium.Math.lerp(
      startLat,
      endLat,
      i / (length - 1)
    )
    // 得到插值的坐标
    // const position = new Cesium.Cartographic(lon, lat)
    // push
    terrainSamplePositions.push(new Cesium.Cartographic(lon, lat))
  }
  // 得到每个点的高程值
  await Promise.resolve(
    Cesium.sampleTerrainMostDetailed(
      viewer.terrainProvider,
      terrainSamplePositions
    )
  ).then((samples) => {
    if (arrayLength >= 2) {
      mileage.shift()
      samples.shift()
      for (let i = 0; i < samples.length; i++) {
        data.push([mileage[i] + Number(distanceSum), samples[i].height])
      }
    } else {
      for (let i = 0; i < samples.length; i++) {
        data.push([mileage[i], samples[i].height])
      }
    }
  })
  return data
}

const calMileage = (distance) => {
  // 插值的个数
  const length = 10
  // 计算里程
  const step = distance / (length - 1)
  const mileage = []
  for (let i = 0; i < length; i++) {
    mileage.push(i * step)
  }
  return mileage
}

// const calMileage = (distance) => {
//   let length = 0
//   switch (Number(distance)) {
//   case distance < 100:
//     length = 5
//     break
//   case distance > 100 && distance < 1000:
//     length = 50
//     break
//   case distance > 1000 && distance < 2000:
//     length = 100
//     break
//   case distance > 2000 && distance < 3000:
//     length = 150
//     break
//   default:
//     length = 300
//   }
//   // 计算里程
//   const step = distance / (length - 1)
//   const mileage = []
//   for (let i = 0; i < length; i++) {
//     mileage.push(i * step)
//   }
//   return mileage
// }

// const calPositionsDetailed = (oneLonLat, twoLonLat, distance) => {
//   let length = 0
//   switch (distance) {
//   case distance < 100:
//     length = 5
//     break
//   case distance > 100 && distance < 1000:
//     length = 50
//     break
//   case distance > 1000 && distance < 2000:
//     length = 100
//     break
//   case distance > 2000 && distance < 3000:
//     length = 150
//     break
//   default:
//     length = 300
//   }

//   // 计算每个插值点的坐标和高程
//   const viewer = window.viewer
//   //   开始经度
//   const startLon = Cesium.Math.toRadians(oneLonLat.x)
//   //   结束经度
//   const endLon = Cesium.Math.toRadians(twoLonLat.x)
//   //   开始纬度
//   const startLat = Cesium.Math.toRadians(oneLonLat.y)
//   //   结束纬度
//   const endLat = Cesium.Math.toRadians(twoLonLat.y)
//   // 存储插值后的坐标
//   const terrainSamplePositions = []
//   // 存储计算出高程后的值
//   const samplesPositions = []
//   // 进行插值计算
//   for (let i = 0; i < length; ++i) {
//   // lerp函数 计算插值
//     const lon = Cesium.Math.lerp(
//       startLon,
//       endLon,
//       i / (length - 1)
//     )
//     const lat = Cesium.Math.lerp(
//       startLat,
//       endLat,
//       i / (length - 1)
//     )
//     // 得到插值的坐标
//     const position = new Cesium.Cartographic(lon, lat)
//     // push
//     terrainSamplePositions.push(position)
//   }
//   // 得到每个点的高程值
//   Promise.resolve(
//     Cesium.sampleTerrainMostDetailed(
//       viewer.terrainProvider,
//       terrainSamplePositions
//     )
//   ).then((samples) => {
//     for (let i = 0; i < samples.length; i++) {
//       samplesPositions.push(samples[i].height)
//     }
//     // samplesPositions = samples.map(item => item.height)
//   })
//   //   console.log(samplesPositions)
//   return samplesPositions
// }

// // if (distance < 100) {
// //     length = 5
// //   }
// //   if (distance > 100 && distance < 1000) {
// //     length = 50
// //   }
// //   if (distance > 1000 && distance < 2000) {
// //     length = 100
// //   }
// //   if (distance > 2000 && distance < 3000) {
// //     length = 150
// //   }
// //   if (distance > 3000) {
// //     length = 300
// //   }
