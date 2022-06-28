export default function handleOrderForeigin(orderBy: any, orderType: any) {
	const orderColumn = (orderBy.split('.')[0])
	const foreiginColumn = (orderBy.split('.')[1])
	switch (orderColumn) {
		case 'local':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'safra':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'foco':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'type_assay':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'tecnologia':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'localPreparo':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'genotipo':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		case 'ensaio':
			return `{ "${orderColumn}": {"${foreiginColumn}": "${orderType}" } }`
		default:
			return
	}
}