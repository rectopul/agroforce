function PermissionGate({ children, permissions, user }: any) {
  const userPermissions = user.permissions;

  if (
    permissions
      .some((permission: string) => userPermissions.includes(permission))
  ) {
    return children;
  }
  throw new Error('você não tem permissão para acessar. ');
}

export default PermissionGate;
