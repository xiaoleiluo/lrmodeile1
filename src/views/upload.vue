<template>
  <div>
    <van-form>
      <van-field name="姓名" label="姓名:" />
      <van-field name="姓名" label="手机号码:" />
      <van-field name="姓名" label="工号/学号:" />
      <van-field name="姓名" label="科室东院:" />
      <van-field class="resultFile" name="姓名" label="行程码识别结果:" />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import Vue from "vue";
import { Form, Field, Button } from "vant";
Vue.use(Form)
  .use(Field)
  .use(Button);
export default {};
</script>

<style lang="less" scope>
.van-field__label {
  width: auto;
  text-align: right;
}
.van-cell__title {
  width: 101.83px;
}
.van-field__control {
  background: rgba(242, 242, 242, 1);
  border-radius: inherit;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
  height: 30px;
}
.resultFile{
  .van-field__control{
    height: 150px;
  }
  .van-field__label {
    line-height:150px;
  }
}
</style>
