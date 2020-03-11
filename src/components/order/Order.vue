<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>订单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column width="95px" prop="order_price" label="订单价格"></el-table-column>
        <el-table-column width="90px" prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="140px" prop="is_send" label="是否发货"></el-table-column>
        <el-table-column width="140px" prop="add_time" label="下单时间">
          <template slot-scope="scope">{{ scope.row.create_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox(scope.row.goods_id)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox(scope.row.goods_id)"
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

    <!-- 修改地址的对话框   -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="120px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- 选择省市区的级联选择框 -->
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流的对话框   -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <!-- 时间轴 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      ordersList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      activities: [],
      reverse: true
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }
      console.log('ss', res)
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.addressVisible = false
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流信息失败！')
      }
      console.log('wuliu', res.data)
      this.activities = res.data
      // this.ordersList = res.data.goods
      // this.total = res.data.total
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
el-cascader {
  width: 100%;
}
</style>
