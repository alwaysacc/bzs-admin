<template>
  <div class="home">
    <el-row>
      <el-col span="6">
        车牌号：{{ map.carInfo.carNumber }}
      </el-col>
      <el-col span="6">
        车牌型号：{{ map.carInfo.brandModel }}
      </el-col>
    </el-row>
    <el-dropdown></el-dropdown>
    <el-row>
      <el-col span="6">
        交强险：{{ map.quoteInfo.forceTotal }}元
      </el-col>
      <el-col span="6">
        车船税：{{ map.quoteInfo.taxTotal }}元
      </el-col>
      <el-col span="6">
        商业险：{{ map.quoteInfo.bizTotal }}元
      </el-col>
      <el-col span="6">
        合计：{{ map.quoteInfo.total }}元
      </el-col>
    </el-row>
    <el-row class="line">
      <el-col span="20">
        <a style="font-weight: bold">车主信息</a>

      </el-col>
      <el-col span="4" />
    </el-row>
    <el-row class="row">
      <el-col span="6">
        车主姓名：{{ map.carInfo.licenseOwner }}
      </el-col>
      <el-col span="6">
        证件类型：身份证
      </el-col>
      <el-col span="6">
        证件号码：{{ map.carInfo.licenseOwnerIdCard }}
      </el-col>
    </el-row>
    <el-row class="line">
      <el-col span="20">
        <a style="font-weight: bold">被保险人信息</a>
        <el-switch
          v-model="value"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
        <a>被保险人与车主信息一致</a>
      </el-col>
    </el-row>
    <el-row v-if="!value" class="row">
      <el-col span="6">
        被保人姓名：{{ map.carInfo.licenseOwner }}
      </el-col>
      <el-col span="6">
        证件类型：身份证
      </el-col>
      <el-col span="6">
        证件号码：{{ map.carInfo.licenseOwnerIdCard }}
      </el-col>
    </el-row>
    <el-row class="line">
      <el-col span="20">
        <a style="font-weight: bold">投保人信息</a>&emsp;
        <el-switch
          v-model="value2"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
        <a>投保人信息与被保险人一致</a>
      </el-col>
      <el-col v-if="value2" span="4" />
    </el-row>
    <el-row v-if="!value2" class="row">
      <el-col span="6">
        投保人姓名：{{ map.carInfo.licenseOwner }}
      </el-col>
      <el-col span="6">
        证件类型：身份证
      </el-col>
      <el-col span="6">
        证件号码：{{ map.carInfo.licenseOwnerIdCard }}
      </el-col>
    </el-row>
    <!--
    <el-row class="center-row">
      <el-col span="12">车牌号：{{ map.carInfo.carNumber }}</el-col>
      <el-col span="12">品牌型号：{{ map.carInfo.carModel }}</el-col>
    </el-row>
    <el-row class="center-row">
      <el-col span="12">商业出险：{{ map.insuredInfo.bizLastYearOutDangerCount==null?'0':map.insuredInfo.bizLastYearOutDangerCount }}次</el-col>
      <el-col span="12">交强出险：{{ map.insuredInfo.forceLastYearOutDangerCount==null?'0':map.insuredInfo.forceLastYearOutDangerCount }}次</el-col>
    </el-row>
    <el-row class="center-row">
      <el-col span="12">
        折扣系数：{{ map.quoteInfo.discountRate==null?'0':map.quoteInfo.discountRate }}
      </el-col>
    </el-row>
    &lt;!&ndash; <el-row class="center-row">
      <el-col span="12">商业险投保单号：TD5455456415435454354</el-col>
      <el-col span="12">交强险投保单号：TD5455456415435454354</el-col>
    </el-row>&ndash;&gt;
    <el-row class="center-row">
      <el-col span="12">商业险起保日期：{{ map.insuredInfo.nextBusinesStartDate }}</el-col>
      <el-col span="12">交强险起保日期：{{ map.insuredInfo.nextForceStartDate }}</el-col>
    </el-row>-->
    <el-table
      :data="tabledata"
      :span-method="arraySpanMethod"
      border
      size="small"
    >
      <el-table-column
        prop="insurance_name"
        label="承保险种"
        align="center"
        width="180"
      />
      <el-table-column
        prop="insurance_amount"
        align="center"
        label="保险金额/责任限额"
      >
        <template slot-scope="scope">
          {{ scope.row.insurance_amount==1?'投保': scope.row.insurance_amount }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="insurance_premium"
        label="保险费(元)"
      >
        <template slot-scope="scope">
          {{ scope.row.insurance_name=='交强险'?map.quoteInfo.forceTotal: scope.row.insurance_premium }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrderDetails } from '../../../api/userApi'

export default {
  name: '',
  data() {
    return {
      form: '',
      value2: true,
      value: true,
      map: [],
      tabledata: {}
    }
  },
  created() {
    this.orderDetails()
  },
  methods: {
    orderDetails() {
      const params = {
        orderId: this.$route.query.order_id
      }
      getOrderDetails(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.map = res.data
          this.tabledata = this.map.insuredList
        }
      })
    },
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
    .home{
        margin: 2em 1em 0 1em;
        font-size: 13px;
        padding-bottom: 2em;
    }
    .line{
        height: 3em;
        line-height: 3em;
        border-bottom: #dfe6ec 1px solid;
    }
    .row{
        height: 3em;
        line-height: 3em;
    }
    .center-row{
        height: 2em;
        line-height: 2em;
    }
</style>
