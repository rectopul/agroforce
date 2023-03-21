/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
export function perm_can_do(screenRoute: string, action: string) {
  const { permissions } = JSON.parse(localStorage.getItem('user') as string);
  if (permissions.includes(`${screenRoute} --${action}`)) {
    return true;
  }
  return false;
}

export async function asidePermissions(routesList: any) {
  const { permissions } = JSON.parse(localStorage.getItem('user') as string);
  const validateRoute: any = [];
  for (const route of routesList) {
    if (permissions.includes(`${route} --view`)) {
      validateRoute.push(route);
    }
  }
  return validateRoute;
}
