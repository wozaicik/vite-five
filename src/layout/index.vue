<template>
    <div class="common-layout">
       <el-container>
         <el-aside :width="isChangeWd?'64px':'200px'">
          <!-- 侧边栏 -->
            <siderbarVue @changeCollapse="changeWidth"></siderbarVue>
         </el-aside>
         <el-main>
            <!-- 显示地球的窗口 -->
            <appViewerVue></appViewerVue>
            <!-- 动态的加载不同的功能模块 -->
            <KeepAlive>
              <component :is="activeMod" :key="activeMod"></component>
            </KeepAlive>
         </el-main>
       </el-container>
     </div>
   </template>

<script setup>

import { ref, watch } from 'vue'
import siderbarVue from './components/siderbar.vue'

import appViewerVue from '../components/app-viewer.vue'
import { useRoute } from 'vue-router'

const isChangeWd = ref(true)
const changeWidth = (isCollapse) => {
  isChangeWd.value = isCollapse
}

// 监视路由的变化，动态加载不同的功能模块
const route = useRoute()
const activeMod = ref(null)
watch(() => route.params.id, (newVal) => {
  activeMod.value = newVal
}, { immediate: true })

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
