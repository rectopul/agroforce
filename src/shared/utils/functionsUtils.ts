const CryptoJS = require("crypto");
const alg = 'aes-256-ctr';
const pwd = 'TMG2022';

export const functionsUtils = {
	validationCPF,
	Crypto,
	countChildrenForSafra,
	formatDate
};

function validationCPF(cpf: any) {
	cpf = cpf.replace(/[^\d]+/g, '');
	if (cpf === '') return false;
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length !== 11 ||
		cpf === "00000000000" ||
		cpf === "11111111111" ||
		cpf === "22222222222" ||
		cpf === "33333333333" ||
		cpf === "44444444444" ||
		cpf === "55555555555" ||
		cpf === "66666666666" ||
		cpf === "77777777777" ||
		cpf === "88888888888" ||
		cpf === "99999999999")
		return false;
	// Valida 1o digito	
	let add = 0;
	for (let i = 0; i < 9; i++)
		add += parseInt(cpf.charAt(i)) * (10 - i);
	let rev = 11 - (add % 11);
	if (rev === 10 || rev === 11)
		rev = 0;
	if (rev !== parseInt(cpf.charAt(9)))
		return false;
	// Valida 2o digito	
	add = 0;
	for (let i = 0; i < 10; i++)
		add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev === 10 || rev === 11)
		rev = 0;
	if (rev !== parseInt(cpf.charAt(10)))
		return false;
	return true;
}

function Crypto(data: any, type: any) {
	if (type === "cipher") {
		const cipher: any = CryptoJS.createCipher(alg, pwd);
		data = cipher.update(data, 'utf8', 'hex');
	} else if (type === 'decipher') {
		const decipher = CryptoJS.createDecipher(alg, pwd);
		data = decipher.update(data, 'hex', 'utf8');
	}

	return data;
}

function countChildrenForSafra(dataChildren: [], safraId: number = 0) {
	let countChildren: number = 0;
	if (safraId != 0) {
		dataChildren.map((item: any) => {
			(Number(item.id_safra) === safraId) ? countChildren += 1 : '';
		})
	}
	return countChildren;
}

function formatDate(data: any) {
	var dia = data.getDate().toString(),
		diaF = (dia.length == 1) ? '0' + dia : dia,
		mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
		mesF = (mes.length == 1) ? '0' + mes : mes,
		anoF = data.getFullYear();
	return diaF + "/" + mesF + "/" + anoF;
}
