<template>
    <el-row class="header" v-if="!isCollapse">
        <el-col >
            <span>道 路 设 计 辅 助 系 统</span>
        </el-col>
        <el-col :span="24" @click="toggleCollapse">
            <el-icon :size="22" style="margin-left:88px"><Fold /></el-icon>
        </el-col>
    </el-row>
    <el-row class="close-icon" v-if="isCollapse" >
        <el-col :span="24" @click="toggleCollapse">
            <el-icon :size="22"><Expand /></el-icon>
        </el-col>
    </el-row>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
        unique-opened
        router
        >
        <template v-for="sub in siderbarOptions" :key="sub.id">
            <template v-if="sub.children">
                <el-sub-menu :index="sub.id">
                    <template #title>
                        <el-icon><component :is="sub.icon" /></el-icon>
                        <span>{{sub.name}}</span>
                    </template>
                    <el-menu-item v-for="item in sub.children" :key="item.id" :index="item.path">
                        <el-icon><component :is="item.icon" /></el-icon>
                        <span>{{item.name}}</span>
                    </el-menu-item>
                </el-sub-menu>
            </template>
            <el-menu-item v-else :index="sub.path" >
                <el-icon><component :is="sub.icon" /></el-icon>
                <span>{{sub.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script setup>

import { siderbarOptions } from '@/api/constants.js'
import { ref } from 'vue'
const emit = defineEmits(['changeCollapse'])

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  emit('changeCollapse', isCollapse.value)
}

</script>

<style lang="scss" scoped>
.header{
    background-color:#545c64;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#fff;
    font-size: 16px;
    height: 50px;
    width: 200px;
    .el-col{
        display: flex;
        align-items: center;
        span{
            margin-left: 19px;
        }
    }
}
.close-icon{
    background-color:#545c64;
    display: flex;
    justify-content: center;
    align-items: center;
    color:#fff;
    .el-col{
        display: flex;
        align-items: center;
        padding: 10px  21px 10px;
    }
}
.el-menu {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    // background-color: #545c64;
    .el-menu-item{
        margin: 0;
        padding: 0 20px;
        border: 0;
    }
}

</style>
