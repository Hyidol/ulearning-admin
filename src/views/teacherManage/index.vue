<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.teaName" size="small" placeholder="姓名" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.teaNumber" size="small" placeholder="工号" style="width: 200px;" class="filter-item" />
      <el-input v-model="listQuery.teaDept" size="small" placeholder="系部" style="width: 200px;" class="filter-item" />
      <el-button
        v-waves
        round
        size="small"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <Upload
        url="/system-manage/teacher/importExcel"
        file-key="file"
        class-name="fr"
        :on-success="uploadSuccess"
      >
        <el-button
          v-permission="['teacher:importExcel']"
          size="small"
          round
          class="filter-item"
          style="margin-left: 10px;"
          type="success"
          icon="el-icon-upload2"
        >
          批量导入
        </el-button>
      </Upload>
      <el-button
        v-permission="['teacher:downloadTemplate']"
        size="small"
        round
        class="filter-item fr"
        style="margin-left: 10px;"
        type="info"
        icon="el-icon-download"
        @click="handleDownloadTemplate"
      >
        下载模板
      </el-button>
      <el-button
        v-permission="['teacher:save']"
        round
        size="small"
        class="filter-item fr"
        style="margin-left: 10px;"
        type="success"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      size="small"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="50"
        :index="indexMethod"
      />
      <el-table-column label="工号" prop="teaNumber" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.teaNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" min-width="50" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaGender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系部" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaDept }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teaPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" min-width="200">
        <template slot-scope="{row}">
          <span>{{ row.teaEmail }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button
            v-permission="['teacher:saveAssignedRole']"
            type="primary"
            size="mini"
            round
            @click="showPopTransfer(row)"
          >
            分配角色
          </el-button>
          <el-button
            v-permission="['teacher:update']"
            type="primary"
            size="mini"
            round
            @click="handleUpdate(row)"
          >
            修改
          </el-button>
          <el-button
            v-permission="['teacher:updatePasswordById']"
            type="primary"
            size="mini"
            round
            @click="handleUpdatePassword(row)"
          >
            修改密码
          </el-button>
          <el-button
            v-permission="['teacher:delete']"
            size="mini"
            type="danger"
            round
            @click="handleDelete(row,$index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page-sizes="[8, 16, 32, 64]"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
      class="fr"
      @pagination="setPagination"
    />

    <el-dialog
      v-el-drag-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        size="small"
        label-position="left"
        label-width="70px"
      >
        <el-form-item label="工号" prop="teaNumber">
          <el-input v-model="temp.teaNumber" />
        </el-form-item>
        <el-form-item label="姓名" prop="teaName">
          <el-input v-model="temp.teaName" />
        </el-form-item>
        <el-form-item label="性别" prop="teaGender">
          <el-select v-model="temp.teaGender" class="filter-item">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
        </el-form-item>
        <el-form-item label="系部" prop="teaDept">
          <el-input v-model="temp.teaDept" />
        </el-form-item>
        <el-form-item label="职称" prop="teaTitle">
          <el-input v-model="temp.teaTitle" />
        </el-form-item>
        <el-form-item label="电话" prop="teaPhone">
          <el-input v-model="temp.teaPhone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="teaEmail">
          <el-input v-model="temp.teaEmail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
    <pop-transfer
      v-model="chooseList"
      v-el-drag-dialog
      pop-title="分配角色"
      :list-titles="['角色池', '已选项']"
      :data="rolesList"
      :visible="visible"
      :on-close="close"
      :on-submit="updateRoles"
    />
    <!-- 提示消息 -->
    <el-dialog
      v-el-drag-dialog
      class-name="error-dialog"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <span>{{ dialogTitle }}</span>
      <ul>
        <li
          v-for="item in dialogMessageList"
          :key="item.line"
          :style="{lineHeight: '23px'}"
        >
          {{ `第${item.line}行：${item.errorMsg}` }}
        </li>
      </ul>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-el-drag-dialog
      title="修改密码"
      :visible.sync="updatePasswordDialogFormVisible"
    >
      <el-form
        ref="updatePasswordForm"
        :rules="updatePasswordRules"
        :model="updatePasswordTemp"
        size="small"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="updatePasswordTemp.newPassword" />
        </el-form-item>
        <el-form-item label="新密码确认" prop="repeatNewPassword">
          <el-input type="password" v-model="updatePasswordTemp.repeatNewPassword" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatePasswordDialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePassword()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { isEmail, isPhone } from '@/utils/validate'
import PopTransfer from '@/components/PopTransfer'
import { updatePasswordById, getTeacherPageList, updateTeacher, addTeacher, deleteTeacher, getAssignedRole, saveAssignedRole } from '@/api/teacher-manage'
import { getRolesList } from '@/api/role-manage'
import permission from '@/directive/permission/index.js' // 权限判断指令
import elDragDialog from '@/directive/el-drag-dialog'

export default {
  name: 'TeacherManage',
  components: { Pagination, PopTransfer, Upload },
  directives: { waves, permission, elDragDialog },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else if (!isPhone(value)) {
        return callback(new Error('手机格式有误!'))
      } else {
        return callback()
      }
    }
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback()
      } else if (!isEmail(value)) {
        return callback(new Error('邮箱格式有误!'))
      } else {
        return callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 8,
        teaName: '',
        teaNumber: '',
        teaDept: ''
      },
      temp: {
        id: '',
        teaDept: '',
        teaGender: '',
        teaName: '',
        teaNumber: '',
        teaTitle: '',
        teaPhone: '',
        teaEmail: ''
      },
      updatePasswordTemp: {
        id: '',
        newPassword: '',
        repeatNewPassword: '',
      },
      updatePasswordDialogFormVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改教师信息',
        create: '添加教师'
      },
      rules: {
        // teaDept: [{ required: true, message: '请输入系部', trigger: 'blur' }],
        // teaGender: [{ required: true, message: '请选择性别', trigger: 'change' }],
        teaName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        teaNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        // teaTitle: [{ required: true, message: '请输入职称', trigger: 'blur' }],
        teaPhone: [{ required: false, validator: checkPhone, trigger: 'blur' }],
        teaEmail: [{ required: false, validator: checkEmail, trigger: 'blur' }]
      },
      updatePasswordRules: {
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        repeatNewPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }]
      },
      // 穿梭框参数
      visible: false,
      rolesList: [],
      chooseList: [],
      selectTeacherId: '',
      dialogVisible: false, // 消息提示
      dialogTitle: '', //
      dialogMessageList: [] // {line:xxx, errorMsg:xxx}
    }
  },
  created() {
    this.getPagePars()
    this.getList()
    this.getRolesList()
  },
  methods: {
    getPagePars() {
      const { pagePars } = this.$store.getters
      const path = this.$route.path
      if (pagePars.has(path)) {
        const { currentPage, pageSize, filter } = pagePars.get(path)
        this.listQuery = {
          currentPage,
          pageSize,
          teaName: filter.teaName,
          teaNumber: filter.teaNumber,
          teaDept: filter.teaDept
        }
        return true
      } else {
        return false
      }
    },
    savePagePars() {
      const path = this.$route.path
      const pars = {
        currentPage: this.listQuery.currentPage,
        pageSize: this.listQuery.pageSize,
        filter: {
          teaName: this.listQuery.teaName,
          teaNumber: this.listQuery.teaNumber,
          teaDept: this.listQuery.teaDept
        }
      }
      this.$store.dispatch('pagePars/savePagePars', { path, pars })
    },
    uploadSuccess(response) {
      const { message, data } = response.data
      if (message && data) {
        this.dialogVisible = true
        this.dialogTitle = message
        this.dialogMessageList = Object.keys(data).map(key => {
          return {
            line: key,
            errorMsg: data[key].errorMsg
          }
        })
      } else {
        this.$message.success('导入成功')
      }
    },
    // 下载教师模板
    handleDownloadTemplate() {
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = process.env.VUE_APP_BASE_API + '/system-manage/teacher/downloadTemplate'
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    },
    close() {
      this.visible = false
    },
    updatePage(val) {
      this.listQuery.currentPage = val
    },
    updateLimit(val) {
      this.listQuery.pageSize = val
    },
    // 显示穿梭弹窗
    async showPopTransfer(row) {
      this.selectTeacherId = row.id
      const response = await getAssignedRole({ id: row.id })
      this.chooseList = response.data.map(item => item + '')
      this.visible = true
    },
    getList() {
      this.savePagePars()
      this.listLoading = true
      getTeacherPageList(this.listQuery)
        .then(response => {
          const { content, total } = response.data
          this.list = content
          this.total = total
          this.listLoading = false
        })
    },
    getRolesList() {
      getRolesList()
        .then(response => {
          this.rolesList = response.data
        })
    },
    setPagination(currentPage, pageSize) {
      // this.listQuery.currentPage = currentPage
      // this.listQuery.pageSize = pageSize
      this.getList()
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    async updateRoles() {
      // 1. 获取数据
      const ids = this.chooseList.join(',')
      const data = {
        roleIds: ids,
        teaId: this.selectTeacherId
      }
      // 2. 发送请求
      await saveAssignedRole(data)
      this.$message({
        type: 'success',
        message: '角色分配成功'
      })
      this.visible = false
    },
    resetTemp() {
      this.temp = {
        'id': '',
        'teaDept': '', // 系部
        'teaEmail': '', // 邮箱
        'teaGender': '', // 性别
        'teaName': '', // 姓名
        'teaNumber': '', // 工号
        'teaPhone': '', // 电话
        'teaTitle': '' // 职称
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 1. 添加教师
          addTeacher(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '教师添加成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 1. 发送请求
          updateTeacher(this.temp)
            .then(response => {
              this.$message({
                type: 'success',
                message: '教师信息更新成功'
              })
              this.getList()
              this.dialogFormVisible = false
            })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('确定永久删除该教师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送请求
        deleteTeacher({ id: row.id })
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      }).catch(() => {

      })
    },
    indexMethod(index) {
      return (index + 1) + (this.listQuery.currentPage - 1) * this.listQuery.pageSize
    },
    resetUpdatePasswordTemp() {
      this.updatePasswordTemp = {
        id: '',
        newPassword: '',
        repeatNewPassword: ''
      }
    },
    handleUpdatePassword(row) {
      this.resetUpdatePasswordTemp()
      this.updatePasswordTemp.id = row.id
      this.updatePasswordDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['updatePasswordForm'].clearValidate()
      })
    },
    updatePassword() {
      this.$refs['updatePasswordForm'].validate((valid) => {
        if(valid){
          if(this.updatePasswordTemp.newPassword !== this.updatePasswordTemp.repeatNewPassword){
            this.$message({
              message: '输入的两次密码不一致',
              type: 'warning'
            });
          } else {
            updatePasswordById(this.updatePasswordTemp)
              .then(response => {
                this.$message({
                  type: 'success',
                  message: '学生密码修改成功'
                })
                this.getList()
                this.updatePasswordDialogFormVisible = false
              })
          }
        }
      })
    }
    /* handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    } */
  }
}
</script>
<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss">
.app-container {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .el-select {
    width: 100%;
  }
}
</style>
