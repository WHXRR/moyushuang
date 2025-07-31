import React from 'react'
import useStore from '@/store'

interface WithPermissionProps {
  children: React.ReactNode
  roles?: ('admin' | 'user')[]
}

export const WithPermission: React.FC<WithPermissionProps> = ({
  children,
  roles = ['admin'],
}) => {
  const { userInfo } = useStore()

  // 检查角色权限
  const hasRolePermission = roles.includes(userInfo.role)

  if (!hasRolePermission) {
    return null
  }

  return <>{children}</>
}
