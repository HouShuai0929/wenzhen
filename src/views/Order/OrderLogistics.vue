<script setup lang="ts">
import { getMedicalOrderLogistics } from '@/services/order'
import { ref, onMounted } from 'vue'
import type { Logistics } from '@/types/order'
import { useRoute } from 'vue-router'
import AMapLoader from '@amap/amap-jsapi-loader'
import endImg from '@/assets/end.png'
import startImg from '@/assets/start.png'
import carImg from '@/assets/car.png'
const route = useRoute()
const logistics = ref<Logistics>()

onMounted(async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  logistics.value = res.data
  window._AMapSecurityConfig = {
    securityJsCode: '4023ab921b5c38d4cc97ddc9f6f83cd5'
  }
  AMapLoader.load({
    key: 'f49f88f95c60c46f3aec10ab2c435117', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: [''] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      // 使用AMap 初始化地图
      const map = new AMap.Map('map', {
        //设置地图容器id
        mapStyle: 'amap://styles/fresh',
        zoom: 12 //初始化地图级别
      })

      AMap.plugin('AMap.Driving', function () {
        var driving = new AMap.Driving({
          map: map,
          showTraffic: false,
          hideMarkers: true
        })

        var start = res.data.logisticsInfo.shift()
        var end = res.data.logisticsInfo.pop()
        // 替换图标点
        // 终点
        const endMarker = new AMap.Marker({
          position: [end?.longitude, end?.latitude],
          icon: endImg
        })
        map.add(endMarker)
        // 起点
        const startMarker = new AMap.Marker({
          position: [start?.longitude, start?.latitude],
          icon: startImg
        })
        map.add(startMarker)
        // 当前所在位置点
        const marker = new AMap.Marker({
          position: [res.data.currentLocationInfo.longitude, res.data.currentLocationInfo.latitude],
          icon: carImg,
          anchor: 'center'
        })
        map.add(marker)

        driving.search(
          [start?.longitude, start?.latitude],
          [end?.longitude, end?.latitude],
          {
            waypoints: res.data.logisticsInfo.map((item) => [item.longitude, item.latitude])
          },
          function (status: string, result: object) {
            // 未出错时，result即是对应的路线规划方案
            console.log('+++++', status, result)
            setTimeout(() => {
              map.setFitView([marker])
              map.setZoom(10)
            }, 3000)
          }
        )
      })
    })
    .catch((e) => {
      console.log(e)
    })
})
</script>

<template>
  <div class="order-logistics-page" v-if="logistics">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ logistics.statusValue }} 预计{{ logistics.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ logistics.name }}</span>
          <span>{{ logistics.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics.list" :key="item.id">
          <p class="status" v-if="item.statusValue">{{ item.statusValue }}</p>
          <p class="content">
            {{ item.content }}
          </p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}

#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;

  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    > span {
      flex: 1;
      text-align: center;
    }

    .van-icon {
      font-size: 18px;
      color: #666;

      &:last-child {
        color: var(--cp-primary);
      }
    }
  }

  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    .status {
      font-size: 15px;
      line-height: 26px;
    }

    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;

      > span {
        padding-right: 10px;
      }
    }
  }
}

.logistics {
  padding: 0 10px 20px;

  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }

  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }

    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }

    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }

    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
