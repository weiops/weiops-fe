<template>
  <div>
    <!-- 抽屉定义 -->
    <Drawer title="添加用户" width="600" :closable="false" v-model="drawerAddUser">
      <Alert type="warning">密码将由后台自动创建，首次登陆后请修改密码。</Alert>

      <Form ref="addFormRef" :model="addUserForm" :rules="UserRules" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input v-model="addUserForm.username" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="addUserForm.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="addUserForm.phone" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleAddUser('addFormRef')" long :loading="addUserLoading">添加</Button>
        </FormItem>
      </Form>
    </Drawer>

    <Drawer title="修改用户" width="600" :closable="false" v-model="drawerUpdateUser">
      <Form ref="updateFormRef" :model="curUpdateUserForm" :rules="UserRules" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input v-model="curUpdateUserForm.username" placeholder="输入用户名" disabled></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="curUpdateUserForm.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="手机号" prop="phone">
          <Input v-model="curUpdateUserForm.phone" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleChangeUser('updateFormRef')" long :loading="updateUserLoading">修改</Button>
        </FormItem>
      </Form>
    </Drawer>

    <Modal v-model="drawerDeleteUser" :footer-hide="true" title="删除用户">
      <p>确认要删除用户 <b style="color: red"> {{ curDeleteUserForm.username }} </b> 吗？</p>
      <Button type="error" @click="handleDeleteUser" long :loading="deleteUserLoading" style="margin-top: 30px">删除</Button>
    </Modal>

    <!-- 过滤区域 -->
    <div class="filter item">
      <Row :gutter="16">
        <Col span="6">
          <Input search placeholder="搜索内容" v-model="params.keyword" @on-enter="loadUsers"/>
        </Col>
        <Col span="6" offset="12">
          <Span class="right">
            <Span class="button-item">
            <Button type="primary" icon="ios-person-add" @click="drawerAddUser = true"> 添加用户 </Button>
          </Span>
          <Span class="button-item">
            <Button icon="md-arrow-down" :loading="exportLoading" @click="exportExcel"> 导出用户 </Button>
          </Span>
          </Span>
        </Col>
      </Row>
    </div>

    <!-- 内容区域 -->
    <div class="item content">
      <Table :columns="columns" :data="data" :loading="loading" :height="height">
        <template #action="{ row, index }">
          <Button type="primary" size="small" class="button-item" @click="handleOpenChangeUser(row)">修改</Button>
          <Button type="error" size="small" class="button-item" @click="handleOpenDeleteUser(row)">删除</Button>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>

import excel from '@/libs/excel'
import { APICreateUser, APIDeleteUser, APIListUser, APIUpdateUser } from '../../../api/sso/user'

export default {
  name: 'User',
  data () {
    return {
      params: {
        keyword: ''
      },
      columns: [
        {
          title: '#',
          key: 'id'
        },
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '邮箱地址',
          key: 'email'
        },
        {
          title: '手机号',
          key: 'phone'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data: [],
      loading: false,
      height: 800,
      drawerAddUser: false,
      addUserForm: {
        username: '',
        email: '',
        phone: ''
      },
      UserRules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          { type: 'email', message: '错误的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' }
        ]
      },
      drawerUpdateUser: false,
      curUpdateUserForm: {
        id: 0,
        username: '',
        email: '',
        phone: ''
      },
      addUserLoading: false,
      updateUserLoading: false,
      curDeleteUserForm: {
        id: 0,
        username: ''
      },
      drawerDeleteUser: false,
      deleteUserLoading: false,
      exportLoading: false
    }
  },
  created () {
    // load user data
    this.loadUsers()
  },
  methods: {
    /**
     * 载入用户列表
     */
    loadUsers () {
      this.loading = true
      // 加载用户数据
      APIListUser(this.params).then(res => {
        this.data = res.data.data
        this.loading = false
      }).catch(_ => {
        this.loading = false
      })
    },
    /**
     * 添加用户
     */
    handleAddUser (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addUserLoading = true
          APICreateUser(this.addUserForm).then(_ => {
            this.$Message.success(`用户 ${this.addUserForm.username} 添加成功`)
            this.addUserLoading = false
            this.drawerAddUser = false
            this.loadUsers()
          }).catch(_ => {
            this.addUserLoading = false
          })
        } else {
          this.drawerAddUser = false
        }
      })
    },
    /**
     * 打开修改用户的抽屉
     */
    handleOpenChangeUser (row) {
      this.curUpdateUserForm = row
      this.drawerUpdateUser = true
    },
    /**
     * 修改用户
     */
    handleChangeUser (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // curUpdateUserForm
          this.updateUserLoading = true
          APIUpdateUser(this.curUpdateUserForm).then(_ => {
            this.$Message.success(`修改用户 ${this.curUpdateUserForm.username} 成功`)
            this.updateUserLoading = false
            this.drawerUpdateUser = false
            this.loadUsers()
          }).catch(_ => {
            this.updateUserLoading = false
          })
        }
      })
    },
    /**
     * 打开删除用户的抽屉
     */
    handleOpenDeleteUser (row) {
      this.curDeleteUserForm = row
      this.drawerDeleteUser = true
    },
    /**
     * 删除用户
     */
    handleDeleteUser () {
      this.deleteUserLoading = true
      APIDeleteUser(this.curDeleteUserForm.id).then(_ => {
        this.$Message.success(`删除用户 ${this.curDeleteUserForm.username} 成功`)
        this.deleteUserLoading = false
        this.drawerDeleteUser = false
        this.loadUsers()
      }).catch(_ => {
        this.deleteUserLoading = false
      })
    },
    /**
     * 导出数据
     */
    exportExcel () {
      if (this.data.length) {
        this.exportLoading = true
        const params = {
          title: ['ID', '用户名', '邮箱地址', '手机号'],
          key: ['id', 'username', 'email', 'phone'],
          data: this.data.map((row) => {
            return {
              id: row.id,
              username: row.username,
              email: row.email,
              phone: row.phone
            }
          }),
          autoWidth: true,
          filename: '用户列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    }
  }
}
</script>

<style scoped>
.item {
  margin-top: 10px;
}

.button-item {
  margin-right: 5px;
}

.right {
  position: absolute;
  right: 0px;
}

</style>
