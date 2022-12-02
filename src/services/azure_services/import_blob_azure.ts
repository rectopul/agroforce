export const importblob (table: string) => {   
  const newFileName =
  uuidv4() + '.' + FormData.file.name.split('.').pop();
  uploadFileToBlob(FormData.file, newFileName);
  registerItem(newFileName);

  const containerName = 'sample-container';
  const sasToken = process.env.NEXT_PUBLIC_STORAGESASTOKEN;
  const storageAccountUrl = process.env.NEXT_PUBLIC_STORAGERESOURCEURL;

  const uploadFileToBlob = useCallback(
  async (file: File | null, newFileName: string) => {

  const blobService = new BlobServiceClient(
    `${storageAccountUrl}${sasToken}`
  );

  const containerClient: ContainerClient =
    blobService.getContainerClient(containerName);
  await containerClient.createIfNotExists({
    access: 'container',
  });

  const blobClient = containerClient.getBlockBlobClient(newFileName);
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  await blobClient.uploadData(file, options);
}