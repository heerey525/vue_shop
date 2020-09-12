<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">{{$t('home')}}</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>{{$t('goods_manage')}}</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{$t('goods_List')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            :placeholder="$t('please_input_content')"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">{{$t('add_good')}}</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" :label="$t('goods_name')"></el-table-column>
        <el-table-column width="130px" prop="goods_price" :label="$t('goods_price')"></el-table-column>
        <el-table-column width="120px" prop="goods_weight" :label="$t('goods_weight')"></el-table-column>
        <el-table-column width="160px" prop="add_time" :label="$t('create_time')">
          <template slot-scope="scope">{{ scope.row.add_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column width="130px" :label="$t('operate')">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="goUpdatePage(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品列表数据
      goodsList: [],
      // 获取商品列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error(this.$t('Failed_to_get_product_list'))
      }
      console.log('ss', res)
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    async removeById(id) {
      // this.$confirm
      const confirmResult = await this.$confirm(
        this.$t('delete_product_continue'),
        this.$t('tips'),
        {
          confirmButtonText: this.$t('yes'),
          cancelButtonText: this.$t('no'),
          type: 'warning'
        }
      ).catch(err => {
        return err
      })
      if (confirmResult === 'cancel') {
        return this.$message.info(this.$t('deleted'))
      }
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(this.$t('Failed_to_delete_product'))
      }
      this.$message.success(this.$t('Successfully_deleted_product'))
      this.getGoodsList()
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    goAddPage() {
      this.$router.push('/goods/add')
    },
    goUpdatePage(id) {
      this.$router.push('/goods/update?id=' + id)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
