<template>
  <div class="measure">
    <el-tabs type="border-card" v-model="tabPaneName">
      <!-- 高度待补充 距离 -->
      <el-tab-pane label="距 离" name="distance" >
          <div class="desc">
            <span >测量地面上两个点之间的距离</span>
            <el-select v-model="coorOption"  placeholder="gsProj" size="small">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
            </el-select>
          </div>
         <subDistanceVue :coor-option="coorOption" :pane-name="tabPaneName"></subDistanceVue>
      </el-tab-pane>
      <el-tab-pane label="线 段" name="polyline">
        <div class="desc">
            <span >测量地面上多个点之间的距离</span>
            <el-select v-model="coorOption"  placeholder="gsProj" size="small">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
            </el-select>
          </div>
        <subPolylineVue :coor-option="coorOption" :pane-name="tabPaneName"></subPolylineVue>
      </el-tab-pane>
      <el-tab-pane label="面 积" name="area">面 积</el-tab-pane>
      <el-tab-pane label="圆" name="circle">圆</el-tab-pane>
      <el-tab-pane label="坡 度 坡 向" name="slopeAspect">坡度 坡向</el-tab-pane>
    </el-tabs>
    <el-row justify="end" >
        <el-col :span="10">
          <el-button size="small"  type="info" round>保存</el-button>
          <el-button size="small"  type="info" round>取消</el-button>
          <el-button size="small"  type="info" round>关闭</el-button>
        </el-col>
      </el-row>
  </div>
</template>

<script >
import { defineComponent, onMounted, provide, ref } from 'vue'
import subDistanceVue from '../sub-distance.vue'
import subPolylineVue from '../sub-polyline.vue'
import * as Cesium from 'cesium'
import { useViewerStore } from '../../store/viewer'

export default defineComponent({
  name: 'Measure',
  components: {
    subDistanceVue,
    subPolylineVue
  },
  setup () {
    // 绑定值，选中选项卡的 name
    const tabPaneName = ref('distance')

    // 存储获取的坐标值
    const tabsCar3 = ref(null)
    // 初始化状态库，查看是地球是否加载完毕
    const viewerData = useViewerStore()
    // 在组件和子组件加载完成后，才运行
    onMounted(() => {
      if (viewerData.isViewer) {
        getCoor(tabsCar3)
      }
    })

    // 提供坐标值，可以被后代组件注入获得坐标。
    provide('tabsCar3', tabsCar3)

    // 距离子模块的selection实现
    // v-model 绑定 选择坐标系
    const coorOption = ref('gsProj')
    // 提供两种坐标系的选择
    const options = [
      { value: 'lonLat', label: '经纬度' },
      { value: 'gsProj', label: '国家2000' }]

    return {
      coorOption, options, tabPaneName, tabsCar3
    }
  }
})

/** 传出事件，方便后期移除
 * 从屏幕中获取cartesian3坐标
 */
const getCoor = (tabsCar3) => {
  // 获得全局变量中的viewer
  const viewer = window.viewer
  // 将响应式数据传给cartesian 这样cartesian也会变成响应式
  const cartesian = tabsCar3
  // Cesium的事件管理函数
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // 鼠标左键点击事件
  handler.setInputAction((movement) => {
    // 获得鼠标点击的笛卡尔空间直角坐标
    cartesian.value = viewer.scene.pickPosition(movement.position)
    // 如果为空，使用另一个函数获得坐标
    // if (!cartesian) {
    //   cartesian.value = viewer.scene.globe.pick(viewer.camera.getPickRay(movement.position), viewer.scene)
    // }
    // 如果为空，使用另一个函数获得坐标
    // if (!cartesian) {
    //   cartesian.value = viewer.scene.camera.pickEllipsoid(movement.position)
    // }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
</script>

<style lang="scss" scoped>
.measure{
position: absolute;
right: 5px;
top: 5px;
height: 60%;
width:500px;
.el-tabs{
  height: 100%;
  width: 100%;
}
.el-row{
position: absolute;
right: 5px;
bottom: 12px;
align-items: center;
height: 30px;
width: 100%;
}
.el-button{
margin-right: 10px;
}
}

.desc{
  margin-top: 10px;
display: flex;
align-items:center;
justify-content:space-around;
height: 30px;
}
</style>
