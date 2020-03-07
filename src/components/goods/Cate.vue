<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a>商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <el-row>
        <!-- 表格 -->
        <tree-table
          class="treeTable"
          :data="cateList"
          :columns="columns"
          :selection-type="false"
          :expand-type="false"
          show-index
          index-text="#"
          border
          :show-row-hover="false"
        >
          <!-- 是否有效 -->
          <template slot="isok" slot-scope="scope">
            <i
              class="el-icon-success"
              style="color: lightgreen;"
              v-if="scope.row.cat_deleted === false"
            ></i>
            <i class="el-icon-error" style="color: red;" v-else></i>
          </template>
          <!-- 排序 -->
          <template slot="order" slot-scope="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag v-else type="info">三级</el-tag>
          </template>
          <!-- 操作 -->
          <template slot="opt">
            <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
          </template>
        </tree-table>
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
      </el-row>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用于指定数据源 props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        pagenum: 1,
        pagesize: 5,
        type: 3
      },
      cateList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 分类对话框的显示
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', tigger: 'blur' }
        ]
        // cat_pid: [{ required: true, message: '请选择父级分类', tigger: 'blur' }]
      },
      // 父级分类的数据列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类的id分组
      selectedKeys: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateList = res.data.result
      this.total = res.data.total
      console.log('cate', this.cateList)
    },
    // 监听pagesize
    handleSizeChange(newsize) {
      this.queryInfo.pagesize = newsize
      this.getCateList()
    },
    // 监听pagenum
    handleCurrentChange(newnum) {
      this.queryInfo.pagenum = newnum
      this.getCateList()
    },
    showAddCateDialog() {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表失败！')
      }
      this.parentCateList = res.data
      console.log(res)
    },
    // 选择项发生改变触发
    parentCateChanged() {
      // 选中数族length大于0 有父级
      if (this.selectedKeys > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      // 没有父级
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 点击添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        console.log('xinfenlei', this.addCateForm)
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('分类添加失败！')
        }
        this.$message.success('分类添加成功！')
        this.addCateDialogVisible = false
        this.getCateList()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
