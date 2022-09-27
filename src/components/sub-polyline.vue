<template>
    <div class="subpolyline"  v-if="componentName===props.paneName">
        <el-table :data="dispolyline.positions" height="370px"  border style="width: 100%">
            <el-table-column type="index"  width="43" align="center"/>
            <el-table-column prop="gsProj" label=" X ------ Y ------ Z " align="center">
                <template #default="scope">
                    <!-- 将坐标数据进行拼接 -->
                    <span v-for="(item,i) in scope.row[props.coorOption]" :key="i" style="margin-left: 10px">{{item.toFixed(3)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="distance" label="距离" width="75" align="center"/>
            <el-table-column prop="distanceSum" label="总距离" width="82" align="center"/>
        </el-table>
        <el-switch
          v-model="isOpenSection"
          size="small"
          active-text="Open"
          inactive-text="打开断面图"
        />
    </div>
  </template>

<script  setup>
// import { storeToRefs } from 'pinia'
import { storeToRefs } from 'pinia'
import { inject, watch } from 'vue'
import { useDisPolylineStore } from '../store/disPolyline'

const props = defineProps({
  // 选择 坐标系
  coorOption: { type: String, default: 'gsProj' },
  // 激活子组件的名称
  paneName: { type: String, default: 'pol' }
})
// 本组件的名称
const componentName = 'polyline'

// 拿到dispolyline存储库
const dispolyline = useDisPolylineStore()

// 将存储库中的positions设置为响应式
// const { positions } = storeToRefs(dispolyline)

// 通过注入获得父组件中存储的坐标值
const tabsCar3 = inject('tabsCar3')

watch(() => tabsCar3.value, () => {
  if (!tabsCar3.value) return
  if (componentName === props.paneName) {
    dispolyline.addPositions(tabsCar3?.value)
    dispolyline.draw()
    // dispolyline.calSectionlView()
  }
})

const { isOpen: isOpenSection } = storeToRefs(dispolyline)
watch(() => isOpenSection.value, (newVal) => {
  if (newVal) {
    dispolyline.isOpen = newVal
  }
}, { immediate: true })

</script>

<style lang="scss" scoped>
.el-table{
    height: 100%;
    margin-top: 10px;
}
</style>
