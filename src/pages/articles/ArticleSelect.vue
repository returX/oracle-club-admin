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
        <a-popconfirm
            title="确定要删除吗？"
            ok-text="是"
            cancel-text="否"
            v-if="canChecked"
            @confirm="handleDeleteArticleInBatch"
        >
          <a-button
              type="danger"
              icon="delete"
          >
            删除
          </a-button>
        </a-popconfirm>
        <a-button
            icon="close"
            v-if="canChecked"
            @click="handleCancelSelection"
        >
          取消
        </a-button>
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
            <a>
              <a-icon type="edit"/>编辑
            </a>
            <a @click="handleDeleteArticleOne(record.key)">
              <a-icon type="delete" />删除
            </a>
          </a-space>
        </div>

        <p slot="expandedRowRender" slot-scope="{record}" style="margin: 0">
          概述：{{ record.description }}
        </p>
      </i-table>
    </div>
  </a-card>
</template>

<script>
import ITable from "@/components/table/ITable";
import articleApi from "@/services/artcle";

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
  components: {ITable},
  data () {
    return {
      advanced: false,
      columns: columns,
      dataSource: [],
      selectedRows: [],
      canChecked: false,
      dateRange:null,
      loading: false,
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
    handleDeleteArticleOne(id) {
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
      if (this.dateRange){
        this.queryParams.createdStart = new Date(this.dateRange[0]._d).getTime()
        this.queryParams.createdEnd = new Date(this.dateRange[1]._d).getTime()
      }
      articleApi.list(this.queryParams).then(resp=>{
        if (resp.data.result === "ok"){
          const {data} = resp.data
          this.dataSource = data.content
          this.pagination.total = data.totalElements
        }
        this.loading = false
      })
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