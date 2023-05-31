import {PermissionRepository} from '../../repository/permission.repository';
import permissions from "./permissionsGrid";
import handleError from "./handleError";

export default async function initializePermissions(responseServer?: any): Promise<any> {

  const permissionsRepository = new PermissionRepository();

  const parameters: object | any = {};

  try {
    
    console.log('=========>>>>> initializePermissions <<<<<==========');
    
    // array de permissions não encontradas
    const permissionsNotFoundArray: any = [];
    
    // se não for passado responseServer, carrega do banco
    const response: object | any = responseServer
      ? responseServer
      : await permissionsRepository.findAll(parameters);
    
    for (const permissionF of permissions) {
      let routeF = permissionF.route;
      let permissionsNotFound = permissionF.permissions.filter((elementF: any) => {
        let encontrou = false;
        for (const item of response) {
          let screenRoute = item.screenRoute;
          let action = item.action;

          if (routeF === screenRoute) {
            if (action.includes(elementF.value)) {
              encontrou = true;
            }
          }
        }
        return !encontrou;
      });
      
      // cadastrar novas permissions;
      if (permissionsNotFound.length > 0) {
        for (const element of permissionsNotFound) {
          const data = {
            screenRoute: routeF,
            action: element.value,
          };

          // cria permissão em permissionsRepository
          await permissionsRepository.create(data);
        }
        
        // merge permissionsNotFoundArray com permissionsNotFound
        permissionsNotFoundArray.push(...permissionsNotFound);
        
      }
    }

    // encontre permissões que existem no banco mas não estão no array de permissions
    const permissionsNotFoundInDatabase = response.filter((element: any) => {
      return !permissions.some((permission: any) => {
        return permission.route === element.screenRoute;
      });
    });

    console.log('permissionsNotFoundInDatabase', permissionsNotFoundInDatabase);
    
    // retorna array de permissions não encontradas
    return permissionsNotFoundArray;

  } catch (error: any) {
    handleError('Permissions controller - initializePermissions', 'GetAll', error.message);
    throw new Error('[Controller] - GetAll Permissions erro: initializePermissions');
  }
  
}