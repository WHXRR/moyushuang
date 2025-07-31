import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ConfigProvider, App as AntdApp } from 'antd'
import BGImage from '@/assets/images/bg.webp'

export function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          cssVar: true,
          hashed: false,
          token: {
            colorPrimary: '#ef857d',
            colorInfo: '#ef857d',
            fontFamily: '"ZCOOL KuaiLe", sans-serif',
          },
          components: {
            Modal: {
              contentBg: '#faf7f4',
              headerBg: '#faf7f4',
              footerBg: '#faf7f4',
            },
          },
        }}
      >
        <AntdApp
          className="w-screen h-screen bg-cover bg-[#fbf7f4]"
          style={{ backgroundImage: `url(${BGImage})` }}
        >
          <RouterProvider router={router} />
        </AntdApp>
      </ConfigProvider>
    </>
  )
}
