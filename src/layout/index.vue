<template>
    <div class="common-layout">
       <el-container>
         <el-aside width="200px">
            <siderbarVue></siderbarVue>
         </el-aside>
         <el-main>Main</el-main>
       </el-container>
     </div>
   </template>

<script setup>
import siderbarVue from './components/siderbar.vue'
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
       }
   }
</style>
