<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#202124"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
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
            <el-menu-item v-else :index="sub.path">
                <el-icon><component :is="sub.icon" /></el-icon>
                <span>{{sub.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script setup>
import { siderbarOptions } from '@/api/constants.js'
</script>

<style lang="scss" scoped>
.el-menu {
    height: 100%;
}
</style>
