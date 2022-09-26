<template>
    <div id="cesiumContainer" ref="viewer">
    </div>
</template>

<script  setup>
import * as Cesium from 'cesium'
import { ElMessage } from 'element-plus'
import { onBeforeUnmount, onMounted } from 'vue'
import { useViewerStore } from '../store/viewer'

// 获取 viewer的初始化状态 false：未加载 true：已加载
const viewerData = useViewerStore()
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjRhOTQ5ZS05OGVhLTRjYzYtOWM4NC0zMWNjNjRmMTRiYjAiLCJpZCI6NTYwOTgsImlhdCI6MTY2NDEwNDM1Mn0.14ncJIklRIf4qm3EDZKPfTY_j3iB0CyBHQSku0wihxU'
// 加载整个地球数据
let viewer = null
onMounted(() => {
  try {
    //  以下内容可在程序开头设置，主要设置基础控件和基础图层的属性，一般不在初始化Viewer时加载数据。
    viewer = new Cesium.Viewer('cesiumContainer', {
      animation: false, // 是否创建动画小控件，即左下角的仪表，默认为TRUE
      baseLayerPicker: false, // 是否显示图层选择器，默认为TRUE
      fullscreenButton: false, // 是否显示全屏按钮，默认为TRUE
      geocoder: false, // 是否显示geocoder(右上角查询按钮)，默认为TRUE
      homeButton: false, // 是否显示home按钮，默认为TRUE
      infoBox: false, // 是否显示信息框，默认为TRUE
      sceneModePicker: false, // 是否显示三维地球/二维地球地图选择器，默认为TRUE
      selectionIndicator: false, // 是否显示选取指示器(鼠标点击显示绿框)，默认为TRUE
      timeline: false, // 是否显示时间轴，默认为TRUE
      navigationHelpButton: false, // 是否显示右上角的帮助按钮，默认为TRUE
      scene3DOnly: false, // 如果设置为TRUE，则所有集合图形以三维模式绘制以节约GPU资源，默认为false
      terrainProvider: Cesium.createWorldTerrain()// 加载地形
    })
    viewer.scene.globe.depthTestAgainstTerrain = true// 设置为true 才能准确的获取坐标值
    // viewer.scene.postProcessStages.fxaa.enabled = false// 给文字去除锯齿
    // 去掉cesium左下角的版权标识
    viewer.cesiumWidget.creditContainer.style.display = 'none'
    // 判断是否已存在全局变量viewer
    // 存在则初始化
    if (window.viewer) {
      window.viewer = null
    }
    // 将viewer与scene传给window作为全局变量
    window.viewer = viewer
    window.scene = viewer.scene
    // 将加载状态改为true
    viewerData.setIsViewer()
  } catch (e) {
    ElMessage.error(e)
  }
})
// 销毁
onBeforeUnmount(() => {
  viewer.destroy()
  window.viewer = undefined
  window.scene = undefined
})
</script>

<style lang="scss" scoped>

</style>
