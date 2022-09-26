const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain()
})
viewer.scene.globe.depthTestAgainstTerrain = true

Sandcastle.addDefaultToolbarMenu(
  [
    {
      //
      // To clamp points or billboards set the heightReference to CLAMP_TO_GROUND or RELATIVE_TO_GROUND
      //
      text: 'Draw Point with Label',
      onselect: function () {
        const e = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
          point: {
            color: Cesium.Color.SKYBLUE,
            pixelSize: 10,
            outlineColor: Cesium.Color.YELLOW,
            outlineWidth: 3,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          },
          label: {
            text: 'Clamped to ground',
            font: '14pt sans-serif',
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BASELINE,
            fillColor: Cesium.Color.BLACK,
            showBackground: true,
            backgroundColor: new Cesium.Color(1, 1, 1, 0.7),
            backgroundPadding: new Cesium.Cartesian2(8, 4),
            disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
          }
        })

        viewer.trackedEntity = e
      }
    },
    {
      text: 'Draw Billboard',
      onselect: function () {
        const e = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
          billboard: {
            image: '../images/facility.gif',
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
          }
        })

        viewer.trackedEntity = e
      }
    },
    {
      //
      // Corridors, polygons and rectangles will be clamped automatically if they are filled with a constant color and
      // has no height or extruded height.
      // NOTE: Setting height to 0 will disable clamping.
      //
      text: 'Draw Corridor',
      onselect: function () {
        const e = viewer.entities.add({
          corridor: {
            positions: Cesium.Cartesian3.fromDegreesArray([
              -122.19,
              46.1914,
              -122.21,
              46.21,
              -122.23,
              46.21
            ]),
            width: 2000.0,
            material: Cesium.Color.GREEN.withAlpha(0.5)
          }
        })

        viewer.zoomTo(e)
      }
    },
    {
      text: 'Draw Polygon',
      onselect: function () {
        const e = viewer.entities.add({
          polygon: {
            hierarchy: {
              positions: [
                new Cesium.Cartesian3(
                  -2358138.847340281,
                  -3744072.459541374,
                  4581158.5714175375
                ),
                new Cesium.Cartesian3(
                  -2357231.4925370603,
                  -3745103.7886602185,
                  4580702.9757762635
                ),
                new Cesium.Cartesian3(
                  -2355912.902205431,
                  -3744249.029778454,
                  4582402.154378103
                ),
                new Cesium.Cartesian3(
                  -2357208.0209552636,
                  -3743553.4420488174,
                  4581961.863286629
                )
              ]
            },
            material: Cesium.Color.BLUE.withAlpha(0.5)
          }
        })

        viewer.zoomTo(e)
      }
    },
    {
      text: 'Draw Textured Polygon',
      onselect: function () {
        if (
          !Cesium.Entity.supportsMaterialsforEntitiesOnTerrain(
            viewer.scene
          )
        ) {
          window.alert(
            'Terrain Entity materials are not supported on this platform'
          )
          return
        }

        const e = viewer.entities.add({
          polygon: {
            hierarchy: {
              positions: [
                new Cesium.Cartesian3(
                  -2358138.847340281,
                  -3744072.459541374,
                  4581158.5714175375
                ),
                new Cesium.Cartesian3(
                  -2357231.4925370603,
                  -3745103.7886602185,
                  4580702.9757762635
                ),
                new Cesium.Cartesian3(
                  -2355912.902205431,
                  -3744249.029778454,
                  4582402.154378103
                ),
                new Cesium.Cartesian3(
                  -2357208.0209552636,
                  -3743553.4420488174,
                  4581961.863286629
                )
              ]
            },
            material: '../images/Cesium_Logo_Color.jpg',
            classificationType: Cesium.ClassificationType.TERRAIN,
            stRotation: Cesium.Math.toRadians(45)
          }
        })

        viewer.zoomTo(e)
      }
    },
    {
      text: 'Draw Rectangle',
      onselect: function () {
        const e = viewer.entities.add({
          rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(
              -122.3,
              46.0,
              -122.0,
              46.3
            ),
            material: Cesium.Color.RED.withAlpha(0.5)
          }
        })

        viewer.zoomTo(e)
      }
    },
    {
      text: 'Draw Model',
      onselect: function () {
        const e = viewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
          model: {
            uri: '../SampleData/models/CesiumMan/Cesium_Man.glb',
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            minimumPixelSize: 128,
            maximumScale: 100
          }
        })

        viewer.trackedEntity = e
      }
    },
    {
      text: 'Sample line positions and draw with depth test disabled',
      onselect: function () {
        const length = 1000 // 代表插值 的数量

        // 开始经度
        const startLon = Cesium.Math.toRadians(86.953793)
        // 结束经度
        const endLon = Cesium.Math.toRadians(86.896497)
        // 纬度
        const lat = Cesium.Math.toRadians(27.988257)

        // 插值
        const terrainSamplePositions = []
        for (let i = 0; i < length; ++i) {
          const lon = Cesium.Math.lerp(
            endLon,
            startLon,
            i / (length - 1)
          )
          //   得到一千个点的经纬度
          const position = new Cesium.Cartographic(lon, lat)
          // push
          terrainSamplePositions.push(position)
        }

        // 异步获得每个点的高程值
        Promise.resolve(
          Cesium.sampleTerrainMostDetailed(
            viewer.terrainProvider,
            terrainSamplePositions
          )
        ).then(function (samples) {
          let offset = 10.0
          for (let i = 0; i < samples.length; ++i) {
            samples[i].height += offset
          }

          viewer.entities.add({
            polyline: {
              positions: Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(
                samples
              ),
              arcType: Cesium.ArcType.NONE,
              width: 5,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: Cesium.Color.ORANGE,
                outlineWidth: 2,
                outlineColor: Cesium.Color.BLACK
              }),
              depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty(
                {
                  color: Cesium.Color.RED,
                  outlineWidth: 2,
                  outlineColor: Cesium.Color.BLACK
                }
              )
            }
          })

          const target = new Cesium.Cartesian3(
            300770.50872389384,
            5634912.131394585,
            2978152.2865545116
          )
          offset = new Cesium.Cartesian3(
            6344.974098678562,
            -793.3419798081741,
            2499.9508860763162
          )
          viewer.camera.lookAt(target, offset)
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
        })
      }
    },
    {
      text: 'Draw polyline on terrain',
      onselect: function () {
        if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
          window.alert(
            'Polylines on terrain are not supported on this platform'
          )
        }

        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray([
              86.953793,
              27.928257,
              86.953793,
              27.988257,
              86.896497,
              27.988257
            ]),
            clampToGround: true,
            width: 5,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.ORANGE,
              outlineWidth: 2,
              outlineColor: Cesium.Color.BLACK
            })
          }
        })

        const target = new Cesium.Cartesian3(
          300770.50872389384,
          5634912.131394585,
          2978152.2865545116
        )
        const offset = new Cesium.Cartesian3(
          6344.974098678562,
          -793.3419798081741,
          2499.9508860763162
        )
        viewer.camera.lookAt(target, offset)
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
      }
    }
  ],
  'zoomButtons'
)

Sandcastle.reset = function () {
  viewer.entities.removeAll()
}

// // 基础日期
// let base = +new Date(1988, 9, 3);

// let oneDay = 24 * 3600 * 1000;
// let data = [[base, Math.random() * 300]];
// for (let i = 1; i < 20000; i++) {
//   let now = new Date((base += oneDay));
//   data.push([+now, Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])]);
// }

const data = [[公里数, 高程值]]
for (let i = 1; i < 666; i++) {
  data.push([公里数, 高程值])
}

option = {
  tooltip: {
    trigger: 'axis',
    position: function (pt) {
      return [pt[0], '10%']
    }
  },
  title: {
    left: 'center',
    text: 'Large Ara Chart'
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'time', // 高程值
    boundaryGap: false
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%']
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 20
    },
    {
      start: 0,
      end: 20
    }
  ],
  series: [
    {
      name: 'Fake Data',
      type: 'line',
      smooth: true,
      symbol: 'none',
      areaStyle: {},
      data
    }
  ]
}
