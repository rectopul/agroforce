import {ProfileRepository} from '../repository/profile.repository';

export class ProfileController {
    profileRepository = new ProfileRepository();

    async getAllProfiles() {
        let response = await this.profileRepository.findAll();
        return response;        
    }

    async getOneProfile(id: string) {
        let newID = parseInt(id);
        if (id && id != '{id}') {
            let response = await this.profileRepository.findOne(newID); 
            if (!response) {
               return {status: 400, response:{error: 'cultura não existe'}};
            } else {
                return {status:200 ,response: response};
            }
        } else {
            return {status:405, response:{error: 'id não informado'}};
        }
    }

    async postProfile(data: object) {
        if (data != null && data != undefined) {
            let response = await this.profileRepository.create(data);
            if(response) {
                return {status: 200, message: "cultura inserida"}
            } else {
                return {status: 400, message: "erro"}

            }
        }
    }

    async updateProfile(id: string, data: object) {
        let newID = parseInt(id);
        if (data != null && data != undefined) {
            let response = await this.profileRepository.update(newID, data);
            if(response) {
                return {status: 200, message: {message: "cultura atualizada"}}
            } else {
                return {status: 400, message: {message: "erro ao tentar fazer o update"}}

            }
        }
    }
}
