import { UsersPermissionsRepository } from 'src/repository/user-permission.repository';

export class UserPermissionController {
	userPermission = new UsersPermissionsRepository();

	async getUserPermissions(userId: any) {
		try {
			if (typeof (userId) === 'string') {
				userId = Number(userId);
			}

			// const response = await this.userPermission.getPermissionsByUser(userId);
			// const arr2: any = [];
			// const arr1: any = [];
			// for (const property in response) {
			// arr1 =response[property].profile.acess_permission.split(',');
			// arr2 = arr1.concat(arr2);
			// }
			// if (!response) 
			//     throw "falha na requisição, tente novamente";

			// return arr2;       
		} catch (err) {

		}
	}

	async getAllPermissions() {
		try {
			const response = await this.userPermission.findAll('');

			if (!response)
				throw "falha na requisição, tente novamente";

			return response;
		} catch (err) {

		}
	}

	async getByUserID(userId: number | any) {
		const newID = Number(userId);
		try {
			if (userId && userId !== '{id}') {
				const response = await this.userPermission.findAllByUser(newID);
				if (!response || response.length === 0) {
					return { status: 400, response: [], message: 'usuario não tem cultura' };
				} else {
					return { status: 200, response };
				}
			} else {
				return { status: 405, response: { error: 'id não informado' } };
			}
		} catch (err) {
			return { status: 400, message: err }
		}
	}

	async post(data: object | any) {
		try {
			if (data !== null && data !== undefined) {
				await this.delete(Number(data.userId));
				data.status = 0;
				const response = await this.userPermission.create(data);
				if (response.count > 0) {
					return { status: 200, message: { message: "permission criada" } }
				} else {
					return { status: 400, message: { message: "erro" } }
				}
			}
		} catch (err) {
			return { status: 400, message: { message: "erro" } }
		}
	}

	async updateCultures(data: object | any) {
		try {
			if (data !== null && data !== undefined) {
				const parameters: object | any = {};

				if (typeof (data.status) === 'string') {
					parameters.status = Number(data.status);
				} else {
					parameters.status = data.status;
				}
				await this.userPermission.queryRaw(Number(data.idUser), Number(data.cultureId));
				return { status: 200 }
			}
		} catch (err) {
			return { status: 400, message: err }
		}
	}

	async updateAllStatusCultures(userId: any) {
		try {
			await this.userPermission.updateAllStatus(userId);
		} catch (err) {
			return { status: 400, message: err }
		}
	}

	async delete(userId: number) {
		try {
			if (userId) {
				const response: object | any = await this.userPermission.delete({ userId: userId });
				return { status: 200, response }

			} else {
				return { status: 400, message: "id não informado" }
			}
		} catch (err) {
			return { status: 400, message: err }
		}
	}
}
