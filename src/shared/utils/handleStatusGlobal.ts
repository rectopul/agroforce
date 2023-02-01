import Swal from 'sweetalert2';

export default async function handleStatusGlobal({
  id, status, service, params, table, data, created_by,
}: any) {
  if (status === 0) {
    status = 1;
  } else {
    status = 0;
  }
  return await service.getAll(params).then(async ({ status: newStatus }: any) => {
    if (newStatus === 200 && status === 1) {
      Swal.fire(`Já existe um registro ativo com esse nome na tabela ${table}. \n Favor inativar o registro antes de executar a ação.`);
      return;
    }
    await service.update({ id, status, created_by });
    const index = data.findIndex((item: any) => item.id === id);
    return index;
  });
}
