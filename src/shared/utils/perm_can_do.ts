export default function perm_can_do(screenRoute: string, action: string) {
  const user = JSON.parse(localStorage.getItem('user') as string);
  console.log('🚀 ~ file: perm_can_do.ts:3 ~ user:', user);
  const { permissions } = user;
  if (permissions?.includes(`${screenRoute} --${action}`)) {
    return true;
  }
  return false;
}
