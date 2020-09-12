<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class>
        <img class="header-img" src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <div>
        <el-select v-model="language" placeholder="请选择" @change="langChange">
          <el-option
            v-for="item in langOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="info" round @click="logout">退出</el-button>
      </div>

    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 侧边菜单 -->
        <div class="toggle-button" @click="toggleCollapse">||||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :index="item.id + ''" :key="item.id" >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in item.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { localSave } from '@/libs/util'
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '',
      langOptions: [
        { value: 'zh-CN', label: '中文' },
        { value: 'en-US', label: 'English' }
      ],
      language: 'zh-CN'
    }
  },
  mounted() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
    this.language = this.$i18n.locale
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(this.menuList)
    },
    // 点击按钮折叠菜单
    toggleCollapse() {
      if (this.isCollapse) this.isCollapse = false
      else this.isCollapse = true
    },
    // 保存链 接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    langChange(val) {
      this.$i18n.locale = val
      localSave('local', val)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .header-img {
    width: 50px;
    height: 50px;
  }
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  .el-select {
    width: 100px;
    margin-right: 10px;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>
