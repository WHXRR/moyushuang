import { App, Button, Form, Input } from 'antd'
import { useEffect, useRef, useState } from 'react'
import type { FormInstance } from 'antd'
import { registerCaptcha } from '@/interfaces/api'

export function RegisterForm({
  onTypeChange,
  form,
  loading,
}: {
  onTypeChange: (type: string) => void
  form: FormInstance
  loading: boolean
}) {
  const { message } = App.useApp()
  const [disabled, setDisabled] = useState(false)
  const [time, setTime] = useState(60)
  const timer = useRef<NodeJS.Timeout>(null)
  const getRegisterCaptcha = async () => {
    if (disabled) return
    const email = form.getFieldValue('email')
    if (!email) return message.error('请输入邮箱地址')
    try {
      const res = await registerCaptcha(email)
      if (res.status === 201 || res.status === 200) {
        message.success('发送成功')
        setDisabled(true)
        timer.current = setInterval(() => {
          setTime((time) => time - 1)
        }, 1000)
      }
    } catch (e) {
      console.warn(e)
    }
  }
  useEffect(() => {
    if (time <= 0 && timer.current) {
      setDisabled(false)
      setTime(60)
      clearInterval(timer.current)
    }
  }, [time])
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [])

  return (
    <>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名!' }]}
      >
        <Input placeholder="用户名" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[{ required: true, message: '请输入邮箱!' }]}
      >
        <Input placeholder="邮箱" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码!' }]}
      >
        <Input.Password placeholder="密码" />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[{ required: true, message: '请输入确认密码!' }]}
      >
        <Input.Password placeholder="确认密码" />
      </Form.Item>
      <Form.Item
        name="captcha"
        rules={[{ required: true, message: '请输入验证码!' }]}
      >
        <div className="flex gap-4">
          <Input placeholder="验证码" />
          <Button
            type="primary"
            onClick={getRegisterCaptcha}
            disabled={disabled}
          >
            {disabled ? `${time}后重新获取` : '获取验证码'}
          </Button>
        </div>
      </Form.Item>
      <Form.Item>
        <Button
          type="link"
          className="!p-0"
          onClick={() => onTypeChange('login')}
        >
          返回登录
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          className="w-full"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          注册
        </Button>
      </Form.Item>
    </>
  )
}
