export default function handleError(file: string, local: string, error: any) {
	console.error(`[${file}] ${local} error \n ${error}`);
}