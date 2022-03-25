import {ProfileRepository} from '../repository/profile.repository';

export class ProfileController {
    profileRepository = new ProfileRepository();

    async getAllProfiles() {
        try {
            let response = await this.profileRepository.findAll();
            return response;     
        } catch(err) {

        }   
    }

    async getOneProfile(id: string) {
        let newID = parseInt(id);
        try {
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
        } catch(err) {

        }   
    }

    async postProfile(data: object) {
        try {
            if (data != null && data != undefined) {
                let response = await this.profileRepository.create(data);
                if(response) {
                    return {status: 200, message: "cultura inserida"}
                } else {
                    return {status: 400, message: "erro"}

                }
            }
        } catch(err) {

        }   
    }

    async updateProfile(id: string, data: object) {
        let newID = parseInt(id);
        try {
            if (data != null && data != undefined) {
                let response = await this.profileRepository.update(newID, data);
                if(response) {
                    return {status: 200, message: {message: "cultura atualizada"}}
                } else {
                    return {status: 400, message: {message: "erro ao tentar fazer o update"}}

                }
            }
        } catch(err) {

        }   
    }
}
