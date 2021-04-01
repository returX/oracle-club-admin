<template>
<div class="i-table">
  <a-table
      :bordered="bordered"
      :loading="loading"
      :columns="columns"
      :rowKey="rowKey"
      :pagination="pagination"
      :dataSource="dataSource"
      size="default"
      :expandedRowKeys="expandedRowKeys"
      :expandedRowRender="expandedRowRender"
      @change="onChange"
      :rowSelection="selectedRows && canChecked ? {selectedRowKeys: selectedRowKeys, onChange: handleChangeSelect} : undefined"
  >
    <template slot-scope="text, record, index" :slot="slot" v-for="slot in Object.keys($scopedSlots).filter(key => key !== 'expandedRowRender') ">
      <slot :name="slot" v-bind="{text, record, index}"></slot>
    </template>
    <template :slot="slot" v-for="slot in Object.keys($slots)">
      <slot :name="slot"></slot>
    </template>
    <template slot-scope="record, index, indent, expanded" :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''">
      <slot v-bind="{record, index, indent, expanded}" :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"></slot>
    </template>
  </a-table>
</div>
</template>

<script>
export default {
  name: "ITable",
  props:{
    dataSource:Array,
    columns: Array,
    bordered: Boolean,
    loading: [Boolean, Object],
    pagination: {
      type: [Object, Boolean],
      default: true
    },
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    selectedRows:Array,
    canChecked:Boolean,
    expandedRowKeys: Array,
    expandedRowRender: Function
  },
  data(){
    return{

    }
  },
  methods:{
    handleChangeSelect(selectedRowKeys, selectedRows){
      this.$emit("update:selectedRows",selectedRows)
      this.$emit("selectedRowChange",selectedRowKeys,selectedRows)
    },
    onChange(pagination, filters, sorter, { currentDataSource }){
      this.$emit('change', pagination, filters, sorter, {currentDataSource})
    }
  },
  computed:{
    selectedRowKeys(){
      return this.selectedRows.map(record => {
        return (typeof this.rowKey === 'function') ? this.rowKey(record) : record[this.rowKey]
      })
    }
  }
}
</script>

<style lang="less">
  .i-table{
    table:not([cellpadding]) td, table:not([cellpadding]) th{
      padding: 16px;
    }
  }
</style>