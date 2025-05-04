<template>
  <div id="login-page">
    <h1 class="title">鱼籽云图库 - 用户注册</h1>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号!' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item name="userPassword" :rules="[{ required: true, message: '请输入密码!' }]">
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>

      <a-form-item
        name="checkPassword"
        :rules="[
          { required: true, message: '请输入校验密码!' },
          { validator: validateCheckPass, trigger: 'change' },
        ]"
      >
        <a-input-password v-model:value="formState.checkPassword" placeholder="请输入校验密码" />
      </a-form-item>

      <a-form-item style="justify-self: right; color: #bebebe">
        已有账号？
        <RouterLink to="/user/login">返回登录</RouterLink>
      </a-form-item>

      <a-form-item>
        <a-button block type="primary" html-type="submit">注册</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { registerUsingPost } from '@/api/yonghuxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import router from '@/router'
import type { Rule } from 'ant-design-vue/es/form'

const formState = reactive<API.UserRegisterDTO>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
})

const validateCheckPass = async (_rule: Rule, value: string) => {
  if (value !== formState.userPassword) {
    return Promise.reject('两次输入密码不一致!')
  } else {
    return Promise.resolve()
  }
}

const handleSubmit = async (values: any) => {
  const res = await registerUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    message.success('注册成功')
    await router.push('/user/login')
  } else {
    message.warning(res.data.message)
  }
}
</script>

<style scoped>
#login-page {
  width: 400px;
  margin: 0 auto;
}

#login-page .title {
  text-align: center;
}

#login-page .desc {
  text-align: center;
  margin-bottom: 40px;
}
</style>
