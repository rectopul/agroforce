export default function perm_can_do(screenRoute: string, action: string) {
  const user = JSON.parse(localStorage.getItem('user') as string);
  const { permissions } = user;
  console.log('🚀 ~ file: perm_can_do.ts:4 ~ permissions:', permissions);
  if (permissions.includes(`${screenRoute} --${action}`)) {
    return true;
  }
  return false;
}
