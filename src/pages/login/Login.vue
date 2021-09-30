<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{systemName}}</span>
      </div>
      <div class="desc">Oracle Club后台管理系统</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs @change="tab=> activeTab = tab" size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="邮箱密码登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="543851436@qq.com"
                v-decorator="['email', {rules: [{ required: true, message: '请输入邮箱', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="123456"
                autocomplete="autocomplete"
                type="password"
                v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="验证码登录" key="2">
            <a-form-item>
              <a-input size="large" placeholder="邮箱" v-model="email">
                <a-icon slot="prefix" type="mail" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="验证码" v-model="verifyCode">
                    <a-icon slot="prefix" type="number" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button style="width: 100%" class="captcha-button" size="large" @click="getVerifyCode">获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="true" >自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import userApi from '@/services/user'
import {setAuthorization} from '@/utils/request'
import {mapMutations} from 'vuex'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      logging: false,
      error: '',
      email: null,
      verifyCode: null,
      activeTab: "1",
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles']),
    onSubmit (e) {
      e.preventDefault()
      if (this.activeTab === "1"){
        this.form.validateFields((err) => {
          if (!err) {
            this.logging = true
            const email = this.form.getFieldValue('email')
            const password = this.form.getFieldValue('password')
            userApi.loginEmail(email, password).then(this.afterLogin).catch(()=>{
              this.$message.warn("登录失败，请重试")
              this.logging = false
            })
          }
        })
      } else if (this.activeTab === "2"){
        this.logging = true
        userApi.loginVerify(this.email, this.verifyCode).then(this.afterLogin).catch(()=>{
          this.$message.warn("登录失败，请重试")
          this.logging = false
        })
      }
    },
    getVerifyCode(){
      userApi.getVerifyCode(this.email).then(({data})=>{
        if (data.result === "ok"){
          this.$message.success(data.msg)
        }
      })
    },
    afterLogin(res) {
      this.logging = false
      const loginRes = res.data
      if (loginRes.result === "ok") {
        const {role,token} = loginRes.data
        this.setUser(loginRes.data)
        this.setRoles([role])
        console.log(loginRes)
        setAuthorization({token: token.token,refreshToken:token.refreshToken})

        this.$router.push('/dashboard/workplace')
        this.$message.success(loginRes.msg, 3)
      } else {
        this.error = loginRes.msg
        this.$message.error(loginRes.msg, 3)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
