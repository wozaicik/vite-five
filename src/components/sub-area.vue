<template>
    <div class="subarea">
        <el-table :data="disarea.positions" height="370px"  border style="width: 100%">
            <el-table-column type="index"  width="43" align="center"/>
            <el-table-column prop="gsProj" label=" X ------ Y ------ Z " align="center">
                <template #default="scope">
                    <!-- 将坐标数据进行拼接 -->
                    <span v-for="(item,i) in scope.row[props.coorOption]" :key="i" style="margin-left: 10px">{{item.toFixed(3)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="area" label="面积" width="75" align="center"/>
        </el-table>
    </div>
</template>

<script setup>
import { inject, watch } from 'vue'
import { useDisArea } from '../store/disArea'

const props = defineProps({
  // 选择 坐标系
  coorOption: { type: String, default: 'gsProj' },
  // 激活子组件的名称
  paneName: { type: String, default: 'a' }
})
// 本组件的名称
const componentName = 'area'
const disarea = useDisArea()

// 注入父组件的坐标
const tabsCar3 = inject('tabsCar3')

watch(() => tabsCar3.value, () => {
  if (!tabsCar3.value) return
  if (componentName === props.paneName) {
    disarea.addPositions(tabsCar3?.value)
    disarea.draw()
    // dispolyline.calSectionlView()
  }
})

</script>

<style lang="scss" scoped>

</style>
