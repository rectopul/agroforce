const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


export async function ImputtoBase64(moduleId: number) {
 const value: any = document.getElementById(`inputFile-${moduleId}`);
 const file = document.querySelector(value).files[0];
 console.log(await toBase64(file));
}