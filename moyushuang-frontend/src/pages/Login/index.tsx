import LoginImage from '@/assets/images/login.webp'
import { App, Form } from 'antd'
import { useState } from 'react'
import type { FormProps } from 'antd'
import { login, register, updatePassword } from '@/interfaces/api'
import type { LoginFormValue, RegisterUser, UpdatePassword } from '@/types/user'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ForgetPasswordForm } from './ForgetPasswordForm'
import useStore from '@/store'
import md5 from 'md5'

export default function Login() {
  const { message } = App.useApp()
  const navigate = useNavigate()

  const [type, setType] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { updateUserInfo } = useStore()
  const onFinish: FormProps['onFinish'] = async (values) => {
    setLoading(true)
    if (type === 'login') {
      await userLogin(values)
    } else if (type === 'register') {
      await userRegister(values)
    } else if (type === 'forget') {
      await userUpdatePassword(values)
    }
    setLoading(false)
  }

  const userLogin = async (values: LoginFormValue) => {
    try {
      const params = {
        email: values.email,
        password: md5(values.password),
      }
      const res = await login(params)
      if (res.status === 201 || res.status === 200) {
        message.success('登录成功')
        updateUserInfo(res.data)
        setTimeout(() => {
          navigate('/home')
        }, 500)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const userRegister = async (values: RegisterUser) => {
    try {
      if (values.password !== values.confirmPassword)
        return message.warning('两次密码不一致')
      const params = {
        ...values,
        password: md5(values.password),
      }
      const res = await register(params)
      if (res.status === 201 || res.status === 200) {
        // message.success('注册成功')
        userLogin({
          email: values.email,
          password: values.password,
        })
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const userUpdatePassword = async (values: UpdatePassword) => {
    try {
      if (values.password !== values.confirmPassword)
        return message.warning('两次密码不一致')
      const params = {
        ...values,
        password: md5(values.password),
      }
      const res = await updatePassword(params)
      if (res.status === 201 || res.status === 200) {
        message.success('修改成功')
        setType('login')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <div className="w-screen h-screen">
      <div className="container flex items-center justify-center px-5 mx-auto h-full">
        <div className="flex-1 flex md:items-center gap-10 flex-col md:flex-row">
          <div className="w-full md:w-[60%]">
            <div className="text-2xl md:text-3xl font-bold pb-3">魔域爽</div>
            <div className="text-sm pb-10 text-[#6a676b]">
              Ctrl+C 是工作，Ctrl+V 是生活，Alt+Tab 是信仰～
            </div>
            <img src={LoginImage} alt="login" />
          </div>
          <div className="flex-1 flex justify-end">
            <div className="flex-1 max-w-[400px]">
              <Form
                form={form}
                colon={false}
                autoComplete="on"
                size="large"
                onFinish={onFinish}
                className="home-form"
              >
                {type === 'login' && (
                  <LoginForm
                    onTypeChange={(type: string) => setType(type)}
                    loading={loading}
                  />
                )}
                {type === 'register' && (
                  <RegisterForm
                    onTypeChange={(type: string) => setType(type)}
                    form={form}
                    loading={loading}
                  />
                )}
                {type === 'forget' && (
                  <ForgetPasswordForm
                    onTypeChange={(type: string) => setType(type)}
                    form={form}
                    loading={loading}
                  />
                )}
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
