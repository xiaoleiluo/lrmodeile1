<template>
  <div>
    <div class="imgHeader">
      <img src="../../assets/imgs/header.png" alt="header" />
    </div>
    <div id="loginWarp">
      <div class="loginWarpTwo">
        <div class="phone">手机号登录</div>
        <van-form @submit="onSubmit">
          <van-field name="用户名" placeholder="用户名" />
          <van-field center clearable placeholder="请输入短信验证码">
            <template #button>
              <van-button
                size="small"
                type="primary"
                v-show="timeTrue == true"
                @click="acquire"
                >发送验证码</van-button
              >
              <van-button
                size="small"
                type="primary"
                v-show="timeTrue == false"
                >{{ time }}</van-button
              >
            </template>
          </van-field>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit"
              >登录</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Form, Field, Button } from "vant";
import {
  setToken
} from '@/utils/auth' // get token from cookie
Vue.use(Form)
  .use(Field)
  .use(Button);
export default {
  data() {
    return {
      timeTrue: true,
      time: 0
    };
  },
  methods: {
    acquire() {
      this.timeTrue = false;
      this.time = 60;
      var setTimeoutS = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          clearInterval(setTimeoutS);
          this.timeTrue = true;
        }
      }, 1000);
    },
    onSubmit() {
      console.log(this.loginForm, "aaa");
      if (true) {
        // this.$store
        //   .dispatch("Login", this.loginForm)
        //   .then(() => {
        //     this.$router.push({ path: this.redirect || "/" });
        //   })
        //   .catch(() => {
        //     this.getCode();
        //   });
        setTimeout(() => {
          setToken("222")
          this.$router.push("/");
        });
      }
    }
  }
};
</script>

<style lang="less" scope>
.van-field__control {
  background: rgba(242, 242, 242, 1);
  border-radius: inherit;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}
.van-field__button {
  padding-left: 0px;
}
.imgHeader {
  margin-bottom: 20px;
  img {
    text-align: center;
    width: 375px;
  }
}
#loginWarp {
  display: flex;
  align-items: center;
  justify-content: center;
  .loginWarpTwo {
    box-shadow: 2px 2px 5px 0px #555;
    .phone {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      color: blue;
    }
  }
}
</style>
