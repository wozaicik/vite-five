<template>
    <el-row >
        <el-col :span="6">
            <el-avatar :icon="UserFilled" />
        </el-col>
        <el-col :span="16">
            <el-image :src="url" :fit="fit" />
        </el-col>
        <el-col :span="2">
            <el-icon :size="18"><Fold /></el-icon>
        </el-col>
    </el-row>
    <!-- <el-row >
        <el-col style="width: 200px; height: 28px;">
            <el-icon :size="18"><Expand /></el-icon>
        </el-col>
    </el-row> -->
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
const url = '@/assets/images/Google'
</script>

<style lang="scss" scoped>
.el-menu {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    .el-menu-item{
        margin: 0;
        padding: 0;
        border: 0;
    }
}
</style>
