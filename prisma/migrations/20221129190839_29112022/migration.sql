/*
  Warnings:

  - A unique constraint covering the columns `[name,safraId]` on the table `ExperimentGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_safra,gli]` on the table `assay_list` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name_unity_culture,id_local]` on the table `cultureUnity` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,id_culture]` on the table `delineamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[divisor,id_quadra]` on the table `dividers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idSafra,period,idLocal,idAssayList]` on the table `experiment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idExperiment,npe]` on the table `experiment_genotipe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,id_culture]` on the table `foco` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_dados,id_culture]` on the table `genotipo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_assay_list,treatments_number]` on the table `genotype_treatment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sl,id_layout]` on the table `layout_children` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sc,id_layout]` on the table `layout_children` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[s_aloc,id_layout]` on the table `layout_children` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[esquema,id_culture]` on the table `layout_quadra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_dados,id_culture]` on the table `lote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[safraId,focoId,typeAssayId,tecnologiaId,localId,epoca]` on the table `npe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[npei,groupId]` on the table `npe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cod_quadra,id_culture]` on the table `quadra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[safraName,id_culture]` on the table `safra` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sorteio,id_delineamento]` on the table `sequencia_delineamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cod_tec,id_culture]` on the table `tecnologia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,id_culture]` on the table `type_assay` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `culture` required. This step will fail if there are existing NULL values in that column.

*/
ALTER TABLE `culture` MODIFY `name` VARCHAR(191) NOT NULL;

ALTER TABLE `tecnologia` ALTER COLUMN `cod_tec` DROP DEFAULT;

CREATE UNIQUE INDEX `ExperimentGroup_name_safraId_key` ON `ExperimentGroup`(`name`, `safraId`);

CREATE UNIQUE INDEX `assay_list_id_safra_gli_key` ON `assay_list`(`id_safra`, `gli`);

CREATE UNIQUE INDEX `cultureUnity_name_unity_culture_id_local_key` ON `cultureUnity`(`name_unity_culture`, `id_local`);

CREATE UNIQUE INDEX `delineamento_name_id_culture_key` ON `delineamento`(`name`, `id_culture`);

CREATE UNIQUE INDEX `dividers_divisor_id_quadra_key` ON `dividers`(`divisor`, `id_quadra`);

CREATE UNIQUE INDEX `experiment_idSafra_period_idLocal_idAssayList_key` ON `experiment`(`idSafra`, `period`, `idLocal`, `idAssayList`);

CREATE UNIQUE INDEX `experiment_genotipe_idExperiment_npe_key` ON `experiment_genotipe`(`idExperiment`, `npe`);

CREATE UNIQUE INDEX `foco_name_id_culture_key` ON `foco`(`name`, `id_culture`);

CREATE UNIQUE INDEX `genotipo_id_dados_id_culture_key` ON `genotipo`(`id_dados`, `id_culture`);

CREATE UNIQUE INDEX `genotype_treatment_id_assay_list_treatments_number_key` ON `genotype_treatment`(`id_assay_list`, `treatments_number`);

CREATE UNIQUE INDEX `layout_children_sl_id_layout_key` ON `layout_children`(`sl`, `id_layout`);

CREATE UNIQUE INDEX `layout_children_sc_id_layout_key` ON `layout_children`(`sc`, `id_layout`);

CREATE UNIQUE INDEX `layout_children_s_aloc_id_layout_key` ON `layout_children`(`s_aloc`, `id_layout`);

CREATE UNIQUE INDEX `layout_quadra_esquema_id_culture_key` ON `layout_quadra`(`esquema`, `id_culture`);

CREATE UNIQUE INDEX `lote_id_dados_id_culture_key` ON `lote`(`id_dados`, `id_culture`);

CREATE UNIQUE INDEX `npe_safraId_focoId_typeAssayId_tecnologiaId_localId_epoca_key` ON `npe`(`safraId`, `focoId`, `typeAssayId`, `tecnologiaId`, `localId`, `epoca`);

CREATE UNIQUE INDEX `npe_npei_groupId_key` ON `npe`(`npei`, `groupId`);

CREATE UNIQUE INDEX `quadra_cod_quadra_id_culture_key` ON `quadra`(`cod_quadra`, `id_culture`);

CREATE UNIQUE INDEX `safra_safraName_id_culture_key` ON `safra`(`safraName`, `id_culture`);

CREATE UNIQUE INDEX `sequencia_delineamento_sorteio_id_delineamento_key` ON `sequencia_delineamento`(`sorteio`, `id_delineamento`);

CREATE UNIQUE INDEX `tecnologia_cod_tec_id_culture_key` ON `tecnologia`(`cod_tec`, `id_culture`);

CREATE UNIQUE INDEX `type_assay_name_id_culture_key` ON `type_assay`(`name`, `id_culture`);
