<template>
    <div class="common-layout">
       <el-container>
         <el-aside :width="isChangeWd?'64px':'200px'">
            <siderbarVue @changeCollapse="changeWidth"></siderbarVue>
         </el-aside>
         <el-main>
            <appViewerVue></appViewerVue>
         </el-main>
       </el-container>
     </div>
   </template>

<script setup>
import { useDistanceStore } from '../store/distance'
import * as Cesium from 'cesium'
import { ref } from 'vue'
import siderbarVue from './components/siderbar.vue'

import appViewerVue from '../components/app-viewer.vue'

const isChangeWd = ref(false)

const changeWidth = (isCollapse) => {
  isChangeWd.value = isCollapse
}
const c3one = Cesium.Cartesian3.fromDegrees(113.3958888, 23.175833333, 300000.0)
const c3two = Cesium.Cartesian3.fromDegrees(113.3978888, 23.175833333, 300000.0)
const distance = useDistanceStore()
distance.addPoint(c3one)

distance.addPoint(c3two)
distance.addPoint(c3two)
console.log(distance.disPositions)
</script>

<style lang="scss" scoped>
   .common-layout{
       position: relative;
       height: 100%;
       width: 100%;
       margin: 0;
       padding: 0;
       overflow: hidden;
       .el-container{
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          .el-aside{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          .el-main{
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
       }
   }
</style>
