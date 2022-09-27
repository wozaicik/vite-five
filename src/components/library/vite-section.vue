<template>
    <div id="section" style="width:1650px; height: 320px;" v-if="isOpen" class="section">
    </div>
  </template>

<script>
import { storeToRefs } from 'pinia'
import { defineComponent, watch } from 'vue'
import { useDisPolylineStore } from '../../store/disPolyline'

export default defineComponent({
  name: 'ViteSection',
  setup () {
    const dispolyline = useDisPolylineStore()
    const { isOpen } = storeToRefs(dispolyline)
    // let data
    watch(() => isOpen.value, (newVal) => {
      if (newVal && dispolyline.getLonLatArr.length >= 3) {
        dispolyline.calSectionlView().then(result => {
          console.log(result)
          drawEchart(result)
        })
      }
    }, { immediate: true })

    return { isOpen }
  }
})

const drawEchart = (dataAB) => {
  if (!window.echarts) {
    return
  }
  const dataA = dataAB.map(item => item[0].toFixed(2))
  console.log(dataA)
  const dataB = dataAB.map(item => item[1])
  console.log(dataB)
  const chartDom = document.getElementById('section')
  const myChart = window.echarts.init(chartDom)

  const option = {
    xAxis: {
      type: 'category',
      data: dataA
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: dataB,
        type: 'line',
        smooth: true
      }
    ]
  }
  option && myChart.setOption(option)
}

</script>

<style lang="scss" scoped>
.section{
    position: absolute;
    top: 600px;
    left: -1300px;
    border: 0;
    margin: 0;
    background-color: #fff;
}
</style>
