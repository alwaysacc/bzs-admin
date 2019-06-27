<template>
  <div id="home">
    <el-row class="row-line">
      <el-col span="22" style="font-size: 16px;font-weight: bold;padding-left: 1em">车辆信息</el-col>
      <el-col span="2"/>
    </el-row>
    <div v-loading="carInfoloading" class="text-right">
      <el-row class="row">
        <el-col span="3">
          车牌：
        </el-col>
        <el-col span="5">
          <el-input v-model="map.carInfo.carNumber" />
        </el-col>
        <el-col span="3">
          发动机号：
        </el-col>
        <el-col span="5">
          <el-input v-model="map.carInfo.engineNumber" />
        </el-col>
        <el-col span="3">
          车架号：
        </el-col>
        <el-col span="5">
          <el-input v-model="map.carInfo.frameNumber" />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col span="3">
          注册日期：
        </el-col>
        <el-col span="5">
          <el-date-picker
            v-model="map.carInfo.registerDate"
            type="date"
            placeholder="交强险到期时间"
            style="width: 100%"
          />
        </el-col>
        <el-col span="3">
          品牌型号：
        </el-col>
        <el-col span="13">
          <el-input v-model="map.carInfo.brandModel" />
        </el-col>
        <!--<el-col span="3">
          车型：
        </el-col>
        <el-col span="5">
          <el-select v-model="map.carInfo.carModel" style="width: 100%">
            <el-option label="投保" value="shi" />
            <el-option label="不投保" value="fou" />
          </el-select>
        </el-col>-->
      </el-row>
      <el-row class="row">
        <el-col span="3">
          新车购置价(￥)：
        </el-col>
        <el-col span="5">
          <el-input v-model="map.carInfo.purchasePrice" />
        </el-col>
        <el-col span="3">
          座位数：
        </el-col>
        <el-col span="5">
          <el-select v-model="map.carInfo.seatNumber" style="width: 100%">
            <el-option label="2座" value="shi" />
            <el-option label="3座" value="shi" />
            <el-option label="4座" value="shi" />
            <el-option label="5座" value="shi" />
            <el-option label="6座" value="shi" />
            <el-option label="7座" value="shi" />
            <el-option label="8座" value="shi" />
            <el-option label="9座" value="shi" />
            <el-option label="10座" value="shi" />
          </el-select>
        </el-col>
        <el-col span="3">
          排量(L)：
        </el-col>
        <el-col span="5">
          <el-input v-model="map.carInfo.displacement" />
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col span="3">
          过户车：
        </el-col>
        <el-col span="3">
          <el-radio-group v-model="map.carInfo.istransferCar+''">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-col>
        <el-col span="2">
          &nbsp;
        </el-col>
        <el-col span="3">
          贷款车：
        </el-col>
        <el-col span="3">
          <el-radio-group v-model="map.carInfo.isloanCar+''">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-col>
        <el-col span="2">
          &nbsp;
        </el-col>
        <el-col span="3">
          &nbsp;
        </el-col>
        <el-col span="5">
          &nbsp;
        </el-col>
      </el-row>
    </div>
    <el-row />
    <div class="bot-div">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

        <el-tab-pane label="上年投保信息" name="first">
          <el-row class="row-line">
            <el-col span="22" style="font-size: 16px;font-weight: bold;padding-left: 1em">上年投保信息</el-col>
            <el-col span="2"><a style="color: red;font-size: 16px;font-weight: bold" /></el-col>
          </el-row>
          <div class="text-right">
            <el-row class="row">
              <el-col span="4">
                投保公司：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.lastYearInsuranceCompany" />
              </el-col>
              <el-col span="4">
                车主名称：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.carInfo.licenseOwner" />
              </el-col>
              <el-col span="8">
                &nbsp;
              </el-col>
            </el-row>
            <el-row />
            <el-row class="row">
              <el-col span="4">
                商业险到期时间：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.nextBusinesStartDate" style="width: 100%" />
              </el-col>
              <el-col span="4">
                交强险到期时间：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.nextForceStartDate" style="width: 100%" />
              </el-col>
              <el-col span="8" style="width: 100%" />
            </el-row>
            <el-row class="row">
              <el-col span="4">
                被保险人：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.carInfo.licenseOwner" style="width: 100%" />
              </el-col>
              <el-col span="4">
                证件类型：
              </el-col>
              <el-col span="4">
                <el-select v-model="map.carInfo.licenseOwnerIdCardType" placeholder="身份证" style="width: auto">
                  <el-option label="身份证" value="1" />
                  <el-option label="组织机构代码证" value="2" />
                  <el-option label="营业执照/统一社会信用代码" value="3" />
                  <el-option label="港澳居民来往内地通行证" value="4" />
                  <el-option label="港澳身份证" value="5" />
                </el-select>
              </el-col>
              <el-col span="3">
                证件号码:
              </el-col>
              <el-col span="5">
                <el-input v-model="map.carInfo.licenseOwnerIdCard" style="width: 100%" />
              </el-col>
            </el-row>
            <el-table
              :data="insuredList"
              :span-method="arraySpanMethod"
              border
              size="small"
            >
              <el-table-column
                prop="insurance_name"
                label="承包险种"
                header-align="center"
                align="center"
              />
              <el-table-column
                prop="insurance_amount"
                label="保险金额/责任限额"
                header-align="center"
                align="center"
              >
                <template slot-scope="scope">
                  {{ scope.row.insurance_amount==1?'投保':scope.row.insurance_amount }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane v-loading="insuredinfoloading" label="报价信息" name="second">
          <el-row class="row-line">
            <el-col span="22" style="font-size: 16px;font-weight: bold;padding-left: 1em">关系人信息</el-col>
          </el-row>
          <el-row class="line">
            <el-col span="20">
              <a style="font-weight: bold">车主信息</a>
            </el-col>
            <el-col v-if="" span="4" />
          </el-row>
          <div class="text-right">
            <el-row class="row">
              <el-col span="4">
                车主姓名：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.carInfo.licenseOwner" style="width: 100%" />
              </el-col>
              <el-col span="4">
                证件类型：
              </el-col>
              <el-col span="4">
                <el-select v-model="map.carInfo.licenseOwnerIdCardType" placeholder="身份证" style="width: auto">
                  <el-option label="身份证" value="1" />
                  <el-option label="组织机构代码证" value="2" />
                  <el-option label="营业执照/统一社会信用代码" value="3" />
                  <el-option label="港澳居民来往内地通行证" value="4" />
                  <el-option label="港澳身份证" value="5" />
                </el-select>
              </el-col>
              <el-col span="3">
                证件号码:
              </el-col>
              <el-col span="5">
                <el-input v-model="map.carInfo.licenseOwnerIdCard" style="width: 100%" />
              </el-col>
            </el-row>
            <!--    <el-row class="row">
              <el-col span="4">
                电话：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.carInfo.mobile" style="width: 100%" />
              </el-col>
              <el-col span="4">
                邮箱：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.insuredIdEmail" style="width: 100%" />
              </el-col>
              <el-col span="3">
                住址:
              </el-col>
              <el-col span="5">
                <el-input v-model="map.insuredInfo.insuredIdAddress" style="width: 100%" />
              </el-col>
            </el-row>-->
          </div>
          <el-row/>
          <el-row class="line" type="flex">
            <a style="font-weight: bold">被保险人信息</a>
            <a style="color: red; margin-left: 20px">被保险人与车主一致</a>
          </el-row>
          <div class="text-right">
            <el-row v-if="!owner" class="row">
              <el-col span="4">
                被保险人姓名：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.insuredName" style="width: 100%" />
              </el-col>
              <el-col span="4">
                证件类型：
              </el-col>
              <el-col span="4">
                <el-select v-model="map.insuredInfo.insuredIdCardType" placeholder="身份证" style="width: auto">
                  <el-option label="身份证" value="shi" />
                  <el-option label="组织机构代码证" value="fou" />
                  <el-option label="营业执照/统一社会信用代码" value="fou" />
                  <el-option label="港澳居民来往内地通行证" value="fou" />
                  <el-option label="港澳身份证" value="fou" />
                </el-select>
              </el-col>
              <el-col span="3">
                证件号码:
              </el-col>
              <el-col span="5">
                <el-input v-model="map.insuredInfo.insuredIdCard" style="width: 100%" />
              </el-col>
            </el-row>
          </div>
          <el-row class="line" type="flex">
            <a style="font-weight: bold">投保人信息</a>
            <a style="color: red;margin-left: 20px">投保人与车主一致</a>
          </el-row>
          <div v-if="!toubaoren" class="text-right">
            <el-row class="row">
              <el-col span="4">
                投保人姓名：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.postedName" style="width: 100%" />
              </el-col>
              <el-col span="4">
                证件类型：
              </el-col>
              <el-col span="4">
                <el-select v-model="map.insuredInfo.holderIdCardType" placeholder="身份证" style="width: auto">
                  <el-option label="身份证" value="shi" />
                  <el-option label="组织机构代码证" value="fou" />
                  <el-option label="营业执照/统一社会信用代码" value="fou" />
                  <el-option label="港澳居民来往内地通行证" value="fou" />
                  <el-option label="港澳身份证" value="fou" />
                </el-select>
              </el-col>
              <el-col span="3">
                证件号码:
              </el-col>
              <el-col span="5">
                <el-input v-model="map.insuredInfo.holderIdCard" style="width: 100%" />
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col span="4">
                投保人电话：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.holderIdTel" style="width: 100%" />
              </el-col>
              <el-col span="4">
                邮箱：
              </el-col>
              <el-col span="4">
                <el-input v-model="map.insuredInfo.holderIdEmail" style="width: 100%" />
              </el-col>
              <el-col span="3">
                住址:
              </el-col>
              <el-col span="5">
                <el-input v-model="map.insuredInfo.holderIdAddress" style="width: 100%" />
              </el-col>
            </el-row>
          </div>
          <el-row class="row-line">
            <el-col span="22" style="font-size: 16px;font-weight: bold;padding-left: 1em">最新报价信息</el-col>
            <el-col span="2"><a style="color: red;font-size: 16px;font-weight: bold" /></el-col>
          </el-row>
          <div style="padding-left: 3.5em">

            <el-row class="row">
              <el-col span="12">上年交强出险：{{
              map.insuredInfo.bizLastYearOutDangerCount==null?0:map.insuredInfo.bizLastYearOutDangerCount }}次
              </el-col>
              <el-col span="12">上年商业出险：{{
              map.insuredInfo.forceLastYearOutDangerCount==null?0:map.insuredInfo.forceLastYearOutDangerCount }}次
              </el-col>
            </el-row>
            <el-row class="row">
              <el-col span="12">交强险起保时间：{{ map.insuredInfo.nextForceStartDate }}</el-col>
              <el-col span="12">商业险起保时间：{{ map.insuredInfo.nextBusinesStartDate }}</el-col>
            </el-row>
          </div>
          <div v-if="!quoteMsg" class="baojia-div">
            <!--  <ul>
              <li v-if="R" :class="{a:b1}" @click="onLi(1)">
                <el-row>
                  <el-col span="8"><img src="http://bao.91bihu.com/resources/images/quote/rb.png"></el-col>
                  <el-col span="16" style="padding-top: 5px">
                    <a class="blod-a">人保</a><a class="small-a">({{ Rquote.quoteStatus==1?'报价成功':'报价失败' }})</a>
                    <br>
                    <a class="red-a">{{ Rquote.bizPremiumByDis元 }}</a>
                  </el-col>
                </el-row>
              </li>
              <li v-if="T" :class="{a:b2}" @click="onLi(2)">
                <el-row>
                  <el-col span="8"><img src="http://bao.91bihu.com/resources/images/quote/rb.png"></el-col>
                  <el-col span="16" style="padding-top: 5px">
                    <a class="blod-a">太平洋</a><a class="small-a">({{ Tquote.quoteStatus==1?'报价成功':'报价失败' }})</a>
                    <br>
                    <a class="red-a">{{ Tquote.bizPremiumByDis }}{{ Tquote.bizPremiumByDis!=''?'':'元' }}</a>
                  </el-col>
                </el-row>
              </li>
              <li v-if="P" :class="{a:b3}" @click="onLi(3)">
                <el-row>
                  <el-col span="8"><img src="http://bao.91bihu.com/resources/images/quote/rb.png"></el-col>
                  <el-col span="16" style="padding-top: 5px">
                    <a class="blod-a">平安</a><a class="small-a">({{ Pquote.quoteStatus==1?'报价成功':'报价失败' }})</a>
                    <br>
                    <a class="red-a">{{ Pquote.bizPremiumByDis元 }}</a>
                  </el-col>
                </el-row>
              </li>
            </ul>-->
            <el-row>
              <el-col lg="24" sm="24">
                <el-tabs v-model="activeNum" tab-position="left" @tab-click="handleClick">
                  <el-tab-pane label="人保" name="1">
                    <div v-if="activeNum==1" class="baojia">
                      <el-row class="bot-row">
                        <el-col span="4">
                          车牌号：
                        </el-col>
                        <el-col span="20">
                          {{ map.carInfo.carNumber }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          报价状态：
                        </el-col>
                        <el-col span="20">
                          {{ Rquote.quoteStatus==1?'报价成功':'报价失败' }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          报价内容：
                        </el-col>
                        <el-col span="20">
                          {{ Rquote.quoteResult }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          核保状态：
                        </el-col>
                        <el-col span="20">
                          {{ Rquote.submitStatus==1?'核保成功':'核保失败' }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          核保内容：
                        </el-col>
                        <el-col span="20">
                          {{ Rquote.submitresult }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="5">无赔款优惠系数:</el-col>
                        <el-col span="3">{{ Rquote.noReparationSaleRate==null?0:Rquote.noReparationSaleRate }}<i
                          class="el-icon-question"
                          @click="youhui = true"
                        /></el-col>
                        <el-dialog
                          :visible.sync="youhui"
                          :before-close="handleClose"
                          title="无赔款系数"
                          width="30%"
                          top="1vh"
                          style="text-align: center"
                        >

                          <img src="http://bao.91bihu.com/resources/images/quote/rb.png" style="width: 66%">
                        </el-dialog>
                        <el-col span="4">自主渠道系数:</el-col>
                        <el-col span="4">{{ Rquote.independentChannelDate==null?0:Rquote.independentChannelDate }}</el-col>
                        <el-col span="4">自主核保系数:</el-col>
                        <el-col span="4">{{ Rquote.independentSubmitRate==null?0:Rquote.independentSubmitRate }}</el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="5">交通违法浮动系数:</el-col>
                        <el-col span="3">{{ Rquote.trafficIllegalRate==null?0:Rquote.trafficIllegalRate }}</el-col>
                        <el-col span="4">折扣系数:</el-col>
                        <el-col span="4">{{ Rquote.discountRate==null?0:Rquote.discountRate }}</el-col>
                        <el-col span="8" />
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="3">
                          报价渠道：
                        </el-col>
                        <el-col span="21">
                          保之顺
                        </el-col>
                      </el-row>
                      <el-table
                        :data="RquoteList"
                        :span-method="arraySpanMethod"
                        border
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="insurance_name"
                          label="承保险种"
                          width="180"
                        />
                        <el-table-column
                          prop="insurance_amount"
                          label="保险金额/责任限额"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.insurance_amount=='1'?'投保':scope.row.insurance_amount }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="insurance_premium"
                          label="保险费(元)"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.insurance_name=='交强险'?Rquote.forceTotal:scope.row.insurance_premium }}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>

                  </el-tab-pane>
                  <el-tab-pane label="太平洋" name="2">
                    <div v-if="activeNum==2" class="baojia">
                      <el-row class="bot-row">
                        <el-col span="4">
                          车牌号：
                        </el-col>
                        <el-col span="20">
                          {{ map.carInfo.carNumber }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          报价状态：
                        </el-col>
                        <el-col span="20">
                          {{ Tquote.quoteStatus==1?'报价成功':'报价失败' }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          报价内容：
                        </el-col>
                        <el-col span="20">
                          {{ Tquote.quoteResult }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          核保状态：
                        </el-col>
                        <el-col span="20">
                          {{ Tquote.submitStatus==1?'核保成功':'核保失败' }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          核保内容：
                        </el-col>
                        <el-col span="20">
                          {{ Tquote.submitresult }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="5">无赔款优惠系数:</el-col>
                        <el-col span="3">{{ Tquote.noReparationSaleRate==null?0:Tquote.noReparationSaleRate }}<i
                          class="el-icon-question"
                          @click="youhui = true"
                        /></el-col>
                        <el-dialog
                          :visible.sync="youhui"
                          :before-close="handleClose"
                          title="无赔款系数"
                          width="30%"
                          top="1vh"
                          style="text-align: center"
                        >

                          <img src="http://bao.91bihu.com/resources/images/quote/rb.png" style="width: 66%">
                        </el-dialog>
                        <el-col span="4">自主渠道系数:</el-col>
                        <el-col span="4">{{ Tquote.independentChannelDate==null?0:Tquote.independentChannelDate }}</el-col>
                        <el-col span="4">自主核保系数:</el-col>
                        <el-col span="4">{{ Tquote.independentSubmitRate==null?0:Tquote.independentSubmitRate }}</el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="5">交通违法浮动系数:</el-col>
                        <el-col span="3">{{ Tquote.trafficIllegalRate==null?0:Tquote.trafficIllegalRate }}</el-col>
                        <el-col span="4">折扣系数:</el-col>
                        <el-col span="4">{{ Tquote.discountRate==null?0:Tquote.discountRate }}</el-col>
                        <el-col span="8" />
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="3">
                          报价渠道：
                        </el-col>
                        <el-col span="21">
                          保之顺
                        </el-col>
                      </el-row>
                      <el-table
                        :data="TquoteList"
                        :span-method="arraySpanMethod"
                        border
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="insurance_name"
                          label="承保险种"
                          width="180"
                        />
                        <el-table-column
                          prop="insurance_amount"
                          label="保险金额/责任限额"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.insurance_amount=='1'?'投保':scope.row.insurance_amount }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="insurance_premium"
                          label="保险费(元)"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.insurance_name=='交强险'?Tquote.forceTotal:scope.row.insurance_premium }}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>

                  </el-tab-pane>
                  <el-tab-pane label="平安" name="3">
                    <div v-if="activeNum==3" class="baojia">
                      <el-row class="bot-row">
                        <el-col span="4">
                          车牌号：
                        </el-col>
                        <el-col span="20">
                          {{ map.carInfo.carNumber }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          报价状态：
                        </el-col>
                        <el-col span="20">
                          {{ Pquote.quoteStatus==1?'报价成功':'报价失败' }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          报价内容：
                        </el-col>
                        <el-col span="20">
                          {{ Pquote.quoteResult }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          核保状态：
                        </el-col>
                        <el-col span="20">
                          {{ Pquote.submitStatus==1?'核保成功':'核保失败' }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="4">
                          核保内容：
                        </el-col>
                        <el-col span="20">
                          {{ Pquote.submitresult }}
                        </el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="5">无赔款优惠系数:</el-col>
                        <el-col span="3">{{ Pquote.noReparationSaleRate==null?0:Pquote.noReparationSaleRate }}<i
                          class="el-icon-question"
                          @click="youhui = true"
                        /></el-col>
                        <el-dialog
                          :visible.sync="youhui"
                          :before-close="handleClose"
                          title="无赔款系数"
                          width="30%"
                          top="1vh"
                          style="text-align: center"
                        >

                          <img src="http://bao.91bihu.com/resources/images/quote/rb.png" style="width: 66%">
                        </el-dialog>
                        <el-col span="4">自主渠道系数:</el-col>
                        <el-col span="4">{{ Pquote.independentChannelDate==null?0:Pquote.independentChannelDate }}</el-col>
                        <el-col span="4">自主核保系数:</el-col>
                        <el-col span="4">{{ Pquote.independentSubmitRate==null?0:Pquote.independentSubmitRate }}</el-col>
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="5">交通违法浮动系数:</el-col>
                        <el-col span="3">{{ Pquote.trafficIllegalRate==null?0:Pquote.trafficIllegalRate }}</el-col>
                        <el-col span="4">折扣系数:</el-col>
                        <el-col span="4">{{ Pquote.discountRate==null?0:Pquote.discountRate }}</el-col>
                        <el-col span="8" />
                      </el-row>
                      <el-row class="bot-row">
                        <el-col span="3">
                          报价渠道：
                        </el-col>
                        <el-col span="21">
                          保之顺
                        </el-col>
                      </el-row>
                      <el-table
                        :data="PquoteList"
                        :span-method="arraySpanMethod"
                        border
                        size="mini"
                        style="width: 100%"
                      >
                        <el-table-column
                          prop="insurance_name"
                          label="承保险种"
                          width="180"
                        />
                        <el-table-column
                          prop="insurance_amount"
                          label="保险金额/责任限额"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.insurance_amount=='1'?'投保':scope.row.insurance_amount }}
                          </template>
                        </el-table-column>
                        <el-table-column
                          prop="insurance_premium"
                          label="保险费(元)"
                        >
                          <template slot-scope="scope">
                            {{ scope.row.insurance_name=='交强险'?Pquote.forceTotal:scope.row.insurance_premium }}
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>

                  </el-tab-pane>
                </el-tabs>
              </el-col>
            </el-row>
          </div>
          <div v-if="quoteMsg" class="baojia-div" style="height: 5em;text-align: center">
            <h5 style="padding-top: 2em">暂无报价信息</h5>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { quoteDetails } from '../../../api/userApi'

export default {
  name: '',
  data() {
    return {
      activeNum: '1',
      b1: true,
      b2: true,
      b3: true,
      flollw: false,
      customerloading: false,
      carInfoloading: false,
      insuredinfoloading: false,
      form: {
        type: '',
        date: new Date() + 1,
        content: ''
      },
      tableData: [],
      insuredList: [],
      owner: true,
      toubaoren: true,
      youhui: false,
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13'
      }, {
        content: '创建成功',
        timestamp: '2018-04-11'
      }],
      renewQuote: false,
      radio: '1',
      value3: '',
      depreciation: 55555,
      shareQuote: false,
      showTextarea: false,
      quote: false,
      radio2: false,
      show: false,
      activeName: 'first',
      map: [],
      customer: {
        createdBy: '',
        createdTime: '',
        customerAddress: '',
        customerId: '',
        customerName: '',
        customerRemarks1: '',
        customerRemarks2: '',
        customerSort: '',
        customerTel1: '',
        customerTel2: '',
        insuredArea: '',
        revision: '',
        status: '',
        updatedBy: '',
        updatedTime: ''
      },
      insuredInfo: {
        bizIsInsured: '',
        bizLastYearOutDanger: '',
        bizLastYearOutDangerCount: '',
        businesExpireDate: '',
        businesNumber: '',
        carInfoId: '',
        choiceInsuranceSource: '',
        createId: '',
        createTime: '',
        forceExpireDate: '',
        forceIsInsured: '',
        forceLastYearOutDanger: '',
        forceLastYearOutDangerCount: '',
        holderIdCard: '',
        holderIdCardType: '',
        insuranceCompany: '',
        insuredId: '',
        insuredIdCard: '',
        insuredIdCardType: '',
        insuredName: '',
        lastYearInsuranceCompany: '',
        lastYearSource: '',
        licenseOwner: '',
        licenseOwnerIdCard: '',
        licenseOwnerIdCardType: '',
        mechanismNumber: '',
        nextBusinesStartDate: '',
        nextForceStartDate: '',
        postedName: '',
        trafficNumber: '',
        updateBy: '',
        updateTime: ''
      },
      Tquote: '',
      Pquote: '',
      Rquote: '',
      T: false,
      P: false,
      R: false,
      TquoteList: {},
      RquoteList: {},
      PquoteList: {},
      quoteMap: [],
      quoteMsg: true
    }
  },
  watch: {
    $route(to, from) {
      if (to.path == '/userDetail') {
        this.getQuote(this.$route.query.car_info_id)
      }
    }
  },
  created() {
    this.getQuote(this.$route.query.car_info_id)
  },
  methods: {
    beforeDate(e) {
      var myDate = new Date()
      myDate.setDate(myDate.getDate() + e)
      console.log(myDate.toLocaleDateString())
      this.form.date = new Date(myDate.toLocaleDateString())
    },
    getQuote(e) {
      const params = {
        carInfoId: e
      }
      quoteDetails(params).then(res => {
        if (res.code == 200) {
          this.map = res.data
          this.insuredList = this.map.insuredList
          if (this.map.customer == null) {
            this.map.customer = this.customer
          }

          const list = res.data.insuredList
          for (let i = 0; i < list.length; i++) {
            if (list[i].insurance_amount == 0) {
              this.map.insuredList[i].insurance_amount = '投保'
            }
            if (list[i].excluding_deductible != '0.00') {
              list[i].insurance_name = list[i].insurance_name + '(不计免赔)'
              /* let insu = list[i]
              list[i].insurance_name = insu.insurance_name + '(不计免赔)'
              list[i].insurance_amount = '投保'
              list[i].insurance_premium = insu.excluding_deductible
              list[i].excluding_deductible = null*/
            }
          }
          /*   console.log(list)
          console.log( res.data.insuredList)
          console.log( this.insuredList)
          this.insuredList=this.insuredList.concat(list)*/
          if (this.map.insuredInfo == null) {
            this.map.insuredInfo = this.insuredInfo
          }
          if (res.data.quote.length == 0) {
            this.quoteMsg = true
          } else {
            this.quoteMsg = false
            for (let i = 0; i < res.data.quote.length; i++) {
              switch (res.data.quote[i].quoteSource) {
                case '1':
                  this.Tquote = res.data.quote[i]
                  this.T = true
                  this.TquoteList = res.data.TquoteList
                  this.b2 = false
                  break
                case '2':
                  this.Pquote = res.data.quote[i]
                  this.P = true
                  this.PquoteList = res.data.PquoteList
                  console.log(this.Pquote)
                  if (this.b2) {
                    this.b1 = false
                    this.quoteMap.quote = this.Pquote
                    this.quoteMap.quoteList = this.PquoteList
                  }
                  break
                case '4':
                  this.Rquote = res.data.quote[i]
                  this.R = true
                  this.RquoteList = res.data.RquoteList
                  if (this.b3 && this.b2) {
                    this.b1 = false
                    this.quoteMap.quote = this.Rquote
                    this.quoteMap.quoteList = this.RquoteList
                  }
                  break
              }
            }
          }
          this.quoteMap = {}
          this.quoteMap.carInfo = this.map.carInfo
          if (this.Rquote != '') {
            this.quoteMap.quote = this.Rquote
            this.quoteMap.quoteList = this.RquoteList
          } else if (this.Tquote != '') {
            this.quoteMap.quote = this.Tquote
            this.quoteMap.quoteList = this.TquoteList
            console.log(this.Tquote.quoteResult)
            console.log(this.TquoteList)
            console.log(this.quoteMap.quote.quoteResult)
          } else if (this.Pquote != '') {
            this.quoteMap.quote = this.Pquote
            this.quoteMap.quoteList = this.PquoteList
          }
          /* if (this.Rquote!=null){
                              this.quoteMap.set('quote',this.Rquote)
                              this.quoteMap.set('quoteList',this.RquoteList)
                          } else if (this.Tquote!=null) {
                              this.quoteMap.set('quote',this.Tquote)
                              this.quoteMap.set('quoteList',this.TquoteList)
                          }else if (this.Pquote!=null) {
                              this.quoteMap.set('quote',this.Pquote)
                              this.quoteMap.set('quoteList',this.PquoteList)
                          }*/
        }
        console.log(res)
      })
    },
    back() {
      this.$router.back(-1)
    }
  }
}
</script>

<style scoped>
  #home {
    width: 100%;
    height: 100%;
  }

  .text-right {
    text-align: right;
    margin: 0 5%;
    height: auto;
    padding-left: -3em;
  }

  .row {
    height: 3.3em;
    line-height: 3.3em;
  }

  .row-line {
    height: 3em;
    line-height: 3em;
    background-color: #dfe6ec;
    margin-top: 1em;
  }

  .bot-div {
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: 5em;
    margin-top: 1em;
    height: auto;
  }

  .bot {
    position: fixed;
    bottom: 0;
    height: 4em;
    line-height: 4em;
    background-color: #dfe6ec;
    width: 100%;
    text-align: center;
    z-index: 2;
  }

  .center-strip {
    background-color: #f8f8f8;
    margin: 10px 5%;
    height: 3em;
    line-height: 3em;
  }

  .bottom-div {
    margin: 10px 5%;
    padding: 10px;
  }

  .line {
    height: 2em;
    line-height: 2em;
    border-bottom: #f5f5f5 1px solid;
    padding-left: 2em;
  }

  .baojia-div {
    padding-bottom: 2em;
    margin:auto;
    width: 90%;
    border: #8c939d 1px solid;
  }

  .baojia-div ul {
    float: left;
    width: 20%;
    height: 100%;
    list-style: none;
  }

  .baojia-div ul li {
    margin: auto;
    height: 6em;
    vertical-align: middle;
    padding-top: 1em;
    padding-left: 1em;
    cursor: pointer;
  }

  .a {
    background-color: #F8F8F8;
  }

  .blod-a {
    font-weight: bold;
  }

  .small-a {
    font-size: 14px;
    color: #8c939d;
  }

  .red-a {
    font-size: 16px;
    margin-top: 0.1em;
    color: red;
  }

  .baojia {
    float: left;
    height: 100%;
    width: 75%;
    font-size: 14px;
  }

  .bot-row {
    height: 3em;
    line-height: 3em;

  }
  .third{
    height: auto;
    margin-bottom: 5em;
  }
  .third p {
    height: 2em;
    line-height: 2em;
    padding-left: 2em;
  }

  .left-div {

  }

  .right-dia-div {
    margin-left: 6%;
  }

  .line-row-dialog {
    height: 4em;
    line-height: 4em;
    border-bottom: #CCCCCC 1px solid;
    padding: 0 0.11em;
  }

  .right-div {
    width: 30px;
    position: fixed;
    right: 0;
    top: 40%;
    text-align: center;
    background-color: #dfe6ec;
    padding: 0.5em 0.5em;
    cursor: pointer;
  }

  .right-div a {
    width: 50px;
    height: 10px;
    line-height: 10px;
  }
</style>
