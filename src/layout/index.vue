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
import { ref } from 'vue'
import siderbarVue from './components/siderbar.vue'

import appViewerVue from '../components/app-viewer.vue'

const isChangeWd = ref(false)

const changeWidth = (isCollapse) => {
  isChangeWd.value = isCollapse
}

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
