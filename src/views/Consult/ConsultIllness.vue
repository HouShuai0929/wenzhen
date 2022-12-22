<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ConsultIllness, Image } from '@/types/consult'
// import { IllnessTime } from '@/enums'
import { uploadImage } from '@/services/consult'
import type {
  UploaderAfterRead,
  UploaderFileListItem
} from 'vant/lib/uploader/types'
import { showConfirmDialog, showToast } from 'vant'
import { useConsultStore } from '@/stores'
import { useRouter } from 'vue-router'
import { timeOptions, flagOptions } from '@/services/constants'
const form = ref<ConsultIllness>({
  illnessDesc: '',
  illnessTime: undefined,
  consultFlag: undefined,
  pictures: []
})

// 时间选项
// const timeOptions = [
//   { label: '一周内', value: IllnessTime.Week },
//   { label: '一月内', value: IllnessTime.Month },
//   { label: '半年内', value: IllnessTime.HalfYear },
//   { label: '大于半年', value: IllnessTime.More }
// ]
// // 是否就诊选项
// const flagOptions = [
//   { label: '就诊过', value: 0 },
//   { label: '没就诊过', value: 1 }
// ]
const fileList = ref<Image[]>([])
const onAfterRead: UploaderAfterRead = (item) => {
  console.log('afterread', item)
  // 调上传接口
  if (Array.isArray(item)) return
  if (!item.file) return
  // 开始上传
  item.status = 'uploading'
  item.message = '上传中...'
  uploadImage(item.file)
    .then((res) => {
      item.status = 'done'
      item.message = undefined
      item.url = res.data.url
      form.value.pictures?.push(res.data)
    })
    .catch(() => {
      item.status = 'failed'
      item.message = '上传失败'
    })
}
const onDeleteImg = (item: UploaderFileListItem) => {
  console.log('delete', item)
  // 表单数据筛选  url不和传进来的一样 就保留下来
  form.value.pictures = form.value.pictures?.filter(
    (pic) => pic.url !== item.url
  )
  // 如果真实业务中需要删除服务器存的图片 可以通过传图片id由后端将图片删除
}
// 按钮不可点击的判断
const disabled = computed(
  () =>
    !form.value.illnessDesc ||
    form.value.illnessTime === undefined ||
    form.value.consultFlag === undefined
)

const store = useConsultStore()
const router = useRouter()
// 跳转下一页
const next = () => {
  // 校验数据
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.illnessTime === undefined)
    return showToast('请选择症状持续时间')
  if (form.value.consultFlag === undefined)
    return showToast('请选择是否已经就诊')
  // 数据存到store
  store.setIllness(form.value)
  // 跳转到选择患者
  // 跳转档案管理，需要根据 isChange 实现选择功能
  router.push('/user/patient?isChange=1')
}

// 页面加载时数据回显
onMounted(() => {
  if (store.consult.illnessDesc) {
    showConfirmDialog({
      title: '温馨提示',
      message: '是否恢复您之前填写的病情信息呢?',
      confirmButtonColor: 'var(--cp-primary)',
      closeOnPopstate: false
    }).then(() => {
      // 点击确认
      const { illnessDesc, illnessTime, consultFlag, pictures } = store.consult
      form.value = { illnessDesc, illnessTime, consultFlag, pictures }
      // 图片如果传了,也得回显
      fileList.value = pictures || []
    })
  }
})
</script>

<template>
  <div class="consult-illness-page">
    <cp-nav-bar title="图文问诊" />
    <!-- 医生提示 -->
    <div class="illness-tip van-hairline--bottom">
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <div class="info">
        <p class="tit">在线医生</p>
        <p class="tip">
          请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助
        </p>
        <p class="safe">
          <cp-icon name="consult-safe" /><span>内容仅医生可见</span>
        </p>
      </div>
    </div>
    <!-- 表单 -->
    <div class="illness-form">
      <van-field
        type="textarea"
        rows="3"
        placeholder="请详细描述您的病情,病情描述不能为空"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="item">
        <p>本次患病多久了?</p>
        <cp-radio-btn
          :options="timeOptions"
          v-model="form.illnessTime"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>此次病情是否去医院就诊过</p>
        <cp-radio-btn
          :options="flagOptions"
          v-model="form.consultFlag"
        ></cp-radio-btn>
      </div>
      <!-- 上传图片 -->
      <div class="illness-img">
        <van-uploader
          upload-icon="photo-o"
          upload-text="上传图片"
          max-count="9"
          :max-size="5 * 1024 * 1024"
          :after-read="onAfterRead"
          @delete="onDeleteImg"
          v-model="fileList"
        ></van-uploader>
        <p class="tip" v-if="fileList.length == 0">
          上传内容仅医生可见,最多9张图,最大5MB
        </p>
      </div>
      <!-- 下一步按钮 -->
      <van-button :class="{ disabled }" @click="next" type="primary" block round
        >下一步</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-illness-page {
  padding-top: 46px;
}
.illness-tip {
  display: flex;
  padding: 15px;
  .img {
    width: 52px;
    height: 52px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 10px;
  }
  .info {
    flex: 1;
    padding-left: 12px;
    .tit {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .tip {
      padding: 12px;
      background: var(--cp-bg);
      color: var(--cp-text3);
      font-size: 13px;
      margin-bottom: 10px;
    }
    .safe {
      font-size: 10px;
      color: var(--cp-text3);
      display: flex;
      align-items: center;
      .cp-icon {
        font-size: 12px;
        margin-right: 2px;
      }
    }
  }
}
.illness-form {
  padding: 15px;
  .van-field {
    padding: 0;
    &::after {
      border-bottom: none;
    }
  }
  .item {
    > p {
      color: var(--cp-text3);
      padding: 15px 0;
    }
  }
}
.illness-img {
  padding-top: 16px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  .tip {
    font-size: 12px;
    color: var(--cp-tip);
  }
  ::v-deep() {
    .van-uploader {
      &__preview {
        &-delete {
          left: -6px;
          top: -6px;
          border-radius: 50%;
          background-color: var(--cp-primary);
          width: 20px;
          height: 20px;
          &-icon {
            transform: scale(0.9) translate(-22%, 22%);
          }
        }
        &-image {
          border-radius: 8px;
          overflow: hidden;
        }
      }
      &__upload {
        border-radius: 8px;
      }
      &__upload-icon {
        color: var(--cp-text3);
      }
    }
  }
}
.van-button {
  font-size: 16px;
  margin-bottom: 30px;
  &.disabled {
    opacity: 1;
    background: #fafafa;
    color: #d9dbde;
    border: #fafafa;
  }
}
</style>
