<template>
  <div>
    <!-- 抽屉定义 -->
    <Drawer title="添加团队" width="600" :closable="false" v-model="drawerAddTeam">
      <Form ref="addTeamFormRef" :model="addTeamForm" :rules="rules" :label-width="80">
        <FormItem label="团队名称" prop="name">
          <Input v-model="addTeamForm.name" placeholder="输入团队名称"></Input>
        </FormItem>
        <FormItem label="负责人" prop="user_id">
          <Select v-model="addTeamForm.user_id" placeholder="请选择用户">
            <Option v-for="item in userList" :key="item.id" :value="item.id">{{ item.username }}</Option>
          </Select>
        </FormItem>

        <FormItem>
          <Button type="primary" @click="handleAddTeam('addTeamFormRef')" long :loading="addTeamLoading">添加团队</Button>
        </FormItem>
      </Form>
    </Drawer>

    <!-- 过滤区域 -->
    <div class="filter item">
      <Row :gutter="16">
        <Col span="6">
          <Input search placeholder="搜索内容" v-model="params.keyword" @on-enter="loadTeam"/>
        </Col>
        <Col span="6" offset="12">
          <Span class="right">
            <Span class="button-item">
            <Button type="primary" icon="ios-person-add" @click="drawerAddTeam = true"> 添加团队 </Button>
          </Span>
          <Span class="button-item">
            <Button icon="md-arrow-down" :loading="exportLoading" @click="exportExcel"> 导出团队 </Button>
          </Span>
          </Span>
        </Col>
      </Row>
    </div>

    <!-- 内容区域 -->
    <div class="item content">
      <Table :columns="columns" :data="data" :loading="loading" :height="height">
        <template #action="{ row, index }">
          <Button type="primary" size="small" class="button-item" @click="handleOpenChangeTeam(row)">修改</Button>
          <Button type="error" size="small" class="button-item" @click="handleOpenDeleteTeam(row)">删除</Button>
        </template>
      </Table>
    </div>

  </div>
</template>

<script>
import excel from '@/libs/excel'

import { APIListTeam, APICreateTeam } from '../../api/relation/relationTeam'
import { APIListUser } from '../../api/sso/user'

export default {
  name: 'Team',
  data () {
    return {
      params: {
        keyword: ''
      },
      drawerAddTeam: false,
      loading: false,
      exportLoading: false,
      addTeamLoading: false,
      height: 800,
      columns: [
        {
          title: '#',
          key: 'id'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '负责人',
          key: 'username'
        },
        {
          title: '创建时间',
          key: 'create_time'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data: [],
      userList: [],
      addTeamForm: {
        name: '',
        user_id: 0
      },
      rules: {
        name: [
          { required: true, message: '团队名称不能为空', trigger: 'blur' }
        ],
        user_id: [
          { required: true, type: 'number', message: '请选择负责人', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.loadUser()
  },
  mounted () {
    this.loadTeam()
  },
  methods: {
    /**
     * 载入团队
     */
    loadTeam () {
      APIListTeam(this.params).then(res => {
        this.data = res.data.data
      })
    },
    /**
     * 载入用户
     */
    loadUser () {
      APIListUser().then(res => {
        this.userList = res.data.data
      })
    },
    /**
     * 导入Excel
     */
    exportExcel () {
      if (this.data.length) {
        this.exportLoading = true
        const params = {
          title: ['ID', '名称', 'Owner', '创建时间'],
          key: ['id', 'name', 'owner', 'create_time'],
          data: this.data.map((row) => {
            return {
              id: row.id,
              name: row.name,
              owner: row.username,
              create_time: row.create_time
            }
          }),
          autoWidth: true,
          filename: '团队列表'
        }
        excel.export_array_to_excel(params)
        this.exportLoading = false
      } else {
        this.$Message.info('表格数据不能为空！')
      }
    },
    /**
     * 修改团队
     */
    handleOpenChangeTeam () {

    },
    /**
     * 删除团队
     */
    handleOpenDeleteTeam () {

    },
    /**
     * 添加团队
     */
    handleAddTeam (name) {
      console.log('name: ', name)
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addTeamLoading = true
          APICreateTeam(this.addTeamForm).then(_ => {
            this.$Message.success(`团队 ${this.addTeamForm.name} 添加成功`)
            this.addTeamLoading = false
            this.drawerAddTeam = false
            this.loadTeam()
          }).catch(_ => {
            this.addTeamLoading = false
          })
        } else {
          this.drawerAddTeam = false
        }
      })
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
