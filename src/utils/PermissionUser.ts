const useGetUserPermisssions = () => {
  // lógica para pegar as permissões das pessoas
  return ['canEdit', 'canSave']
}

const PermisssionGate = ({ children, permissions, user }: any) => {
  const userPermissions = user.permissions

  if (
    permissions
      .some(permission => {
        return userPermissions.includes(permission)
      })
  ) {
    return children
  } else { 
    throw 'você não tem permissão para acessar. ';
  }

  return null
}

export default PermisssionGate
