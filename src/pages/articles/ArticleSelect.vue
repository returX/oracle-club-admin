<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >

            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="标题"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="queryParams.title" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="描述"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="queryParams.description" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="创建日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-range-picker style="width: 100%"
                                v-model="dateRange"
                                @change="handleChangeDate"
                                format="YYYY-MM-DD"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="advanced">
            <a-col :md="8" :sm="24" >
              <a-form-item
                  label="作者"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}"
              >
                <a-input v-model="queryParams.author" placeholder="请输入" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-space>
            <a-button @click="handleListArticle" type="primary">查询</a-button>
            <a-button @click="handleResetForm">重置</a-button>
            <a @click="toggleAdvanced">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </a-space>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">新建</a-button>
        <a-button
          @click="()=> canChecked = true"
          v-if="!canChecked"
      >批量操作</a-button>
        <template v-else>
          <a-popconfirm
              title="确定要删除吗？"
              ok-text="是"
              cancel-text="否"
              @confirm="handleDeleteArticleInBatch"
          >
            <a-button
                type="danger"
                icon="delete"
            >
              删除
            </a-button>
          </a-popconfirm>
          <a-dropdown>
            <a-menu slot="overlay"  @click="handleMenuClick">
              <a-menu-item key="1">
                移入回收站
              </a-menu-item>
            </a-menu>
            <a-button> 更多操作 <a-icon type="down" /> </a-button>
          </a-dropdown>
          <a-button
              icon="close"
              @click="handleCancelSelection"
          >
            取消
          </a-button>
        </template>
      </a-space>
      <i-table
          :columns="columns"
          :dataSource="dataSource"
          :selectedRows.sync="selectedRows"
          :canChecked="canChecked"
          :loading="loading"
          :pagination="{current:pagination.page,total:pagination.total,pageSize:pagination.size}"
          :row-key="record=>record.id"
          @change="handleTableChange"
      >
        <div slot="description" slot-scope="{text}">
          {{text}}
        </div>

        <div slot="viewCount" slot-scope="{text}">
          {{text}}次
        </div>

        <div slot="likeCount" slot-scope="{text}">
          {{text}}次
        </div>

        <div slot="status" slot-scope="{text}">
          <a-badge
              :status="text | articleBadge"
              :text="text | articleStatusCN"
          />
        </div>

        <div slot="createdAt" slot-scope="{text}">
          {{text | moment}}
        </div>

        <div slot="action" slot-scope="{text, record}">
          <a-space>
            <template v-if="record.status !== 'DELETED'">
              <a @click="handleToEdit(record)">
                <a-icon type="edit"/>编辑
              </a>
              <a-popconfirm
                  title="确定将该新闻稿移至回收站?"
                  @confirm="handleEditStatusClick(record,'DELETED')">
                  <a>
                    <a-icon type="delete" />回收站
                  </a>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-popconfirm
                title="确定要发布新闻稿?"
                @confirm="handleEditStatusClick(record,'PUBLISHED')"
              >
                <a>
                  <a-icon type="redo"/>还原
                </a>
              </a-popconfirm>

              <a-popconfirm
                  title="确定删除该新闻稿?(一经删除将无法恢复)"
                  @confirm="handleRemoveArticle(record.id)">
                <a>
                  <a-icon type="delete" />删除
                </a>
              </a-popconfirm>
            </template>
            <a @click="handleOpenSetting(record)">
              设置
            </a>
          </a-space>
        </div>

        <p slot="expandedRowRender" slot-scope="{record}" style="margin: 0">
          摘要：{{ record.description }}
        </p>
      </i-table>
    </div>
    <article-setting-drawer
        :article="selectedArticle"
        v-model="drawerVisible"
    />
  </a-card>
</template>

<script>
import moment from 'moment';
import ITable from "@/components/table/ITable";
import articleApi from "@/services/artcle";
import ArticleSettingDrawer from "@/components/drawer/ArticleSettingDrawer";
import {articleStatus} from "@/utils/constants";

const columns = [
  {
    title: '标题',
    dataIndex: 'title',
  },
  {
    title: '作者',
    dataIndex: 'author',
  },
  {
    title: '浏览次数',
    dataIndex: 'viewCount',
    sorter: (a,b)=>a.viewCount - b.viewCount,
    scopedSlots: { customRender: 'viewCount' },
  },
  {
    title: '点赞次数',
    dataIndex: 'likeCount',
    sorter: (a,b)=>a.likeCount - b.likeCount,
    scopedSlots: { customRender: 'likeCount' },
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    sorter: (a,b)=> a.createdAt - b.createdAt,
    scopedSlots: { customRender: 'createdAt' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: "ArticleSelect",
  components: {ArticleSettingDrawer, ITable},
  data () {
    return {
      advanced: false,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      canChecked: false,
      dateRange:null,
      loading: false,
      drawerVisible: false,
      selectedArticle: {},
      pagination: {
        page: 1,
        size: 10,
        sort: null,
        total: 1
      },
      queryParams:{
        title: null,
        author: null,
        description:null,
        status:null,
        createdStart:null,
        createdEnd:null,
        page: 1,
        size: 10,
        sort: null,
      }
    }
  },
  mounted() {
    this.handleListArticle()
  },
  methods: {
    handleOpenSetting(record){
      this.selectedArticle = record
      this.drawerVisible = true
    },
    handleEditStatusClick(record,status){
      record.status = status
      this.loading = true
      articleApi.update(record).then(resp=>{
        if (resp.data.result ==='ok'){
          console.log(resp)
        }
        this.loading = false
        this.handleListArticle()
      })
    },
    handleToEdit(record){
      this.$router.push({name:'新闻稿上传',query:{id: record.id}})
    },
    handleRemoveArticle(id){
      this.loading = true
      articleApi.delete(id).then(resp=>{
        console.log(resp.data)
        if (resp.data.result === "ok"){
          this.$message.success("删除文章成功")
        }
        this.loading = false
        this.handleListArticle()
      })
    },
    handleMenuClick({key}){
      //批量移入回收站
      this.loading = true
      if (key === "1"){
        articleApi.updateStatus(this.selectedIds,articleStatus.DELETED).then(resp=>{
          if (resp.data.result === "ok"){
            console.log(resp.data)
            this.$message.success("批量移入回收站成功")
          }
          this.loading = false
          this.canChecked = false
          this.handleListArticle()
        })
      }
    },
    handleChangeDate([start,end]){
      this.queryParams.createdStart = moment(start).unix() * 1000
      this.queryParams.createdEnd = moment(end).unix() * 1000
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    remove() {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    handleTableChange(pagination){
      console.log(pagination)
      this.pagination.size = pagination.pageSize
      this.pagination.page = pagination.current
      this.handleListArticle()
    },
    addNew() {
      this.$router.push("new")
    },
    handleResetForm(){
      this.queryParams = {}
      this.dateRange = null
      this.handlePaginationChange(1,10)
    },
    handlePaginationChange(page,size){
      this.pagination.page = page
      this.pagination.size = size
      this.handleListArticle()
    },
    handleDeleteArticleInBatch(){
      this.canChecked = false
      const ids = this.selectedRows.map(item => item.id)
      articleApi.deleteMulti(ids).then(resp=>{
        if (resp.data.result === "ok"){
          this.$message.success("批量删除成功")
          this.handleListArticle()
        }
      })
    },
    handleCancelSelection(){
      this.canChecked = false
      this.selectedRows = []
      this.$message.success("取消批量删除")
    },
    handleListArticle(){
      this.loading = true
      this.queryParams.size = this.pagination.size
      this.queryParams.page = this.pagination.page - 1
      articleApi.list(this.queryParams).then(resp=>{
        if (resp.data.result === "ok"){
          const {data} = resp.data
          this.dataSource = data.content
          this.pagination.total = data.totalElements
        }
        this.loading = false
      })
    }
  },
  computed:{
    selectedIds(){
      return this.selectedRows.map(item => item.id)
    }
  }
}
</script>

<style lang="less" scoped>
.search{
  margin-bottom: 54px;
}
.fold{
  width: calc(100% - 216px);
  display: inline-block
}
.operator{
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>