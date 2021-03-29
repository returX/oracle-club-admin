<template>
  <a-drawer
      title="附件详情"
      :width="540"
      :visible="visible"
      closable
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
  >
    <a-row
        type="flex"
        align="middle"
    >
      <a-col :span="24">
        <div class="attach-detail-img">
          <div v-show="nonsupportPreviewVisible">此文件不支持预览</div>
          <a
              :href="attachment.path"
              target="_blank"
          >
            <img
                :src="attachment.path"
                v-show="photoPreviewVisible"
                class="w-full"
                loading="lazy"
            >
          </a>
        </div>
      </a-col>
      <a-divider />
      <a-col :span="24">
        <a-list item-layout="horizontal">
          <a-list-item>
            <a-list-item-meta>
              <template
                  slot="description"
                  v-if="editable"
              >
                <a-input
                    ref="nameInput"
                    v-model="attachment.name"
                    @blur="doUpdateAttachment"
                />
              </template>
              <template
                  slot="description"
                  v-else
              >{{ attachment.name }}</template>
              <span slot="title">
                附件名：
                  <a-icon
                      type="edit"
                      @click="handleEditName"
                  />
              </span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="attachment.mediaType">
              <span slot="title">附件类型：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="attachment.type">
              <span slot="title">储存位置：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template slot="description">
                {{ attachment.size | fileSizeFormat }}
              </template>
              <span slot="title">附件大小：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item v-if="photoPreviewVisible">
            <a-list-item-meta :description="attachment.height+'x'+attachment.width">
              <span slot="title">图片尺寸：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta>
              <template slot="description">
                {{ attachment.createdAt | moment }}
              </template>
              <span slot="title">上传日期：</span>
            </a-list-item-meta>
          </a-list-item>
          <a-list-item>
            <a-list-item-meta :description="attachment.path">
              <span slot="title">
                普通链接：
                <a
                    href="javascript:void(0);"
                    @click="handleCopyNormalLink"
                >
                  <a-icon type="copy" />
                </a>
              </span>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>

import attachmentApi from "@/services/attachment";

export default {
  name: "AttachmentDetailDrawer",
  data(){
    return{
      photoPreviewVisible: true,
      nonsupportPreviewVisible: false,
      editable: false,
    }
  },
  model: {
    prop: 'visible',
    event: 'close',
  },
  props:{
    attachment: {
      type: Object,
      required: true,
    },
    visible: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed:{

  },
  methods:{
    onClose(){
      this.$emit('close', false)
    },
    handleEditName(){
      this.editable = true
    },
    doUpdateAttachment(){
      this.editable = false
      attachmentApi.update(this.attachment.id,{
        name: this.attachment.name
      }).then(resp=>{
        console.log(resp)
      })
    },
    //todo 复制链接
    handleCopyNormalLink(){

    }
  }
}
</script>

<style scoped lang="less">
.attach-detail-img{
  display: flex;
  justify-content: center;
}
</style>