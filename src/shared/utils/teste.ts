import Swal from 'sweetalert2';

export default async function handleStatusGlobal({
  id, status, service, params, table, data,
}: any) {
  if (status === 0) {
    status = 1;
  } else {
    status = 0;
  }

  await service.getAll(params).then(async ({ status }: any) => {
    if (status === 200 && status === 1) {
      Swal.fire(`Já existe um registro ativo com esse nome na tabela ${table}. \n Favor inativar o registro antes de executar a ação.`);
      return;
    }
    await service.update({ id, status });
    const index = data.findIndex((item: any) => item.id === id);
    return index;
  });
}
