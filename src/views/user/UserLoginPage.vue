<template>
  <div id="login-page">
    <h1 class="title">鱼籽云图库 - 用户登录</h1>
    <div class="desc">企业级智能协同云图库</div>
    <a-form :model="formState" name="basic" autocomplete="off" @finish="handleSubmit">
      <a-form-item name="userAccount" :rules="[{ required: true, message: '请输入账号!' }]">
        <a-input v-model:value="formState.userAccount" placeholder="请输入账号" />
      </a-form-item>

      <a-form-item
        name="userPassword"
        :rules="[
          { required: true, message: '请输入密码!' },
          { min: 6, message: '密码长度不能小于6位' },
        ]"
      >
        <a-input-password v-model:value="formState.userPassword" placeholder="请输入密码" />
      </a-form-item>

      <a-form-item style="justify-self: right; color: #bebebe">
        还没账号？
        <RouterLink to="/user/register">前往注册</RouterLink>
      </a-form-item>

      <a-form-item>
        <a-button block type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { loginUsingPost } from '@/api/yonghuxiangguanjiekou.ts'
import { message } from 'ant-design-vue'
import router from '@/router'
import { useLoginUserStore } from '@/stores/loginUserStore.ts'

const loginUserStore = useLoginUserStore()

const formState = reactive<API.UserLoginDTO>({
  userAccount: '',
  userPassword: '',
})

const handleSubmit = async (values: any) => {
  const res = await loginUsingPost(values)
  if (res.data.code === 0 && res.data.data) {
    await loginUserStore.fetchLoginUser()
    message.success('登录成功')
    await router.replace('/')
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
