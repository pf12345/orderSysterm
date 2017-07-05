<template>
  <div class="login">
    <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <Form-item prop="user">
            <Input type="text" v-model="formInline.user" placeholder="用户名">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
        <Form-item prop="password">
            <Input type="password" v-model="formInline.password" placeholder="密码">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
            </Input>
        </Form-item>
        <Form-item>
            <Button size="large" style="width: 120px;" type="primary" @click="handleSubmit('formInline')">登录</Button>
        </Form-item>
    </Form>
  </div>
</template>
<style media="screen" scoped>
  .login {
    width: 500px;
    margin: auto;
    margin-top: 150px;
  }
</style>
<script>
    import axios from 'axios'
    export default {
        data () {
            return {
                formInline: {
                    user: '',
                    password: ''
                },
                ruleInline: {
                    user: [
                        { required: true, message: '请填写用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请填写密码', trigger: 'blur' },
                        // { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                let _this = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                      axios.post('http://127.0.0.1:8033/loginSystem', {
                        name: this.formInline.user,
                        pwd: this.formInline.password
                      })
                        .then(function(response) {
                          console.log(response);
                          if(response.data.result == 'TRUE') {
                            _this.$Message.success('登录成功!');
                            window.location.href = '/';
                          }else {
                            _this.$Message.error(response.data.message);
                          }

                        })
                        .catch(function(error) {
                          _this.$Message.error('登录失败!');
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            }
        }
    }
</script>
