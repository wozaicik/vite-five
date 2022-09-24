<template>
    <div class="subdistance">
        <el-table :data="disPositions" border style="width: 100%">
            <!-- <el-table-column prop="number" label="序号" width="60" /> -->
            <el-table-column type="index"  width="35" align="center"/>
            <el-table-column prop="gsProj" label=" X ------ Y ------ Z " align="center">
                <template #default="scope">
                    <!-- 将坐标数据进行拼接 -->
                    <span v-for="(item,i) in scope.row[props.coorOption]" :key="i" style="margin-left: 15px">{{item.toFixed(3)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="distance" label="距离" width="85" align="center"/>
            <el-table-column prop="bearing" label="方位" width="85" align="center"/>
        </el-table>
    </div>
  </template>

<script  setup>
import { storeToRefs } from 'pinia'
import { inject, watch } from 'vue'
import { useDistanceStore } from '../store/distance'
// import * as Cesium from 'cesium'

const props = defineProps({
  // 选择 坐标系
  coorOption: { type: String, default: 'gsProj' },
  // 激活子组件的名称
  paneName: { type: String, default: 'dis' }
})
const componentName = 'distance'
// 获取distance存储库
const distance = useDistanceStore()
// 将存储库中的disPositions设置为响应式
const { disPositions } = storeToRefs(distance)

// 通过注入获得父组件中存储的坐标值
const tabsCar3 = inject('tabsCar3')

// 监听父组件中的坐标值，当改变时，将数据传递给distance库中
watch(() => tabsCar3.value, () => {
  if (!tabsCar3.value) return
  if (componentName === props.paneName) {
    distance.addPoint(tabsCar3?.value)
    distance.draw()
  }
})

</script>

<style lang="scss" scoped>
.el-table{
    height: 100%;
    margin-top: 20px;
}
</style>
<!-- // 实验数据
// const c3one = Cesium.Cartesian3.fromDegrees(113.3958888, 23.175833333, 300000.0)
// const c3two = Cesium.Cartesian3.fromDegrees(113.3978888, 23.175833333, 300000.0)
// distance.addPoint(c3one)
// distance.addPoint(c3two) -->
