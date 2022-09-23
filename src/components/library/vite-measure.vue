<template>
  <div class="measure">
    <el-tabs type="border-card">
      <!-- 高度待补充 距离 -->
      <el-tab-pane label="距 离">
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
         <subDistanceVue :coor-option="coorOption"></subDistanceVue>
      </el-tab-pane>
      <el-tab-pane label="线 段">线 段</el-tab-pane>
      <el-tab-pane label="面 积">面 积</el-tab-pane>
      <el-tab-pane label="圆">圆</el-tab-pane>
      <el-tab-pane label="坡 度 坡 向">坡度 坡向</el-tab-pane>
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
import { defineComponent, ref } from 'vue'
import subDistanceVue from '../sub-distance.vue'

export default defineComponent({
  name: 'Measure',
  components: {
    subDistanceVue
  },
  setup () {
    // v-model 绑定 选择坐标系
    const coorOption = ref('gsProj')
    // 提供两种坐标系的选择
    const options = [
      { value: 'lonLat', label: '经纬度' },
      { value: 'gsProj', label: '国家2000' }]

    return {
      coorOption, options
    }
  }
})
</script>

<style lang="scss" scoped>
.measure{
position: absolute;
right: 5px;
top: 5px;
height: 300px;
width:550px;
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
