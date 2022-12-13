
const AzureStorageBlob = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");

const account = "<account>";
const accountKey = "<accountkey>";
const connStr = "<connection string>";
const defaultAzureCredential = new DefaultAzureCredential();

const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  defaultAzureCredential
);



const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");


// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(
  `https://${account}.blob.core.windows.net`,
  sharedKeyCredential
);



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
export function teste() { 
  console.log('teste')
}