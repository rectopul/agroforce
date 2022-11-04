-- phpMyAdmin SQL Dump
-- version 4.6.6deb4+deb9u2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 31/10/2022 às 15:28
-- Versão do servidor: 5.7.34
-- Versão do PHP: 7.0.33-0+deb9u12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `tmg`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `AllocatedExperiment`
--

CREATE TABLE `AllocatedExperiment` (
  `id` int(11) NOT NULL,
  `seq` int(11) NOT NULL,
  `experimentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `npei` int(11) NOT NULL,
  `npef` int(11) NOT NULL,
  `parcelas` int(11) NOT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `blockId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `assay_list`
--

CREATE TABLE `assay_list` (
  `id` int(11) NOT NULL,
  `id_safra` int(11) NOT NULL,
  `id_foco` int(11) NOT NULL,
  `id_type_assay` int(11) NOT NULL,
  `id_tecnologia` int(11) NOT NULL,
  `gli` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `treatmentsNumber` int(11) DEFAULT NULL,
  `bgm` int(11) DEFAULT NULL,
  `project` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMPORTADO',
  `comments` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `assay_list`
--

INSERT INTO `assay_list` (`id`, `id_safra`, `id_foco`, `id_type_assay`, `id_tecnologia`, `gli`, `treatmentsNumber`, `bgm`, `project`, `status`, `comments`, `created_by`, `created_at`) VALUES
(1, 84, 4, 6, 12, 'INTS(0)50/01', 30, 50, 'INT-SUL_CONVENCIONAL_BGM50', 'EXP IMP.', NULL, 2, '2022-10-28 13:42:47.851'),
(2, 84, 4, 6, 12, 'INTS(0)50/02', 15, 0, 'INT-SUL_CONVENCIONAL_BGM50', 'EXP IMP.', NULL, 2, '2022-10-28 13:42:56.510'),
(3, 85, 4, 6, 12, 'INTS(0)50/01', 3, NULL, 'INT-SUL_CONVENCIONAL_BGM50', 'IMPORTADO', NULL, 23, '2022-10-28 16:36:56.615'),
(4, 85, 4, 6, 12, 'INTS(0)50/02', 15, 0, 'INT-SUL_CONVENCIONAL_BGM50', 'IMPORTADO', NULL, 2, '2022-10-28 16:36:58.116'),
(5, 89, 11, 6, 23, 'INTS(0)50/01', 30, 50, 'INT-SUL_CONVENCIONAL_BGM50', 'EXP IMP.', NULL, 2, '2022-10-29 15:19:01.203'),
(6, 89, 11, 6, 23, 'INTS(0)50/02', 15, 0, 'INT-SUL_CONVENCIONAL_BGM50', 'EXP IMP.', NULL, 2, '2022-10-29 15:19:02.475');

-- --------------------------------------------------------

--
-- Estrutura para tabela `config_gerais`
--

CREATE TABLE `config_gerais` (
  `id` int(11) NOT NULL,
  `itens_per_page` int(11) DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `config_gerais`
--

INSERT INTO `config_gerais` (`id`, `itens_per_page`, `updated_at`, `updated_by`) VALUES
(1, 10, '0000-00-00 00:00:00.000', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `culture`
--

CREATE TABLE `culture` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `desc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `culture`
--

INSERT INTO `culture` (`id`, `name`, `created_at`, `created_by`, `status`, `desc`) VALUES
(21, 'PE', '2022-09-19 14:12:06.047', 23, 1, 'PEDRO'),
(22, 'GA', '2022-09-19 14:12:06.047', 23, 1, 'GABRIEL'),
(23, 'CA', '2022-09-27 18:39:47.484', 2, 1, 'CARLOS'),
(24, 'FE', '2022-09-28 12:37:44.456', 2, 1, 'FELIPE'),
(25, 'TE', '2022-10-07 15:19:25.491', 23, 0, 'TESTE'),
(26, 'SO', '2022-10-21 16:51:26.292', 2, 1, 'Soja'),
(27, 'AB', '2022-10-28 19:02:01.612', 38, 1, 'Abacate');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cultureUnity`
--

CREATE TABLE `cultureUnity` (
  `id` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `id_unity_culture` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `name_unity_culture` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `dt_export` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `cultureUnity`
--

INSERT INTO `cultureUnity` (`id`, `id_local`, `id_unity_culture`, `year`, `name_unity_culture`, `created_by`, `created_at`, `dt_export`) VALUES
(1, 1, 12, 2021, '21-RS101CP01-01', 2, '2022-10-28 12:37:21.995', '2022-10-05 09:07:06.000'),
(2, 2, 59, 2021, '21-RS101RP01-01', 2, '2022-10-28 12:37:22.018', '2022-10-05 09:07:06.000'),
(3, 3, 60, 2021, '21-RS101SS01-01', 2, '2022-10-28 12:37:22.032', '2022-10-05 09:07:06.000'),
(4, 4, 61, 2021, '21-RS102CD01-01', 2, '2022-10-28 12:37:22.046', '2022-10-05 09:07:06.000'),
(5, 5, 62, 2021, '21-RS102CT01-01', 2, '2022-10-28 12:37:22.059', '2022-10-05 09:07:06.000'),
(6, 6, 63, 2021, '21-RS102CZ01-01', 2, '2022-10-28 12:37:22.073', '2022-10-05 09:07:06.000'),
(7, 7, 64, 2021, '21-RS102NT01-01', 2, '2022-10-28 12:37:22.086', '2022-10-05 09:07:06.000'),
(8, 8, 65, 2021, '21-RS102PF01-01', 2, '2022-10-28 12:37:22.099', '2022-10-05 09:07:06.000'),
(9, 9, 66, 2021, '21-RS102PM01-01', 2, '2022-10-28 12:37:22.112', '2022-10-05 09:07:06.000'),
(10, 10, 67, 2021, '21-RS102RD01-01', 2, '2022-10-28 12:37:22.125', '2022-10-05 09:07:06.000'),
(11, 11, 68, 2021, '21-RS103VA01-01', 2, '2022-10-28 12:37:22.138', '2022-10-05 09:07:06.000'),
(12, 12, 86, 2021, '21-RS101SG01-01', 2, '2022-10-28 12:37:22.150', '2022-10-05 09:07:06.000'),
(13, 5, 103, 2022, '22-RS102CT01-01', 2, '2022-10-28 12:56:38.425', '2022-10-05 09:07:06.000'),
(14, 4, 108, 2022, '22-RS102CD01-01', 2, '2022-10-28 12:56:38.442', '2022-10-05 09:07:06.000'),
(15, 1, 110, 2022, '22-RS101CP01-01', 2, '2022-10-28 12:56:38.459', '2022-10-05 09:07:06.000'),
(16, 6, 113, 2022, '22-RS102CZ01-01', 2, '2022-10-28 12:56:38.478', '2022-10-05 09:07:06.000'),
(17, 7, 129, 2022, '22-RS102NT01-01', 2, '2022-10-28 12:56:38.492', '2022-10-05 09:07:06.000'),
(18, 8, 131, 2022, '22-RS102PF01-01', 2, '2022-10-28 12:56:38.508', '2022-10-05 09:07:06.000'),
(19, 9, 133, 2022, '22-RS102PM01-01', 2, '2022-10-28 12:56:38.523', '2022-10-05 09:07:06.000'),
(20, 10, 141, 2022, '22-RS102RD01-01', 2, '2022-10-28 12:56:38.538', '2022-10-05 09:07:06.000'),
(21, 2, 142, 2022, '22-RS101RP01-01', 2, '2022-10-28 12:56:38.553', '2022-10-05 09:07:06.000'),
(22, 3, 155, 2022, '22-RS101SS01-01', 2, '2022-10-28 12:56:38.572', '2022-10-05 09:07:06.000'),
(24, 11, 163, 2022, '22-RS103VA01-01', 2, '2022-10-28 19:09:11.245', '2022-10-05 09:07:06.000'),
(25, 13, 9, 2021, '21-MT402SS01-01', 2, '2022-10-29 15:06:16.244', '2022-10-05 08:07:06.000'),
(26, 14, 49, 2021, '21-PR201MS02-01', 2, '2022-10-29 15:06:16.265', '2022-10-05 08:07:06.000');

-- --------------------------------------------------------

--
-- Estrutura para tabela `delineamento`
--

CREATE TABLE `delineamento` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `repeticao` int(11) NOT NULL,
  `trat_repeticao` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `delineamento`
--

INSERT INTO `delineamento` (`id`, `id_culture`, `name`, `repeticao`, `trat_repeticao`, `status`, `created_by`, `created_at`) VALUES
(1, 22, 'DBC-30', 3, 30, 1, 2, '2022-10-28 14:29:19.462'),
(2, 22, 'DBC-25', 3, 25, 1, 2, '2022-10-28 14:29:21.281'),
(3, 23, 'DBC-30', 3, 30, 1, 2, '2022-10-29 15:29:43.699'),
(4, 23, 'DBC-25', 3, 25, 1, 2, '2022-10-29 15:29:45.450');

-- --------------------------------------------------------

--
-- Estrutura para tabela `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `department`
--

INSERT INTO `department` (`id`, `name`, `status`, `created_at`, `created_by`) VALUES
(3, 'RH', 0, '2022-03-25 11:35:55.627', 2),
(4, 'Gestão A', 1, '2022-03-25 16:40:45.712', 4),
(5, 'TI Editado 2', 1, '2022-03-28 11:48:29.660', 4),
(6, 'SETOR A ', 1, '2022-03-30 12:47:32.152', 4),
(7, 'SETOR B ', 1, '2022-04-19 21:50:14.788', 2),
(8, 'TESTE', 0, '2022-04-20 13:22:00.554', 8),
(9, 'Mecanização', 0, '2022-04-20 13:22:14.658', 8),
(10, 'RHA', 0, '2022-06-10 13:20:42.044', 2),
(11, 'Gestão B', 1, '2022-07-01 13:21:28.722', 23),
(12, 'Logística', 1, '2022-07-08 13:01:52.105', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `dividers`
--

CREATE TABLE `dividers` (
  `id` int(11) NOT NULL,
  `id_quadra` int(11) NOT NULL,
  `t4_i` int(11) NOT NULL,
  `t4_f` int(11) NOT NULL,
  `di` int(11) NOT NULL,
  `divisor` int(11) NOT NULL,
  `df` int(11) NOT NULL,
  `sem_metros` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `envelope`
--

CREATE TABLE `envelope` (
  `id` int(11) NOT NULL,
  `id_safra` int(11) NOT NULL,
  `id_type_assay` int(11) NOT NULL,
  `seeds` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `envelope`
--

INSERT INTO `envelope` (`id`, `id_safra`, `id_type_assay`, `seeds`, `created_by`, `created_at`) VALUES
(1, 84, 1, 555, 23, '2022-09-27 15:19:44.288'),
(2, 84, 2, 222, 23, '2022-09-27 15:19:54.482'),
(3, 83, 2, 543, 23, '2022-09-27 15:20:01.820'),
(4, 83, 1, 777, 23, '2022-09-27 15:20:09.078'),
(5, 86, 7, 200, 2, '2022-09-28 21:45:52.490'),
(6, 86, 8, 500, 2, '2022-09-28 21:46:08.790'),
(7, 86, 9, 200, 2, '2022-09-28 21:46:24.667'),
(8, 85, 2, 100, 2, '2022-10-04 22:52:34.521'),
(9, 88, 2, 100, 2, '2022-10-26 16:49:27.197'),
(10, 88, 1, 50, 2, '2022-10-28 13:50:09.530'),
(11, 89, 12, 1, 2, '2022-10-29 15:18:33.094');

-- --------------------------------------------------------

--
-- Estrutura para tabela `epoca`
--

CREATE TABLE `epoca` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `experiment`
--

CREATE TABLE `experiment` (
  `id` int(11) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMPORTADO',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `clp` decimal(5,2) NOT NULL,
  `comments` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `density` int(11) NOT NULL,
  `experimentName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idAssayList` int(11) NOT NULL,
  `idDelineamento` int(11) NOT NULL,
  `experimentGroupId` int(11) DEFAULT NULL,
  `idLocal` int(11) NOT NULL,
  `idSafra` int(11) NOT NULL,
  `nlp` int(11) NOT NULL,
  `orderDraw` int(11) NOT NULL,
  `period` int(11) NOT NULL,
  `repetitionsNumber` int(11) NOT NULL,
  `blockId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `experiment`
--

INSERT INTO `experiment` (`id`, `status`, `created_by`, `created_at`, `clp`, `comments`, `density`, `experimentName`, `idAssayList`, `idDelineamento`, `experimentGroupId`, `idLocal`, `idSafra`, `nlp`, `orderDraw`, `period`, `repetitionsNumber`, `blockId`) VALUES
(1, 'IMPORTADO', 2, '2022-10-28 14:33:50.954', '5.00', '', 18, '2022/22_INTS(0)50/01_RS102PM01_01', 1, 1, NULL, 9, 84, 4, 1, 1, 2, NULL),
(2, 'IMPORTADO', 2, '2022-10-28 14:33:51.001', '5.00', '', 18, '2022/22_INTS(0)50/01_RS102PF01_01', 1, 1, NULL, 8, 84, 4, 1, 1, 2, NULL),
(3, 'SORTEADO', 2, '2022-10-28 14:33:51.032', '5.00', '', 18, '2022/22_INTS(0)50/01_PR201MS02_01', 1, 1, NULL, 12, 84, 4, 1, 1, 2, NULL),
(4, 'IMPORTADO', 2, '2022-10-28 14:33:51.055', '5.00', '', 18, '2022/22_INTS(0)50/02_RS102PM01_01', 2, 1, NULL, 9, 84, 4, 1, 1, 2, NULL),
(5, 'IMPORTADO', 2, '2022-10-28 14:33:51.079', '5.00', '', 18, '2022/22_INTS(0)50/02_RS102PF01_01', 2, 1, NULL, 8, 84, 4, 1, 1, 2, NULL),
(6, 'SORTEADO', 2, '2022-10-28 14:33:51.101', '5.00', '', 18, '2022/22_INTS(0)50/02_PR201MS02_01', 2, 1, NULL, 12, 84, 4, 1, 1, 2, NULL),
(7, 'IMPORTADO', 2, '2022-10-29 15:32:14.007', '5.00', '', 18, '2022/22_INTS(0)50/01_RS102PM01_01', 5, 3, NULL, 9, 89, 4, 1, 1, 2, NULL),
(8, 'IMPORTADO', 2, '2022-10-29 15:32:14.063', '5.00', '', 18, '2022/22_INTS(0)50/01_RS102PF01_01', 5, 3, NULL, 8, 89, 4, 1, 1, 2, NULL),
(9, 'IMPORTADO', 2, '2022-10-29 15:32:14.094', '5.00', '', 18, '2022/22_INTS(0)50/01_PR201MS02_01', 5, 3, NULL, 2, 89, 4, 1, 1, 2, NULL),
(10, 'IMPORTADO', 2, '2022-10-29 15:32:14.118', '5.00', '', 18, '2022/22_INTS(0)50/02_RS102PM01_01', 6, 3, NULL, 9, 89, 4, 1, 1, 2, NULL),
(11, 'IMPORTADO', 2, '2022-10-29 15:32:14.142', '5.00', '', 18, '2022/22_INTS(0)50/02_RS102PF01_01', 6, 3, NULL, 8, 89, 4, 1, 1, 2, NULL),
(12, 'IMPORTADO', 2, '2022-10-29 15:32:14.164', '5.00', '', 18, '2022/22_INTS(0)50/02_PR201MS02_01', 6, 3, NULL, 2, 89, 4, 1, 1, 2, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `ExperimentGroup`
--

CREATE TABLE `ExperimentGroup` (
  `id` int(11) NOT NULL,
  `safraId` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `experimentAmount` int(11) NOT NULL DEFAULT '0',
  `tagsToPrint` int(11) DEFAULT NULL,
  `tagsPrinted` int(11) DEFAULT NULL,
  `totalTags` int(11) DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `ExperimentGroup`
--

INSERT INTO `ExperimentGroup` (`id`, `safraId`, `name`, `experimentAmount`, `tagsToPrint`, `tagsPrinted`, `totalTags`, `status`, `createdBy`, `createdAt`) VALUES
(1, 85, 'fgdsfdsfds', 0, NULL, NULL, NULL, NULL, 30, '2022-10-31 15:42:50.962');

-- --------------------------------------------------------

--
-- Estrutura para tabela `experiment_genotipe`
--

CREATE TABLE `experiment_genotipe` (
  `id` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `idSafra` int(11) NOT NULL,
  `idFoco` int(11) NOT NULL,
  `idTypeAssay` int(11) NOT NULL,
  `idTecnologia` int(11) NOT NULL,
  `idExperiment` int(11) NOT NULL,
  `idGenotipo` int(11) DEFAULT NULL,
  `blockLayoutId` int(11) DEFAULT NULL,
  `idLote` int(11) DEFAULT NULL,
  `gli` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rep` int(11) NOT NULL,
  `nt` int(11) NOT NULL,
  `npe` int(11) NOT NULL,
  `nca` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SORTEADO',
  `status_t` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'L',
  `id_seq_delineamento` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `experiment_genotipe`
--

INSERT INTO `experiment_genotipe` (`id`, `created_at`, `idSafra`, `idFoco`, `idTypeAssay`, `idTecnologia`, `idExperiment`, `idGenotipo`, `blockLayoutId`, `idLote`, `gli`, `rep`, `nt`, `npe`, `nca`, `status`, `status_t`, `id_seq_delineamento`) VALUES
(1, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 9, NULL, NULL, 'INTS(0)50/01', 1, 1, 663001, NULL, 'SORTEADO', 'L', 30),
(2, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 9, NULL, NULL, 'INTS(0)50/01', 1, 1, 663002, NULL, 'SORTEADO', 'L', 52),
(3, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 3, NULL, NULL, 'INTS(0)50/01', 1, 2, 663003, NULL, 'SORTEADO', 'L', 30),
(4, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 3, NULL, NULL, 'INTS(0)50/01', 1, 2, 663004, NULL, 'SORTEADO', 'L', 52),
(5, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 6, NULL, NULL, 'INTS(0)50/01', 1, 3, 663005, NULL, 'SORTEADO', 'L', 30),
(6, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 6, NULL, NULL, 'INTS(0)50/01', 1, 3, 663006, NULL, 'SORTEADO', 'L', 52),
(7, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 23, NULL, NULL, 'INTS(0)50/01', 1, 4, 663007, '202120726101', 'SORTEADO', 'L', 30),
(8, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 23, NULL, NULL, 'INTS(0)50/01', 1, 4, 663008, '202120726101', 'SORTEADO', 'L', 52),
(9, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 24, NULL, NULL, 'INTS(0)50/01', 1, 5, 663009, '202120726102', 'SORTEADO', 'L', 30),
(10, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 24, NULL, NULL, 'INTS(0)50/01', 1, 5, 663010, '202120726102', 'SORTEADO', 'L', 52),
(11, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 26, NULL, NULL, 'INTS(0)50/01', 1, 6, 663011, '202120726104', 'SORTEADO', 'L', 30),
(12, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 26, NULL, NULL, 'INTS(0)50/01', 1, 6, 663012, '202120726104', 'SORTEADO', 'L', 52),
(13, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 27, NULL, NULL, 'INTS(0)50/01', 1, 7, 663013, '202120726105', 'SORTEADO', 'L', 30),
(14, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 27, NULL, NULL, 'INTS(0)50/01', 1, 7, 663014, '202120726105', 'SORTEADO', 'L', 52),
(15, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 29, NULL, NULL, 'INTS(0)50/01', 1, 8, 663015, '202120726107', 'SORTEADO', 'L', 30),
(16, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 29, NULL, NULL, 'INTS(0)50/01', 1, 8, 663016, '202120726107', 'SORTEADO', 'L', 52),
(17, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 30, NULL, NULL, 'INTS(0)50/01', 1, 9, 663017, '202120726108', 'SORTEADO', 'L', 30),
(18, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 30, NULL, NULL, 'INTS(0)50/01', 1, 9, 663018, '202120726108', 'SORTEADO', 'L', 52),
(19, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 31, NULL, NULL, 'INTS(0)50/01', 1, 10, 663019, '202120726109', 'SORTEADO', 'L', 30),
(20, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 31, NULL, NULL, 'INTS(0)50/01', 1, 10, 663020, '202120726109', 'SORTEADO', 'L', 52),
(21, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 96, NULL, NULL, 'INTS(0)50/01', 1, 11, 663021, '202120724814', 'SORTEADO', 'L', 30),
(22, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 96, NULL, NULL, 'INTS(0)50/01', 1, 11, 663022, '202120724814', 'SORTEADO', 'L', 52),
(23, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 44, NULL, NULL, 'INTS(0)50/01', 1, 12, 663023, '202120726123', 'SORTEADO', 'L', 30),
(24, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 44, NULL, NULL, 'INTS(0)50/01', 1, 12, 663024, '202120726123', 'SORTEADO', 'L', 52),
(25, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 45, NULL, NULL, 'INTS(0)50/01', 1, 13, 663025, '202120726124', 'SORTEADO', 'L', 30),
(26, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 45, NULL, NULL, 'INTS(0)50/01', 1, 13, 663026, '202120726124', 'SORTEADO', 'L', 52),
(27, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 46, NULL, NULL, 'INTS(0)50/01', 1, 14, 663027, '202120726125', 'SORTEADO', 'L', 30),
(28, '2022-10-28 14:35:45.436', 84, 4, 6, 12, 3, 46, NULL, NULL, 'INTS(0)50/01', 1, 14, 663028, '202120726125', 'SORTEADO', 'L', 52),
(29, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 47, NULL, NULL, 'INTS(0)50/01', 1, 15, 663029, '202120726126', 'SORTEADO', 'L', 30),
(30, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 47, NULL, NULL, 'INTS(0)50/01', 1, 15, 663030, '202120726126', 'SORTEADO', 'L', 52),
(31, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 48, NULL, NULL, 'INTS(0)50/01', 1, 16, 663031, '202120726127', 'SORTEADO', 'L', 30),
(32, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 48, NULL, NULL, 'INTS(0)50/01', 1, 16, 663032, '202120726127', 'SORTEADO', 'L', 52),
(33, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 49, NULL, NULL, 'INTS(0)50/01', 1, 17, 663033, '202120726128', 'SORTEADO', 'L', 30),
(34, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 49, NULL, NULL, 'INTS(0)50/01', 1, 17, 663034, '202120726128', 'SORTEADO', 'L', 52),
(35, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 50, NULL, NULL, 'INTS(0)50/01', 1, 18, 663035, '202120726129', 'SORTEADO', 'L', 30),
(36, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 50, NULL, NULL, 'INTS(0)50/01', 1, 18, 663036, '202120726129', 'SORTEADO', 'L', 52),
(37, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 51, NULL, NULL, 'INTS(0)50/01', 1, 19, 663037, '202120726131', 'SORTEADO', 'L', 30),
(38, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 51, NULL, NULL, 'INTS(0)50/01', 1, 19, 663038, '202120726131', 'SORTEADO', 'L', 52),
(39, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 52, NULL, NULL, 'INTS(0)50/01', 1, 20, 663039, '202120726132', 'SORTEADO', 'L', 30),
(40, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 52, NULL, NULL, 'INTS(0)50/01', 1, 20, 663040, '202120726132', 'SORTEADO', 'L', 52),
(41, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 53, NULL, NULL, 'INTS(0)50/01', 1, 21, 663041, '202120726133', 'SORTEADO', 'L', 30),
(42, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 53, NULL, NULL, 'INTS(0)50/01', 1, 21, 663042, '202120726133', 'SORTEADO', 'L', 52),
(43, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 54, NULL, NULL, 'INTS(0)50/01', 1, 22, 663043, '202120726134', 'SORTEADO', 'L', 30),
(44, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 54, NULL, NULL, 'INTS(0)50/01', 1, 22, 663044, '202120726134', 'SORTEADO', 'L', 52),
(45, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 28, NULL, NULL, 'INTS(0)50/01', 1, 23, 663045, '202120726106', 'SORTEADO', 'L', 30),
(46, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 28, NULL, NULL, 'INTS(0)50/01', 1, 23, 663046, '202120726106', 'SORTEADO', 'L', 52),
(47, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 55, NULL, NULL, 'INTS(0)50/01', 1, 24, 663047, '202120726135', 'SORTEADO', 'L', 30),
(48, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 55, NULL, NULL, 'INTS(0)50/01', 1, 24, 663048, '202120726135', 'SORTEADO', 'L', 52),
(49, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 56, NULL, NULL, 'INTS(0)50/01', 1, 25, 663049, '202120726136', 'SORTEADO', 'L', 30),
(50, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 56, NULL, NULL, 'INTS(0)50/01', 1, 25, 663050, '202120726136', 'SORTEADO', 'L', 52),
(51, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 34, NULL, NULL, 'INTS(0)50/01', 1, 26, 663051, '202120726112', 'SORTEADO', 'L', 30),
(52, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 34, NULL, NULL, 'INTS(0)50/01', 1, 26, 663052, '202120726112', 'SORTEADO', 'L', 52),
(53, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 35, NULL, NULL, 'INTS(0)50/01', 1, 27, 663053, '202120726113', 'SORTEADO', 'L', 30),
(54, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 35, NULL, NULL, 'INTS(0)50/01', 1, 27, 663054, '202120726113', 'SORTEADO', 'L', 52),
(55, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 57, NULL, NULL, 'INTS(0)50/01', 1, 28, 663055, '202120726137', 'SORTEADO', 'L', 30),
(56, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 57, NULL, NULL, 'INTS(0)50/01', 1, 28, 663056, '202120726137', 'SORTEADO', 'L', 52),
(57, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 58, NULL, NULL, 'INTS(0)50/01', 1, 29, 663057, '202120726138', 'SORTEADO', 'L', 30),
(58, '2022-10-28 14:35:45.437', 84, 4, 6, 12, 3, 58, NULL, NULL, 'INTS(0)50/01', 1, 29, 663058, '202120726138', 'SORTEADO', 'L', 52),
(59, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 59, NULL, NULL, 'INTS(0)50/01', 1, 30, 663059, '202120726139', 'SORTEADO', 'L', 30),
(60, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 59, NULL, NULL, 'INTS(0)50/01', 1, 30, 663060, '202120726139', 'SORTEADO', 'L', 52),
(61, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 9, NULL, NULL, 'INTS(0)50/01', 2, 1, 663061, NULL, 'SORTEADO', 'L', 30),
(62, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 9, NULL, NULL, 'INTS(0)50/01', 2, 1, 663062, NULL, 'SORTEADO', 'L', 52),
(63, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 3, NULL, NULL, 'INTS(0)50/01', 2, 2, 663063, NULL, 'SORTEADO', 'L', 30),
(64, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 3, NULL, NULL, 'INTS(0)50/01', 2, 2, 663064, NULL, 'SORTEADO', 'L', 52),
(65, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 6, NULL, NULL, 'INTS(0)50/01', 2, 3, 663065, NULL, 'SORTEADO', 'L', 30),
(66, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 6, NULL, NULL, 'INTS(0)50/01', 2, 3, 663066, NULL, 'SORTEADO', 'L', 52),
(67, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 23, NULL, NULL, 'INTS(0)50/01', 2, 4, 663067, '202120726101', 'SORTEADO', 'L', 30),
(68, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 23, NULL, NULL, 'INTS(0)50/01', 2, 4, 663068, '202120726101', 'SORTEADO', 'L', 52),
(69, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 24, NULL, NULL, 'INTS(0)50/01', 2, 5, 663069, '202120726102', 'SORTEADO', 'L', 30),
(70, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 24, NULL, NULL, 'INTS(0)50/01', 2, 5, 663070, '202120726102', 'SORTEADO', 'L', 52),
(71, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 26, NULL, NULL, 'INTS(0)50/01', 2, 6, 663071, '202120726104', 'SORTEADO', 'L', 30),
(72, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 26, NULL, NULL, 'INTS(0)50/01', 2, 6, 663072, '202120726104', 'SORTEADO', 'L', 52),
(73, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 27, NULL, NULL, 'INTS(0)50/01', 2, 7, 663073, '202120726105', 'SORTEADO', 'L', 30),
(74, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 27, NULL, NULL, 'INTS(0)50/01', 2, 7, 663074, '202120726105', 'SORTEADO', 'L', 52),
(75, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 29, NULL, NULL, 'INTS(0)50/01', 2, 8, 663075, '202120726107', 'SORTEADO', 'L', 30),
(76, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 29, NULL, NULL, 'INTS(0)50/01', 2, 8, 663076, '202120726107', 'SORTEADO', 'L', 52),
(77, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 30, NULL, NULL, 'INTS(0)50/01', 2, 9, 663077, '202120726108', 'SORTEADO', 'L', 30),
(78, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 30, NULL, NULL, 'INTS(0)50/01', 2, 9, 663078, '202120726108', 'SORTEADO', 'L', 52),
(79, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 31, NULL, NULL, 'INTS(0)50/01', 2, 10, 663079, '202120726109', 'SORTEADO', 'L', 30),
(80, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 31, NULL, NULL, 'INTS(0)50/01', 2, 10, 663080, '202120726109', 'SORTEADO', 'L', 52),
(81, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 96, NULL, NULL, 'INTS(0)50/01', 2, 11, 663081, '202120724814', 'SORTEADO', 'L', 30),
(82, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 96, NULL, NULL, 'INTS(0)50/01', 2, 11, 663082, '202120724814', 'SORTEADO', 'L', 52),
(83, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 44, NULL, NULL, 'INTS(0)50/01', 2, 12, 663083, '202120726123', 'SORTEADO', 'L', 30),
(84, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 44, NULL, NULL, 'INTS(0)50/01', 2, 12, 663084, '202120726123', 'SORTEADO', 'L', 52),
(85, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 45, NULL, NULL, 'INTS(0)50/01', 2, 13, 663085, '202120726124', 'SORTEADO', 'L', 30),
(86, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 45, NULL, NULL, 'INTS(0)50/01', 2, 13, 663086, '202120726124', 'SORTEADO', 'L', 52),
(87, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 46, NULL, NULL, 'INTS(0)50/01', 2, 14, 663087, '202120726125', 'SORTEADO', 'L', 30),
(88, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 46, NULL, NULL, 'INTS(0)50/01', 2, 14, 663088, '202120726125', 'SORTEADO', 'L', 52),
(89, '2022-10-28 14:35:45.438', 84, 4, 6, 12, 3, 47, NULL, NULL, 'INTS(0)50/01', 2, 15, 663089, '202120726126', 'SORTEADO', 'L', 30),
(90, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 47, NULL, NULL, 'INTS(0)50/01', 2, 15, 663090, '202120726126', 'SORTEADO', 'L', 52),
(91, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 48, NULL, NULL, 'INTS(0)50/01', 2, 16, 663091, '202120726127', 'SORTEADO', 'L', 30),
(92, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 48, NULL, NULL, 'INTS(0)50/01', 2, 16, 663092, '202120726127', 'SORTEADO', 'L', 52),
(93, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 49, NULL, NULL, 'INTS(0)50/01', 2, 17, 663093, '202120726128', 'SORTEADO', 'L', 30),
(94, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 49, NULL, NULL, 'INTS(0)50/01', 2, 17, 663094, '202120726128', 'SORTEADO', 'L', 52),
(95, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 50, NULL, NULL, 'INTS(0)50/01', 2, 18, 663095, '202120726129', 'SORTEADO', 'L', 30),
(96, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 50, NULL, NULL, 'INTS(0)50/01', 2, 18, 663096, '202120726129', 'SORTEADO', 'L', 52),
(97, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 51, NULL, NULL, 'INTS(0)50/01', 2, 19, 663097, '202120726131', 'SORTEADO', 'L', 30),
(98, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 51, NULL, NULL, 'INTS(0)50/01', 2, 19, 663098, '202120726131', 'SORTEADO', 'L', 52),
(99, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 52, NULL, NULL, 'INTS(0)50/01', 2, 20, 663099, '202120726132', 'SORTEADO', 'L', 30),
(100, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 52, NULL, NULL, 'INTS(0)50/01', 2, 20, 663100, '202120726132', 'SORTEADO', 'L', 52),
(101, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 53, NULL, NULL, 'INTS(0)50/01', 2, 21, 663101, '202120726133', 'SORTEADO', 'L', 30),
(102, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 53, NULL, NULL, 'INTS(0)50/01', 2, 21, 663102, '202120726133', 'SORTEADO', 'L', 52),
(103, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 54, NULL, NULL, 'INTS(0)50/01', 2, 22, 663103, '202120726134', 'SORTEADO', 'L', 30),
(104, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 54, NULL, NULL, 'INTS(0)50/01', 2, 22, 663104, '202120726134', 'SORTEADO', 'L', 52),
(105, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 28, NULL, NULL, 'INTS(0)50/01', 2, 23, 663105, '202120726106', 'SORTEADO', 'L', 30),
(106, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 28, NULL, NULL, 'INTS(0)50/01', 2, 23, 663106, '202120726106', 'SORTEADO', 'L', 52),
(107, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 55, NULL, NULL, 'INTS(0)50/01', 2, 24, 663107, '202120726135', 'SORTEADO', 'L', 30),
(108, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 55, NULL, NULL, 'INTS(0)50/01', 2, 24, 663108, '202120726135', 'SORTEADO', 'L', 52),
(109, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 56, NULL, NULL, 'INTS(0)50/01', 2, 25, 663109, '202120726136', 'SORTEADO', 'L', 30),
(110, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 56, NULL, NULL, 'INTS(0)50/01', 2, 25, 663110, '202120726136', 'SORTEADO', 'L', 52),
(111, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 34, NULL, NULL, 'INTS(0)50/01', 2, 26, 663111, '202120726112', 'SORTEADO', 'L', 30),
(112, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 34, NULL, NULL, 'INTS(0)50/01', 2, 26, 663112, '202120726112', 'SORTEADO', 'L', 52),
(113, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 35, NULL, NULL, 'INTS(0)50/01', 2, 27, 663113, '202120726113', 'SORTEADO', 'L', 30),
(114, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 35, NULL, NULL, 'INTS(0)50/01', 2, 27, 663114, '202120726113', 'SORTEADO', 'L', 52),
(115, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 57, NULL, NULL, 'INTS(0)50/01', 2, 28, 663115, '202120726137', 'SORTEADO', 'L', 30),
(116, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 57, NULL, NULL, 'INTS(0)50/01', 2, 28, 663116, '202120726137', 'SORTEADO', 'L', 52),
(117, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 58, NULL, NULL, 'INTS(0)50/01', 2, 29, 663117, '202120726138', 'SORTEADO', 'L', 30),
(118, '2022-10-28 14:35:45.439', 84, 4, 6, 12, 3, 58, NULL, NULL, 'INTS(0)50/01', 2, 29, 663118, '202120726138', 'SORTEADO', 'L', 52),
(119, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 3, 59, NULL, NULL, 'INTS(0)50/01', 2, 30, 663119, '202120726139', 'SORTEADO', 'L', 30),
(120, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 3, 59, NULL, NULL, 'INTS(0)50/01', 2, 30, 663120, '202120726139', 'SORTEADO', 'L', 52),
(121, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 9, NULL, NULL, 'INTS(0)50/02', 1, 1, 663121, NULL, 'SORTEADO', 'L', 15),
(122, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 9, NULL, NULL, 'INTS(0)50/02', 1, 1, 663122, NULL, 'SORTEADO', 'L', 32),
(123, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 3, NULL, NULL, 'INTS(0)50/02', 1, 2, 663123, NULL, 'SORTEADO', 'L', 15),
(124, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 3, NULL, NULL, 'INTS(0)50/02', 1, 2, 663124, NULL, 'SORTEADO', 'L', 32),
(125, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 6, NULL, NULL, 'INTS(0)50/02', 1, 3, 663125, NULL, 'SORTEADO', 'L', 15),
(126, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 6, NULL, NULL, 'INTS(0)50/02', 1, 3, 663126, NULL, 'SORTEADO', 'L', 32),
(127, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 60, NULL, NULL, 'INTS(0)50/02', 1, 4, 663127, '202120726140', 'SORTEADO', 'L', 15),
(128, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 60, NULL, NULL, 'INTS(0)50/02', 1, 4, 663128, '202120726140', 'SORTEADO', 'L', 32),
(129, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 36, NULL, NULL, 'INTS(0)50/02', 1, 5, 663129, '202120726114', 'SORTEADO', 'L', 15),
(130, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 36, NULL, NULL, 'INTS(0)50/02', 1, 5, 663130, '202120726114', 'SORTEADO', 'L', 32),
(131, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 38, NULL, NULL, 'INTS(0)50/02', 1, 6, 663131, '202120726116', 'SORTEADO', 'L', 15),
(132, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 38, NULL, NULL, 'INTS(0)50/02', 1, 6, 663132, '202120726116', 'SORTEADO', 'L', 32),
(133, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 37, NULL, NULL, 'INTS(0)50/02', 1, 7, 663133, '202120726115', 'SORTEADO', 'L', 15),
(134, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 37, NULL, NULL, 'INTS(0)50/02', 1, 7, 663134, '202120726115', 'SORTEADO', 'L', 32),
(135, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 33, NULL, NULL, 'INTS(0)50/02', 1, 8, 663135, '202120726111', 'SORTEADO', 'L', 15),
(136, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 33, NULL, NULL, 'INTS(0)50/02', 1, 8, 663136, '202120726111', 'SORTEADO', 'L', 32),
(137, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 41, NULL, NULL, 'INTS(0)50/02', 1, 9, 663137, '202120726120', 'SORTEADO', 'L', 15),
(138, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 41, NULL, NULL, 'INTS(0)50/02', 1, 9, 663138, '202120726120', 'SORTEADO', 'L', 32),
(139, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 25, NULL, NULL, 'INTS(0)50/02', 1, 10, 663139, '202120726103', 'SORTEADO', 'L', 15),
(140, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 25, NULL, NULL, 'INTS(0)50/02', 1, 10, 663140, '202120726103', 'SORTEADO', 'L', 32),
(141, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 39, NULL, NULL, 'INTS(0)50/02', 1, 11, 663141, '202120726117', 'SORTEADO', 'L', 15),
(142, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 39, NULL, NULL, 'INTS(0)50/02', 1, 11, 663142, '202120726117', 'SORTEADO', 'L', 32),
(143, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 42, NULL, NULL, 'INTS(0)50/02', 1, 12, 663143, '202120726121', 'SORTEADO', 'L', 15),
(144, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 42, NULL, NULL, 'INTS(0)50/02', 1, 12, 663144, '202120726121', 'SORTEADO', 'L', 32),
(145, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 32, NULL, NULL, 'INTS(0)50/02', 1, 13, 663145, '202120726110', 'SORTEADO', 'L', 15),
(146, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 32, NULL, NULL, 'INTS(0)50/02', 1, 13, 663146, '202120726110', 'SORTEADO', 'L', 32),
(147, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 40, NULL, NULL, 'INTS(0)50/02', 1, 14, 663147, '202120726118', 'SORTEADO', 'L', 15),
(148, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 40, NULL, NULL, 'INTS(0)50/02', 1, 14, 663148, '202120726118', 'SORTEADO', 'L', 32),
(149, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 43, NULL, NULL, 'INTS(0)50/02', 1, 15, 663149, '202120726122', 'SORTEADO', 'L', 15),
(150, '2022-10-28 14:35:45.440', 84, 4, 6, 12, 6, 43, NULL, NULL, 'INTS(0)50/02', 1, 15, 663150, '202120726122', 'SORTEADO', 'L', 32),
(151, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 9, NULL, NULL, 'INTS(0)50/02', 2, 1, 663151, NULL, 'SORTEADO', 'L', 15),
(152, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 9, NULL, NULL, 'INTS(0)50/02', 2, 1, 663152, NULL, 'SORTEADO', 'L', 32),
(153, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 3, NULL, NULL, 'INTS(0)50/02', 2, 2, 663153, NULL, 'SORTEADO', 'L', 15),
(154, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 3, NULL, NULL, 'INTS(0)50/02', 2, 2, 663154, NULL, 'SORTEADO', 'L', 32),
(155, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 6, NULL, NULL, 'INTS(0)50/02', 2, 3, 663155, NULL, 'SORTEADO', 'L', 15),
(156, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 6, NULL, NULL, 'INTS(0)50/02', 2, 3, 663156, NULL, 'SORTEADO', 'L', 32),
(157, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 60, NULL, NULL, 'INTS(0)50/02', 2, 4, 663157, '202120726140', 'SORTEADO', 'L', 15),
(158, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 60, NULL, NULL, 'INTS(0)50/02', 2, 4, 663158, '202120726140', 'SORTEADO', 'L', 32),
(159, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 36, NULL, NULL, 'INTS(0)50/02', 2, 5, 663159, '202120726114', 'SORTEADO', 'L', 15),
(160, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 36, NULL, NULL, 'INTS(0)50/02', 2, 5, 663160, '202120726114', 'SORTEADO', 'L', 32),
(161, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 38, NULL, NULL, 'INTS(0)50/02', 2, 6, 663161, '202120726116', 'SORTEADO', 'L', 15),
(162, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 38, NULL, NULL, 'INTS(0)50/02', 2, 6, 663162, '202120726116', 'SORTEADO', 'L', 32),
(163, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 37, NULL, NULL, 'INTS(0)50/02', 2, 7, 663163, '202120726115', 'SORTEADO', 'L', 15),
(164, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 37, NULL, NULL, 'INTS(0)50/02', 2, 7, 663164, '202120726115', 'SORTEADO', 'L', 32),
(165, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 33, NULL, NULL, 'INTS(0)50/02', 2, 8, 663165, '202120726111', 'SORTEADO', 'L', 15),
(166, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 33, NULL, NULL, 'INTS(0)50/02', 2, 8, 663166, '202120726111', 'SORTEADO', 'L', 32),
(167, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 41, NULL, NULL, 'INTS(0)50/02', 2, 9, 663167, '202120726120', 'SORTEADO', 'L', 15),
(168, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 41, NULL, NULL, 'INTS(0)50/02', 2, 9, 663168, '202120726120', 'SORTEADO', 'L', 32),
(169, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 25, NULL, NULL, 'INTS(0)50/02', 2, 10, 663169, '202120726103', 'SORTEADO', 'L', 15),
(170, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 25, NULL, NULL, 'INTS(0)50/02', 2, 10, 663170, '202120726103', 'SORTEADO', 'L', 32),
(171, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 39, NULL, NULL, 'INTS(0)50/02', 2, 11, 663171, '202120726117', 'SORTEADO', 'L', 15),
(172, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 39, NULL, NULL, 'INTS(0)50/02', 2, 11, 663172, '202120726117', 'SORTEADO', 'L', 32),
(173, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 42, NULL, NULL, 'INTS(0)50/02', 2, 12, 663173, '202120726121', 'SORTEADO', 'L', 15),
(174, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 42, NULL, NULL, 'INTS(0)50/02', 2, 12, 663174, '202120726121', 'SORTEADO', 'L', 32),
(175, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 32, NULL, NULL, 'INTS(0)50/02', 2, 13, 663175, '202120726110', 'SORTEADO', 'L', 15),
(176, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 32, NULL, NULL, 'INTS(0)50/02', 2, 13, 663176, '202120726110', 'SORTEADO', 'L', 32),
(177, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 40, NULL, NULL, 'INTS(0)50/02', 2, 14, 663177, '202120726118', 'SORTEADO', 'L', 15),
(178, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 40, NULL, NULL, 'INTS(0)50/02', 2, 14, 663178, '202120726118', 'SORTEADO', 'L', 32),
(179, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 43, NULL, NULL, 'INTS(0)50/02', 2, 15, 663179, '202120726122', 'SORTEADO', 'L', 15),
(180, '2022-10-28 14:35:45.441', 84, 4, 6, 12, 6, 43, NULL, NULL, 'INTS(0)50/02', 2, 15, 663180, '202120726122', 'SORTEADO', 'L', 32);

-- --------------------------------------------------------

--
-- Estrutura para tabela `foco`
--

CREATE TABLE `foco` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `foco`
--

INSERT INTO `foco` (`id`, `id_culture`, `name`, `status`, `created_by`, `created_at`) VALUES
(1, 24, 'SUL', 1, 23, '2022-09-27 15:20:14.035'),
(2, 22, 'NORTE', 0, 23, '2022-09-27 15:20:35.916'),
(3, 22, 'CO', 0, 2, '2022-09-27 19:45:17.779'),
(4, 22, 'SUL', 0, 2, '2022-09-28 21:51:42.551'),
(5, 24, 'CO', 1, 23, '2022-09-28 21:56:29.303'),
(6, 24, 'GA', 1, 2, '2022-09-28 21:58:05.264'),
(7, 22, 'NORTE', 0, 2, '2022-10-05 13:57:41.446'),
(8, 24, 'Teste', 0, 2, '2022-10-06 12:32:38.190'),
(9, 25, 'TESTE', 1, 23, '2022-10-07 15:24:25.849'),
(10, 27, 'SUL', 1, 38, '2022-10-28 19:10:32.849'),
(11, 23, 'SUL', 1, 2, '2022-10-29 15:18:20.725');

-- --------------------------------------------------------

--
-- Estrutura para tabela `genotipo`
--

CREATE TABLE `genotipo` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `cruza` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `id_tecnologia` int(11) NOT NULL,
  `bgm` decimal(12,2) DEFAULT NULL,
  `elit_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gmr` decimal(12,2) DEFAULT NULL,
  `numberLotes` int(11) DEFAULT NULL,
  `id_dados` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_s1` int(11) NOT NULL,
  `name_alter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_experiment` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_genotipo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_main` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_public` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentesco_completo` mediumtext COLLATE utf8mb4_unicode_ci,
  `progenitor_f_direto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progenitor_f_origem` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progenitor_m_direto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progenitor_m_origem` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `progenitores_origem` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `safraId` int(11) DEFAULT NULL,
  `dt_export` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `genotipo`
--

INSERT INTO `genotipo` (`id`, `id_culture`, `cruza`, `created_by`, `created_at`, `id_tecnologia`, `bgm`, `elit_name`, `gmr`, `numberLotes`, `id_dados`, `id_s1`, `name_alter`, `name_experiment`, `name_genotipo`, `name_main`, `name_public`, `parentesco_completo`, `progenitor_f_direto`, `progenitor_f_origem`, `progenitor_m_direto`, `progenitor_m_origem`, `progenitores_origem`, `type`, `safraId`, `dt_export`) VALUES
(1, 22, 'BMXCOMPACTAIPRO', 23, '2022-10-28 12:36:05.272', 10, '65.00', NULL, '6.50', 1, '9', 9, NULL, 'BMXCOMPACTAIPRO', 'BMXCOMPACTAIPRO', 'BMXCOMPACTAIPRO', NULL, 'BMXCOMPACTAIPRO', NULL, NULL, NULL, NULL, 'BMXCOMPACTAIPRO', 'CC', NULL, '2022-10-09 10:00:00.000'),
(2, 22, 'BMXLANÇAIPRO', 23, '2022-10-28 12:36:06.421', 12, '56.00', NULL, '5.80', 29, '15', 15, NULL, 'BMXLANÇAIPRO', 'BMXLANCAIPRO', 'BMXLANÇAIPRO', NULL, 'BMXLANÇAIPRO', NULL, NULL, NULL, NULL, 'BMXLANÇAIPRO', 'CC', NULL, '2022-10-09 10:00:00.000'),
(3, 22, 'BMXRAIOIPRO', 2, '2022-10-28 12:36:07.680', 12, '50.00', NULL, '5.00', 48, '19', 19, NULL, 'BMXRAIOIPRO', 'BMXRAIOIPRO', 'BMXRAIOIPRO', NULL, 'BMXRAIOIPRO', NULL, NULL, NULL, NULL, 'BMXRAIOIPRO', 'CC', NULL, '2022-10-27 10:00:00.000'),
(4, 22, 'BMXZEUSIPRO', 2, '2022-10-28 12:36:09.618', 12, '56.00', NULL, '5.70', 117, '23', 23, NULL, 'BMXZEUSIPRO', 'BMXZEUSIPRO', 'BMXZEUSIPRO', NULL, 'BMXZEUSIPRO', NULL, NULL, NULL, NULL, 'BMXZEUSIPRO', 'CC', NULL, '2022-10-27 10:00:00.000'),
(5, 22, 'BS2606IPRO', 2, '2022-10-28 12:36:14.218', 12, '59.00', NULL, '6.00', 41, '24', 24, NULL, 'BS2606IPRO', 'BS2606IPRO', 'BS2606IPRO', NULL, 'BS2606IPRO', NULL, NULL, NULL, NULL, 'BS2606IPRO', 'CC', NULL, '2022-10-27 10:00:00.000'),
(6, 22, 'DM53I54IPRO', 2, '2022-10-28 12:36:15.319', 12, '53.00', NULL, '5.40', 27, '30', 30, NULL, 'DM53I54IPRO', 'DM53I54IPRO', 'DM53I54IPRO', NULL, 'DM53I54IPRO', NULL, NULL, NULL, NULL, 'DM53I54IPRO', 'CC', NULL, '2022-10-27 10:00:00.000'),
(7, 22, 'DM66I68IPRO', 2, '2022-10-28 12:36:16.060', 12, '65.00', NULL, '6.60', 80, '33', 33, NULL, 'DM66I68IPRO', 'DM66I68RSFIPRO', 'DM66I68IPRO', NULL, 'DM66I68IPRO', NULL, NULL, NULL, NULL, 'DM66I68IPRO', 'CC', NULL, '2022-10-27 10:00:00.000'),
(8, 22, 'NS5445IPRO', 2, '2022-10-28 12:36:18.509', 12, '53.00', NULL, '5.40', 14, '69', 69, NULL, 'NS5445IPRO', 'NS5445IPRO', 'NS5445IPRO', NULL, 'NS5445IPRO', NULL, NULL, NULL, NULL, 'NS5445IPRO', 'CC', NULL, '2022-10-27 10:00:00.000'),
(9, 22, 'P95R51RR', 2, '2022-10-28 12:36:18.899', 12, '53.00', NULL, '5.40', 28, '84', 84, NULL, 'P95R51RR', 'P95R51RR', 'P95R51RR', NULL, 'P95R51RR', NULL, NULL, NULL, NULL, 'P95R51RR', 'CC', NULL, '2022-10-27 10:00:00.000'),
(10, 22, 'TMG2757IPRO', 2, '2022-10-28 12:36:19.706', 12, '56.00', NULL, '5.70', 39, '207', 207, NULL, 'TMG2757IPRO', 'TMG2757IPRO', 'TMG2757IPRO', NULL, 'TMG2757IPRO', NULL, NULL, NULL, NULL, 'TMG2757IPRO', 'CI', NULL, '2022-10-27 10:00:00.000'),
(11, 22, 'TMG7368IPRO', 2, '2022-10-28 12:36:20.800', 12, '68.00', NULL, '6.80', 77, '215', 215, NULL, 'TMG7368IPRO', 'TMG7368IPRO', 'TMG7368IPRO', NULL, 'TMG7368IPRO', NULL, NULL, NULL, NULL, 'TMG7368IPRO', 'CI', NULL, '2022-10-27 10:00:00.000'),
(12, 22, 'NA5909RR', 2, '2022-10-28 12:36:23.110', 12, '59.00', NULL, '6.00', 60, '218', 218, NULL, 'NA5909RR', 'NA5909RR', 'NA5909RR', NULL, 'NA5909RR', NULL, NULL, NULL, NULL, 'NA5909RR', 'CC', NULL, '2022-10-27 10:00:00.000'),
(13, 22, 'VAZIO', 2, '2022-10-28 12:36:24.861', 12, '59.00', NULL, '5.90', 4, '377', 377, NULL, 'TS17-3-310605', 'TS17-3-310605', 'TS17-3-310605', NULL, '[TMG15-1-PYT22] X [[TMG 7161 RR] X [MS(E3)]]', NULL, NULL, NULL, NULL, 'NA5909RR', 'LI', NULL, '2022-10-27 10:00:00.000'),
(14, 22, 'TS17-2-201.759', 2, '2022-10-28 12:36:24.988', 12, '56.00', NULL, '5.80', 1, '8731', 8733, NULL, 'TS19-0-121.009', 'TS19-0-121009', 'TS19-0-121.009', NULL, '[[NA5909RG X BTRR2-5] X [[[NA5909RG X BTRR2-5]] X TMG08-70.105-505]] X [[[[NA5909RG X RR2BT-V]] X [[[NA5909RG X BTRR2-5] X TMG08-70.105-505]]] X [TS17-2-201.759 X TS15-0-010.255]]', NULL, NULL, NULL, NULL, '[TS17-2-201.759] X [TMGB19-0-90.023/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(15, 22, 'TS17-2-201.759', 2, '2022-10-28 12:36:25.014', 12, '56.00', NULL, '5.80', 1, '8735', 8737, NULL, 'TS19-0-121.014', 'TS19-0-121014', 'TS19-0-121.014', NULL, '[[NA5909RG X BTRR2-5] X [[[NA5909RG X BTRR2-5]] X TMG08-70.105-505]] X [[[[NA5909RG X RR2BT-V]] X [[[NA5909RG X BTRR2-5] X TMG08-70.105-505]]] X [TS17-2-201.759 X TS15-0-010.255]]', NULL, NULL, NULL, NULL, '[TS17-2-201.759] X [TMGB19-0-90.023/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(16, 22, 'TMG2757IPRO', 2, '2022-10-28 12:36:25.043', 12, '56.00', NULL, '5.60', 1, '8742', 8744, NULL, 'TS19-0-121.030', 'TS19-0-121030', 'TS19-0-121.030', NULL, '[NS5959IPRO X [NA5909RG X BTRR2-5]] X [[NS5959IPRO X [[NA5909RG X RR2BT-V]]] X [TS17-2-218.137 X TS15-0-011.161]]', NULL, NULL, NULL, NULL, '[TS17-2-218.137] X [TMGB19-0-90.047/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(17, 22, 'TMG2757IPRO', 2, '2022-10-28 12:36:25.070', 12, '56.00', NULL, '5.70', 1, '8745', 8747, NULL, 'TS19-0-121.033', 'TS19-0-121033', 'TS19-0-121.033', NULL, '[NS5959IPRO X [NA5909RG X BTRR2-5]] X [[NS5959IPRO X [[NA5909RG X RR2BT-V]]] X [TS17-2-218.137 X TS15-0-011.161]]', NULL, NULL, NULL, NULL, '[TS17-2-218.137] X [TMGB19-0-90.047/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(18, 22, 'TMG7058IPRO', 2, '2022-10-28 12:36:25.100', 12, '56.00', NULL, '5.80', 1, '8748', 8750, NULL, 'TS19-0-121.036', 'TS19-0-121036', 'TS19-0-121.036', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(19, 22, 'TMG7058IPRO', 2, '2022-10-28 12:36:25.131', 12, '56.00', NULL, '5.80', 1, '8749', 8751, NULL, 'TS19-0-121.037', 'TS19-0-121037', 'TS19-0-121.037', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(20, 22, 'TMG7058IPRO', 2, '2022-10-28 12:36:25.165', 12, '56.00', NULL, '5.80', 1, '8750', 8752, NULL, 'TS19-0-121.038', 'TS19-0-121038', 'TS19-0-121.038', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(21, 22, 'TMG7058IPRO', 2, '2022-10-28 12:36:25.195', 12, '56.00', NULL, '5.80', 1, '8751', 8753, NULL, 'TS19-0-121.039', 'TS19-0-121039', 'TS19-0-121.039', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(22, 22, 'TMG7058IPRO', 2, '2022-10-28 12:36:25.222', 12, '56.00', NULL, '5.70', 1, '8752', 8754, NULL, 'TS19-0-121.040', 'TS19-0-121040', 'TS19-0-121.040', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(23, 22, 'TMGB17-1-12330076/180436/1/01', 2, '2022-10-28 12:36:25.248', 12, '50.00', NULL, '4.50', 1, '9412', 9414, NULL, 'TS20-0-95801', 'TS20-0-95801', 'TS20-0-95801', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(24, 22, 'TMGB17-1-12330076/180426/1/01', 2, '2022-10-28 12:36:25.282', 12, '50.00', NULL, '4.50', 1, '9413', 9415, NULL, 'TS20-0-95802', 'TS20-0-95802', 'TS20-0-95802', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(25, 22, 'TMGB17-1-12330076/180362/2/02', 2, '2022-10-28 12:36:25.315', 12, '50.00', NULL, '5.20', 1, '9414', 9416, NULL, 'TS20-0-95803', 'TS20-0-95803', 'TS20-0-95803', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(26, 22, 'TMGB17-1-12330076/180385/1/01', 2, '2022-10-28 12:36:25.351', 12, '50.00', NULL, '4.50', 1, '9415', 9417, NULL, 'TS20-0-95804', 'TS20-0-95804', 'TS20-0-95804', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(27, 22, 'TMGB17-1-12330076/180385/1/01', 2, '2022-10-28 12:36:25.396', 12, '50.00', NULL, '4.50', 1, '9416', 9418, NULL, 'TS20-0-95805', 'TS20-0-95805', 'TS20-0-95805', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(28, 22, 'TMGB17-1-12330076/180369/1/01', 2, '2022-10-28 12:36:25.422', 12, '50.00', NULL, '5.00', 1, '9417', 9419, NULL, 'TS20-0-95806', 'TS20-0-95806', 'TS20-0-95806', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(29, 22, 'TMGB17-1-12330076/180407/2/02', 2, '2022-10-28 12:36:25.447', 12, '50.00', NULL, '4.50', 1, '9418', 9420, NULL, 'TS20-0-95807', 'TS20-0-95807', 'TS20-0-95807', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(30, 22, 'TMGB17-1-12330076/180407/2/02', 2, '2022-10-28 12:36:25.476', 12, '50.00', NULL, '4.50', 1, '9419', 9421, NULL, 'TS20-0-95808', 'TS20-0-95808', 'TS20-0-95808', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(31, 22, 'TMGB17-1-12330076/180385/1/01', 2, '2022-10-28 12:36:25.504', 12, '50.00', NULL, '4.50', 1, '9420', 9422, NULL, 'TS20-0-95809', 'TS20-0-95809', 'TS20-0-95809', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(32, 22, 'TMGB17-1-12330076/180369/1/01', 2, '2022-10-28 12:36:25.554', 12, '50.00', NULL, '5.20', 1, '9421', 9423, NULL, 'TS20-0-95810', 'TS20-0-95810', 'TS20-0-95810', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(33, 22, 'TMGB17-2-22330085/1/180062/2/02', 2, '2022-10-28 12:36:25.585', 12, '50.00', NULL, '5.20', 1, '9422', 9424, NULL, 'TS20-0-95811', 'TS20-0-95811', 'TS20-0-95811', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(34, 22, 'TMGB17-2-22330085/3/180135/1/01', 2, '2022-10-28 12:36:25.613', 12, '50.00', NULL, '5.00', 1, '9423', 9425, NULL, 'TS20-0-95812', 'TS20-0-95812', 'TS20-0-95812', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(35, 22, 'TMGB17-2-22330085/3/180135/2/02', 2, '2022-10-28 12:36:25.644', 12, '50.00', NULL, '5.00', 1, '9424', 9426, NULL, 'TS20-0-95813', 'TS20-0-95813', 'TS20-0-95813', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(36, 22, 'TMGB17-2-22330085/1/180062/1/01', 2, '2022-10-28 12:36:25.691', 12, '50.00', NULL, '5.00', 1, '9425', 9427, NULL, 'TS20-0-95814', 'TS20-0-95814', 'TS20-0-95814', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(37, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:25.743', 12, '50.00', NULL, '5.20', 1, '9426', 9428, NULL, 'TS20-0-95815', 'TS20-0-95815', 'TS20-0-95815', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(38, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:25.803', 12, '50.00', NULL, '5.20', 1, '9427', 9429, NULL, 'TS20-0-95816', 'TS20-0-95816', 'TS20-0-95816', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(39, 22, 'TMGB18-1-60733/1/1', 2, '2022-10-28 12:36:25.827', 12, '50.00', NULL, '5.20', 1, '9428', 9430, NULL, 'TS20-0-95817', 'TS20-0-95817', 'TS20-0-95817', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(40, 22, 'TMGB18-1-60733/1/1', 2, '2022-10-28 12:36:25.853', 12, '50.00', NULL, '5.20', 1, '9429', 9431, NULL, 'TS20-0-95818', 'TS20-0-95818', 'TS20-0-95818', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(41, 22, 'TMGB18-1-60754', 2, '2022-10-28 12:36:25.889', 12, '50.00', NULL, '5.20', 1, '9431', 9433, NULL, 'TS20-0-95820', 'TS20-0-95820', 'TS20-0-95820', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51RR]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(42, 22, 'TMGB18-1-60754', 2, '2022-10-28 12:36:25.925', 12, '50.00', NULL, '5.20', 1, '9432', 9434, NULL, 'TS20-0-95821', 'TS20-0-95821', 'TS20-0-95821', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51RR]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(43, 22, 'TMGB18-1-60754', 2, '2022-10-28 12:36:25.958', 12, '50.00', NULL, '5.20', 1, '9433', 9435, NULL, 'TS20-0-95822', 'TS20-0-95822', 'TS20-0-95822', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51RR]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(44, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:25.990', 12, '50.00', NULL, '5.00', 1, '9434', 9436, NULL, 'TS20-0-95823', 'TS20-0-95823', 'TS20-0-95823', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(45, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.021', 12, '50.00', NULL, '5.00', 1, '9435', 9437, NULL, 'TS20-0-95824', 'TS20-0-95824', 'TS20-0-95824', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(46, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.074', 12, '50.00', NULL, '5.00', 1, '9436', 9438, NULL, 'TS20-0-95825', 'TS20-0-95825', 'TS20-0-95825', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(47, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.106', 12, '50.00', NULL, '5.00', 1, '9437', 9439, NULL, 'TS20-0-95826', 'TS20-0-95826', 'TS20-0-95826', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(48, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.132', 12, '50.00', NULL, '5.00', 1, '9438', 9440, NULL, 'TS20-0-95827', 'TS20-0-95827', 'TS20-0-95827', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(49, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.160', 12, '50.00', NULL, '5.00', 1, '9439', 9441, NULL, 'TS20-0-95828', 'TS20-0-95828', 'TS20-0-95828', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(50, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.189', 12, '50.00', NULL, '5.00', 1, '9440', 9442, NULL, 'TS20-0-95829', 'TS20-0-95829', 'TS20-0-95829', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(51, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.236', 12, '50.00', NULL, '5.00', 1, '9442', 9444, NULL, 'TS20-0-95831', 'TS20-0-95831', 'TS20-0-95831', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(52, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.271', 12, '50.00', NULL, '5.00', 1, '9443', 9445, NULL, 'TS20-0-95832', 'TS20-0-95832', 'TS20-0-95832', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(53, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.299', 12, '50.00', NULL, '5.00', 1, '9444', 9446, NULL, 'TS20-0-95833', 'TS20-0-95833', 'TS20-0-95833', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(54, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.326', 12, '50.00', NULL, '5.00', 1, '9445', 9447, NULL, 'TS20-0-95834', 'TS20-0-95834', 'TS20-0-95834', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(55, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.355', 12, '50.00', NULL, '5.00', 1, '9446', 9448, NULL, 'TS20-0-95835', 'TS20-0-95835', 'TS20-0-95835', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(56, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.385', 12, '50.00', NULL, '5.00', 1, '9447', 9449, NULL, 'TS20-0-95836', 'TS20-0-95836', 'TS20-0-95836', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(57, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.415', 12, '50.00', NULL, '5.00', 1, '9448', 9450, NULL, 'TS20-0-95837', 'TS20-0-95837', 'TS20-0-95837', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(58, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.439', 12, '50.00', NULL, '5.00', 1, '9449', 9451, NULL, 'TS20-0-95838', 'TS20-0-95838', 'TS20-0-95838', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(59, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.475', 12, '50.00', NULL, '5.00', 1, '9450', 9452, NULL, 'TS20-0-95839', 'TS20-0-95839', 'TS20-0-95839', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(60, 22, 'TP18-11115/1', 2, '2022-10-28 12:36:26.509', 12, '50.00', NULL, '5.00', 1, '9451', 9453, NULL, 'TS20-0-95840', 'TS20-0-95840', 'TS20-0-95840', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, '2022-10-27 10:00:00.000'),
(61, 22, 'TMGB18-0-60509/2/1', 2, '2022-10-28 12:36:26.540', 12, '53.00', NULL, '5.40', 1, '9452', 9454, NULL, 'TS20-0-95841', 'TS20-0-95841', 'TS20-0-95841', NULL, '[(AD(5) X FE19-2 ) X ER09-14344_POSSíVEIS GENES PARA RESISTêNCIA à FERRUGEM RPP?.] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[KFE17-0-6714 ] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(62, 22, 'TMGB17-1-12330076/180369/1/01', 2, '2022-10-28 12:36:26.568', 12, '53.00', NULL, '5.30', 1, '9453', 9455, NULL, 'TS20-0-95842', 'TS20-0-95842', 'TS20-0-95842', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(63, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:26.603', 12, '53.00', NULL, '5.50', 1, '9455', 9457, NULL, 'TS20-0-95844', 'TS20-0-95844', 'TS20-0-95844', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(64, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:26.629', 12, '53.00', NULL, '5.50', 1, '9456', 9458, NULL, 'TS20-0-95845', 'TS20-0-95845', 'TS20-0-95845', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(65, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:26.658', 12, '53.00', NULL, '5.40', 1, '9457', 9459, NULL, 'TS20-0-95846', 'TS20-0-95846', 'TS20-0-95846', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(66, 22, 'TMGB18-1-60716/1/1', 2, '2022-10-28 12:36:26.696', 12, '53.00', NULL, '5.30', 1, '9458', 9460, NULL, 'TS20-0-95847', 'TS20-0-95847', 'TS20-0-95847', NULL, '[[ARG(5) X FE-12]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[KCB16-0-3308] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(67, 22, 'TMGB18-1-60716/1/1', 2, '2022-10-28 12:36:26.732', 12, '53.00', NULL, '5.30', 1, '9459', 9461, NULL, 'TS20-0-95848', 'TS20-0-95848', 'TS20-0-95848', NULL, '[[ARG(5) X FE-12]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[KCB16-0-3308] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(68, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:26.769', 12, '53.00', NULL, '5.30', 1, '9460', 9462, NULL, 'TS20-0-95849', 'TS20-0-95849', 'TS20-0-95849', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(69, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:26.799', 12, '53.00', NULL, '5.30', 1, '9461', 9463, NULL, 'TS20-0-95850', 'TS20-0-95850', 'TS20-0-95850', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(70, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:26.826', 12, '53.00', NULL, '5.40', 1, '9462', 9464, NULL, 'TS20-0-95851', 'TS20-0-95851', 'TS20-0-95851', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(71, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:26.861', 12, '53.00', NULL, '5.40', 1, '9463', 9465, NULL, 'TS20-0-95852', 'TS20-0-95852', 'TS20-0-95852', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(72, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:26.895', 12, '53.00', NULL, '5.30', 1, '9465', 9467, NULL, 'TS20-0-95854', 'TS20-0-95854', 'TS20-0-95854', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(73, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:26.925', 12, '53.00', NULL, '5.40', 1, '9466', 9468, NULL, 'TS20-0-95855', 'TS20-0-95855', 'TS20-0-95855', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(74, 22, 'TMGB18-1-60730/1/1', 2, '2022-10-28 12:36:26.952', 12, '53.00', NULL, '5.30', 1, '9467', 9469, NULL, 'TS20-0-95856', 'TS20-0-95856', 'TS20-0-95856', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(75, 22, 'TMGB18-1-60730/1/1', 2, '2022-10-28 12:36:26.988', 12, '53.00', NULL, '5.30', 1, '9470', 9472, NULL, 'TS20-0-95859', 'TS20-0-95859', 'TS20-0-95859', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(76, 22, 'TMGB18-1-60733/1/1', 2, '2022-10-28 12:36:27.029', 12, '53.00', NULL, '5.50', 1, '9472', 9474, NULL, 'TS20-0-95861', 'TS20-0-95861', 'TS20-0-95861', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(77, 22, 'TMGB18-1-60754/3/2', 2, '2022-10-28 12:36:27.058', 12, '53.00', NULL, '5.40', 1, '9473', 9475, NULL, 'TS20-0-95862', 'TS20-0-95862', 'TS20-0-95862', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(78, 22, 'TMGB18-1-60754/3/1', 2, '2022-10-28 12:36:27.408', 12, '53.00', NULL, '5.50', 1, '9474', 9476, NULL, 'TS20-0-95863', 'TS20-0-95863', 'TS20-0-95863', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(79, 22, 'TB18-000162/1', 2, '2022-10-28 12:36:27.438', 12, '53.00', NULL, '5.50', 1, '9476', 9478, NULL, 'TS20-0-95865', 'TS20-0-95865', 'TS20-0-95865', NULL, 'NA 5909 RG X PI 227557', NULL, NULL, NULL, NULL, 'NA 5909 RG X PI 227557', 'LI', NULL, '2022-10-27 10:00:00.000'),
(80, 22, 'TB18-000133/2', 2, '2022-10-28 12:36:27.469', 12, '53.00', NULL, '5.50', 1, '9477', 9479, NULL, 'TS20-0-95866', 'TS20-0-95866', 'TS20-0-95866', NULL, 'RAIO IPRO  X (K34 ARG4 X FE12)', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K34 ARG4 X FE12)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(81, 22, 'TB18-000130/3', 2, '2022-10-28 12:36:27.495', 12, '53.00', NULL, '5.50', 1, '9478', 9480, NULL, 'TS20-0-95867', 'TS20-0-95867', 'TS20-0-95867', NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K34 ARG4 X FE12)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(82, 22, 'TMGB17-0-090036', 2, '2022-10-28 12:36:27.520', 12, '53.00', NULL, '5.50', 1, '9479', 9481, NULL, 'TS20-0-95868', 'TS20-0-95868', 'TS20-0-95868', NULL, 'RAIO IPRO X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'RAIO IPRO X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(83, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:27.551', 12, '53.00', NULL, '5.30', 1, '9480', 9482, NULL, 'TS20-0-95869', 'TS20-0-95869', 'TS20-0-95869', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(84, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:27.630', 12, '53.00', NULL, '5.30', 1, '9481', 9483, NULL, 'TS20-0-95870', 'TS20-0-95870', 'TS20-0-95870', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(85, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:27.663', 12, '53.00', NULL, '5.40', 1, '9482', 9484, NULL, 'TS20-0-95871', 'TS20-0-95871', 'TS20-0-95871', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(86, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:27.696', 12, '53.00', NULL, '5.40', 1, '9483', 9485, NULL, 'TS20-0-95872', 'TS20-0-95872', 'TS20-0-95872', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(87, 22, 'TMGB18-0-02090008', 2, '2022-10-28 12:36:27.725', 12, '53.00', NULL, '5.30', 1, '9484', 9486, NULL, 'TS20-0-95873', 'TS20-0-95873', 'TS20-0-95873', NULL, '[P95R51RR(4) X VMAX]', NULL, NULL, NULL, NULL, '[P95R51RR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(88, 22, 'TMGB18-0-02090008', 2, '2022-10-28 12:36:27.748', 12, '53.00', NULL, '5.50', 1, '9485', 9487, NULL, 'TS20-0-95874', 'TS20-0-95874', 'TS20-0-95874', NULL, '[P95R51RR(4) X VMAX]', NULL, NULL, NULL, NULL, '[P95R51RR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(89, 22, 'TMGB19-2-90307', 2, '2022-10-28 12:36:27.791', 12, '53.00', NULL, '5.30', 1, '9486', 9488, NULL, 'TS20-0-95875', 'TS20-0-95875', 'TS20-0-95875', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(90, 22, 'TMGB19-2-90307', 2, '2022-10-28 12:36:27.836', 12, '53.00', NULL, '5.30', 1, '9487', 9489, NULL, 'TS20-0-95876', 'TS20-0-95876', 'TS20-0-95876', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(91, 22, 'TMGB19-2-90307', 2, '2022-10-28 12:36:27.862', 12, '53.00', NULL, '5.30', 1, '9488', 9490, NULL, 'TS20-0-95877', 'TS20-0-95877', 'TS20-0-95877', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(92, 22, 'TMGB19-2-90307', 2, '2022-10-28 12:36:27.890', 12, '53.00', NULL, '5.30', 1, '9489', 9491, NULL, 'TS20-0-95878', 'TS20-0-95878', 'TS20-0-95878', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(93, 22, 'TMGB19-2-90307', 2, '2022-10-28 12:36:27.923', 12, '53.00', NULL, '5.40', 1, '9490', 9492, NULL, 'TS20-0-95879', 'TS20-0-95879', 'TS20-0-95879', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(94, 22, 'TMGB19-2-90307', 2, '2022-10-28 12:36:27.957', 12, '53.00', NULL, '5.30', 1, '9491', 9493, NULL, 'TS20-0-95880', 'TS20-0-95880', 'TS20-0-95880', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(95, 22, 'VAZIO', 2, '2022-10-28 12:36:27.985', 12, '53.00', NULL, '5.50', 1, '9492', 9494, NULL, 'TS20-0-95881', 'TS20-0-95881', 'TS20-0-95881', NULL, 'A4910 RG2 X (AD2X FE9) , YYY', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(96, 22, 'VAZIO', 2, '2022-10-28 12:36:28.016', 12, '53.00', NULL, '5.00', 1, '9493', 9495, NULL, 'TS20-0-95882', 'TS20-0-95882', 'TS20-0-95882', NULL, 'KCB09-14.344 X (NS733 RR ROXA) , YYY, RCS3, R NC 1,3', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(97, 22, 'VAZIO', 2, '2022-10-28 12:36:28.042', 12, '53.00', NULL, '5.50', 1, '9494', 9496, NULL, 'TS20-0-95883', 'TS20-0-95883', 'TS20-0-95883', NULL, 'TMG08-25729 X PI595099 , YYY , RXP RXP', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(98, 22, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-28 12:36:28.067', 12, '56.00', NULL, '5.60', 1, '9496', 9498, NULL, 'TS20-0-95885', 'TS20-0-95885', 'TS20-0-95885', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(99, 22, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-28 12:36:28.093', 12, '56.00', NULL, '5.80', 1, '9497', 9499, NULL, 'TS20-0-95886', 'TS20-0-95886', 'TS20-0-95886', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(100, 22, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-28 12:36:28.120', 12, '56.00', NULL, '5.80', 1, '9498', 9500, NULL, 'TS20-0-95887', 'TS20-0-95887', 'TS20-0-95887', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(101, 22, 'TMGB17-1-12330076/180364/1/01', 2, '2022-10-28 12:36:28.145', 12, '56.00', NULL, '5.80', 1, '9499', 9501, NULL, 'TS20-0-95888', 'TS20-0-95888', 'TS20-0-95888', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(102, 22, 'TMGB17-1-12330076/180383/1/01', 2, '2022-10-28 12:36:28.173', 12, '56.00', NULL, '5.80', 1, '9500', 9502, NULL, 'TS20-0-95889', 'TS20-0-95889', 'TS20-0-95889', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(103, 22, 'TMGB17-1-12330076/180310/4/04', 2, '2022-10-28 12:36:28.199', 12, '56.00', NULL, '5.70', 1, '9502', 9504, NULL, 'TS20-0-95891', 'TS20-0-95891', 'TS20-0-95891', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(104, 22, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-28 12:36:28.224', 12, '56.00', NULL, '5.80', 1, '9503', 9505, NULL, 'TS20-0-95892', 'TS20-0-95892', 'TS20-0-95892', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(105, 22, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-28 12:36:28.248', 12, '56.00', NULL, '5.80', 1, '9504', 9506, NULL, 'TS20-0-95893', 'TS20-0-95893', 'TS20-0-95893', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(106, 22, 'TMGB17-1-12330076/180310/2/02', 2, '2022-10-28 12:36:28.274', 12, '56.00', NULL, '5.80', 1, '9505', 9507, NULL, 'TS20-0-95894', 'TS20-0-95894', 'TS20-0-95894', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(107, 22, 'TMGB17-1-12330076/180379/3/03', 2, '2022-10-28 12:36:28.299', 12, '56.00', NULL, '5.70', 1, '9506', 9508, NULL, 'TS20-0-95895', 'TS20-0-95895', 'TS20-0-95895', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(108, 22, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-28 12:36:28.329', 12, '56.00', NULL, '5.70', 1, '9507', 9509, NULL, 'TS20-0-95896', 'TS20-0-95896', 'TS20-0-95896', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(109, 22, 'TMGB17-1-12330076/180421/3/03', 2, '2022-10-28 12:36:28.367', 12, '56.00', NULL, '5.80', 1, '9508', 9510, NULL, 'TS20-0-95897', 'TS20-0-95897', 'TS20-0-95897', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(110, 22, 'TMGB17-1-12330076/180383/2/02', 2, '2022-10-28 12:36:28.393', 12, '56.00', NULL, '5.80', 1, '9511', 9513, NULL, 'TS20-0-95900', 'TS20-0-95900', 'TS20-0-95900', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(111, 22, 'TMGB17-1-12330076/180353/1/01', 2, '2022-10-28 12:36:28.418', 12, '56.00', NULL, '5.80', 1, '9512', 9514, NULL, 'TS20-0-95901', 'TS20-0-95901', 'TS20-0-95901', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(112, 22, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-28 12:36:28.443', 12, '56.00', NULL, '5.80', 1, '9513', 9515, NULL, 'TS20-0-95902', 'TS20-0-95902', 'TS20-0-95902', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(113, 22, 'TMGB17-1-12330076/180259/1/01', 2, '2022-10-28 12:36:28.474', 12, '56.00', NULL, '5.80', 1, '9516', 9518, NULL, 'TS20-0-95905', 'TS20-0-95905', 'TS20-0-95905', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(114, 22, 'TMGB17-1-12330076/180431/1/01', 2, '2022-10-28 12:36:28.504', 12, '56.00', NULL, '5.60', 1, '9517', 9519, NULL, 'TS20-0-95906', 'TS20-0-95906', 'TS20-0-95906', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(115, 22, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-28 12:36:28.532', 12, '56.00', NULL, '5.80', 1, '9519', 9521, NULL, 'TS20-0-95908', 'TS20-0-95908', 'TS20-0-95908', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(116, 22, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-28 12:36:28.558', 12, '56.00', NULL, '5.80', 1, '9520', 9522, NULL, 'TS20-0-95909', 'TS20-0-95909', 'TS20-0-95909', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(117, 22, 'TMGB17-1-12330076/180294/3/03', 2, '2022-10-28 12:36:28.585', 12, '56.00', NULL, '5.80', 1, '9521', 9523, NULL, 'TS20-0-95910', 'TS20-0-95910', 'TS20-0-95910', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(118, 22, 'TMGB17-1-12330076/180402/1/01', 2, '2022-10-28 12:36:28.613', 12, '56.00', NULL, '5.60', 1, '9523', 9525, NULL, 'TS20-0-95912', 'TS20-0-95912', 'TS20-0-95912', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(119, 22, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-28 12:36:28.642', 12, '56.00', NULL, '5.80', 1, '9525', 9527, NULL, 'TS20-0-95914', 'TS20-0-95914', 'TS20-0-95914', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(120, 22, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-28 12:36:28.667', 12, '56.00', NULL, '5.70', 1, '9526', 9528, NULL, 'TS20-0-95915', 'TS20-0-95915', 'TS20-0-95915', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(121, 22, 'TMGB17-1-12330076/180364/1/01', 2, '2022-10-28 12:36:28.696', 12, '56.00', NULL, '5.80', 1, '9528', 9530, NULL, 'TS20-0-95917', 'TS20-0-95917', 'TS20-0-95917', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(122, 22, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-28 12:36:28.721', 12, '56.00', NULL, '5.70', 1, '9529', 9531, NULL, 'TS20-0-95918', 'TS20-0-95918', 'TS20-0-95918', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(123, 22, 'TMGB17-1-12330076/180359/1/01', 2, '2022-10-28 12:36:28.750', 12, '56.00', NULL, '5.70', 1, '9530', 9532, NULL, 'TS20-0-95919', 'TS20-0-95919', 'TS20-0-95919', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(124, 22, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-28 12:36:28.781', 12, '56.00', NULL, '5.80', 1, '9531', 9533, NULL, 'TS20-0-95920', 'TS20-0-95920', 'TS20-0-95920', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(125, 22, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-28 12:36:28.811', 12, '56.00', NULL, '5.80', 1, '9532', 9534, NULL, 'TS20-0-95921', 'TS20-0-95921', 'TS20-0-95921', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(126, 22, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-28 12:36:28.841', 12, '56.00', NULL, '5.80', 1, '9533', 9535, NULL, 'TS20-0-95922', 'TS20-0-95922', 'TS20-0-95922', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(127, 22, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-28 12:36:28.865', 12, '56.00', NULL, '5.70', 1, '9534', 9536, NULL, 'TS20-0-95923', 'TS20-0-95923', 'TS20-0-95923', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(128, 22, 'TMGB17-1-12330076/180263/2/02', 2, '2022-10-28 12:36:28.889', 12, '56.00', NULL, '5.80', 1, '9535', 9537, NULL, 'TS20-0-95924', 'TS20-0-95924', 'TS20-0-95924', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(129, 22, 'TMGB17-1-12330076/180364/2/02', 2, '2022-10-28 12:36:28.918', 12, '56.00', NULL, '5.80', 1, '9536', 9538, NULL, 'TS20-0-95925', 'TS20-0-95925', 'TS20-0-95925', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(130, 22, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-28 12:36:28.947', 12, '56.00', NULL, '5.80', 1, '9537', 9539, NULL, 'TS20-0-95926', 'TS20-0-95926', 'TS20-0-95926', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(131, 22, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-28 12:36:28.972', 12, '56.00', NULL, '5.60', 1, '9538', 9540, NULL, 'TS20-0-95927', 'TS20-0-95927', 'TS20-0-95927', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(132, 22, 'TMGB17-1-12330076/180336/1/01', 2, '2022-10-28 12:36:29.017', 12, '56.00', NULL, '5.80', 1, '9539', 9541, NULL, 'TS20-0-95928', 'TS20-0-95928', 'TS20-0-95928', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(133, 22, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-28 12:36:29.049', 12, '56.00', NULL, '5.70', 1, '9540', 9542, NULL, 'TS20-0-95929', 'TS20-0-95929', 'TS20-0-95929', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(134, 22, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-28 12:36:29.075', 12, '56.00', NULL, '5.80', 1, '9544', 9546, NULL, 'TS20-0-95933', 'TS20-0-95933', 'TS20-0-95933', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(135, 22, 'TMGB17-1-12330076/180362/2/02', 2, '2022-10-28 12:36:29.103', 12, '56.00', NULL, '5.80', 1, '9545', 9547, NULL, 'TS20-0-95934', 'TS20-0-95934', 'TS20-0-95934', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(136, 22, 'TMGB17-1-12330076/180362/2/02', 2, '2022-10-28 12:36:29.134', 12, '56.00', NULL, '5.70', 1, '9546', 9548, NULL, 'TS20-0-95935', 'TS20-0-95935', 'TS20-0-95935', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(137, 22, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-28 12:36:29.168', 12, '56.00', NULL, '5.80', 1, '9547', 9549, NULL, 'TS20-0-95936', 'TS20-0-95936', 'TS20-0-95936', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(138, 22, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-28 12:36:29.199', 12, '56.00', NULL, '5.80', 1, '9548', 9550, NULL, 'TS20-0-95937', 'TS20-0-95937', 'TS20-0-95937', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(139, 22, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-28 12:36:29.334', 12, '56.00', NULL, '5.80', 1, '9549', 9551, NULL, 'TS20-0-95938', 'TS20-0-95938', 'TS20-0-95938', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(140, 22, 'TMGB17-1-12330076/180383/4/04', 2, '2022-10-28 12:36:29.372', 12, '56.00', NULL, '5.80', 1, '9550', 9552, NULL, 'TS20-0-95939', 'TS20-0-95939', 'TS20-0-95939', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(141, 22, 'TMGB17-1-12330076/180359/1/01', 2, '2022-10-28 12:36:29.401', 12, '56.00', NULL, '5.60', 1, '9551', 9553, NULL, 'TS20-0-95940', 'TS20-0-95940', 'TS20-0-95940', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(142, 22, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-28 12:36:29.429', 12, '56.00', NULL, '5.80', 1, '9553', 9555, NULL, 'TS20-0-95942', 'TS20-0-95942', 'TS20-0-95942', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(143, 22, 'TMGB17-1-12330076/180294/3/03', 2, '2022-10-28 12:36:29.457', 12, '56.00', NULL, '5.80', 1, '9554', 9556, NULL, 'TS20-0-95943', 'TS20-0-95943', 'TS20-0-95943', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(144, 22, 'TMGB17-1-12330076/180383/1/01', 2, '2022-10-28 12:36:29.485', 12, '56.00', NULL, '5.80', 1, '9555', 9557, NULL, 'TS20-0-95944', 'TS20-0-95944', 'TS20-0-95944', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(145, 22, 'TMGB17-1-12330076/180389/2/02', 2, '2022-10-28 12:36:29.513', 12, '56.00', NULL, '5.70', 1, '9556', 9558, NULL, 'TS20-0-95945', 'TS20-0-95945', 'TS20-0-95945', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(146, 22, 'TMGB17-1-12330076/180364/1/01', 2, '2022-10-28 12:36:29.541', 12, '56.00', NULL, '5.80', 1, '9557', 9559, NULL, 'TS20-0-95946', 'TS20-0-95946', 'TS20-0-95946', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(147, 22, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-28 12:36:29.583', 12, '56.00', NULL, '5.80', 1, '9558', 9560, NULL, 'TS20-0-95947', 'TS20-0-95947', 'TS20-0-95947', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(148, 22, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-28 12:36:29.618', 12, '56.00', NULL, '5.80', 1, '9559', 9561, NULL, 'TS20-0-95948', 'TS20-0-95948', 'TS20-0-95948', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(149, 22, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-28 12:36:29.648', 12, '56.00', NULL, '5.60', 1, '9560', 9562, NULL, 'TS20-0-95949', 'TS20-0-95949', 'TS20-0-95949', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(150, 22, 'TMGB17-1-12330076/180348/1/01', 2, '2022-10-28 12:36:29.678', 12, '56.00', NULL, '5.60', 1, '9561', 9563, NULL, 'TS20-0-95950', 'TS20-0-95950', 'TS20-0-95950', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(151, 22, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-28 12:36:29.717', 12, '56.00', NULL, '5.70', 1, '9562', 9564, NULL, 'TS20-0-95951', 'TS20-0-95951', 'TS20-0-95951', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(152, 22, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-28 12:36:29.753', 12, '56.00', NULL, '5.80', 1, '9563', 9565, NULL, 'TS20-0-95952', 'TS20-0-95952', 'TS20-0-95952', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(153, 22, 'TMGB17-1-12330076/180402/1/01', 2, '2022-10-28 12:36:29.792', 12, '56.00', NULL, '5.70', 1, '9564', 9566, NULL, 'TS20-0-95953', 'TS20-0-95953', 'TS20-0-95953', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(154, 22, 'TMGB17-1-12330076/180282/1/01', 2, '2022-10-28 12:36:29.832', 12, '56.00', NULL, '5.80', 1, '9565', 9567, NULL, 'TS20-0-95954', 'TS20-0-95954', 'TS20-0-95954', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(155, 22, 'TMGB17-1-12330076/180383/1/01', 2, '2022-10-28 12:36:29.868', 12, '56.00', NULL, '5.80', 1, '9567', 9569, NULL, 'TS20-0-95956', 'TS20-0-95956', 'TS20-0-95956', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(156, 22, 'TMGB17-1-12330076/180263/2/02', 2, '2022-10-28 12:36:29.904', 12, '56.00', NULL, '5.80', 1, '9568', 9570, NULL, 'TS20-0-95957', 'TS20-0-95957', 'TS20-0-95957', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(157, 22, 'TMGB17-1-12330076/180282/1/01', 2, '2022-10-28 12:36:29.937', 12, '56.00', NULL, '5.80', 1, '9569', 9571, NULL, 'TS20-0-95958', 'TS20-0-95958', 'TS20-0-95958', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(158, 22, 'TMGB17-1-12330076/180324/1/01', 2, '2022-10-28 12:36:29.969', 12, '56.00', NULL, '5.80', 1, '9570', 9572, NULL, 'TS20-0-95959', 'TS20-0-95959', 'TS20-0-95959', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(159, 22, 'TMGB17-1-12330076/180348/2/02', 2, '2022-10-28 12:36:30.003', 12, '56.00', NULL, '5.70', 1, '9571', 9573, NULL, 'TS20-0-95960', 'TS20-0-95960', 'TS20-0-95960', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(160, 22, 'TMGB17-1-12330076/180359/1/01', 2, '2022-10-28 12:36:30.033', 12, '56.00', NULL, '5.70', 1, '9572', 9574, NULL, 'TS20-0-95961', 'TS20-0-95961', 'TS20-0-95961', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(161, 22, 'TMGB17-1-12330076/180379/3/03', 2, '2022-10-28 12:36:30.062', 12, '56.00', NULL, '5.80', 1, '9573', 9575, NULL, 'TS20-0-95962', 'TS20-0-95962', 'TS20-0-95962', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(162, 22, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-28 12:36:30.127', 12, '56.00', NULL, '5.80', 1, '9575', 9577, NULL, 'TS20-0-95964', 'TS20-0-95964', 'TS20-0-95964', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(163, 22, 'TMGB17-1-12330076/180379/3/03', 2, '2022-10-28 12:36:30.172', 12, '56.00', NULL, '5.80', 1, '9578', 9580, NULL, 'TS20-0-95967', 'TS20-0-95967', 'TS20-0-95967', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(164, 22, 'TMGB17-1-12330076/180353/1/01', 2, '2022-10-28 12:36:30.201', 12, '56.00', NULL, '5.80', 1, '9579', 9581, NULL, 'TS20-0-95968', 'TS20-0-95968', 'TS20-0-95968', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000');
INSERT INTO `genotipo` (`id`, `id_culture`, `cruza`, `created_by`, `created_at`, `id_tecnologia`, `bgm`, `elit_name`, `gmr`, `numberLotes`, `id_dados`, `id_s1`, `name_alter`, `name_experiment`, `name_genotipo`, `name_main`, `name_public`, `parentesco_completo`, `progenitor_f_direto`, `progenitor_f_origem`, `progenitor_m_direto`, `progenitor_m_origem`, `progenitores_origem`, `type`, `safraId`, `dt_export`) VALUES
(165, 22, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-28 12:36:30.229', 12, '56.00', NULL, '5.80', 1, '9581', 9583, NULL, 'TS20-0-95970', 'TS20-0-95970', 'TS20-0-95970', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(166, 22, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-28 12:36:30.255', 12, '56.00', NULL, '5.80', 1, '9582', 9584, NULL, 'TS20-0-95971', 'TS20-0-95971', 'TS20-0-95971', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(167, 22, 'TMGB17-2-22330085/1/180062/2/02', 2, '2022-10-28 12:36:30.289', 12, '56.00', NULL, '5.80', 1, '9584', 9586, NULL, 'TS20-0-95973', 'TS20-0-95973', 'TS20-0-95973', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(168, 22, 'TMGB17-2-22330085/1/180062/3/03', 2, '2022-10-28 12:36:30.322', 12, '56.00', NULL, '5.80', 1, '9585', 9587, NULL, 'TS20-0-95974', 'TS20-0-95974', 'TS20-0-95974', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(169, 22, 'TMGB18-2-60645/1/1', 2, '2022-10-28 12:36:30.349', 12, '56.00', NULL, '5.80', 1, '9591', 9593, NULL, 'TS20-0-95980', 'TS20-0-95980', 'TS20-0-95980', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(170, 22, 'TMGB18-2-60645/1/1', 2, '2022-10-28 12:36:30.375', 12, '56.00', NULL, '5.80', 1, '9592', 9594, NULL, 'TS20-0-95981', 'TS20-0-95981', 'TS20-0-95981', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(171, 22, 'TMGB18-2-60645/1/2', 2, '2022-10-28 12:36:30.403', 12, '56.00', NULL, '5.80', 1, '9593', 9595, NULL, 'TS20-0-95982', 'TS20-0-95982', 'TS20-0-95982', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(172, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:30.429', 12, '56.00', NULL, '5.60', 1, '9594', 9596, NULL, 'TS20-0-95983', 'TS20-0-95983', 'TS20-0-95983', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(173, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:30.455', 12, '56.00', NULL, '5.80', 1, '9595', 9597, NULL, 'TS20-0-95984', 'TS20-0-95984', 'TS20-0-95984', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(174, 22, 'TMGB18-1-60714/1/1', 2, '2022-10-28 12:36:30.483', 12, '56.00', NULL, '5.80', 1, '9596', 9598, NULL, 'TS20-0-95985', 'TS20-0-95985', 'TS20-0-95985', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(175, 22, 'TMGB18-0-60522/5/1', 2, '2022-10-28 12:36:30.510', 12, '56.00', NULL, '5.60', 1, '9597', 9599, NULL, 'TS20-0-95986', 'TS20-0-95986', 'TS20-0-95986', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [[ARG(5) X FE-12]]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(176, 22, 'TMGB18-1-60725/1/1', 2, '2022-10-28 12:36:30.537', 12, '56.00', NULL, '5.60', 1, '9598', 9600, NULL, 'TS20-0-95987', 'TS20-0-95987', 'TS20-0-95987', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(177, 22, 'TMGB18-1-60730', 2, '2022-10-28 12:36:30.562', 12, '56.00', NULL, '5.60', 1, '9599', 9601, NULL, 'TS20-0-95988', 'TS20-0-95988', 'TS20-0-95988', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(178, 22, 'TMGB18-1-60730/1/1', 2, '2022-10-28 12:36:30.589', 12, '56.00', NULL, '5.60', 1, '9601', 9603, NULL, 'TS20-0-95990', 'TS20-0-95990', 'TS20-0-95990', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(179, 22, 'TMGB18-1-60730', 2, '2022-10-28 12:36:30.615', 12, '56.00', NULL, '5.80', 1, '9603', 9605, NULL, 'TS20-0-95992', 'TS20-0-95992', 'TS20-0-95992', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(180, 22, 'TB18-000162/1', 2, '2022-10-28 12:36:30.644', 12, '56.00', NULL, '5.80', 1, '9608', 9610, NULL, 'TS20-0-95997', 'TS20-0-95997', 'TS20-0-95997', NULL, 'NA 5909 RG X PI 227557', NULL, NULL, NULL, NULL, 'NA 5909 RG X PI 227557', 'LI', NULL, '2022-10-27 10:00:00.000'),
(181, 22, 'TB18-000162/1', 2, '2022-10-28 12:36:30.671', 12, '56.00', NULL, '5.80', 1, '9610', 9612, NULL, 'TS20-0-95999', 'TS20-0-95999', 'TS20-0-95999', NULL, 'NA 5909 RG X PI 227557', NULL, NULL, NULL, NULL, 'NA 5909 RG X PI 227557', 'LI', NULL, '2022-10-27 10:00:00.000'),
(182, 22, 'TB18-000130/2', 2, '2022-10-28 12:36:30.697', 12, '56.00', NULL, '5.70', 1, '9611', 9613, NULL, 'TS20-0-96000', 'TS20-0-96000', 'TS20-0-96000', NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(183, 22, 'VAZIO', 2, '2022-10-28 12:36:30.724', 12, '56.00', NULL, '5.60', 1, '9612', 9614, NULL, 'TS20-0-96001', 'TS20-0-96001', 'TS20-0-96001', NULL, '(KCB10-14.6843 X FE8) X VMAX , YYY', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(184, 22, 'VAZIO', 2, '2022-10-28 12:36:30.752', 12, '56.00', NULL, '5.70', 1, '9613', 9615, NULL, 'TS20-0-96002', 'TS20-0-96002', 'TS20-0-96002', NULL, '(PI5994754 X BMX APOLO RR ) X NA5909 RG , YYY RXP', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(185, 22, 'VAZIO', 2, '2022-10-28 12:36:30.780', 12, '56.00', NULL, '5.60', 1, '9614', 9616, NULL, 'TS20-0-96003', 'TS20-0-96003', 'TS20-0-96003', NULL, '(PI5994754 X BMX APOLO RR) X NA5909 RG , YYY RXP', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(186, 22, 'TMGB17-0-12330099/1', 2, '2022-10-28 12:36:30.807', 12, '56.00', NULL, '5.50', 1, '9616', 9618, NULL, 'TS20-0-96005', 'TS20-0-96005', 'TS20-0-96005', NULL, '[(TMG7262RR²) X (PI647961)]', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(187, 22, 'TMGB17-0-12330099', 2, '2022-10-28 12:36:30.834', 12, '56.00', NULL, '5.50', 1, '9617', 9619, NULL, 'TS20-0-96006', 'TS20-0-96006', 'TS20-0-96006', NULL, '[(TMG7262RR²) X (PI647961)]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(188, 22, 'TMGB17-0-12330099', 2, '2022-10-28 12:36:30.860', 12, '56.00', NULL, '5.50', 1, '9619', 9621, NULL, 'TS20-0-96008', 'TS20-0-96008', 'TS20-0-96008', NULL, '[(TMG7262RR²) X (PI647961)]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(189, 22, 'TMGB18-2-60623', 2, '2022-10-28 12:36:30.886', 12, '0.00', NULL, '5.70', 1, '9620', 9622, NULL, 'TS20-0-96009', 'TS20-0-96009', 'TS20-0-96009', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(190, 22, 'TMGB18-2-60623', 2, '2022-10-28 12:36:30.913', 12, '56.00', NULL, '5.80', 1, '9621', 9623, NULL, 'TS20-0-96010', 'TS20-0-96010', 'TS20-0-96010', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(191, 22, 'TMGB18-2-60623', 2, '2022-10-28 12:36:30.940', 12, '56.00', NULL, '5.70', 1, '9622', 9624, NULL, 'TS20-0-96011', 'TS20-0-96011', 'TS20-0-96011', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(192, 22, 'TMGB18-2-60623', 2, '2022-10-28 12:36:30.969', 12, '56.00', NULL, '5.80', 1, '9623', 9625, NULL, 'TS20-0-96012', 'TS20-0-96012', 'TS20-0-96012', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(193, 22, 'TMGB18-2-60625', 2, '2022-10-28 12:36:30.998', 12, '56.00', NULL, '5.80', 1, '9624', 9626, NULL, 'TS20-0-96013', 'TS20-0-96013', 'TS20-0-96013', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [TMG4182]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(194, 22, 'TMGB18-2-60625', 2, '2022-10-28 12:36:31.025', 12, '56.00', NULL, '5.60', 1, '9625', 9627, NULL, 'TS20-0-96014', 'TS20-0-96014', 'TS20-0-96014', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [TMG4182]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(195, 22, 'TMGB18-2-60630', 2, '2022-10-28 12:36:31.051', 12, '56.00', NULL, '5.80', 1, '9626', 9628, NULL, 'TS20-0-96015', 'TS20-0-96015', 'TS20-0-96015', NULL, '[[[NA5909RG X BTRR2-5] X [LEO-116 X [[CD-215 X GC-84.058-29-4]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(196, 22, 'TMGB18-2-60630', 2, '2022-10-28 12:36:31.080', 12, '56.00', NULL, '5.70', 1, '9627', 9629, NULL, 'TS20-0-96016', 'TS20-0-96016', 'TS20-0-96016', NULL, '[[[NA5909RG X BTRR2-5] X [LEO-116 X [[CD-215 X GC-84.058-29-4]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(197, 22, 'TMGB18-2-60630', 2, '2022-10-28 12:36:31.106', 12, '56.00', NULL, '5.60', 1, '9628', 9630, NULL, 'TS20-0-96017', 'TS20-0-96017', 'TS20-0-96017', NULL, '[[[NA5909RG X BTRR2-5] X [LEO-116 X [[CD-215 X GC-84.058-29-4]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(198, 22, 'TMGB18-2-60644', 2, '2022-10-28 12:36:31.133', 12, '56.00', NULL, '5.70', 1, '9629', 9631, NULL, 'TS20-0-96018', 'TS20-0-96018', 'TS20-0-96018', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(199, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.160', 12, '56.00', NULL, '5.60', 1, '9631', 9633, NULL, 'TS20-0-96020', 'TS20-0-96020', 'TS20-0-96020', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(200, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.183', 12, '56.00', NULL, '5.50', 1, '9632', 9634, NULL, 'TS20-0-96021', 'TS20-0-96021', 'TS20-0-96021', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(201, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.206', 12, '56.00', NULL, '5.50', 1, '9633', 9635, NULL, 'TS20-0-96022', 'TS20-0-96022', 'TS20-0-96022', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(202, 22, 'TMGB18-2-60647', 2, '2022-10-28 12:36:31.230', 12, '56.00', NULL, '5.70', 1, '9634', 9636, NULL, 'TS20-0-96023', 'TS20-0-96023', 'TS20-0-96023', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(203, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.259', 12, '56.00', NULL, '5.60', 1, '9635', 9637, NULL, 'TS20-0-96024', 'TS20-0-96024', 'TS20-0-96024', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(204, 22, 'TMGB18-2-60647', 2, '2022-10-28 12:36:31.283', 12, '56.00', NULL, '5.70', 1, '9637', 9639, NULL, 'TS20-0-96026', 'TS20-0-96026', 'TS20-0-96026', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(205, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.311', 12, '56.00', NULL, '5.60', 1, '9638', 9640, NULL, 'TS20-0-96027', 'TS20-0-96027', 'TS20-0-96027', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(206, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.334', 12, '56.00', NULL, '5.70', 1, '9639', 9641, NULL, 'TS20-0-96028', 'TS20-0-96028', 'TS20-0-96028', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(207, 22, 'TMGB18-2-60645', 2, '2022-10-28 12:36:31.359', 12, '56.00', NULL, '5.50', 1, '9640', 9642, NULL, 'TS20-0-96029', 'TS20-0-96029', 'TS20-0-96029', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(208, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.384', 12, '56.00', NULL, '5.80', 1, '9641', 9643, NULL, 'TS20-0-96030', 'TS20-0-96030', 'TS20-0-96030', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(209, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.408', 12, '56.00', NULL, '5.80', 1, '9642', 9644, NULL, 'TS20-0-96031', 'TS20-0-96031', 'TS20-0-96031', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(210, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.430', 12, '56.00', NULL, '5.80', 1, '9643', 9645, NULL, 'TS20-0-96032', 'TS20-0-96032', 'TS20-0-96032', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(211, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.471', 12, '56.00', NULL, '5.80', 1, '9644', 9646, NULL, 'TS20-0-96033', 'TS20-0-96033', 'TS20-0-96033', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(212, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.499', 12, '56.00', NULL, '5.70', 1, '9645', 9647, NULL, 'TS20-0-96034', 'TS20-0-96034', 'TS20-0-96034', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(213, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.525', 12, '56.00', NULL, '5.80', 1, '9646', 9648, NULL, 'TS20-0-96035', 'TS20-0-96035', 'TS20-0-96035', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(214, 22, 'TMGB18-0-60518', 2, '2022-10-28 12:36:31.554', 12, '56.00', NULL, '5.80', 1, '9647', 9649, NULL, 'TS20-0-96036', 'TS20-0-96036', 'TS20-0-96036', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(215, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.579', 12, '56.00', NULL, '5.80', 1, '9648', 9650, NULL, 'TS20-0-96037', 'TS20-0-96037', 'TS20-0-96037', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(216, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.604', 12, '56.00', NULL, '5.80', 1, '9649', 9651, NULL, 'TS20-0-96038', 'TS20-0-96038', 'TS20-0-96038', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(217, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.629', 12, '56.00', NULL, '5.80', 1, '9650', 9652, NULL, 'TS20-0-96039', 'TS20-0-96039', 'TS20-0-96039', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(218, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.653', 12, '56.00', NULL, '5.80', 1, '9651', 9653, NULL, 'TS20-0-96040', 'TS20-0-96040', 'TS20-0-96040', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(219, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.679', 12, '56.00', NULL, '5.80', 1, '9652', 9654, NULL, 'TS20-0-96041', 'TS20-0-96041', 'TS20-0-96041', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(220, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.702', 12, '56.00', NULL, '5.80', 1, '9653', 9655, NULL, 'TS20-0-96042', 'TS20-0-96042', 'TS20-0-96042', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(221, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.726', 12, '56.00', NULL, '5.80', 1, '9654', 9656, NULL, 'TS20-0-96043', 'TS20-0-96043', 'TS20-0-96043', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(222, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.749', 12, '56.00', NULL, '5.80', 1, '9655', 9657, NULL, 'TS20-0-96044', 'TS20-0-96044', 'TS20-0-96044', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(223, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.771', 12, '56.00', NULL, '5.80', 1, '9656', 9658, NULL, 'TS20-0-96045', 'TS20-0-96045', 'TS20-0-96045', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(224, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.795', 12, '56.00', NULL, '5.70', 1, '9658', 9660, NULL, 'TS20-0-96047', 'TS20-0-96047', 'TS20-0-96047', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(225, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.818', 12, '56.00', NULL, '5.80', 1, '9659', 9661, NULL, 'TS20-0-96048', 'TS20-0-96048', 'TS20-0-96048', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(226, 22, 'TMGB18-0-60523', 2, '2022-10-28 12:36:31.845', 12, '56.00', NULL, '5.80', 1, '9660', 9662, NULL, 'TS20-0-96049', 'TS20-0-96049', 'TS20-0-96049', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(227, 22, 'TMGB18-0-60525', 2, '2022-10-28 12:36:31.866', 12, '56.00', NULL, '5.50', 1, '9661', 9663, NULL, 'TS20-0-96050', 'TS20-0-96050', 'TS20-0-96050', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(228, 22, 'TMGB18-0-60545', 2, '2022-10-28 12:36:31.889', 12, '56.00', NULL, '5.70', 1, '9664', 9666, NULL, 'TS20-0-96053', 'TS20-0-96053', 'TS20-0-96053', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(229, 22, 'TMGB18-0-60545', 2, '2022-10-28 12:36:31.914', 12, '56.00', NULL, '5.60', 1, '9665', 9667, NULL, 'TS20-0-96054', 'TS20-0-96054', 'TS20-0-96054', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(230, 22, 'TMGB18-0-60545', 2, '2022-10-28 12:36:31.939', 12, '56.00', NULL, '5.70', 1, '9666', 9668, NULL, 'TS20-0-96055', 'TS20-0-96055', 'TS20-0-96055', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [CA13001209]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(231, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:31.963', 12, '56.00', NULL, '5.60', 1, '9668', 9670, NULL, 'TS20-0-96058', 'TS20-0-96058', 'TS20-0-96058', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(232, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:31.986', 12, '56.00', NULL, '5.60', 1, '9669', 9671, NULL, 'TS20-0-96059', 'TS20-0-96059', 'TS20-0-96059', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(233, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:32.008', 12, '56.00', NULL, '5.60', 1, '9670', 9672, NULL, 'TS20-0-96060', 'TS20-0-96060', 'TS20-0-96060', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(234, 22, 'TMGB18-1-60745', 2, '2022-10-28 12:36:32.031', 12, '56.00', NULL, '5.80', 1, '9671', 9673, NULL, 'TS20-0-96061', 'TS20-0-96061', 'TS20-0-96061', NULL, '[BMXATIVARR] X [[ARG(5) X FE-12]]', NULL, NULL, NULL, NULL, '[BMXATIVARR] X [KCB16-0-3308]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(235, 22, 'TMGB19-2-90306', 2, '2022-10-28 12:36:32.054', 12, '56.00', NULL, '5.60', 1, '9672', 9674, NULL, 'TS20-0-96062', 'TS20-0-96062', 'TS20-0-96062', NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(236, 22, 'TMGB19-2-90306', 2, '2022-10-28 12:36:32.077', 12, '56.00', NULL, '5.80', 1, '9673', 9675, NULL, 'TS20-0-96063', 'TS20-0-96063', 'TS20-0-96063', NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(237, 22, 'TMGB19-2-90306', 2, '2022-10-28 12:36:32.102', 12, '56.00', NULL, '5.80', 1, '9674', 9676, NULL, 'TS20-0-96064', 'TS20-0-96064', 'TS20-0-96064', NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(238, 22, 'VAZIO', 2, '2022-10-28 12:36:32.125', 12, '56.00', NULL, '5.60', 1, '9675', 9677, NULL, 'TS20-0-96065', 'TS20-0-96065', 'TS20-0-96065', NULL, 'KCB09-14.344-2 X (NS7337 RR SELEÇÃO FLOR ROXA) , YXY, RCS3, R 1,3 NC', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(239, 22, 'VAZIO', 2, '2022-10-28 12:36:32.148', 12, '56.00', NULL, '5.60', 1, '9676', 9678, NULL, 'TS20-0-96066', 'TS20-0-96066', 'TS20-0-96066', NULL, 'KCB10-14.6832 X (KCB10-14.7843 X FE9) , YYY RCS3', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(240, 22, 'TMGB16-1-100081', 2, '2022-10-28 12:36:32.170', 12, '56.00', NULL, '5.70', 1, '9678', 9680, NULL, 'TS20-0-96069', 'TS20-0-96069', 'TS20-0-96069', NULL, 'NA 5909 RG X PI 471938', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(241, 22, 'TMGB16-1-100081', 2, '2022-10-28 12:36:32.194', 12, '56.00', NULL, '5.80', 1, '9679', 9681, NULL, 'TS20-0-96070', 'TS20-0-96070', 'TS20-0-96070', NULL, 'NA 5909 RG X PI 471938', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(242, 22, 'TMGB16-1-100081', 2, '2022-10-28 12:36:32.218', 12, '56.00', NULL, '5.80', 1, '9680', 9682, NULL, 'TS20-0-96071', 'TS20-0-96071', 'TS20-0-96071', NULL, 'NA 5909 RG X PI 471938', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(243, 22, 'TMGB16-1-122030166', 2, '2022-10-28 12:36:32.242', 12, '56.00', NULL, '5.80', 1, '9681', 9683, NULL, 'TS20-0-96072', 'TS20-0-96072', 'TS20-0-96072', NULL, 'TMG7262RR X (PI227557 X TMG7262RR)', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(244, 22, 'TMGB18-0-02090006', 2, '2022-10-28 12:36:32.267', 12, '56.00', NULL, '5.60', 1, '164135', 164137, NULL, 'TS20-0-96057', 'TS20-0-96057', 'TS20-0-96057', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, '2022-10-27 10:00:00.000'),
(245, 22, 'TMGB17-0-090051', 2, '2022-10-28 12:36:32.295', 12, '56.00', NULL, '5.70', 1, '164136', 164138, NULL, 'TS20-0-96067', 'TS20-0-96067', 'TS20-0-96067', NULL, 'NA 5909 RG  X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'NA 5909 RG  X (K43 ARG4 X FE9)', 'LI', NULL, '2022-10-27 10:00:00.000'),
(246, 27, 'BMXCOMPACTAIPRO', 23, '2022-10-28 19:08:37.298', 16, '65.00', NULL, '6.50', 20, '9', 9, NULL, 'BMXCOMPACTAIPRO', 'BMXCOMPACTAIPRO', 'BMXCOMPACTAIPRO', 'gabriel', 'BMXCOMPACTAIPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'BMXCOMPACTAIPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(247, 27, 'BMXLANÇAIPRO', 23, '2022-10-28 19:08:37.988', 16, '56.00', NULL, '5.80', 29, '15', 15, NULL, 'BMXLANÇAIPRO', 'BMXLANCAIPRO', 'BMXLANÇAIPRO', 'gabriel', 'BMXLANÇAIPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'BMXLANÇAIPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(248, 27, 'BMXRAIOIPRO', 23, '2022-10-28 19:08:38.892', 16, '50.00', NULL, '5.00', 48, '19', 19, NULL, 'BMXRAIOIPRO', 'BMXRAIOIPRO', 'BMXRAIOIPRO', 'gabriel', 'BMXRAIOIPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'BMXRAIOIPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(249, 27, 'BMXZEUSIPRO', 23, '2022-10-28 19:08:40.443', 16, '56.00', NULL, '5.70', 117, '23', 23, NULL, 'BMXZEUSIPRO', 'BMXZEUSIPRO', 'BMXZEUSIPRO', 'gabriel', 'BMXZEUSIPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'BMXZEUSIPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(250, 27, 'BS2606IPRO', 23, '2022-10-28 19:08:44.413', 16, '59.00', NULL, '6.00', 41, '24', 24, NULL, 'BS2606IPRO', 'BS2606IPRO', 'BS2606IPRO', 'gabriel', 'BS2606IPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'BS2606IPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(251, 27, 'TMGB19-0-10147', 23, '2022-10-28 19:08:44.845', 16, '62.00', NULL, '6.20', 1, '130983', 130985, NULL, 'P1S210-103535', 'P1S210-103535', 'BS2606IPRO', 'gabriel', '[TS15-0-011270] x [CB11-0008-A x [VMAX x TMG1188RR]]', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', '[TS15-0-011.270] x [TS15-0-011.201]', 'PO', NULL, '2022-10-28 15:59:59.995'),
(252, 27, 'DM53I54IPRO', 23, '2022-10-28 19:08:45.775', 16, '53.00', NULL, '5.40', 27, '30', 30, NULL, 'DM53I54IPRO', 'DM53I54IPRO', 'DM53I54IPRO', 'gabriel', 'DM53I54IPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'DM53I54IPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(253, 27, 'DM66I68IPRO', 23, '2022-10-28 19:08:46.615', 16, '65.00', NULL, '6.60', 26, '33', 33, NULL, 'DM66I68IPRO', 'DM66I68RSFIPRO', 'DM66I68IPRO', 'gabriel', 'DM66I68IPRO', NULL, 'TS15-0-011.270', NULL, 'TS15-0-011.201', 'DM66I68IPRO', 'CC', NULL, '2022-10-28 15:59:59.995'),
(254, 23, 'BMXCOMPACTAIPRO', 2, '2022-10-29 15:03:59.438', 32, '65.00', NULL, '6.50', 20, '9', 9, NULL, 'BMXCOMPACTAIPRO', 'BMXCOMPACTAIPRO', 'BMXCOMPACTAIPRO', 'GABRIEL', 'BMXCOMPACTAIPRO', NULL, NULL, NULL, NULL, 'BMXCOMPACTAIPRO', 'CC', NULL, NULL),
(255, 23, 'BMXLANÇAIPRO', 2, '2022-10-29 15:04:00.627', 32, '56.00', NULL, '5.80', 29, '15', 15, NULL, 'BMXLANÇAIPRO', 'BMXLANCAIPRO', 'BMXLANÇAIPRO', NULL, 'BMXLANÇAIPRO', NULL, NULL, NULL, NULL, 'BMXLANÇAIPRO', 'CC', NULL, NULL),
(256, 23, 'BMXRAIOIPRO', 2, '2022-10-29 15:04:01.631', 32, '50.00', NULL, '5.00', 48, '19', 19, NULL, 'BMXRAIOIPRO', 'BMXRAIOIPRO', 'BMXRAIOIPRO', NULL, 'BMXRAIOIPRO', NULL, NULL, NULL, NULL, 'BMXRAIOIPRO', 'CC', NULL, NULL),
(257, 23, 'BMXZEUSIPRO', 2, '2022-10-29 15:04:03.667', 32, '56.00', NULL, '5.70', 117, '23', 23, NULL, 'BMXZEUSIPRO', 'BMXZEUSIPRO', 'BMXZEUSIPRO', NULL, 'BMXZEUSIPRO', NULL, NULL, NULL, NULL, 'BMXZEUSIPRO', 'CC', NULL, NULL),
(258, 23, 'BS2606IPRO', 2, '2022-10-29 15:04:09.404', 32, '59.00', NULL, '6.00', 41, '24', 24, NULL, 'BS2606IPRO', 'BS2606IPRO', 'BS2606IPRO', NULL, 'BS2606IPRO', NULL, NULL, NULL, NULL, 'BS2606IPRO', 'CC', NULL, NULL),
(259, 23, 'DM53I54IPRO', 2, '2022-10-29 15:04:11.153', 32, '53.00', NULL, '5.40', 27, '30', 30, NULL, 'DM53I54IPRO', 'DM53I54IPRO', 'DM53I54IPRO', NULL, 'DM53I54IPRO', NULL, NULL, NULL, NULL, 'DM53I54IPRO', 'CC', NULL, NULL),
(260, 23, 'DM66I68IPRO', 2, '2022-10-29 15:04:12.316', 32, '65.00', NULL, '6.60', 80, '33', 33, NULL, 'DM66I68IPRO', 'DM66I68RSFIPRO', 'DM66I68IPRO', NULL, 'DM66I68IPRO', NULL, NULL, NULL, NULL, 'DM66I68IPRO', 'CC', NULL, NULL),
(261, 23, 'NS5445IPRO', 2, '2022-10-29 15:04:14.893', 32, '53.00', NULL, '5.40', 14, '69', 69, NULL, 'NS5445IPRO', 'NS5445IPRO', 'NS5445IPRO', NULL, 'NS5445IPRO', NULL, NULL, NULL, NULL, 'NS5445IPRO', 'CC', NULL, NULL),
(262, 23, 'P95R51RR', 2, '2022-10-29 15:04:15.321', 21, '53.00', NULL, '5.40', 28, '84', 84, NULL, 'P95R51RR', 'P95R51RR', 'P95R51RR', NULL, 'P95R51RR', NULL, NULL, NULL, NULL, 'P95R51RR', 'CC', NULL, NULL),
(263, 23, 'TMG2757IPRO', 2, '2022-10-29 15:04:16.169', 32, '56.00', NULL, '5.70', 39, '207', 207, NULL, 'TMG2757IPRO', 'TMG2757IPRO', 'TMG2757IPRO', NULL, 'TMG2757IPRO', NULL, NULL, NULL, NULL, 'TMG2757IPRO', 'CI', NULL, NULL),
(264, 23, 'TMG7368IPRO', 2, '2022-10-29 15:04:17.392', 32, '68.00', NULL, '6.80', 77, '215', 215, NULL, 'TMG7368IPRO', 'TMG7368IPRO', 'TMG7368IPRO', NULL, 'TMG7368IPRO', NULL, NULL, NULL, NULL, 'TMG7368IPRO', 'CI', NULL, NULL),
(265, 23, 'NA5909RR', 2, '2022-10-29 15:04:19.856', 21, '59.00', NULL, '6.00', 60, '218', 218, NULL, 'NA5909RR', 'NA5909RR', 'NA5909RR', NULL, 'NA5909RR', NULL, NULL, NULL, NULL, 'NA5909RR', 'CC', NULL, NULL),
(266, 23, 'VAZIO', 2, '2022-10-29 15:04:21.775', 26, '59.00', NULL, '5.90', 4, '377', 377, NULL, 'TS17-3-310605', 'TS17-3-310605', 'TS17-3-310605', NULL, '[TMG15-1-PYT22] X [[TMG 7161 RR] X [MS(E3)]]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(267, 23, 'TS17-2-201.759', 2, '2022-10-29 15:04:21.905', 23, '56.00', NULL, '5.80', 1, '8731', 8733, NULL, 'TS19-0-121.009', 'TS19-0-121009', 'TS19-0-121.009', NULL, '[[NA5909RG X BTRR2-5] X [[[NA5909RG X BTRR2-5]] X TMG08-70.105-505]] X [[[[NA5909RG X RR2BT-V]] X [[[NA5909RG X BTRR2-5] X TMG08-70.105-505]]] X [TS17-2-201.759 X TS15-0-010.255]]', NULL, NULL, NULL, NULL, '[TS17-2-201.759] X [TMGB19-0-90.023/BC1/F1]', 'LI', NULL, NULL),
(268, 23, 'TS17-2-201.759', 2, '2022-10-29 15:04:21.941', 23, '56.00', NULL, '5.80', 1, '8735', 8737, NULL, 'TS19-0-121.014', 'TS19-0-121014', 'TS19-0-121.014', NULL, '[[NA5909RG X BTRR2-5] X [[[NA5909RG X BTRR2-5]] X TMG08-70.105-505]] X [[[[NA5909RG X RR2BT-V]] X [[[NA5909RG X BTRR2-5] X TMG08-70.105-505]]] X [TS17-2-201.759 X TS15-0-010.255]]', NULL, NULL, NULL, NULL, '[TS17-2-201.759] X [TMGB19-0-90.023/BC1/F1]', 'LI', NULL, NULL),
(269, 23, 'TMG2757IPRO', 2, '2022-10-29 15:04:21.969', 23, '56.00', NULL, '5.60', 1, '8742', 8744, NULL, 'TS19-0-121.030', 'TS19-0-121030', 'TS19-0-121.030', NULL, '[NS5959IPRO X [NA5909RG X BTRR2-5]] X [[NS5959IPRO X [[NA5909RG X RR2BT-V]]] X [TS17-2-218.137 X TS15-0-011.161]]', NULL, NULL, NULL, NULL, '[TS17-2-218.137] X [TMGB19-0-90.047/BC1/F1]', 'LI', NULL, NULL),
(270, 23, 'TMG2757IPRO', 2, '2022-10-29 15:04:21.996', 23, '56.00', NULL, '5.70', 1, '8745', 8747, NULL, 'TS19-0-121.033', 'TS19-0-121033', 'TS19-0-121.033', NULL, '[NS5959IPRO X [NA5909RG X BTRR2-5]] X [[NS5959IPRO X [[NA5909RG X RR2BT-V]]] X [TS17-2-218.137 X TS15-0-011.161]]', NULL, NULL, NULL, NULL, '[TS17-2-218.137] X [TMGB19-0-90.047/BC1/F1]', 'LI', NULL, NULL),
(271, 23, 'TMG7058IPRO', 2, '2022-10-29 15:04:22.024', 23, '56.00', NULL, '5.80', 1, '8748', 8750, NULL, 'TS19-0-121.036', 'TS19-0-121036', 'TS19-0-121.036', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, NULL),
(272, 23, 'TMG7058IPRO', 2, '2022-10-29 15:04:22.052', 23, '56.00', NULL, '5.80', 1, '8749', 8751, NULL, 'TS19-0-121.037', 'TS19-0-121037', 'TS19-0-121.037', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, NULL),
(273, 23, 'TMG7058IPRO', 2, '2022-10-29 15:04:22.080', 23, '56.00', NULL, '5.80', 1, '8750', 8752, NULL, 'TS19-0-121.038', 'TS19-0-121038', 'TS19-0-121.038', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, NULL),
(274, 23, 'TMG7058IPRO', 2, '2022-10-29 15:04:22.107', 23, '56.00', NULL, '5.80', 1, '8751', 8753, NULL, 'TS19-0-121.039', 'TS19-0-121039', 'TS19-0-121.039', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, NULL),
(275, 23, 'TMG7058IPRO', 2, '2022-10-29 15:04:22.133', 23, '56.00', NULL, '5.70', 1, '8752', 8754, NULL, 'TS19-0-121.040', 'TS19-0-121040', 'TS19-0-121.040', NULL, '[[S11BTRR2-47 X TP10-0-00.484] X [BMXPOTENCIARR X BTRR2-5]] X [[TMGB11-2-100.155 X TS12-2-202.044] X [TMG7058IPRO X [MSOY-8001 X VMAX]]]', NULL, NULL, NULL, NULL, '[TMG7058IPRO] X [TMGC19-0-80.003/BC1/F1]', 'LI', NULL, NULL),
(276, 23, 'TMGB17-1-12330076/180436/1/01', 2, '2022-10-29 15:04:22.158', 23, '50.00', NULL, '4.50', 1, '9412', 9414, NULL, 'TS20-0-95801', 'TS20-0-95801', 'TS20-0-95801', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(277, 23, 'TMGB17-1-12330076/180426/1/01', 2, '2022-10-29 15:04:22.188', 23, '50.00', NULL, '4.50', 1, '9413', 9415, NULL, 'TS20-0-95802', 'TS20-0-95802', 'TS20-0-95802', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(278, 23, 'TMGB17-1-12330076/180362/2/02', 2, '2022-10-29 15:04:22.215', 23, '50.00', NULL, '5.20', 1, '9414', 9416, NULL, 'TS20-0-95803', 'TS20-0-95803', 'TS20-0-95803', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(279, 23, 'TMGB17-1-12330076/180385/1/01', 2, '2022-10-29 15:04:22.240', 23, '50.00', NULL, '4.50', 1, '9415', 9417, NULL, 'TS20-0-95804', 'TS20-0-95804', 'TS20-0-95804', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(280, 23, 'TMGB17-1-12330076/180385/1/01', 2, '2022-10-29 15:04:22.269', 23, '50.00', NULL, '4.50', 1, '9416', 9418, NULL, 'TS20-0-95805', 'TS20-0-95805', 'TS20-0-95805', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(281, 23, 'TMGB17-1-12330076/180369/1/01', 2, '2022-10-29 15:04:22.296', 23, '50.00', NULL, '5.00', 1, '9417', 9419, NULL, 'TS20-0-95806', 'TS20-0-95806', 'TS20-0-95806', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(282, 23, 'TMGB17-1-12330076/180407/2/02', 2, '2022-10-29 15:04:22.323', 23, '50.00', NULL, '4.50', 1, '9418', 9420, NULL, 'TS20-0-95807', 'TS20-0-95807', 'TS20-0-95807', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(283, 23, 'TMGB17-1-12330076/180407/2/02', 2, '2022-10-29 15:04:22.352', 23, '50.00', NULL, '4.50', 1, '9419', 9421, NULL, 'TS20-0-95808', 'TS20-0-95808', 'TS20-0-95808', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(284, 23, 'TMGB17-1-12330076/180385/1/01', 2, '2022-10-29 15:04:22.386', 23, '50.00', NULL, '4.50', 1, '9420', 9422, NULL, 'TS20-0-95809', 'TS20-0-95809', 'TS20-0-95809', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(285, 23, 'TMGB17-1-12330076/180369/1/01', 2, '2022-10-29 15:04:22.414', 23, '50.00', NULL, '5.20', 1, '9421', 9423, NULL, 'TS20-0-95810', 'TS20-0-95810', 'TS20-0-95810', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(286, 23, 'TMGB17-2-22330085/1/180062/2/02', 2, '2022-10-29 15:04:22.443', 23, '50.00', NULL, '5.20', 1, '9422', 9424, NULL, 'TS20-0-95811', 'TS20-0-95811', 'TS20-0-95811', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(287, 23, 'TMGB17-2-22330085/3/180135/1/01', 2, '2022-10-29 15:04:22.475', 23, '50.00', NULL, '5.00', 1, '9423', 9425, NULL, 'TS20-0-95812', 'TS20-0-95812', 'TS20-0-95812', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(288, 23, 'TMGB17-2-22330085/3/180135/2/02', 2, '2022-10-29 15:04:22.503', 23, '50.00', NULL, '5.00', 1, '9424', 9426, NULL, 'TS20-0-95813', 'TS20-0-95813', 'TS20-0-95813', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(289, 23, 'TMGB17-2-22330085/1/180062/1/01', 2, '2022-10-29 15:04:22.548', 23, '50.00', NULL, '5.00', 1, '9425', 9427, NULL, 'TS20-0-95814', 'TS20-0-95814', 'TS20-0-95814', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(290, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:22.581', 23, '50.00', NULL, '5.20', 1, '9426', 9428, NULL, 'TS20-0-95815', 'TS20-0-95815', 'TS20-0-95815', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(291, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:22.613', 23, '50.00', NULL, '5.20', 1, '9427', 9429, NULL, 'TS20-0-95816', 'TS20-0-95816', 'TS20-0-95816', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(292, 23, 'TMGB18-1-60733/1/1', 2, '2022-10-29 15:04:22.645', 23, '50.00', NULL, '5.20', 1, '9428', 9430, NULL, 'TS20-0-95817', 'TS20-0-95817', 'TS20-0-95817', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [P95R51]', 'LI', NULL, NULL),
(293, 23, 'TMGB18-1-60733/1/1', 2, '2022-10-29 15:04:22.679', 23, '50.00', NULL, '5.20', 1, '9429', 9431, NULL, 'TS20-0-95818', 'TS20-0-95818', 'TS20-0-95818', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [P95R51]', 'LI', NULL, NULL),
(294, 23, 'TMGB18-1-60754', 2, '2022-10-29 15:04:22.708', 23, '50.00', NULL, '5.20', 1, '9431', 9433, NULL, 'TS20-0-95820', 'TS20-0-95820', 'TS20-0-95820', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51RR]', 'LI', NULL, NULL),
(295, 23, 'TMGB18-1-60754', 2, '2022-10-29 15:04:22.742', 23, '50.00', NULL, '5.20', 1, '9432', 9434, NULL, 'TS20-0-95821', 'TS20-0-95821', 'TS20-0-95821', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51RR]', 'LI', NULL, NULL),
(296, 23, 'TMGB18-1-60754', 2, '2022-10-29 15:04:22.771', 23, '50.00', NULL, '5.20', 1, '9433', 9435, NULL, 'TS20-0-95822', 'TS20-0-95822', 'TS20-0-95822', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51RR]', 'LI', NULL, NULL),
(297, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.800', 23, '50.00', NULL, '5.00', 1, '9434', 9436, NULL, 'TS20-0-95823', 'TS20-0-95823', 'TS20-0-95823', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(298, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.829', 23, '50.00', NULL, '5.00', 1, '9435', 9437, NULL, 'TS20-0-95824', 'TS20-0-95824', 'TS20-0-95824', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(299, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.856', 23, '50.00', NULL, '5.00', 1, '9436', 9438, NULL, 'TS20-0-95825', 'TS20-0-95825', 'TS20-0-95825', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(300, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.883', 23, '50.00', NULL, '5.00', 1, '9437', 9439, NULL, 'TS20-0-95826', 'TS20-0-95826', 'TS20-0-95826', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(301, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.910', 23, '50.00', NULL, '5.00', 1, '9438', 9440, NULL, 'TS20-0-95827', 'TS20-0-95827', 'TS20-0-95827', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(302, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.938', 23, '50.00', NULL, '5.00', 1, '9439', 9441, NULL, 'TS20-0-95828', 'TS20-0-95828', 'TS20-0-95828', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(303, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.966', 23, '50.00', NULL, '5.00', 1, '9440', 9442, NULL, 'TS20-0-95829', 'TS20-0-95829', 'TS20-0-95829', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(304, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:22.993', 23, '50.00', NULL, '5.00', 1, '9442', 9444, NULL, 'TS20-0-95831', 'TS20-0-95831', 'TS20-0-95831', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(305, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.032', 23, '50.00', NULL, '5.00', 1, '9443', 9445, NULL, 'TS20-0-95832', 'TS20-0-95832', 'TS20-0-95832', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(306, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.059', 23, '50.00', NULL, '5.00', 1, '9444', 9446, NULL, 'TS20-0-95833', 'TS20-0-95833', 'TS20-0-95833', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(307, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.087', 23, '50.00', NULL, '5.00', 1, '9445', 9447, NULL, 'TS20-0-95834', 'TS20-0-95834', 'TS20-0-95834', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(308, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.113', 23, '50.00', NULL, '5.00', 1, '9446', 9448, NULL, 'TS20-0-95835', 'TS20-0-95835', 'TS20-0-95835', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(309, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.139', 23, '50.00', NULL, '5.00', 1, '9447', 9449, NULL, 'TS20-0-95836', 'TS20-0-95836', 'TS20-0-95836', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(310, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.165', 23, '50.00', NULL, '5.00', 1, '9448', 9450, NULL, 'TS20-0-95837', 'TS20-0-95837', 'TS20-0-95837', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(311, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.192', 23, '50.00', NULL, '5.00', 1, '9449', 9451, NULL, 'TS20-0-95838', 'TS20-0-95838', 'TS20-0-95838', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(312, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.217', 23, '50.00', NULL, '5.00', 1, '9450', 9452, NULL, 'TS20-0-95839', 'TS20-0-95839', 'TS20-0-95839', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(313, 23, 'TP18-11115/1', 2, '2022-10-29 15:04:23.245', 23, '50.00', NULL, '5.00', 1, '9451', 9453, NULL, 'TS20-0-95840', 'TS20-0-95840', 'TS20-0-95840', NULL, 'TMG7262RR X PI644025', NULL, NULL, NULL, NULL, 'TMG7262RR X STRONG RPS1K', 'LI', NULL, NULL),
(314, 23, 'TMGB18-0-60509/2/1', 2, '2022-10-29 15:04:23.272', 23, '53.00', NULL, '5.40', 1, '9452', 9454, NULL, 'TS20-0-95841', 'TS20-0-95841', 'TS20-0-95841', NULL, '[(AD(5) X FE19-2 ) X ER09-14344_POSSíVEIS GENES PARA RESISTêNCIA à FERRUGEM RPP?.] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[KFE17-0-6714 ] X [BS2021]', 'LI', NULL, NULL),
(315, 23, 'TMGB17-1-12330076/180369/1/01', 2, '2022-10-29 15:04:23.301', 23, '53.00', NULL, '5.30', 1, '9453', 9455, NULL, 'TS20-0-95842', 'TS20-0-95842', 'TS20-0-95842', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(316, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:23.336', 23, '53.00', NULL, '5.50', 1, '9455', 9457, NULL, 'TS20-0-95844', 'TS20-0-95844', 'TS20-0-95844', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(317, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:23.363', 23, '53.00', NULL, '5.50', 1, '9456', 9458, NULL, 'TS20-0-95845', 'TS20-0-95845', 'TS20-0-95845', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(318, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:23.392', 23, '53.00', NULL, '5.40', 1, '9457', 9459, NULL, 'TS20-0-95846', 'TS20-0-95846', 'TS20-0-95846', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(319, 23, 'TMGB18-1-60716/1/1', 2, '2022-10-29 15:04:23.420', 23, '53.00', NULL, '5.30', 1, '9458', 9460, NULL, 'TS20-0-95847', 'TS20-0-95847', 'TS20-0-95847', NULL, '[[ARG(5) X FE-12]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[KCB16-0-3308] X [P95R51]', 'LI', NULL, NULL),
(320, 23, 'TMGB18-1-60716/1/1', 2, '2022-10-29 15:04:23.446', 23, '53.00', NULL, '5.30', 1, '9459', 9461, NULL, 'TS20-0-95848', 'TS20-0-95848', 'TS20-0-95848', NULL, '[[ARG(5) X FE-12]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[KCB16-0-3308] X [P95R51]', 'LI', NULL, NULL),
(321, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:23.474', 23, '53.00', NULL, '5.30', 1, '9460', 9462, NULL, 'TS20-0-95849', 'TS20-0-95849', 'TS20-0-95849', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(322, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:23.503', 23, '53.00', NULL, '5.30', 1, '9461', 9463, NULL, 'TS20-0-95850', 'TS20-0-95850', 'TS20-0-95850', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(323, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:23.533', 23, '53.00', NULL, '5.40', 1, '9462', 9464, NULL, 'TS20-0-95851', 'TS20-0-95851', 'TS20-0-95851', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(324, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:23.558', 23, '53.00', NULL, '5.40', 1, '9463', 9465, NULL, 'TS20-0-95852', 'TS20-0-95852', 'TS20-0-95852', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(325, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:23.586', 23, '53.00', NULL, '5.30', 1, '9465', 9467, NULL, 'TS20-0-95854', 'TS20-0-95854', 'TS20-0-95854', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(326, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:23.612', 23, '53.00', NULL, '5.40', 1, '9466', 9468, NULL, 'TS20-0-95855', 'TS20-0-95855', 'TS20-0-95855', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(327, 23, 'TMGB18-1-60730/1/1', 2, '2022-10-29 15:04:23.639', 23, '53.00', NULL, '5.30', 1, '9467', 9469, NULL, 'TS20-0-95856', 'TS20-0-95856', 'TS20-0-95856', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, NULL),
(328, 23, 'TMGB18-1-60730/1/1', 2, '2022-10-29 15:04:23.667', 23, '53.00', NULL, '5.30', 1, '9470', 9472, NULL, 'TS20-0-95859', 'TS20-0-95859', 'TS20-0-95859', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, NULL);
INSERT INTO `genotipo` (`id`, `id_culture`, `cruza`, `created_by`, `created_at`, `id_tecnologia`, `bgm`, `elit_name`, `gmr`, `numberLotes`, `id_dados`, `id_s1`, `name_alter`, `name_experiment`, `name_genotipo`, `name_main`, `name_public`, `parentesco_completo`, `progenitor_f_direto`, `progenitor_f_origem`, `progenitor_m_direto`, `progenitor_m_origem`, `progenitores_origem`, `type`, `safraId`, `dt_export`) VALUES
(329, 23, 'TMGB18-1-60733/1/1', 2, '2022-10-29 15:04:23.694', 23, '53.00', NULL, '5.50', 1, '9472', 9474, NULL, 'TS20-0-95861', 'TS20-0-95861', 'TS20-0-95861', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [P95R51]', 'LI', NULL, NULL),
(330, 23, 'TMGB18-1-60754/3/2', 2, '2022-10-29 15:04:23.725', 23, '53.00', NULL, '5.40', 1, '9473', 9475, NULL, 'TS20-0-95862', 'TS20-0-95862', 'TS20-0-95862', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51]', 'LI', NULL, NULL),
(331, 23, 'TMGB18-1-60754/3/1', 2, '2022-10-29 15:04:23.752', 23, '53.00', NULL, '5.50', 1, '9474', 9476, NULL, 'TS20-0-95863', 'TS20-0-95863', 'TS20-0-95863', NULL, '[TS15-0-011925] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-011925] X [P95R51]', 'LI', NULL, NULL),
(332, 23, 'TB18-000162/1', 2, '2022-10-29 15:04:23.781', 23, '53.00', NULL, '5.50', 1, '9476', 9478, NULL, 'TS20-0-95865', 'TS20-0-95865', 'TS20-0-95865', NULL, 'NA 5909 RG X PI 227557', NULL, NULL, NULL, NULL, 'NA 5909 RG X PI 227557', 'LI', NULL, NULL),
(333, 23, 'TB18-000133/2', 2, '2022-10-29 15:04:23.810', 23, '53.00', NULL, '5.50', 1, '9477', 9479, NULL, 'TS20-0-95866', 'TS20-0-95866', 'TS20-0-95866', NULL, 'RAIO IPRO  X (K34 ARG4 X FE12)', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K34 ARG4 X FE12)', 'LI', NULL, NULL),
(334, 23, 'TB18-000130/3', 2, '2022-10-29 15:04:23.838', 23, '53.00', NULL, '5.50', 1, '9478', 9480, NULL, 'TS20-0-95867', 'TS20-0-95867', 'TS20-0-95867', NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(335, 23, 'TMGB17-0-090036', 2, '2022-10-29 15:04:23.863', 23, '53.00', NULL, '5.50', 1, '9479', 9481, NULL, 'TS20-0-95868', 'TS20-0-95868', 'TS20-0-95868', NULL, 'RAIO IPRO X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'RAIO IPRO X (K43 ARG4 X FE9)', 'LI', NULL, NULL),
(336, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:23.891', 23, '53.00', NULL, '5.30', 1, '9480', 9482, NULL, 'TS20-0-95869', 'TS20-0-95869', 'TS20-0-95869', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(337, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:23.918', 23, '53.00', NULL, '5.30', 1, '9481', 9483, NULL, 'TS20-0-95870', 'TS20-0-95870', 'TS20-0-95870', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(338, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:23.945', 23, '53.00', NULL, '5.40', 1, '9482', 9484, NULL, 'TS20-0-95871', 'TS20-0-95871', 'TS20-0-95871', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(339, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:23.972', 23, '53.00', NULL, '5.40', 1, '9483', 9485, NULL, 'TS20-0-95872', 'TS20-0-95872', 'TS20-0-95872', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(340, 23, 'TMGB18-0-02090008', 2, '2022-10-29 15:04:23.999', 23, '53.00', NULL, '5.30', 1, '9484', 9486, NULL, 'TS20-0-95873', 'TS20-0-95873', 'TS20-0-95873', NULL, '[P95R51RR(4) X VMAX]', NULL, NULL, NULL, NULL, '[P95R51RR(4) X VMAX]', 'LI', NULL, NULL),
(341, 23, 'TMGB18-0-02090008', 2, '2022-10-29 15:04:24.030', 23, '53.00', NULL, '5.50', 1, '9485', 9487, NULL, 'TS20-0-95874', 'TS20-0-95874', 'TS20-0-95874', NULL, '[P95R51RR(4) X VMAX]', NULL, NULL, NULL, NULL, '[P95R51RR(4) X VMAX]', 'LI', NULL, NULL),
(342, 23, 'TMGB19-2-90307', 2, '2022-10-29 15:04:24.060', 23, '53.00', NULL, '5.30', 1, '9486', 9488, NULL, 'TS20-0-95875', 'TS20-0-95875', 'TS20-0-95875', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(343, 23, 'TMGB19-2-90307', 2, '2022-10-29 15:04:24.088', 23, '53.00', NULL, '5.30', 1, '9487', 9489, NULL, 'TS20-0-95876', 'TS20-0-95876', 'TS20-0-95876', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(344, 23, 'TMGB19-2-90307', 2, '2022-10-29 15:04:24.115', 23, '53.00', NULL, '5.30', 1, '9488', 9490, NULL, 'TS20-0-95877', 'TS20-0-95877', 'TS20-0-95877', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(345, 23, 'TMGB19-2-90307', 2, '2022-10-29 15:04:24.145', 23, '53.00', NULL, '5.30', 1, '9489', 9491, NULL, 'TS20-0-95878', 'TS20-0-95878', 'TS20-0-95878', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(346, 23, 'TMGB19-2-90307', 2, '2022-10-29 15:04:24.172', 23, '53.00', NULL, '5.40', 1, '9490', 9492, NULL, 'TS20-0-95879', 'TS20-0-95879', 'TS20-0-95879', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(347, 23, 'TMGB19-2-90307', 2, '2022-10-29 15:04:24.199', 23, '53.00', NULL, '5.30', 1, '9491', 9493, NULL, 'TS20-0-95880', 'TS20-0-95880', 'TS20-0-95880', NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7061IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(348, 23, 'VAZIO', 2, '2022-10-29 15:04:24.227', 23, '53.00', NULL, '5.50', 1, '9492', 9494, NULL, 'TS20-0-95881', 'TS20-0-95881', 'TS20-0-95881', NULL, 'A4910 RG2 X (AD2X FE9) , YYY', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(349, 23, 'VAZIO', 2, '2022-10-29 15:04:24.253', 23, '53.00', NULL, '5.00', 1, '9493', 9495, NULL, 'TS20-0-95882', 'TS20-0-95882', 'TS20-0-95882', NULL, 'KCB09-14.344 X (NS733 RR ROXA) , YYY, RCS3, R NC 1,3', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(350, 23, 'VAZIO', 2, '2022-10-29 15:04:24.280', 23, '53.00', NULL, '5.50', 1, '9494', 9496, NULL, 'TS20-0-95883', 'TS20-0-95883', 'TS20-0-95883', NULL, 'TMG08-25729 X PI595099 , YYY , RXP RXP', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(351, 23, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-29 15:04:24.306', 23, '56.00', NULL, '5.60', 1, '9496', 9498, NULL, 'TS20-0-95885', 'TS20-0-95885', 'TS20-0-95885', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(352, 23, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-29 15:04:24.332', 23, '56.00', NULL, '5.80', 1, '9497', 9499, NULL, 'TS20-0-95886', 'TS20-0-95886', 'TS20-0-95886', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(353, 23, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-29 15:04:24.358', 23, '56.00', NULL, '5.80', 1, '9498', 9500, NULL, 'TS20-0-95887', 'TS20-0-95887', 'TS20-0-95887', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(354, 23, 'TMGB17-1-12330076/180364/1/01', 2, '2022-10-29 15:04:24.385', 23, '56.00', NULL, '5.80', 1, '9499', 9501, NULL, 'TS20-0-95888', 'TS20-0-95888', 'TS20-0-95888', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(355, 23, 'TMGB17-1-12330076/180383/1/01', 2, '2022-10-29 15:04:24.432', 23, '56.00', NULL, '5.80', 1, '9500', 9502, NULL, 'TS20-0-95889', 'TS20-0-95889', 'TS20-0-95889', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(356, 23, 'TMGB17-1-12330076/180310/4/04', 2, '2022-10-29 15:04:24.460', 23, '56.00', NULL, '5.70', 1, '9502', 9504, NULL, 'TS20-0-95891', 'TS20-0-95891', 'TS20-0-95891', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(357, 23, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-29 15:04:24.488', 23, '56.00', NULL, '5.80', 1, '9503', 9505, NULL, 'TS20-0-95892', 'TS20-0-95892', 'TS20-0-95892', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(358, 23, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-29 15:04:24.518', 23, '56.00', NULL, '5.80', 1, '9504', 9506, NULL, 'TS20-0-95893', 'TS20-0-95893', 'TS20-0-95893', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(359, 23, 'TMGB17-1-12330076/180310/2/02', 2, '2022-10-29 15:04:24.548', 23, '56.00', NULL, '5.80', 1, '9505', 9507, NULL, 'TS20-0-95894', 'TS20-0-95894', 'TS20-0-95894', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(360, 23, 'TMGB17-1-12330076/180379/3/03', 2, '2022-10-29 15:04:24.578', 23, '56.00', NULL, '5.70', 1, '9506', 9508, NULL, 'TS20-0-95895', 'TS20-0-95895', 'TS20-0-95895', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(361, 23, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-29 15:04:24.610', 23, '56.00', NULL, '5.70', 1, '9507', 9509, NULL, 'TS20-0-95896', 'TS20-0-95896', 'TS20-0-95896', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(362, 23, 'TMGB17-1-12330076/180421/3/03', 2, '2022-10-29 15:04:24.642', 23, '56.00', NULL, '5.80', 1, '9508', 9510, NULL, 'TS20-0-95897', 'TS20-0-95897', 'TS20-0-95897', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(363, 23, 'TMGB17-1-12330076/180383/2/02', 2, '2022-10-29 15:04:24.673', 23, '56.00', NULL, '5.80', 1, '9511', 9513, NULL, 'TS20-0-95900', 'TS20-0-95900', 'TS20-0-95900', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(364, 23, 'TMGB17-1-12330076/180353/1/01', 2, '2022-10-29 15:04:24.702', 23, '56.00', NULL, '5.80', 1, '9512', 9514, NULL, 'TS20-0-95901', 'TS20-0-95901', 'TS20-0-95901', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(365, 23, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-29 15:04:24.728', 23, '56.00', NULL, '5.80', 1, '9513', 9515, NULL, 'TS20-0-95902', 'TS20-0-95902', 'TS20-0-95902', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(366, 23, 'TMGB17-1-12330076/180259/1/01', 2, '2022-10-29 15:04:24.756', 23, '56.00', NULL, '5.80', 1, '9516', 9518, NULL, 'TS20-0-95905', 'TS20-0-95905', 'TS20-0-95905', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(367, 23, 'TMGB17-1-12330076/180431/1/01', 2, '2022-10-29 15:04:24.787', 23, '56.00', NULL, '5.60', 1, '9517', 9519, NULL, 'TS20-0-95906', 'TS20-0-95906', 'TS20-0-95906', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(368, 23, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-29 15:04:24.814', 23, '56.00', NULL, '5.80', 1, '9519', 9521, NULL, 'TS20-0-95908', 'TS20-0-95908', 'TS20-0-95908', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(369, 23, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-29 15:04:24.847', 23, '56.00', NULL, '5.80', 1, '9520', 9522, NULL, 'TS20-0-95909', 'TS20-0-95909', 'TS20-0-95909', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(370, 23, 'TMGB17-1-12330076/180294/3/03', 2, '2022-10-29 15:04:24.876', 23, '56.00', NULL, '5.80', 1, '9521', 9523, NULL, 'TS20-0-95910', 'TS20-0-95910', 'TS20-0-95910', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(371, 23, 'TMGB17-1-12330076/180402/1/01', 2, '2022-10-29 15:04:24.904', 23, '56.00', NULL, '5.60', 1, '9523', 9525, NULL, 'TS20-0-95912', 'TS20-0-95912', 'TS20-0-95912', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(372, 23, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-29 15:04:24.932', 23, '56.00', NULL, '5.80', 1, '9525', 9527, NULL, 'TS20-0-95914', 'TS20-0-95914', 'TS20-0-95914', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(373, 23, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-29 15:04:24.962', 23, '56.00', NULL, '5.70', 1, '9526', 9528, NULL, 'TS20-0-95915', 'TS20-0-95915', 'TS20-0-95915', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(374, 23, 'TMGB17-1-12330076/180364/1/01', 2, '2022-10-29 15:04:24.993', 23, '56.00', NULL, '5.80', 1, '9528', 9530, NULL, 'TS20-0-95917', 'TS20-0-95917', 'TS20-0-95917', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(375, 23, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-29 15:04:25.021', 23, '56.00', NULL, '5.70', 1, '9529', 9531, NULL, 'TS20-0-95918', 'TS20-0-95918', 'TS20-0-95918', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(376, 23, 'TMGB17-1-12330076/180359/1/01', 2, '2022-10-29 15:04:25.048', 23, '56.00', NULL, '5.70', 1, '9530', 9532, NULL, 'TS20-0-95919', 'TS20-0-95919', 'TS20-0-95919', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(377, 23, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-29 15:04:25.079', 23, '56.00', NULL, '5.80', 1, '9531', 9533, NULL, 'TS20-0-95920', 'TS20-0-95920', 'TS20-0-95920', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(378, 23, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-29 15:04:25.108', 23, '56.00', NULL, '5.80', 1, '9532', 9534, NULL, 'TS20-0-95921', 'TS20-0-95921', 'TS20-0-95921', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(379, 23, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-29 15:04:25.137', 23, '56.00', NULL, '5.80', 1, '9533', 9535, NULL, 'TS20-0-95922', 'TS20-0-95922', 'TS20-0-95922', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(380, 23, 'TMGB17-1-12330076/180389/1/01', 2, '2022-10-29 15:04:25.167', 23, '56.00', NULL, '5.70', 1, '9534', 9536, NULL, 'TS20-0-95923', 'TS20-0-95923', 'TS20-0-95923', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(381, 23, 'TMGB17-1-12330076/180263/2/02', 2, '2022-10-29 15:04:25.200', 23, '56.00', NULL, '5.80', 1, '9535', 9537, NULL, 'TS20-0-95924', 'TS20-0-95924', 'TS20-0-95924', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(382, 23, 'TMGB17-1-12330076/180364/2/02', 2, '2022-10-29 15:04:25.229', 23, '56.00', NULL, '5.80', 1, '9536', 9538, NULL, 'TS20-0-95925', 'TS20-0-95925', 'TS20-0-95925', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(383, 23, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-29 15:04:25.259', 23, '56.00', NULL, '5.80', 1, '9537', 9539, NULL, 'TS20-0-95926', 'TS20-0-95926', 'TS20-0-95926', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(384, 23, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-29 15:04:25.289', 23, '56.00', NULL, '5.60', 1, '9538', 9540, NULL, 'TS20-0-95927', 'TS20-0-95927', 'TS20-0-95927', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(385, 23, 'TMGB17-1-12330076/180336/1/01', 2, '2022-10-29 15:04:25.318', 23, '56.00', NULL, '5.80', 1, '9539', 9541, NULL, 'TS20-0-95928', 'TS20-0-95928', 'TS20-0-95928', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(386, 23, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-29 15:04:25.348', 23, '56.00', NULL, '5.70', 1, '9540', 9542, NULL, 'TS20-0-95929', 'TS20-0-95929', 'TS20-0-95929', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(387, 23, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-29 15:04:25.378', 23, '56.00', NULL, '5.80', 1, '9544', 9546, NULL, 'TS20-0-95933', 'TS20-0-95933', 'TS20-0-95933', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(388, 23, 'TMGB17-1-12330076/180362/2/02', 2, '2022-10-29 15:04:25.408', 23, '56.00', NULL, '5.80', 1, '9545', 9547, NULL, 'TS20-0-95934', 'TS20-0-95934', 'TS20-0-95934', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(389, 23, 'TMGB17-1-12330076/180362/2/02', 2, '2022-10-29 15:04:25.440', 23, '56.00', NULL, '5.70', 1, '9546', 9548, NULL, 'TS20-0-95935', 'TS20-0-95935', 'TS20-0-95935', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(390, 23, 'TMGB17-1-12330076/180348/8/08', 2, '2022-10-29 15:04:25.469', 23, '56.00', NULL, '5.80', 1, '9547', 9549, NULL, 'TS20-0-95936', 'TS20-0-95936', 'TS20-0-95936', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(391, 23, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-29 15:04:25.499', 23, '56.00', NULL, '5.80', 1, '9548', 9550, NULL, 'TS20-0-95937', 'TS20-0-95937', 'TS20-0-95937', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(392, 23, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-29 15:04:25.528', 23, '56.00', NULL, '5.80', 1, '9549', 9551, NULL, 'TS20-0-95938', 'TS20-0-95938', 'TS20-0-95938', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(393, 23, 'TMGB17-1-12330076/180383/4/04', 2, '2022-10-29 15:04:25.555', 23, '56.00', NULL, '5.80', 1, '9550', 9552, NULL, 'TS20-0-95939', 'TS20-0-95939', 'TS20-0-95939', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(394, 23, 'TMGB17-1-12330076/180359/1/01', 2, '2022-10-29 15:04:25.581', 23, '56.00', NULL, '5.60', 1, '9551', 9553, NULL, 'TS20-0-95940', 'TS20-0-95940', 'TS20-0-95940', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(395, 23, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-29 15:04:25.608', 23, '56.00', NULL, '5.80', 1, '9553', 9555, NULL, 'TS20-0-95942', 'TS20-0-95942', 'TS20-0-95942', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(396, 23, 'TMGB17-1-12330076/180294/3/03', 2, '2022-10-29 15:04:25.635', 23, '56.00', NULL, '5.80', 1, '9554', 9556, NULL, 'TS20-0-95943', 'TS20-0-95943', 'TS20-0-95943', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(397, 23, 'TMGB17-1-12330076/180383/1/01', 2, '2022-10-29 15:04:25.663', 23, '56.00', NULL, '5.80', 1, '9555', 9557, NULL, 'TS20-0-95944', 'TS20-0-95944', 'TS20-0-95944', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(398, 23, 'TMGB17-1-12330076/180389/2/02', 2, '2022-10-29 15:04:25.690', 23, '56.00', NULL, '5.70', 1, '9556', 9558, NULL, 'TS20-0-95945', 'TS20-0-95945', 'TS20-0-95945', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(399, 23, 'TMGB17-1-12330076/180364/1/01', 2, '2022-10-29 15:04:25.724', 23, '56.00', NULL, '5.80', 1, '9557', 9559, NULL, 'TS20-0-95946', 'TS20-0-95946', 'TS20-0-95946', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(400, 23, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-29 15:04:25.752', 23, '56.00', NULL, '5.80', 1, '9558', 9560, NULL, 'TS20-0-95947', 'TS20-0-95947', 'TS20-0-95947', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(401, 23, 'TMGB17-1-12330076/180379/2/02', 2, '2022-10-29 15:04:25.781', 23, '56.00', NULL, '5.80', 1, '9559', 9561, NULL, 'TS20-0-95948', 'TS20-0-95948', 'TS20-0-95948', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(402, 23, 'TMGB17-1-12330076/180383/3/03', 2, '2022-10-29 15:04:25.807', 23, '56.00', NULL, '5.60', 1, '9560', 9562, NULL, 'TS20-0-95949', 'TS20-0-95949', 'TS20-0-95949', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(403, 23, 'TMGB17-1-12330076/180348/1/01', 2, '2022-10-29 15:04:25.835', 23, '56.00', NULL, '5.60', 1, '9561', 9563, NULL, 'TS20-0-95950', 'TS20-0-95950', 'TS20-0-95950', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(404, 23, 'TMGB17-1-12330076/180437/1/01', 2, '2022-10-29 15:04:25.863', 23, '56.00', NULL, '5.70', 1, '9562', 9564, NULL, 'TS20-0-95951', 'TS20-0-95951', 'TS20-0-95951', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(405, 23, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-29 15:04:25.890', 23, '56.00', NULL, '5.80', 1, '9563', 9565, NULL, 'TS20-0-95952', 'TS20-0-95952', 'TS20-0-95952', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(406, 23, 'TMGB17-1-12330076/180402/1/01', 2, '2022-10-29 15:04:25.918', 23, '56.00', NULL, '5.70', 1, '9564', 9566, NULL, 'TS20-0-95953', 'TS20-0-95953', 'TS20-0-95953', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(407, 23, 'TMGB17-1-12330076/180282/1/01', 2, '2022-10-29 15:04:25.947', 23, '56.00', NULL, '5.80', 1, '9565', 9567, NULL, 'TS20-0-95954', 'TS20-0-95954', 'TS20-0-95954', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(408, 23, 'TMGB17-1-12330076/180383/1/01', 2, '2022-10-29 15:04:25.975', 23, '56.00', NULL, '5.80', 1, '9567', 9569, NULL, 'TS20-0-95956', 'TS20-0-95956', 'TS20-0-95956', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(409, 23, 'TMGB17-1-12330076/180263/2/02', 2, '2022-10-29 15:04:26.004', 23, '56.00', NULL, '5.80', 1, '9568', 9570, NULL, 'TS20-0-95957', 'TS20-0-95957', 'TS20-0-95957', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(410, 23, 'TMGB17-1-12330076/180282/1/01', 2, '2022-10-29 15:04:26.032', 23, '56.00', NULL, '5.80', 1, '9569', 9571, NULL, 'TS20-0-95958', 'TS20-0-95958', 'TS20-0-95958', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(411, 23, 'TMGB17-1-12330076/180324/1/01', 2, '2022-10-29 15:04:26.061', 23, '56.00', NULL, '5.80', 1, '9570', 9572, NULL, 'TS20-0-95959', 'TS20-0-95959', 'TS20-0-95959', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(412, 23, 'TMGB17-1-12330076/180348/2/02', 2, '2022-10-29 15:04:26.087', 23, '56.00', NULL, '5.70', 1, '9571', 9573, NULL, 'TS20-0-95960', 'TS20-0-95960', 'TS20-0-95960', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(413, 23, 'TMGB17-1-12330076/180359/1/01', 2, '2022-10-29 15:04:26.114', 23, '56.00', NULL, '5.70', 1, '9572', 9574, NULL, 'TS20-0-95961', 'TS20-0-95961', 'TS20-0-95961', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(414, 23, 'TMGB17-1-12330076/180379/3/03', 2, '2022-10-29 15:04:26.142', 23, '56.00', NULL, '5.80', 1, '9573', 9575, NULL, 'TS20-0-95962', 'TS20-0-95962', 'TS20-0-95962', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(415, 23, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-29 15:04:26.172', 23, '56.00', NULL, '5.80', 1, '9575', 9577, NULL, 'TS20-0-95964', 'TS20-0-95964', 'TS20-0-95964', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(416, 23, 'TMGB17-1-12330076/180379/3/03', 2, '2022-10-29 15:04:26.199', 23, '56.00', NULL, '5.80', 1, '9578', 9580, NULL, 'TS20-0-95967', 'TS20-0-95967', 'TS20-0-95967', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(417, 23, 'TMGB17-1-12330076/180353/1/01', 2, '2022-10-29 15:04:26.226', 23, '56.00', NULL, '5.80', 1, '9579', 9581, NULL, 'TS20-0-95968', 'TS20-0-95968', 'TS20-0-95968', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(418, 23, 'TMGB17-1-12330076/180379/1/01', 2, '2022-10-29 15:04:26.254', 23, '56.00', NULL, '5.80', 1, '9581', 9583, NULL, 'TS20-0-95970', 'TS20-0-95970', 'TS20-0-95970', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(419, 23, 'TMGB17-1-12330076/180310/3/03', 2, '2022-10-29 15:04:26.282', 23, '56.00', NULL, '5.80', 1, '9582', 9584, NULL, 'TS20-0-95971', 'TS20-0-95971', 'TS20-0-95971', NULL, '[(NK 3363²) X (PI644025)]', NULL, NULL, NULL, NULL, '[(NK 3363*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(420, 23, 'TMGB17-2-22330085/1/180062/2/02', 2, '2022-10-29 15:04:26.309', 23, '56.00', NULL, '5.80', 1, '9584', 9586, NULL, 'TS20-0-95973', 'TS20-0-95973', 'TS20-0-95973', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(421, 23, 'TMGB17-2-22330085/1/180062/3/03', 2, '2022-10-29 15:04:26.335', 23, '56.00', NULL, '5.80', 1, '9585', 9587, NULL, 'TS20-0-95974', 'TS20-0-95974', 'TS20-0-95974', NULL, '[(TMG7062IPRO*2) X (PI644025)]', NULL, NULL, NULL, NULL, '[(TMG7062IPRO*2) X (STRONG RPS1K)]', 'LI', NULL, NULL),
(422, 23, 'TMGB18-2-60645/1/1', 2, '2022-10-29 15:04:26.363', 23, '56.00', NULL, '5.80', 1, '9591', 9593, NULL, 'TS20-0-95980', 'TS20-0-95980', 'TS20-0-95980', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(423, 23, 'TMGB18-2-60645/1/1', 2, '2022-10-29 15:04:26.390', 23, '56.00', NULL, '5.80', 1, '9592', 9594, NULL, 'TS20-0-95981', 'TS20-0-95981', 'TS20-0-95981', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(424, 23, 'TMGB18-2-60645/1/2', 2, '2022-10-29 15:04:26.416', 23, '56.00', NULL, '5.80', 1, '9593', 9595, NULL, 'TS20-0-95982', 'TS20-0-95982', 'TS20-0-95982', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(425, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:26.444', 23, '56.00', NULL, '5.60', 1, '9594', 9596, NULL, 'TS20-0-95983', 'TS20-0-95983', 'TS20-0-95983', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(426, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:26.472', 23, '56.00', NULL, '5.80', 1, '9595', 9597, NULL, 'TS20-0-95984', 'TS20-0-95984', 'TS20-0-95984', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(427, 23, 'TMGB18-1-60714/1/1', 2, '2022-10-29 15:04:26.498', 23, '56.00', NULL, '5.80', 1, '9596', 9598, NULL, 'TS20-0-95985', 'TS20-0-95985', 'TS20-0-95985', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X BRS-239]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS15-0-010713] X [P95R51]', 'LI', NULL, NULL),
(428, 23, 'TMGB18-0-60522/5/1', 2, '2022-10-29 15:04:26.528', 23, '56.00', NULL, '5.60', 1, '9597', 9599, NULL, 'TS20-0-95986', 'TS20-0-95986', 'TS20-0-95986', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [[ARG(5) X FE-12]]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(429, 23, 'TMGB18-1-60725/1/1', 2, '2022-10-29 15:04:26.556', 23, '56.00', NULL, '5.60', 1, '9598', 9600, NULL, 'TS20-0-95987', 'TS20-0-95987', 'TS20-0-95987', NULL, '[[BMX-TITAN-RR X [[[DAVIS X PARANA]] X [[IAS-4 X BR-5]]]]] X [P95R51RR]', NULL, NULL, NULL, NULL, '[TS13-0-010197] X [P95R51]', 'LI', NULL, NULL),
(430, 23, 'TMGB18-1-60730', 2, '2022-10-29 15:04:26.583', 23, '56.00', NULL, '5.60', 1, '9599', 9601, NULL, 'TS20-0-95988', 'TS20-0-95988', 'TS20-0-95988', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, NULL),
(431, 23, 'TMGB18-1-60730/1/1', 2, '2022-10-29 15:04:26.611', 23, '56.00', NULL, '5.60', 1, '9601', 9603, NULL, 'TS20-0-95990', 'TS20-0-95990', 'TS20-0-95990', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, NULL),
(432, 23, 'TMGB18-1-60730', 2, '2022-10-29 15:04:26.638', 23, '56.00', NULL, '5.80', 1, '9603', 9605, NULL, 'TS20-0-95992', 'TS20-0-95992', 'TS20-0-95992', NULL, '[[CB11-0003-B X [VMAX X A-4715]]] X [BR12-4929]', NULL, NULL, NULL, NULL, '[TS15-0-011411] X [BR12-4929]', 'LI', NULL, NULL),
(433, 23, 'TB18-000162/1', 2, '2022-10-29 15:04:26.667', 23, '56.00', NULL, '5.80', 1, '9608', 9610, NULL, 'TS20-0-95997', 'TS20-0-95997', 'TS20-0-95997', NULL, 'NA 5909 RG X PI 227557', NULL, NULL, NULL, NULL, 'NA 5909 RG X PI 227557', 'LI', NULL, NULL),
(434, 23, 'TB18-000162/1', 2, '2022-10-29 15:04:26.693', 23, '56.00', NULL, '5.80', 1, '9610', 9612, NULL, 'TS20-0-95999', 'TS20-0-95999', 'TS20-0-95999', NULL, 'NA 5909 RG X PI 227557', NULL, NULL, NULL, NULL, 'NA 5909 RG X PI 227557', 'LI', NULL, NULL),
(435, 23, 'TB18-000130/2', 2, '2022-10-29 15:04:26.720', 23, '56.00', NULL, '5.70', 1, '9611', 9613, NULL, 'TS20-0-96000', 'TS20-0-96000', 'TS20-0-96000', NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'RAIO IPRO  X (K43 ARG4 X FE9)', 'LI', NULL, NULL),
(436, 23, 'VAZIO', 2, '2022-10-29 15:04:26.747', 23, '56.00', NULL, '5.60', 1, '9612', 9614, NULL, 'TS20-0-96001', 'TS20-0-96001', 'TS20-0-96001', NULL, '(KCB10-14.6843 X FE8) X VMAX , YYY', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(437, 23, 'VAZIO', 2, '2022-10-29 15:04:26.773', 23, '56.00', NULL, '5.70', 1, '9613', 9615, NULL, 'TS20-0-96002', 'TS20-0-96002', 'TS20-0-96002', NULL, '(PI5994754 X BMX APOLO RR ) X NA5909 RG , YYY RXP', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(438, 23, 'VAZIO', 2, '2022-10-29 15:04:26.799', 23, '56.00', NULL, '5.60', 1, '9614', 9616, NULL, 'TS20-0-96003', 'TS20-0-96003', 'TS20-0-96003', NULL, '(PI5994754 X BMX APOLO RR) X NA5909 RG , YYY RXP', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(439, 23, 'TMGB17-0-12330099/1', 2, '2022-10-29 15:04:26.827', 23, '56.00', NULL, '5.50', 1, '9616', 9618, NULL, 'TS20-0-96005', 'TS20-0-96005', 'TS20-0-96005', NULL, '[(TMG7262RR²) X (PI647961)]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(440, 23, 'TMGB17-0-12330099', 2, '2022-10-29 15:04:26.855', 23, '56.00', NULL, '5.50', 1, '9617', 9619, NULL, 'TS20-0-96006', 'TS20-0-96006', 'TS20-0-96006', NULL, '[(TMG7262RR²) X (PI647961)]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, NULL),
(441, 23, 'TMGB17-0-12330099', 2, '2022-10-29 15:04:26.881', 23, '56.00', NULL, '5.50', 1, '9619', 9621, NULL, 'TS20-0-96008', 'TS20-0-96008', 'TS20-0-96008', NULL, '[(TMG7262RR²) X (PI647961)]', NULL, NULL, NULL, NULL, '[(TMG7262RR²) X (PI647961)]', 'LI', NULL, NULL),
(442, 23, 'TMGB18-2-60623', 2, '2022-10-29 15:04:26.908', 23, '56.00', NULL, '5.70', 1, '9620', 9622, NULL, 'TS20-0-96009', 'TS20-0-96009', 'TS20-0-96009', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(443, 23, 'TMGB18-2-60623', 2, '2022-10-29 15:04:26.937', 23, '56.00', NULL, '5.80', 1, '9621', 9623, NULL, 'TS20-0-96010', 'TS20-0-96010', 'TS20-0-96010', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(444, 23, 'TMGB18-2-60623', 2, '2022-10-29 15:04:26.966', 23, '56.00', NULL, '5.70', 1, '9622', 9624, NULL, 'TS20-0-96011', 'TS20-0-96011', 'TS20-0-96011', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(445, 23, 'TMGB18-2-60623', 2, '2022-10-29 15:04:26.993', 23, '56.00', NULL, '5.80', 1, '9623', 9625, NULL, 'TS20-0-96012', 'TS20-0-96012', 'TS20-0-96012', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(446, 23, 'TMGB18-2-60625', 2, '2022-10-29 15:04:27.023', 23, '56.00', NULL, '5.80', 1, '9624', 9626, NULL, 'TS20-0-96013', 'TS20-0-96013', 'TS20-0-96013', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [TMG4182]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(447, 23, 'TMGB18-2-60625', 2, '2022-10-29 15:04:27.051', 23, '56.00', NULL, '5.60', 1, '9625', 9627, NULL, 'TS20-0-96014', 'TS20-0-96014', 'TS20-0-96014', NULL, '[[[[[NK-2555 X [BMX-APOLO X BTRR2]]] X ER11-16.025] X BMXATIVARR]] X [TMG4182]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(448, 23, 'TMGB18-2-60630', 2, '2022-10-29 15:04:27.078', 23, '56.00', NULL, '5.80', 1, '9626', 9628, NULL, 'TS20-0-96015', 'TS20-0-96015', 'TS20-0-96015', NULL, '[[[NA5909RG X BTRR2-5] X [LEO-116 X [[CD-215 X GC-84.058-29-4]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, NULL),
(449, 23, 'TMGB18-2-60630', 2, '2022-10-29 15:04:27.104', 23, '56.00', NULL, '5.70', 1, '9627', 9629, NULL, 'TS20-0-96016', 'TS20-0-96016', 'TS20-0-96016', NULL, '[[[NA5909RG X BTRR2-5] X [LEO-116 X [[CD-215 X GC-84.058-29-4]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, NULL),
(450, 23, 'TMGB18-2-60630', 2, '2022-10-29 15:04:27.130', 23, '56.00', NULL, '5.60', 1, '9628', 9630, NULL, 'TS20-0-96017', 'TS20-0-96017', 'TS20-0-96017', NULL, '[[[NA5909RG X BTRR2-5] X [LEO-116 X [[CD-215 X GC-84.058-29-4]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS16-2-264153] X [BS2021]', 'LI', NULL, NULL),
(451, 23, 'TMGB18-2-60644', 2, '2022-10-29 15:04:27.162', 23, '56.00', NULL, '5.70', 1, '9629', 9631, NULL, 'TS20-0-96018', 'TS20-0-96018', 'TS20-0-96018', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [BR12-4929]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(452, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.191', 23, '56.00', NULL, '5.60', 1, '9631', 9633, NULL, 'TS20-0-96020', 'TS20-0-96020', 'TS20-0-96020', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(453, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.221', 23, '56.00', NULL, '5.50', 1, '9632', 9634, NULL, 'TS20-0-96021', 'TS20-0-96021', 'TS20-0-96021', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(454, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.248', 23, '56.00', NULL, '5.50', 1, '9633', 9635, NULL, 'TS20-0-96022', 'TS20-0-96022', 'TS20-0-96022', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(455, 23, 'TMGB18-2-60647', 2, '2022-10-29 15:04:27.274', 23, '56.00', NULL, '5.70', 1, '9634', 9636, NULL, 'TS20-0-96023', 'TS20-0-96023', 'TS20-0-96023', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(456, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.303', 23, '56.00', NULL, '5.60', 1, '9635', 9637, NULL, 'TS20-0-96024', 'TS20-0-96024', 'TS20-0-96024', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(457, 23, 'TMGB18-2-60647', 2, '2022-10-29 15:04:27.331', 23, '56.00', NULL, '5.70', 1, '9637', 9639, NULL, 'TS20-0-96026', 'TS20-0-96026', 'TS20-0-96026', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(458, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.358', 23, '56.00', NULL, '5.60', 1, '9638', 9640, NULL, 'TS20-0-96027', 'TS20-0-96027', 'TS20-0-96027', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(459, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.386', 23, '56.00', NULL, '5.70', 1, '9639', 9641, NULL, 'TS20-0-96028', 'TS20-0-96028', 'TS20-0-96028', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(460, 23, 'TMGB18-2-60645', 2, '2022-10-29 15:04:27.413', 23, '56.00', NULL, '5.50', 1, '9640', 9642, NULL, 'TS20-0-96029', 'TS20-0-96029', 'TS20-0-96029', NULL, '[[[TMG7262RR X BTRR2-5] X [[[ER10-14.683 X RPP-1]] X ER10-14.215]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, '[TS15-2-258313] X [BS2021]', 'LI', NULL, NULL),
(461, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.441', 23, '56.00', NULL, '5.80', 1, '9641', 9643, NULL, 'TS20-0-96030', 'TS20-0-96030', 'TS20-0-96030', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(462, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.469', 23, '56.00', NULL, '5.80', 1, '9642', 9644, NULL, 'TS20-0-96031', 'TS20-0-96031', 'TS20-0-96031', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(463, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.496', 23, '56.00', NULL, '5.80', 1, '9643', 9645, NULL, 'TS20-0-96032', 'TS20-0-96032', 'TS20-0-96032', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(464, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.523', 23, '56.00', NULL, '5.80', 1, '9644', 9646, NULL, 'TS20-0-96033', 'TS20-0-96033', 'TS20-0-96033', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(465, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.551', 23, '56.00', NULL, '5.70', 1, '9645', 9647, NULL, 'TS20-0-96034', 'TS20-0-96034', 'TS20-0-96034', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(466, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.580', 23, '56.00', NULL, '5.80', 1, '9646', 9648, NULL, 'TS20-0-96035', 'TS20-0-96035', 'TS20-0-96035', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(467, 23, 'TMGB18-0-60518', 2, '2022-10-29 15:04:27.610', 23, '56.00', NULL, '5.80', 1, '9647', 9649, NULL, 'TS20-0-96036', 'TS20-0-96036', 'TS20-0-96036', NULL, '[[[WILLIAMS X ESSEX] X [CD-216 X CD-217]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010108] X [CA13001209]', 'LI', NULL, NULL),
(468, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.640', 23, '56.00', NULL, '5.80', 1, '9648', 9650, NULL, 'TS20-0-96037', 'TS20-0-96037', 'TS20-0-96037', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(469, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.670', 23, '56.00', NULL, '5.80', 1, '9649', 9651, NULL, 'TS20-0-96038', 'TS20-0-96038', 'TS20-0-96038', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(470, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.700', 23, '56.00', NULL, '5.80', 1, '9650', 9652, NULL, 'TS20-0-96039', 'TS20-0-96039', 'TS20-0-96039', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(471, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.731', 23, '56.00', NULL, '5.80', 1, '9651', 9653, NULL, 'TS20-0-96040', 'TS20-0-96040', 'TS20-0-96040', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(472, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.758', 23, '56.00', NULL, '5.80', 1, '9652', 9654, NULL, 'TS20-0-96041', 'TS20-0-96041', 'TS20-0-96041', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(473, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.783', 23, '56.00', NULL, '5.80', 1, '9653', 9655, NULL, 'TS20-0-96042', 'TS20-0-96042', 'TS20-0-96042', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(474, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.811', 23, '56.00', NULL, '5.80', 1, '9654', 9656, NULL, 'TS20-0-96043', 'TS20-0-96043', 'TS20-0-96043', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(475, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.840', 23, '56.00', NULL, '5.80', 1, '9655', 9657, NULL, 'TS20-0-96044', 'TS20-0-96044', 'TS20-0-96044', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(476, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.867', 23, '56.00', NULL, '5.80', 1, '9656', 9658, NULL, 'TS20-0-96045', 'TS20-0-96045', 'TS20-0-96045', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(477, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.894', 23, '56.00', NULL, '5.70', 1, '9658', 9660, NULL, 'TS20-0-96047', 'TS20-0-96047', 'TS20-0-96047', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(478, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.924', 23, '56.00', NULL, '5.80', 1, '9659', 9661, NULL, 'TS20-0-96048', 'TS20-0-96048', 'TS20-0-96048', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(479, 23, 'TMGB18-0-60523', 2, '2022-10-29 15:04:27.953', 23, '56.00', NULL, '5.80', 1, '9660', 9662, NULL, 'TS20-0-96049', 'TS20-0-96049', 'TS20-0-96049', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010187] X [CA13001209]', 'LI', NULL, NULL),
(480, 23, 'TMGB18-0-60525', 2, '2022-10-29 15:04:27.981', 23, '56.00', NULL, '5.50', 1, '9661', 9663, NULL, 'TS20-0-96050', 'TS20-0-96050', 'TS20-0-96050', NULL, '[[[WILLIAMS X ESSEX] X [NA-66-RR X [[BRS-184 X FE-9]]]]] X [RPS1K RESISTENTE]', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(481, 23, 'TMGB18-0-60545', 2, '2022-10-29 15:04:28.009', 23, '56.00', NULL, '5.70', 1, '9664', 9666, NULL, 'TS20-0-96053', 'TS20-0-96053', 'TS20-0-96053', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [CA13001209]', 'LI', NULL, NULL),
(482, 23, 'TMGB18-0-60545', 2, '2022-10-29 15:04:28.036', 23, '56.00', NULL, '5.60', 1, '9665', 9667, NULL, 'TS20-0-96054', 'TS20-0-96054', 'TS20-0-96054', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [CA13001209]', 'LI', NULL, NULL),
(483, 23, 'TMGB18-0-60545', 2, '2022-10-29 15:04:28.065', 23, '56.00', NULL, '5.70', 1, '9666', 9668, NULL, 'TS20-0-96055', 'TS20-0-96055', 'TS20-0-96055', NULL, '[[GC-00.138-29 X PI-459.025-B]] X [CA13001209]', NULL, NULL, NULL, NULL, '[TS13-0-010010] X [CA13001209]', 'LI', NULL, NULL),
(484, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:28.094', 23, '56.00', NULL, '5.60', 1, '9668', 9670, NULL, 'TS20-0-96058', 'TS20-0-96058', 'TS20-0-96058', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(485, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:28.122', 23, '56.00', NULL, '5.60', 1, '9669', 9671, NULL, 'TS20-0-96059', 'TS20-0-96059', 'TS20-0-96059', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(486, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:28.150', 23, '56.00', NULL, '5.60', 1, '9670', 9672, NULL, 'TS20-0-96060', 'TS20-0-96060', 'TS20-0-96060', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(487, 23, 'TMGB18-1-60745', 2, '2022-10-29 15:04:28.178', 23, '56.00', NULL, '5.80', 1, '9671', 9673, NULL, 'TS20-0-96061', 'TS20-0-96061', 'TS20-0-96061', NULL, '[BMXATIVARR] X [[ARG(5) X FE-12]]', NULL, NULL, NULL, NULL, '[BMXATIVARR] X [KCB16-0-3308]', 'LI', NULL, NULL),
(488, 23, 'TMGB19-2-90306', 2, '2022-10-29 15:04:28.206', 23, '56.00', NULL, '5.60', 1, '9672', 9674, NULL, 'TS20-0-96062', 'TS20-0-96062', 'TS20-0-96062', NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(489, 23, 'TMGB19-2-90306', 2, '2022-10-29 15:04:28.234', 23, '56.00', NULL, '5.80', 1, '9673', 9675, NULL, 'TS20-0-96063', 'TS20-0-96063', 'TS20-0-96063', NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(490, 23, 'TMGB19-2-90306', 2, '2022-10-29 15:04:28.261', 23, '56.00', NULL, '5.80', 1, '9674', 9676, NULL, 'TS20-0-96064', 'TS20-0-96064', 'TS20-0-96064', NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', NULL, NULL, NULL, NULL, '[TMG7058IPRO X [TMG7063IPRO(3) X PI644025]', 'LI', NULL, NULL),
(491, 23, 'VAZIO', 2, '2022-10-29 15:04:28.289', 23, '56.00', NULL, '5.60', 1, '9675', 9677, NULL, 'TS20-0-96065', 'TS20-0-96065', 'TS20-0-96065', NULL, 'KCB09-14.344-2 X (NS7337 RR SELEÇÃO FLOR ROXA) , YXY, RCS3, R 1,3 NC', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(492, 23, 'VAZIO', 2, '2022-10-29 15:04:28.316', 23, '56.00', NULL, '5.60', 1, '9676', 9678, NULL, 'TS20-0-96066', 'TS20-0-96066', 'TS20-0-96066', NULL, 'KCB10-14.6832 X (KCB10-14.7843 X FE9) , YYY RCS3', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(493, 23, 'TMGB16-1-100081', 2, '2022-10-29 15:04:28.343', 23, '56.00', NULL, '5.70', 1, '9678', 9680, NULL, 'TS20-0-96069', 'TS20-0-96069', 'TS20-0-96069', NULL, 'NA 5909 RG X PI 471938', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(494, 23, 'TMGB16-1-100081', 2, '2022-10-29 15:04:28.370', 23, '56.00', NULL, '5.80', 1, '9679', 9681, NULL, 'TS20-0-96070', 'TS20-0-96070', 'TS20-0-96070', NULL, 'NA 5909 RG X PI 471938', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(495, 23, 'TMGB16-1-100081', 2, '2022-10-29 15:04:28.398', 23, '56.00', NULL, '5.80', 1, '9680', 9682, NULL, 'TS20-0-96071', 'TS20-0-96071', 'TS20-0-96071', NULL, 'NA 5909 RG X PI 471938', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(496, 23, 'TMGB16-1-122030166', 2, '2022-10-29 15:04:28.425', 23, '56.00', NULL, '5.80', 1, '9681', 9683, NULL, 'TS20-0-96072', 'TS20-0-96072', 'TS20-0-96072', NULL, 'TMG7262RR X (PI227557 X TMG7262RR)', NULL, NULL, NULL, NULL, NULL, 'LI', NULL, NULL),
(497, 23, 'TMGB18-0-02090006', 2, '2022-10-29 15:04:28.453', 23, '56.00', NULL, '5.60', 1, '164135', 164137, NULL, 'TS20-0-96057', 'TS20-0-96057', 'TS20-0-96057', NULL, '[BMXALVORR(4) X VMAX]', NULL, NULL, NULL, NULL, '[BMXALVORR(4) X VMAX]', 'LI', NULL, NULL),
(498, 23, 'TMGB17-0-090051', 2, '2022-10-29 15:04:28.480', 23, '56.00', NULL, '5.70', 1, '164136', 164138, NULL, 'TS20-0-96067', 'TS20-0-96067', 'TS20-0-96067', NULL, 'NA 5909 RG  X (K43 ARG4 X FE9)', NULL, NULL, NULL, NULL, 'NA 5909 RG  X (K43 ARG4 X FE9)', 'LI', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `genotype_treatment`
--

CREATE TABLE `genotype_treatment` (
  `id` int(11) NOT NULL,
  `id_safra` int(11) NOT NULL,
  `id_assay_list` int(11) NOT NULL,
  `id_genotipo` int(11) NOT NULL,
  `id_lote` int(11) DEFAULT NULL,
  `treatments_number` int(11) NOT NULL,
  `comments` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `status_experiment` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMPORTADO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `genotype_treatment`
--

INSERT INTO `genotype_treatment` (`id`, `id_safra`, `id_assay_list`, `id_genotipo`, `id_lote`, `treatments_number`, `comments`, `status`, `created_by`, `status_experiment`) VALUES
(46, 84, 1, 23, 594, 1, '', 'L', 2, 'EXP. SORTEADO'),
(47, 84, 1, 23, 594, 2, '', 'L', 2, 'EXP. SORTEADO'),
(48, 84, 1, 23, 594, 3, '', 'L', 2, 'EXP. SORTEADO'),
(49, 84, 1, 23, 594, 4, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(50, 84, 1, 24, 595, 5, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(51, 84, 1, 26, 597, 6, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(52, 84, 1, 27, 598, 7, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(53, 84, 1, 29, 600, 8, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(54, 84, 1, 30, 601, 9, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(55, 84, 1, 31, 602, 10, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(56, 84, 1, 96, 667, 11, 'RK/TPG/P1C/P1G(0)CB', 'L', 2, 'EXP. SORTEADO'),
(57, 84, 1, 44, 615, 12, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(58, 84, 1, 45, 616, 13, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(59, 84, 1, 46, 617, 14, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(60, 84, 1, 47, 618, 15, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(61, 84, 1, 48, 619, 16, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(62, 84, 1, 49, 620, 17, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(63, 84, 1, 50, 621, 18, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(64, 84, 1, 51, 622, 19, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(65, 84, 1, 52, 623, 20, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(66, 84, 1, 53, 624, 21, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(67, 84, 1, 54, 625, 22, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(68, 84, 1, 28, 599, 23, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(69, 84, 1, 55, 626, 24, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(70, 84, 1, 56, 627, 25, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(71, 84, 1, 34, 605, 26, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(72, 84, 1, 35, 606, 27, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(73, 84, 1, 57, 628, 28, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(74, 84, 1, 58, 629, 29, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(75, 84, 1, 59, 630, 30, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(76, 84, 2, 9, NULL, 1, '', 'T', 2, 'EXP. SORTEADO'),
(77, 84, 2, 3, NULL, 2, '', 'T', 2, 'EXP. SORTEADO'),
(78, 84, 2, 6, NULL, 3, '', 'T', 2, 'EXP. SORTEADO'),
(79, 84, 2, 60, 631, 4, 'F8CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(80, 84, 2, 36, 607, 5, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(81, 84, 2, 38, 609, 6, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(82, 84, 2, 37, 608, 7, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(83, 84, 2, 33, 604, 8, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(84, 84, 2, 41, 612, 9, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(85, 84, 2, 25, 596, 10, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(86, 84, 2, 39, 610, 11, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(87, 84, 2, 42, 613, 12, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(88, 84, 2, 32, 603, 13, 'TPPF/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(89, 84, 2, 40, 611, 14, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(90, 84, 2, 43, 614, 15, 'F4CB/P1C/P1PF', 'L', 2, 'EXP. SORTEADO'),
(121, 85, 4, 9, NULL, 1, '', 'T', 2, 'IMPORTADO'),
(122, 85, 4, 3, NULL, 2, '', 'T', 2, 'IMPORTADO'),
(123, 85, 4, 6, NULL, 3, '', 'T', 2, 'IMPORTADO'),
(124, 85, 4, 60, 631, 4, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(125, 85, 4, 36, 607, 5, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(126, 85, 4, 38, 609, 6, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(127, 85, 4, 37, 608, 7, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(128, 85, 4, 33, 604, 8, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(129, 85, 4, 41, 612, 9, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(130, 85, 4, 25, 596, 10, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(131, 85, 4, 39, 610, 11, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(132, 85, 4, 42, 613, 12, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(133, 85, 4, 32, 603, 13, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(134, 85, 4, 40, 611, 14, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(135, 85, 4, 43, 614, 15, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(136, 89, 5, 262, 377, 1, '', 'T', 2, 'IMPORTADO'),
(137, 89, 5, 256, NULL, 2, '', 'T', 2, 'IMPORTADO'),
(138, 89, 5, 259, NULL, 3, '', 'T', 2, 'IMPORTADO'),
(139, 89, 5, 276, 594, 4, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(140, 89, 5, 277, 595, 5, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(141, 89, 5, 279, 597, 6, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(142, 89, 5, 280, 598, 7, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(143, 89, 5, 282, 600, 8, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(144, 89, 5, 283, 601, 9, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(145, 89, 5, 284, 602, 10, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(146, 89, 5, 349, 667, 11, 'RK/TPG/P1C/P1G(0)CB', 'L', 2, 'IMPORTADO'),
(147, 89, 5, 297, 615, 12, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(148, 89, 5, 298, 616, 13, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(149, 89, 5, 299, 617, 14, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(150, 89, 5, 300, 618, 15, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(151, 89, 5, 301, 619, 16, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(152, 89, 5, 302, 620, 17, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(153, 89, 5, 303, 621, 18, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(154, 89, 5, 304, 622, 19, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(155, 89, 5, 305, 623, 20, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(156, 89, 5, 306, 624, 21, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(157, 89, 5, 307, 625, 22, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(158, 89, 5, 281, 599, 23, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(159, 89, 5, 308, 626, 24, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(160, 89, 5, 309, 627, 25, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(161, 89, 5, 287, 605, 26, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(162, 89, 5, 288, 606, 27, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(163, 89, 5, 310, 628, 28, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(164, 89, 5, 311, 629, 29, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(165, 89, 5, 312, 630, 30, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(166, 89, 6, 262, NULL, 1, '', 'T', 2, 'IMPORTADO'),
(167, 89, 6, 256, NULL, 2, '', 'T', 2, 'IMPORTADO'),
(168, 89, 6, 259, NULL, 3, '', 'T', 2, 'IMPORTADO'),
(169, 89, 6, 313, 631, 4, 'F8CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(170, 89, 6, 289, 607, 5, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(171, 89, 6, 291, 609, 6, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(172, 89, 6, 290, 608, 7, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(173, 89, 6, 286, 604, 8, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(174, 89, 6, 294, 612, 9, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(175, 89, 6, 278, 596, 10, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(176, 89, 6, 292, 610, 11, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(177, 89, 6, 295, 613, 12, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(178, 89, 6, 285, 603, 13, 'TPPF/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(179, 89, 6, 293, 611, 14, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(180, 89, 6, 296, 614, 15, 'F4CB/P1C/P1PF', 'L', 2, 'IMPORTADO'),
(184, 85, 3, 1, 1, 1, '', 'T', 23, 'IMPORTADO'),
(185, 85, 3, 1, 1, 2, '', 'T', 23, 'IMPORTADO'),
(186, 85, 3, 1, 1, 3, '', 'T', 23, 'IMPORTADO');

-- --------------------------------------------------------

--
-- Estrutura para tabela `group`
--

CREATE TABLE `group` (
  `id` int(11) NOT NULL,
  `id_safra` int(11) NOT NULL,
  `id_foco` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `group`
--

INSERT INTO `group` (`id`, `id_safra`, `id_foco`, `created_by`, `created_at`, `group`) VALUES
(1, 83, 1, 23, '2022-09-27 15:20:20.734', 22),
(2, 84, 1, 23, '2022-09-27 15:20:27.941', 55),
(3, 84, 2, 23, '2022-09-27 15:20:42.359', 11),
(4, 83, 2, 23, '2022-09-27 15:20:48.026', 25),
(5, 85, 3, 2, '2022-09-27 19:45:25.089', 1),
(6, 84, 3, 2, '2022-09-27 20:04:50.635', 1),
(7, 86, 1, 2, '2022-09-28 21:47:08.348', 1),
(8, 86, 2, 2, '2022-09-28 21:47:15.595', 1),
(9, 86, 3, 2, '2022-09-28 21:47:24.145', 1),
(10, 87, 1, 2, '2022-09-28 21:50:19.284', 2),
(11, 84, 4, 2, '2022-09-28 21:51:49.247', 2),
(12, 86, 5, 2, '2022-09-28 21:57:47.840', 1),
(13, 86, 6, 2, '2022-09-28 21:58:12.603', 10),
(14, 87, 6, 2, '2022-09-28 21:58:57.915', 2),
(15, 85, 2, 23, '2022-10-04 18:37:56.400', 2),
(16, 83, 3, 2, '2022-10-04 18:51:09.242', 1),
(17, 83, 4, 23, '2022-10-04 23:30:20.746', 11),
(18, 88, 3, 23, '2022-10-15 00:11:18.654', 12),
(19, 85, 4, 2, '2022-10-21 18:26:48.347', 2),
(20, 89, 11, 2, '2022-10-29 15:28:46.148', 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `history_genotype_treatment`
--

CREATE TABLE `history_genotype_treatment` (
  `id` int(11) NOT NULL,
  `safra` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `foco` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ensaio` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tecnologia` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gli` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bgm` int(11) NOT NULL,
  `nt` int(11) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `genotipo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nca` decimal(12,0) NOT NULL,
  `created_by` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `history_genotype_treatment`
--

INSERT INTO `history_genotype_treatment` (`id`, `safra`, `foco`, `ensaio`, `tecnologia`, `gli`, `bgm`, `nt`, `status`, `genotipo`, `nca`, `created_by`, `createdAt`) VALUES
(1, '2022/22', 'SUL', 'INT', '00', 'INTS(0)50/01', 50, 1, 'T', 'P95R51RR', '0', 23, '2022-10-29 17:44:09.092'),
(2, '2022/22', 'SUL', 'INT', '00', 'INTS(0)50/01', 50, 2, 'T', 'BMXRAIOIPRO', '0', 23, '2022-10-29 17:44:11.927'),
(3, '2022/22', 'SUL', 'INT', '00', 'INTS(0)50/01', 50, 3, 'T', 'DM53I54IPRO', '0', 23, '2022-10-29 17:44:14.479');

-- --------------------------------------------------------

--
-- Estrutura para tabela `import_spreadsheet`
--

CREATE TABLE `import_spreadsheet` (
  `id` int(11) NOT NULL,
  `moduleId` int(11) NOT NULL,
  `fields` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `import_spreadsheet`
--

INSERT INTO `import_spreadsheet` (`id`, `moduleId`, `fields`) VALUES
(76, 17, '[\"Safra\", \"Cultura\", \"LocalPrep\", \"CodigoQuadra\", \"LargQ\", \"CompP\", \"LinhaP\", \"CompC\", \"Esquema\", \"Divisor\", \"SemMetro\", \"T4I\", \"T4F\", \"DI\", \"DF\"]'),
(80, 8, '[\"código\", \"nome\", \"rótulo\", \"cultura\"]'),
(81, 10, '[\"id_s1\", \"S1_DATA_ID\", \"Cultura\", \"Nome do genótipo\", \"Nome principal\", \"Nome público\", \"Nome experimental\", \"Nome alternativo\", \"Elite_Nome\", \"Código da tecnologia\", \"Tipo\", \"gmr\", \"bgm\", \"Cruzamento de origem\", \"Progenitor F direto\", \"Progenitor M direto\", \"Progenitor F de origem\", \"Progenitor M de origem\", \"Progenitores de origem\", \"Parentesco Completo\", \"id_s2\", \"DATA_ID\", \"Ano do lote\", \"Safra\", \"Código do lote\", \"NCC\", \"Fase\", \"Peso\", \"Quantidade\", \"DT_EXPORT\"]'),
(82, 12, '[\"Genotipo\", \"Lote\", \"Volume\"]'),
(85, 4, '[\"ID da unidade de cultura\", \"Ano\", \"Nome da unidade de cultura\", \"ID do lugar de cultura\", \"Nome do lugar de cultura\", \"CP_LIBELLE\", \"mloc\", \"Endereço\", \"Identificador de localidade\", \"Nome da localidade\", \"Identificador de região\", \"Nome da região\", \"REG_LIBELLE\", \"ID do país\", \"Nome do país\", \"CNTR_LIBELLE\"]'),
(89, 26, '[\"Protocolo\", \"RD\", \"SAFRA\", \"FOCO\", \"ENSAIO\", \"GLI (Grupo de linhagem)\", \"Código da tecnologia\", \"EP\", \"BGM\", \"PRJ\", \"Número de tratamento\", \"Status\", \"Nome do genótipo\", \"NCA\", \"Observação\"]'),
(91, 5, '[\"Cultura\", \"Esquema\", \"Plantadeiras\", \"SL\", \"SC\", \"SALOC\", \"Tiro\", \"Disparo\", \"CJ\", \"Dist\", \"ST\", \"SPC\", \"SColheita\", \"TipoParcela\"]'),
(94, 14, '[\"Cultura\", \"Safra\", \"Foco\", \"Ensaio\", \"OGM\", \"Local\", \"NPEI\", \"Epoca\"]'),
(98, 7, '[\"Cultura\", \"Nome\", \"Repeticao\", \"Sorteio\", \"Tratamento\", \"Bloco\"]');

-- --------------------------------------------------------

--
-- Estrutura para tabela `layout_children`
--

CREATE TABLE `layout_children` (
  `id` int(11) NOT NULL,
  `sl` int(11) NOT NULL,
  `sc` int(11) NOT NULL,
  `s_aloc` int(11) NOT NULL,
  `tiro` int(11) NOT NULL,
  `cj` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `disparo` int(11) NOT NULL,
  `dist` int(11) NOT NULL,
  `st` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `spc` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scolheita` int(11) NOT NULL,
  `tipo_parcela` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `id_layout` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `layout_quadra`
--

CREATE TABLE `layout_quadra` (
  `id` int(11) NOT NULL,
  `esquema` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `plantadeira` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tiros` int(11) DEFAULT NULL,
  `disparos` int(11) DEFAULT NULL,
  `parcelas` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `id_culture` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `local`
--

CREATE TABLE `local` (
  `id` int(11) NOT NULL,
  `latitude` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `longitude` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `altitude` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL,
  `adress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_country` int(11) NOT NULL,
  `id_local_culture` int(11) NOT NULL,
  `id_locality` int(11) NOT NULL,
  `id_region` int(11) NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label_region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mloc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name_country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_local_culture` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_locality` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_region` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `local`
--

INSERT INTO `local` (`id`, `latitude`, `longitude`, `altitude`, `created_at`, `created_by`, `adress`, `id_country`, `id_local_culture`, `id_locality`, `id_region`, `label`, `label_country`, `label_region`, `mloc`, `name_country`, `name_local_culture`, `name_locality`, `name_region`) VALUES
(1, NULL, NULL, NULL, '2022-10-28 12:37:21.975', 2, NULL, 4, 242, 242, 241, 'CAÇAPAVA DO SUL', 'BRASIL', 'RIO GRANDE DO SUL', 'CS01', 'BR', 'RS101CP01', 'CAÇAPAVA DO SUL', 'RS'),
(2, NULL, NULL, NULL, '2022-10-28 12:37:22.011', 2, NULL, 4, 374, 375, 241, 'RIO PARDO', 'BRASIL', 'RIO GRANDE DO SUL', 'RI01', 'BR', 'PR201MS02', 'RIO PARDO', 'RS'),
(3, NULL, NULL, NULL, '2022-10-28 12:37:22.027', 2, NULL, 4, 376, 377, 241, 'SAO SEPÉ', 'BRASIL', 'RIO GRANDE DO SUL', 'SP01', 'BR', 'RS101SS01', 'SAO SEPÉ', 'RS'),
(4, NULL, NULL, NULL, '2022-10-28 12:37:22.040', 2, NULL, 4, 378, 379, 241, 'CONDOR', 'BRASIL', 'RIO GRANDE DO SUL', 'CO01', 'BR', 'RS102CD01', 'CONDOR', 'RS'),
(5, NULL, NULL, NULL, '2022-10-28 12:37:22.053', 2, NULL, 4, 380, 381, 241, 'CRUZ ALTA', 'BRASIL', 'RIO GRANDE DO SUL', 'CA01', 'BR', 'RS102CT01', 'CRUZ ALTA', 'RS'),
(6, NULL, NULL, NULL, '2022-10-28 12:37:22.067', 2, NULL, 4, 382, 383, 241, 'CARAZINHO', 'BRASIL', 'RIO GRANDE DO SUL', 'CZ01', 'BR', 'RS102CZ01', 'CARAZINHO', 'RS'),
(7, NULL, NULL, NULL, '2022-10-28 12:37:22.081', 2, NULL, 4, 384, 385, 241, 'NÃO-ME-TOQUE', 'BRASIL', 'RIO GRANDE DO SUL', 'NT01', 'BR', 'RS102NT01', 'NAO-ME-TOQUE', 'RS'),
(8, NULL, NULL, NULL, '2022-10-28 12:37:22.094', 2, NULL, 4, 386, 387, 241, 'PASSO FUNDO', 'BRASIL', 'RIO GRANDE DO SUL', 'PF01', 'BR', 'RS102PF01', 'PASSO FUNDO', 'RS'),
(9, NULL, NULL, NULL, '2022-10-28 12:37:22.107', 2, NULL, 4, 388, 389, 241, 'PALMEIRA DAS MISSÕES', 'BRASIL', 'RIO GRANDE DO SUL', 'PM01', 'BR', 'RS102PM01', 'PALMEIRA DAS MISSÕES', 'RS'),
(10, NULL, NULL, NULL, '2022-10-28 12:37:22.120', 2, NULL, 4, 390, 391, 241, 'ROLADOR', 'BRASIL', 'RIO GRANDE DO SUL', 'RD01', 'BR', 'RS102PF01', 'ROLADOR', 'RS'),
(11, NULL, NULL, NULL, '2022-10-28 12:37:22.133', 2, NULL, 4, 392, 393, 241, 'VACARIA', 'BRASIL', 'RIO GRANDE DO SUL', 'VA01', 'BR', 'RS103VA01', 'VACARIA', 'RS'),
(12, NULL, NULL, NULL, '2022-10-28 12:37:22.145', 2, NULL, 4, 418, 411, 241, 'SAO GABRIEL', 'BRASIL', 'RIO GRANDE DO SUL', 'SG01', 'BR', 'RS101SG01', 'SAO GABRIEL', 'RS'),
(13, NULL, NULL, NULL, '2022-10-29 15:06:16.229', 2, NULL, 4, 160, 160, 159, 'MICRO-RADIAL-PROTÓTIPO(2)1', 'BRASIL', 'MATO GROSSO', NULL, 'BR', 'MT402SS01', 'SORRISO', 'MT'),
(14, NULL, NULL, NULL, '2022-10-29 15:06:16.257', 2, NULL, 4, 354, 355, 205, 'MARILANDIA DO SUL', 'BRASIL', 'PARANA', 'MS02', 'BR', 'PR201MS02', 'MARILANDIA DO SUL', 'PR');

-- --------------------------------------------------------

--
-- Estrutura para tabela `log_import`
--

CREATE TABLE `log_import` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `table` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '2',
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `state` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `executeTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalRecords` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `log_import`
--

INSERT INTO `log_import` (`id`, `user_id`, `table`, `status`, `created_at`, `updated_at`, `state`, `executeTime`, `totalRecords`) VALUES
(1, 2, 'TECHNOLOGY_S2', 1, '2022-10-28 12:30:54.038', '2022-10-28 12:30:54.038', 'EM ANDAMENTO', '0:01', 11),
(2, 2, 'TECHNOLOGY_S2', 1, '2022-10-28 12:31:28.334', '2022-10-28 12:31:28.334', 'SUCESSO', '0:01', 11),
(3, 2, 'GENOTYPE_S2', 1, '2022-10-28 12:33:27.802', '2022-10-28 12:33:27.802', 'INVALIDA', '0:09', 816),
(4, 2, 'TECHNOLOGY_S2', 1, '2022-10-28 12:35:32.434', '2022-10-28 12:35:32.434', 'SUCESSO', '0:01', 12),
(5, 2, 'GENOTYPE_S2', 1, '2022-10-28 12:35:56.211', '2022-10-28 12:35:56.211', 'SUCESSO', '0:36', 816),
(6, 2, 'CULTURE_UNIT', 1, '2022-10-28 12:37:02.504', '2022-10-28 12:37:02.504', 'EM ANDAMENTO', '0:01', 12),
(7, 2, 'CULTURE_UNIT', 1, '2022-10-28 12:37:21.853', '2022-10-28 12:37:21.853', 'SUCESSO', '0:01', 12),
(8, 2, 'ASSAY_LIST', 1, '2022-10-28 12:38:29.796', '2022-10-28 12:38:29.796', 'INVALIDA', '0:01', 45),
(9, 2, 'NPE', 1, '2022-10-28 12:47:42.716', '2022-10-28 12:47:42.716', 'INVALIDA', '0:01', 3),
(10, 2, 'NPE', 1, '2022-10-28 12:47:55.727', '2022-10-28 12:47:55.727', 'INVALIDA', '0:01', 3),
(11, 2, 'NPE', 1, '2022-10-28 12:48:16.671', '2022-10-28 12:48:16.671', 'SUCESSO', '0:01', 3),
(12, 2, 'CULTURE_UNIT', 1, '2022-10-28 12:56:09.665', '2022-10-28 12:56:09.665', 'EM ANDAMENTO', '0:01', 11),
(13, 2, 'CULTURE_UNIT', 1, '2022-10-28 12:56:38.309', '2022-10-28 12:56:38.309', 'SUCESSO', '0:01', 11),
(14, 23, 'ASSAY_LIST', 1, '2022-10-28 13:08:01.894', '2022-10-28 13:08:01.894', 'INVALIDA', '0:08', 45),
(15, 23, 'ASSAY_LIST', 1, '2022-10-28 13:18:36.593', '2022-10-28 13:18:36.593', 'INVALIDA', '0:06', 45),
(16, 23, 'ASSAY_LIST', 1, '2022-10-28 13:19:03.728', '2022-10-28 13:19:03.728', 'INVALIDA', '0:06', 45),
(17, 23, 'ASSAY_LIST', 1, '2022-10-28 13:41:07.261', '2022-10-28 13:41:07.261', 'FALHA', NULL, 45),
(18, 23, 'ASSAY_LIST', 1, '2022-10-28 13:42:41.595', '2022-10-28 13:42:41.595', 'SUCESSO', '0:19', 45),
(19, 2, 'ASSAY_LIST', 1, '2022-10-28 14:23:12.930', '2022-10-28 14:23:12.930', 'EM ANDAMENTO', '0:01', 3),
(20, 2, 'ASSAY_LIST', 1, '2022-10-28 14:24:02.518', '2022-10-28 14:24:02.518', 'INVALIDA', '0:01', 45),
(21, 2, 'ASSAY_LIST', 1, '2022-10-28 14:24:55.537', '2022-10-28 14:24:55.537', 'SUCESSO', '0:03', 45),
(22, 2, 'DELIMITATION', 1, '2022-10-28 14:26:10.458', '2022-10-28 14:26:10.458', 'INVALIDA', '0:01', 165),
(23, 2, 'DELIMITATION', 1, '2022-10-28 14:26:35.279', '2022-10-28 14:26:35.279', 'INVALIDA', '0:01', 165),
(24, 2, 'DELIMITATION', 1, '2022-10-28 14:28:34.172', '2022-10-28 14:28:34.172', 'INVALIDA', '0:01', 165),
(25, 2, 'DELIMITATION', 1, '2022-10-28 14:29:19.077', '2022-10-28 14:29:19.077', 'SUCESSO', '0:04', 165),
(26, 2, 'EXPERIMENT', 1, '2022-10-28 14:30:14.694', '2022-10-28 14:30:14.694', 'EM ANDAMENTO', '0:01', 6),
(27, 2, 'EXPERIMENT', 1, '2022-10-28 14:30:35.285', '2022-10-28 14:30:35.285', 'INVALIDA', '0:01', 6),
(28, 2, 'EXPERIMENT', 1, '2022-10-28 14:31:05.199', '2022-10-28 14:31:05.199', 'INVALIDA', '0:01', 6),
(29, 2, 'EXPERIMENT', 1, '2022-10-28 14:31:32.501', '2022-10-28 14:31:32.501', 'INVALIDA', '0:01', 6),
(30, 2, 'CULTURE_UNIT', 1, '2022-10-28 14:32:30.388', '2022-10-28 14:32:30.388', 'EM ANDAMENTO', '0:01', 12),
(31, 2, 'CULTURE_UNIT', 1, '2022-10-28 14:32:58.206', '2022-10-28 14:32:58.206', 'INVALIDA', '0:01', 12),
(32, 2, 'CULTURE_UNIT', 1, '2022-10-28 14:33:18.467', '2022-10-28 14:33:18.467', 'SUCESSO', '0:01', 12),
(33, 2, 'EXPERIMENT', 1, '2022-10-28 14:33:36.257', '2022-10-28 14:33:36.257', 'EM ANDAMENTO', '0:01', 12),
(34, 2, 'EXPERIMENT', 1, '2022-10-28 14:33:50.844', '2022-10-28 14:33:50.844', 'SUCESSO', '0:01', 6),
(35, 2, 'NPE', 1, '2022-10-28 14:35:02.634', '2022-10-28 14:35:02.634', 'SUCESSO', '0:01', 3),
(36, 2, 'ASSAY_LIST', 1, '2022-10-28 16:36:55.273', '2022-10-28 16:36:55.273', 'SUCESSO', '0:03', 45),
(37, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:01:49.372', '2022-10-28 17:01:49.372', 'EM ANDAMENTO', '0:01', 15),
(38, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:03:09.223', '2022-10-28 17:03:09.223', 'EM ANDAMENTO', '0:01', 15),
(39, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:04:32.532', '2022-10-28 17:04:32.532', 'INVALIDA', '0:02', 15),
(40, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:04:58.501', '2022-10-28 17:04:58.501', 'INVALIDA', '0:01', 15),
(41, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:09:09.915', '2022-10-28 17:09:09.915', 'SUCESSO', '0:02', 15),
(42, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:09:45.993', '2022-10-28 17:09:45.993', 'SUCESSO', '0:02', 15),
(43, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:10:57.277', '2022-10-28 17:10:57.277', 'SUCESSO', '0:02', 15),
(44, 2, 'GENOTYPE_S2', 1, '2022-10-28 17:13:18.211', '2022-10-28 17:13:18.211', 'SUCESSO', '0:02', 15),
(45, 23, 'GENOTYPE_S2', 1, '2022-10-28 17:52:55.311', '2022-10-28 17:52:55.311', 'EM ANDAMENTO', NULL, 816),
(46, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:08:16.371', '2022-10-28 18:08:16.371', 'INVALIDA', '1:20', 38),
(47, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:15:58.082', '2022-10-28 18:15:58.082', 'SUCESSO', '3:14', 38),
(48, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:19:40.410', '2022-10-28 18:19:40.410', 'SUCESSO', '3:26', 38),
(49, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:23:50.417', '2022-10-28 18:23:50.417', 'INVALIDA', '1:35', 38),
(50, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:26:27.638', '2022-10-28 18:26:27.638', 'INVALIDA', '0:10', 38),
(51, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:27:02.877', '2022-10-28 18:27:02.877', 'SUCESSO', '0:03', 3),
(52, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:28:09.946', '2022-10-28 18:28:09.946', 'SUCESSO', '0:03', 3),
(53, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:30:02.247', '2022-10-28 18:30:02.247', 'SUCESSO', '0:03', 3),
(54, 23, 'TECHNOLOGY_S2', 1, '2022-10-28 18:32:17.260', '2022-10-28 18:32:17.260', 'EM ANDAMENTO', '0:01', 11),
(55, 23, 'TECHNOLOGY_S2', 1, '2022-10-28 18:32:27.744', '2022-10-28 18:32:27.744', 'INVALIDA', '0:02', 11),
(56, 23, 'TECHNOLOGY_S2', 1, '2022-10-28 18:32:36.370', '2022-10-28 18:32:36.370', 'SUCESSO', '0:01', 11),
(57, 23, 'TECHNOLOGY_S2', 1, '2022-10-28 18:32:48.249', '2022-10-28 18:32:48.249', 'INVALIDA', '0:01', 11),
(58, 2, 'CULTURE_UNIT', 1, '2022-10-28 18:35:04.780', '2022-10-28 18:35:04.780', 'INVALIDA', '0:01', 12),
(59, 23, 'TECHNOLOGY_S2', 1, '2022-10-28 18:35:36.637', '2022-10-28 18:35:36.637', 'INVALIDA', '0:01', 11),
(60, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:35:57.863', '2022-10-28 18:35:57.863', 'SUCESSO', '0:04', 3),
(61, 23, 'GENOTYPE_S2', 1, '2022-10-28 18:36:20.691', '2022-10-28 18:36:20.691', 'INVALIDA', '0:03', 3),
(62, 38, 'TECHNOLOGY_S2', 1, '2022-10-28 19:03:45.802', '2022-10-28 19:03:45.802', 'SUCESSO', '0:01', 8),
(63, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:04:14.502', '2022-10-28 19:04:14.502', 'EM ANDAMENTO', '0:01', 309),
(64, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:04:47.279', '2022-10-28 19:04:47.279', 'EM ANDAMENTO', '0:01', 309),
(65, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:05:42.135', '2022-10-28 19:05:42.135', 'EM ANDAMENTO', '0:01', 309),
(66, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:06:35.844', '2022-10-28 19:06:35.844', 'EM ANDAMENTO', '0:01', 309),
(67, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:08:22.886', '2022-10-28 19:08:22.886', 'SUCESSO', '0:24', 309),
(68, 38, 'CULTURE_UNIT', 1, '2022-10-28 19:09:10.871', '2022-10-28 19:09:10.871', 'SUCESSO', '0:01', 11),
(69, 38, 'ASSAY_LIST', 1, '2022-10-28 19:09:20.610', '2022-10-28 19:09:20.610', 'INVALIDA', '0:01', 45),
(70, 23, 'GENOTYPE_S2', 1, '2022-10-28 19:09:34.331', '2022-10-28 19:09:34.331', 'SUCESSO', '0:05', 3),
(71, 38, 'ASSAY_LIST', 1, '2022-10-28 19:11:42.480', '2022-10-28 19:11:42.480', 'INVALIDA', '0:01', 45),
(72, 38, 'ASSAY_LIST', 1, '2022-10-28 19:12:39.163', '2022-10-28 19:12:39.163', 'INVALIDA', '0:01', 45),
(73, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:14:52.484', '2022-10-28 19:14:52.484', 'SUCESSO', '0:31', 309),
(74, 38, 'ASSAY_LIST', 1, '2022-10-28 19:15:47.068', '2022-10-28 19:15:47.068', 'INVALIDA', '0:01', 45),
(75, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:17:15.456', '2022-10-28 19:17:15.456', 'INVALIDA', '0:19', 309),
(76, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:18:51.117', '2022-10-28 19:18:51.117', 'INVALIDA', '0:20', 309),
(77, 38, 'GENOTYPE_S2', 1, '2022-10-28 19:20:56.645', '2022-10-28 19:20:56.645', 'SUCESSO', '0:30', 309),
(78, 23, 'GENOTYPE_S2', 1, '2022-10-28 19:25:00.249', '2022-10-28 19:25:00.249', 'SUCESSO', '0:32', 309),
(79, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-28 19:37:37.534', '2022-10-28 19:37:37.534', 'FALHA', NULL, 309),
(80, 38, 'ASSAY_LIST', 1, '2022-10-28 19:37:53.211', '2022-10-28 19:37:53.211', 'INVALIDA', '0:01', 45),
(81, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-28 19:41:29.966', '2022-10-28 19:41:29.966', 'FALHA', NULL, 3),
(82, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-28 19:51:04.489', '2022-10-28 19:51:04.489', 'FALHA', NULL, 3),
(83, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-28 19:52:19.950', '2022-10-28 19:52:19.950', 'FALHA', NULL, 3),
(84, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-28 19:52:43.967', '2022-10-28 19:52:43.967', 'FALHA', NULL, 3),
(85, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-28 19:53:14.730', '2022-10-28 19:53:14.730', 'FALHA', NULL, 3),
(86, 2, 'TECHNOLOGY_S2', 1, '2022-10-29 15:01:23.874', '2022-10-29 15:01:23.874', 'INVALIDA', '0:01', 13),
(87, 2, 'TECHNOLOGY_S2', 1, '2022-10-29 15:01:45.759', '2022-10-29 15:01:45.759', 'SUCESSO', '0:01', 13),
(88, 2, 'TECHNOLOGY_S2', 1, '2022-10-29 15:01:59.417', '2022-10-29 15:01:59.417', 'INVALIDA', '0:01', 13),
(89, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:02:48.176', '2022-10-29 15:02:48.176', 'EM ANDAMENTO', '0:01', 816),
(90, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:03:23.357', '2022-10-29 15:03:23.357', 'SUCESSO', '1:05', 816),
(91, 2, 'CULTURE_UNIT', 1, '2022-10-29 15:06:15.770', '2022-10-29 15:06:15.770', 'SUCESSO', '0:01', 14),
(92, 2, 'CULTURE_UNIT', 1, '2022-10-29 15:09:14.218', '2022-10-29 15:09:14.218', 'EM ANDAMENTO', '0:01', 11),
(93, 2, 'CULTURE_UNIT', 1, '2022-10-29 15:09:35.073', '2022-10-29 15:09:35.073', 'SUCESSO', '0:01', 11),
(94, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:10:57.076', '2022-10-29 15:10:57.076', 'INVALIDA', '0:45', 816),
(95, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:12:53.968', '2022-10-29 15:12:53.968', 'INVALIDA', '1:24', 816),
(96, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:15:49.743', '2022-10-29 15:15:49.743', 'INVALIDA', '1:25', 816),
(97, 2, 'ASSAY_LIST', 1, '2022-10-29 15:18:03.853', '2022-10-29 15:18:03.852', 'INVALIDA', '0:01', 45),
(98, 2, 'ASSAY_LIST', 1, '2022-10-29 15:19:00.284', '2022-10-29 15:19:00.284', 'SUCESSO', '0:03', 45),
(99, 2, 'GENOTYPE_TREATMENT', 1, '2022-10-29 15:23:52.866', '2022-10-29 15:23:52.866', 'FALHA', NULL, 3),
(100, 2, 'GENOTYPE_TREATMENT', 1, '2022-10-29 15:25:17.708', '2022-10-29 15:25:17.708', 'FALHA', NULL, 3),
(101, 2, 'NPE', 1, '2022-10-29 15:28:27.563', '2022-10-29 15:28:27.563', 'INVALIDA', '0:01', 3),
(102, 2, 'NPE', 1, '2022-10-29 15:28:57.315', '2022-10-29 15:28:57.315', 'SUCESSO', '0:01', 3),
(103, 2, 'DELIMITATION', 1, '2022-10-29 15:29:15.682', '2022-10-29 15:29:15.682', 'INVALIDA', '0:01', 165),
(104, 2, 'DELIMITATION', 1, '2022-10-29 15:29:43.311', '2022-10-29 15:29:43.311', 'SUCESSO', '0:04', 165),
(105, 2, 'EXPERIMENT', 1, '2022-10-29 15:32:13.864', '2022-10-29 15:32:13.864', 'SUCESSO', '0:01', 6),
(106, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:33:10.895', '2022-10-29 15:33:10.895', 'INVALIDA', '1:23', 816),
(107, 2, 'GENOTYPE_S2', 1, '2022-10-29 15:34:57.591', '2022-10-29 15:34:57.591', 'SUCESSO', '1:54', 816),
(108, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-29 17:28:21.413', '2022-10-29 17:28:21.413', 'FALHA', NULL, 3),
(109, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-29 17:42:06.051', '2022-10-29 17:42:06.051', 'FALHA', NULL, 3),
(110, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-29 17:43:04.632', '2022-10-29 17:43:04.632', 'FALHA', NULL, 3),
(111, 23, 'GENOTYPE_TREATMENT', 1, '2022-10-29 17:43:57.524', '2022-10-29 17:43:57.524', 'SUCESSO', '0:17', 3),
(112, 38, 'TECHNOLOGY_S2', 1, '2022-10-30 17:23:22.652', '2022-10-30 17:23:22.652', 'SUCESSO', '0:01', 8),
(113, 38, 'TECHNOLOGY_S2', 1, '2022-10-30 17:25:12.521', '2022-10-30 17:25:12.521', 'SUCESSO', '0:01', 8),
(114, 2, 'CULTURE_UNIT', 1, '2022-10-31 12:15:28.242', '2022-10-31 12:15:28.242', 'INVALIDA', '0:01', 12),
(115, 23, 'GENOTYPE_S2', 1, '2022-10-31 13:01:51.134', '2022-10-31 13:01:51.134', 'INVALIDA', '0:01', 2),
(116, 23, 'GENOTYPE_S2', 1, '2022-10-31 13:02:23.239', '2022-10-31 13:02:23.239', 'INVALIDA', '0:01', 2),
(117, 23, 'GENOTYPE_S2', 1, '2022-10-31 13:02:43.222', '2022-10-31 13:02:43.222', 'INVALIDA', '0:01', 2),
(118, 23, 'GENOTYPE_S2', 1, '2022-10-31 13:04:45.139', '2022-10-31 13:04:45.139', 'INVALIDA', '0:01', 2),
(119, 23, 'GENOTYPE_S2', 1, '2022-10-31 13:05:07.127', '2022-10-31 13:05:07.127', 'SUCESSO', '0:06', 2),
(120, 23, 'null', 1, '2022-10-31 13:06:35.379', '2022-10-31 13:06:35.379', 'EM ANDAMENTO', '0:01', 2),
(121, 23, 'null', 1, '2022-10-31 13:07:46.857', '2022-10-31 13:07:46.857', 'INVALIDA', '0:01', 2),
(122, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:12:30.158', '2022-10-31 13:12:30.158', 'INVALIDA', '2:14', 11),
(123, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:17:23.469', '2022-10-31 13:17:23.469', 'SUCESSO', '1:45', 11),
(124, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:39:53.310', '2022-10-31 13:39:53.310', 'SUCESSO', '0:01', 11),
(125, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:40:25.359', '2022-10-31 13:40:25.359', 'SUCESSO', '0:01', 11),
(126, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:50:38.821', '2022-10-31 13:50:38.821', 'SUCESSO', '0:01', 11),
(127, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:51:04.883', '2022-10-31 13:51:04.883', 'SUCESSO', '0:01', 11),
(128, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:55:08.430', '2022-10-31 13:55:08.430', 'SUCESSO', '0:01', 2),
(129, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 13:55:22.562', '2022-10-31 13:55:22.562', 'SUCESSO', '0:01', 2),
(130, 23, 'GA', 1, '2022-10-31 14:05:14.646', '2022-10-31 14:05:14.645', 'FALHA', NULL, 3),
(131, 23, 'ASSAY_LIST', 1, '2022-10-31 14:05:19.358', '2022-10-31 14:05:19.358', 'INVALIDA', '0:01', 3),
(132, 23, 'ASSAY_LIST', 1, '2022-10-31 14:05:37.024', '2022-10-31 14:05:37.024', 'INVALIDA', '0:01', 3),
(133, 23, 'ASSAY_LIST', 1, '2022-10-31 14:06:19.301', '2022-10-31 14:06:19.301', 'SUCESSO', '0:02', 3),
(134, 23, 'GA', 1, '2022-10-31 14:06:48.450', '2022-10-31 14:06:48.450', 'FALHA', NULL, 3),
(135, 23, 'ASSAY_LIST', 1, '2022-10-31 14:06:52.877', '2022-10-31 14:06:52.877', 'FALHA', NULL, 3),
(136, 23, 'ASSAY_LIST', 1, '2022-10-31 14:08:18.244', '2022-10-31 14:08:18.244', 'SUCESSO', '0:02', 3),
(137, 23, 'ASSAY_LIST', 1, '2022-10-31 14:08:52.476', '2022-10-31 14:08:52.476', 'INVALIDA', '0:01', 3),
(138, 2, 'TECHNOLOGY_S2', 1, '2022-10-31 15:22:37.936', '2022-10-31 15:22:37.936', 'SUCESSO', NULL, 13),
(139, 2, 'TECHNOLOGY_S2', 1, '2022-10-31 15:24:05.821', '2022-10-31 15:24:05.821', 'SUCESSO', NULL, 13),
(140, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:35:26.083', '2022-10-31 15:35:26.083', 'INVALIDA', '0:01', 13),
(141, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:35:35.457', '2022-10-31 15:35:35.457', 'SUCESSO', '0:01', 13),
(142, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:37:00.753', '2022-10-31 15:37:00.753', 'SUCESSO', '0:01', 13),
(143, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:37:50.809', '2022-10-31 15:37:50.809', 'SUCESSO', '0:01', 13),
(144, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:44:13.113', '2022-10-31 15:44:13.113', 'INVALIDA', '0:01', 13),
(145, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:44:36.394', '2022-10-31 15:44:36.394', 'INVALIDA', '0:01', 13),
(146, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:44:52.615', '2022-10-31 15:44:52.615', 'SUCESSO', '0:01', 12),
(147, 23, 'TECHNOLOGY_S2', 1, '2022-10-31 15:45:27.715', '2022-10-31 15:45:27.715', 'SUCESSO', '0:01', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `lote`
--

CREATE TABLE `lote` (
  `id` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `id_genotipo` int(11) NOT NULL,
  `cod_lote` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fase` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_dados` int(11) NOT NULL,
  `id_s2` int(11) NOT NULL,
  `id_safra` int(11) NOT NULL,
  `ncc` decimal(12,0) DEFAULT NULL,
  `peso` decimal(5,0) DEFAULT NULL,
  `quant_sementes` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `dt_export` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `lote`
--

INSERT INTO `lote` (`id`, `created_by`, `created_at`, `id_genotipo`, `cod_lote`, `fase`, `id_dados`, `id_s2`, `id_safra`, `ncc`, `peso`, `quant_sementes`, `year`, `dt_export`) VALUES
(1, 23, '2022-10-28 12:36:05.331', 1, '110000000096', 'P1', 96, 1, 85, '202114285111', '100', NULL, 2022, '2022-10-28 16:00:00.000'),
(2, 23, '2022-10-28 12:36:05.484', 1, '110000000097', 'P1', 97, 2, 85, '202114285112', '100', NULL, 2022, '2022-10-28 16:00:00.000'),
(3, 2, '2022-10-28 12:36:05.533', 254, '110000000098', 'P1', 98, 3, 89, '202114285121', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(4, 2, '2022-10-28 12:36:05.570', 254, '110000000099', 'P1', 99, 4, 89, '202114285122', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(5, 2, '2022-10-28 12:36:05.607', 254, '110000002081', 'P1', 2081, 5, 89, '202120993622', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(6, 2, '2022-10-28 12:36:05.651', 254, '110000002082', 'P1', 2082, 6, 89, '202120993623', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(7, 2, '2022-10-28 12:36:05.696', 254, '110000002083', 'P1', 2083, 7, 89, '202120993624', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(8, 2, '2022-10-28 12:36:05.738', 254, '110000002084', 'P1', 2084, 8, 89, '202120993625', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(9, 2, '2022-10-28 12:36:05.824', 254, '110000002085', 'P1', 2085, 9, 89, '202120993626', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(10, 2, '2022-10-28 12:36:05.877', 254, '110000002086', 'P1', 2086, 10, 89, '202120993627', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(11, 2, '2022-10-28 12:36:05.924', 254, '110000002087', 'P1', 2087, 11, 89, '202120993628', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(12, 2, '2022-10-28 12:36:05.966', 254, '110000002088', 'P1', 2088, 12, 89, '202120993629', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(13, 2, '2022-10-28 12:36:06.065', 254, '110000002089', 'P1', 2089, 13, 89, '202120993630', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(14, 2, '2022-10-28 12:36:06.116', 254, '110000002090', 'P1', 2090, 14, 89, '202120993631', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(15, 2, '2022-10-28 12:36:06.165', 254, '110000002091', 'P1', 2091, 15, 89, '202120993632', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(16, 2, '2022-10-28 12:36:06.215', 254, '110000002092', 'P1', 2092, 16, 89, '202120993633', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(17, 2, '2022-10-28 12:36:06.256', 254, '110000002093', 'P1', 2093, 17, 89, '202120993634', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(18, 2, '2022-10-28 12:36:06.301', 254, '110000002094', 'P1', 2094, 18, 89, '202120993635', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(19, 2, '2022-10-28 12:36:06.343', 254, '110000006012', 'P1', 6012, 19, 89, '202120702890', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(20, 2, '2022-10-28 12:36:06.390', 254, '110000189633', 'P1', 189633, 20, 89, '202102022202', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(21, 2, '2022-10-28 12:36:06.430', 255, '110000000203', 'P1', 203, 1, 89, '202114285231', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(22, 2, '2022-10-28 12:36:06.479', 255, '110000000204', 'P1', 204, 2, 89, '202114285232', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(23, 2, '2022-10-28 12:36:06.520', 255, '110000000205', 'P1', 205, 3, 89, '202114285241', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(24, 2, '2022-10-28 12:36:06.559', 255, '110000000206', 'P1', 206, 4, 89, '202114285242', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(25, 2, '2022-10-28 12:36:06.599', 255, '110000002095', 'P1', 2095, 5, 89, '202120994519', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(26, 2, '2022-10-28 12:36:06.632', 255, '110000002096', 'P1', 2096, 6, 89, '202120994520', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(27, 2, '2022-10-28 12:36:06.673', 255, '110000002097', 'P1', 2097, 7, 89, '202120994521', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(28, 2, '2022-10-28 12:36:06.710', 255, '110000002098', 'P1', 2098, 8, 89, '202120994534', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(29, 2, '2022-10-28 12:36:06.749', 255, '110000002099', 'P1', 2099, 9, 89, '202120994535', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(30, 2, '2022-10-28 12:36:06.793', 255, '110000002100', 'P1', 2100, 10, 89, '202120994536', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(31, 2, '2022-10-28 12:36:06.836', 255, '110000002101', 'P1', 2101, 11, 89, '202120994537', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(32, 2, '2022-10-28 12:36:06.877', 255, '110000002102', 'P1', 2102, 12, 89, '202120994538', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(33, 2, '2022-10-28 12:36:06.915', 255, '110000002103', 'P1', 2103, 13, 89, '202120994539', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(34, 2, '2022-10-28 12:36:06.957', 255, '110000002104', 'P1', 2104, 14, 89, '202120994546', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(35, 2, '2022-10-28 12:36:06.996', 255, '110000002105', 'P1', 2105, 15, 89, '202120994547', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(36, 2, '2022-10-28 12:36:07.041', 255, '110000002106', 'P1', 2106, 16, 89, '202120994548', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(37, 2, '2022-10-28 12:36:07.085', 255, '110000002107', 'P1', 2107, 17, 89, '202120994561', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(38, 2, '2022-10-28 12:36:07.128', 255, '110000002108', 'P1', 2108, 18, 89, '202120994562', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(39, 2, '2022-10-28 12:36:07.164', 255, '110000002109', 'P1', 2109, 19, 89, '202120994563', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(40, 2, '2022-10-28 12:36:07.205', 255, '110000002110', 'P1', 2110, 20, 89, '202120994564', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(41, 2, '2022-10-28 12:36:07.272', 255, '110000002111', 'P1', 2111, 21, 89, '202120994565', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(42, 2, '2022-10-28 12:36:07.320', 255, '110000002112', 'P1', 2112, 22, 89, '202120994566', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(43, 2, '2022-10-28 12:36:07.375', 255, '110000002113', 'P1', 2113, 23, 89, '202120994579', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(44, 2, '2022-10-28 12:36:07.427', 255, '110000002114', 'P1', 2114, 24, 89, '202120994580', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(45, 2, '2022-10-28 12:36:07.477', 255, '110000002115', 'P1', 2115, 25, 89, '202120994581', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(46, 2, '2022-10-28 12:36:07.527', 255, '110000002116', 'P1', 2116, 26, 89, '202120994582', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(47, 2, '2022-10-28 12:36:07.567', 255, '110000002117', 'P1', 2117, 27, 89, '202120994583', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(48, 2, '2022-10-28 12:36:07.610', 255, '110000006019', 'P1', 6019, 28, 89, '202120702853', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(49, 2, '2022-10-28 12:36:07.652', 255, '110000189634', 'P1', 189634, 29, 89, '202102022204', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(50, 2, '2022-10-28 12:36:07.687', 256, '110000000288', 'P1', 288, 1, 89, '202114285391', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(51, 2, '2022-10-28 12:36:07.726', 256, '110000000289', 'P1', 289, 2, 89, '202114285392', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(52, 2, '2022-10-28 12:36:07.763', 256, '110000000290', 'P1', 290, 3, 89, '202114285401', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(53, 2, '2022-10-28 12:36:07.806', 256, '110000000291', 'P1', 291, 4, 89, '202114285402', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(54, 2, '2022-10-28 12:36:07.840', 256, '110000002118', 'P1', 2118, 5, 89, '202120988565', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(55, 2, '2022-10-28 12:36:07.872', 256, '110000002119', 'P1', 2119, 6, 89, '202120988566', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(56, 2, '2022-10-28 12:36:07.912', 256, '110000002120', 'P1', 2120, 7, 89, '202120988567', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(57, 2, '2022-10-28 12:36:07.947', 256, '110000002121', 'P1', 2121, 8, 89, '202120988568', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(58, 2, '2022-10-28 12:36:07.986', 256, '110000002122', 'P1', 2122, 9, 89, '202120988569', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(59, 2, '2022-10-28 12:36:08.027', 256, '110000002123', 'P1', 2123, 10, 89, '202120988570', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(60, 2, '2022-10-28 12:36:08.067', 256, '110000002124', 'P1', 2124, 11, 89, '202120988571', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(61, 2, '2022-10-28 12:36:08.109', 256, '110000002125', 'P1', 2125, 12, 89, '202120988572', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(62, 2, '2022-10-28 12:36:08.144', 256, '110000002126', 'P1', 2126, 13, 89, '202120988573', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(63, 2, '2022-10-28 12:36:08.180', 256, '110000002127', 'P1', 2127, 14, 89, '202120988574', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(64, 2, '2022-10-28 12:36:08.219', 256, '110000002128', 'P1', 2128, 15, 89, '202120988575', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(65, 2, '2022-10-28 12:36:08.259', 256, '110000002129', 'P1', 2129, 16, 89, '202120988576', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(66, 2, '2022-10-28 12:36:08.297', 256, '110000002130', 'P1', 2130, 17, 89, '202120988577', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(67, 2, '2022-10-28 12:36:08.336', 256, '110000002131', 'P1', 2131, 18, 89, '202120988578', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(68, 2, '2022-10-28 12:36:08.374', 256, '110000002132', 'P1', 2132, 19, 89, '202120988579', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(69, 2, '2022-10-28 12:36:08.416', 256, '110000002133', 'P1', 2133, 20, 89, '202120988580', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(70, 2, '2022-10-28 12:36:08.456', 256, '110000002134', 'P1', 2134, 21, 89, '202120988581', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(71, 2, '2022-10-28 12:36:08.499', 256, '110000002135', 'P1', 2135, 22, 89, '202120988582', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(72, 2, '2022-10-28 12:36:08.537', 256, '110000002136', 'P1', 2136, 23, 89, '202120988583', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(73, 2, '2022-10-28 12:36:08.579', 256, '110000002137', 'P1', 2137, 24, 89, '202120988584', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(74, 2, '2022-10-28 12:36:08.624', 256, '110000002138', 'P1', 2138, 25, 89, '202120988585', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(75, 2, '2022-10-28 12:36:08.665', 256, '110000002139', 'P1', 2139, 26, 89, '202120988586', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(76, 2, '2022-10-28 12:36:08.709', 256, '110000002140', 'P1', 2140, 27, 89, '202120988587', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(77, 2, '2022-10-28 12:36:08.751', 256, '110000002141', 'P1', 2141, 28, 89, '202120988588', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(78, 2, '2022-10-28 12:36:08.798', 256, '110000002142', 'P1', 2142, 29, 89, '202120988589', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(79, 2, '2022-10-28 12:36:08.844', 256, '110000002143', 'P1', 2143, 30, 89, '202120988590', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(80, 2, '2022-10-28 12:36:08.886', 256, '110000002144', 'P1', 2144, 31, 89, '202120994955', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(81, 2, '2022-10-28 12:36:08.929', 256, '110000002145', 'P1', 2145, 32, 89, '202120994956', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(82, 2, '2022-10-28 12:36:08.974', 256, '110000002146', 'P1', 2146, 33, 89, '202120994962', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(83, 2, '2022-10-28 12:36:09.017', 256, '110000002147', 'P1', 2147, 34, 89, '202120994963', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(84, 2, '2022-10-28 12:36:09.055', 256, '110000002148', 'P1', 2148, 35, 89, '202120994969', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(85, 2, '2022-10-28 12:36:09.096', 256, '110000002149', 'P1', 2149, 36, 89, '202120994970', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(86, 2, '2022-10-28 12:36:09.137', 256, '110000002150', 'P1', 2150, 37, 89, '202120995001', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(87, 2, '2022-10-28 12:36:09.179', 256, '110000002151', 'P1', 2151, 38, 89, '202120995002', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(88, 2, '2022-10-28 12:36:09.217', 256, '110000002152', 'P1', 2152, 39, 89, '202120995013', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(89, 2, '2022-10-28 12:36:09.259', 256, '110000002153', 'P1', 2153, 40, 89, '202120995014', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(90, 2, '2022-10-28 12:36:09.300', 256, '110000002154', 'P1', 2154, 41, 89, '202120995015', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(91, 2, '2022-10-28 12:36:09.340', 256, '110000002155', 'P1', 2155, 42, 89, '202120995016', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(92, 2, '2022-10-28 12:36:09.380', 256, '110000002156', 'P1', 2156, 43, 89, '202120995027', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(93, 2, '2022-10-28 12:36:09.422', 256, '110000002157', 'P1', 2157, 44, 89, '202120995028', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(94, 2, '2022-10-28 12:36:09.464', 256, '110000002158', 'P1', 2158, 45, 89, '202120995029', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(95, 2, '2022-10-28 12:36:09.504', 256, '110000002159', 'P1', 2159, 46, 89, '202120995030', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(96, 2, '2022-10-28 12:36:09.545', 256, '110000006022', 'P1', 6022, 47, 89, '202120702813', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(97, 2, '2022-10-28 12:36:09.589', 256, '110000189649', 'P1', 189649, 48, 89, '202102022226', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(98, 2, '2022-10-28 12:36:09.627', 257, '110000000413', 'P1', 413, 1, 89, '202114285211', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(99, 2, '2022-10-28 12:36:09.667', 257, '110000000414', 'P1', 414, 2, 89, '202114285212', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(100, 2, '2022-10-28 12:36:09.706', 257, '110000000415', 'P1', 415, 3, 89, '202114285221', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(101, 2, '2022-10-28 12:36:09.747', 257, '110000000416', 'P1', 416, 4, 89, '202114285222', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(102, 2, '2022-10-28 12:36:09.788', 257, '110000000417', 'P1', 417, 5, 89, '202114288381', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(103, 2, '2022-10-28 12:36:09.826', 257, '110000000418', 'P1', 418, 6, 89, '202114288382', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(104, 2, '2022-10-28 12:36:09.862', 257, '110000002160', 'P1', 2160, 7, 89, '202120987401', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(105, 2, '2022-10-28 12:36:09.898', 257, '110000002161', 'P1', 2161, 8, 89, '202120987402', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(106, 2, '2022-10-28 12:36:09.932', 257, '110000002162', 'P1', 2162, 9, 89, '202120987403', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(107, 2, '2022-10-28 12:36:09.976', 257, '110000002163', 'P1', 2163, 10, 89, '202120987404', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(108, 2, '2022-10-28 12:36:10.024', 257, '110000002164', 'P1', 2164, 11, 89, '202120987415', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(109, 2, '2022-10-28 12:36:10.075', 257, '110000002165', 'P1', 2165, 12, 89, '202120987416', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(110, 2, '2022-10-28 12:36:10.120', 257, '110000002166', 'P1', 2166, 13, 89, '202120987417', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(111, 2, '2022-10-28 12:36:10.158', 257, '110000002167', 'P1', 2167, 14, 89, '202120987418', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(112, 2, '2022-10-28 12:36:10.200', 257, '110000002168', 'P1', 2168, 15, 89, '202120987419', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(113, 2, '2022-10-28 12:36:10.239', 257, '110000002169', 'P1', 2169, 16, 89, '202120987420', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(114, 2, '2022-10-28 12:36:10.275', 257, '110000002170', 'P1', 2170, 17, 89, '202120987421', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(115, 2, '2022-10-28 12:36:10.314', 257, '110000002171', 'P1', 2171, 18, 89, '202120987422', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(116, 2, '2022-10-28 12:36:10.352', 257, '110000002172', 'P1', 2172, 19, 89, '202120987434', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(117, 2, '2022-10-28 12:36:10.391', 257, '110000002173', 'P1', 2173, 20, 89, '202120987435', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(118, 2, '2022-10-28 12:36:10.430', 257, '110000002174', 'P1', 2174, 21, 89, '202120987436', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(119, 2, '2022-10-28 12:36:10.472', 257, '110000002175', 'P1', 2175, 22, 89, '202120987437', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(120, 2, '2022-10-28 12:36:10.514', 257, '110000002176', 'P1', 2176, 23, 89, '202120987438', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(121, 2, '2022-10-28 12:36:10.555', 257, '110000002177', 'P1', 2177, 24, 89, '202120987439', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(122, 2, '2022-10-28 12:36:10.596', 257, '110000002178', 'P1', 2178, 25, 89, '202120987440', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(123, 2, '2022-10-28 12:36:10.639', 257, '110000002179', 'P1', 2179, 26, 89, '202120987451', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(124, 2, '2022-10-28 12:36:10.676', 257, '110000002180', 'P1', 2180, 27, 89, '202120987452', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(125, 2, '2022-10-28 12:36:10.720', 257, '110000002181', 'P1', 2181, 28, 89, '202120987453', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(126, 2, '2022-10-28 12:36:10.765', 257, '110000002182', 'P1', 2182, 29, 89, '202120987454', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(127, 2, '2022-10-28 12:36:10.808', 257, '110000002183', 'P1', 2183, 30, 89, '202120987455', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(128, 2, '2022-10-28 12:36:10.852', 257, '110000002184', 'P1', 2184, 31, 89, '202120987456', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(129, 2, '2022-10-28 12:36:10.900', 257, '110000002185', 'P1', 2185, 32, 89, '202120987457', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(130, 2, '2022-10-28 12:36:10.953', 257, '110000002186', 'P1', 2186, 33, 89, '202120987458', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(131, 2, '2022-10-28 12:36:11.002', 257, '110000002187', 'P1', 2187, 34, 89, '202120987469', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(132, 2, '2022-10-28 12:36:11.054', 257, '110000002188', 'P1', 2188, 35, 89, '202120987470', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(133, 2, '2022-10-28 12:36:11.091', 257, '110000002189', 'P1', 2189, 36, 89, '202120987471', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(134, 2, '2022-10-28 12:36:11.125', 257, '110000002190', 'P1', 2190, 37, 89, '202120987472', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(135, 2, '2022-10-28 12:36:11.166', 257, '110000002191', 'P1', 2191, 38, 89, '202120987473', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(136, 2, '2022-10-28 12:36:11.214', 257, '110000002192', 'P1', 2192, 39, 89, '202120987474', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(137, 2, '2022-10-28 12:36:11.251', 257, '110000002193', 'P1', 2193, 40, 89, '202120987475', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(138, 2, '2022-10-28 12:36:11.393', 257, '110000002194', 'P1', 2194, 41, 89, '202120987476', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(139, 2, '2022-10-28 12:36:11.436', 257, '110000002195', 'P1', 2195, 42, 89, '202120987487', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(140, 2, '2022-10-28 12:36:11.481', 257, '110000002196', 'P1', 2196, 43, 89, '202120987488', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(141, 2, '2022-10-28 12:36:11.531', 257, '110000002197', 'P1', 2197, 44, 89, '202120987489', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(142, 2, '2022-10-28 12:36:11.579', 257, '110000002198', 'P1', 2198, 45, 89, '202120987490', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(143, 2, '2022-10-28 12:36:11.623', 257, '110000002199', 'P1', 2199, 46, 89, '202120987501', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(144, 2, '2022-10-28 12:36:11.671', 257, '110000002200', 'P1', 2200, 47, 89, '202120987502', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(145, 2, '2022-10-28 12:36:11.716', 257, '110000002201', 'P1', 2201, 48, 89, '202120987503', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(146, 2, '2022-10-28 12:36:11.763', 257, '110000002202', 'P1', 2202, 49, 89, '202120987504', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(147, 2, '2022-10-28 12:36:11.807', 257, '110000002203', 'P1', 2203, 50, 89, '202120987513', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(148, 2, '2022-10-28 12:36:11.855', 257, '110000002204', 'P1', 2204, 51, 89, '202120987514', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(149, 2, '2022-10-28 12:36:11.904', 257, '110000002205', 'P1', 2205, 52, 89, '202120987515', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(150, 2, '2022-10-28 12:36:11.955', 257, '110000002206', 'P1', 2206, 53, 89, '202120987516', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(151, 2, '2022-10-28 12:36:11.991', 257, '110000002207', 'P1', 2207, 54, 89, '202120987517', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(152, 2, '2022-10-28 12:36:12.025', 257, '110000002208', 'P1', 2208, 55, 89, '202120987518', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(153, 2, '2022-10-28 12:36:12.059', 257, '110000002209', 'P1', 2209, 56, 89, '202120987519', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(154, 2, '2022-10-28 12:36:12.093', 257, '110000002210', 'P1', 2210, 57, 89, '202120987520', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(155, 2, '2022-10-28 12:36:12.129', 257, '110000002211', 'P1', 2211, 58, 89, '202120987529', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(156, 2, '2022-10-28 12:36:12.164', 257, '110000002212', 'P1', 2212, 59, 89, '202120987530', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(157, 2, '2022-10-28 12:36:12.197', 257, '110000002213', 'P1', 2213, 60, 89, '202120987531', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(158, 2, '2022-10-28 12:36:12.230', 257, '110000002214', 'P1', 2214, 61, 89, '202120987532', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(159, 2, '2022-10-28 12:36:12.262', 257, '110000002215', 'P1', 2215, 62, 89, '202120987533', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(160, 2, '2022-10-28 12:36:12.294', 257, '110000002216', 'P1', 2216, 63, 89, '202120987534', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(161, 2, '2022-10-28 12:36:12.326', 257, '110000002217', 'P1', 2217, 64, 89, '202120987535', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(162, 2, '2022-10-28 12:36:12.362', 257, '110000002218', 'P1', 2218, 65, 89, '202120987536', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(163, 2, '2022-10-28 12:36:12.398', 257, '110000002219', 'P1', 2219, 66, 89, '202120987545', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(164, 2, '2022-10-28 12:36:12.436', 257, '110000002220', 'P1', 2220, 67, 89, '202120987546', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(165, 2, '2022-10-28 12:36:12.470', 257, '110000002221', 'P1', 2221, 68, 89, '202120987547', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(166, 2, '2022-10-28 12:36:12.505', 257, '110000002222', 'P1', 2222, 69, 89, '202120987548', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(167, 2, '2022-10-28 12:36:12.544', 257, '110000002223', 'P1', 2223, 70, 89, '202120987549', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(168, 2, '2022-10-28 12:36:12.584', 257, '110000002224', 'P1', 2224, 71, 89, '202120987550', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(169, 2, '2022-10-28 12:36:12.619', 257, '110000002225', 'P1', 2225, 72, 89, '202120987551', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(170, 2, '2022-10-28 12:36:12.653', 257, '110000002226', 'P1', 2226, 73, 89, '202120987552', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(171, 2, '2022-10-28 12:36:12.690', 257, '110000002227', 'P1', 2227, 74, 89, '202120987561', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(172, 2, '2022-10-28 12:36:12.727', 257, '110000002228', 'P1', 2228, 75, 89, '202120987562', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(173, 2, '2022-10-28 12:36:12.762', 257, '110000002229', 'P1', 2229, 76, 89, '202120987563', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(174, 2, '2022-10-28 12:36:12.797', 257, '110000002230', 'P1', 2230, 77, 89, '202120987564', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(175, 2, '2022-10-28 12:36:12.834', 257, '110000002231', 'P1', 2231, 78, 89, '202120987565', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(176, 2, '2022-10-28 12:36:12.870', 257, '110000002232', 'P1', 2232, 79, 89, '202120987566', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(177, 2, '2022-10-28 12:36:12.904', 257, '110000002233', 'P1', 2233, 80, 89, '202120987567', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(178, 2, '2022-10-28 12:36:12.942', 257, '110000002234', 'P1', 2234, 81, 89, '202120987568', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(179, 2, '2022-10-28 12:36:12.979', 257, '110000002235', 'P1', 2235, 82, 89, '202120987577', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(180, 2, '2022-10-28 12:36:13.021', 257, '110000002236', 'P1', 2236, 83, 89, '202120987578', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(181, 2, '2022-10-28 12:36:13.057', 257, '110000002237', 'P1', 2237, 84, 89, '202120987579', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(182, 2, '2022-10-28 12:36:13.093', 257, '110000002238', 'P1', 2238, 85, 89, '202120987580', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(183, 2, '2022-10-28 12:36:13.129', 257, '110000002239', 'P1', 2239, 86, 89, '202120991455', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(184, 2, '2022-10-28 12:36:13.169', 257, '110000002240', 'P1', 2240, 87, 89, '202120991456', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(185, 2, '2022-10-28 12:36:13.202', 257, '110000002241', 'P1', 2241, 88, 89, '202120991457', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(186, 2, '2022-10-28 12:36:13.239', 257, '110000002242', 'P1', 2242, 89, 89, '202120991458', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(187, 2, '2022-10-28 12:36:13.269', 257, '110000002243', 'P1', 2243, 90, 89, '202120991459', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(188, 2, '2022-10-28 12:36:13.300', 257, '110000002244', 'P1', 2244, 91, 89, '202120991460', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(189, 2, '2022-10-28 12:36:13.332', 257, '110000002245', 'P1', 2245, 92, 89, '202120994601', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(190, 2, '2022-10-28 12:36:13.364', 257, '110000002246', 'P1', 2246, 93, 89, '202120994602', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(191, 2, '2022-10-28 12:36:13.395', 257, '110000002247', 'P1', 2247, 94, 89, '202120994603', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(192, 2, '2022-10-28 12:36:13.427', 257, '110000002248', 'P1', 2248, 95, 89, '202120994616', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(193, 2, '2022-10-28 12:36:13.459', 257, '110000002249', 'P1', 2249, 96, 89, '202120994617', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(194, 2, '2022-10-28 12:36:13.491', 257, '110000002250', 'P1', 2250, 97, 89, '202120994618', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(195, 2, '2022-10-28 12:36:13.523', 257, '110000002251', 'P1', 2251, 98, 89, '202120994619', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(196, 2, '2022-10-28 12:36:13.559', 257, '110000002252', 'P1', 2252, 99, 89, '202120994620', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(197, 2, '2022-10-28 12:36:13.592', 257, '110000002253', 'P1', 2253, 100, 89, '202120994621', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(198, 2, '2022-10-28 12:36:13.625', 257, '110000002254', 'P1', 2254, 101, 89, '202120994635', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(199, 2, '2022-10-28 12:36:13.658', 257, '110000002255', 'P1', 2255, 102, 89, '202120994636', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(200, 2, '2022-10-28 12:36:13.694', 257, '110000002256', 'P1', 2256, 103, 89, '202120994637', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(201, 2, '2022-10-28 12:36:13.729', 257, '110000002257', 'P1', 2257, 104, 89, '202120994638', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(202, 2, '2022-10-28 12:36:13.764', 257, '110000002258', 'P1', 2258, 105, 89, '202120994639', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(203, 2, '2022-10-28 12:36:13.798', 257, '110000002259', 'P1', 2259, 106, 89, '202120994640', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(204, 2, '2022-10-28 12:36:13.832', 257, '110000002260', 'P1', 2260, 107, 89, '202120994646', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(205, 2, '2022-10-28 12:36:13.868', 257, '110000002261', 'P1', 2261, 108, 89, '202120994647', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(206, 2, '2022-10-28 12:36:13.902', 257, '110000002262', 'P1', 2262, 109, 89, '202120994648', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(207, 2, '2022-10-28 12:36:13.938', 257, '110000002263', 'P1', 2263, 110, 89, '202120994661', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(208, 2, '2022-10-28 12:36:13.975', 257, '110000002264', 'P1', 2264, 111, 89, '202120994662', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(209, 2, '2022-10-28 12:36:14.017', 257, '110000002265', 'P1', 2265, 112, 89, '202120994663', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(210, 2, '2022-10-28 12:36:14.061', 257, '110000002266', 'P1', 2266, 113, 89, '202120994664', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(211, 2, '2022-10-28 12:36:14.094', 257, '110000002267', 'P1', 2267, 114, 89, '202120994665', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(212, 2, '2022-10-28 12:36:14.127', 257, '110000002268', 'P1', 2268, 115, 89, '202120994666', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(213, 2, '2022-10-28 12:36:14.161', 257, '110000006026', 'P1', 6026, 116, 89, '202120702846', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(214, 2, '2022-10-28 12:36:14.194', 257, '110000189635', 'P1', 189635, 117, 89, '202102022205', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(215, 2, '2022-10-28 12:36:14.222', 258, '110000000419', 'P1', 419, 1, 89, '202114285091', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(216, 2, '2022-10-28 12:36:14.246', 258, '110000000420', 'P1', 420, 2, 89, '202114285092', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(217, 2, '2022-10-28 12:36:14.270', 258, '110000000421', 'P1', 421, 3, 89, '202114285101', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(218, 2, '2022-10-28 12:36:14.296', 258, '110000000422', 'P1', 422, 4, 89, '202114285102', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(219, 2, '2022-10-28 12:36:14.321', 258, '110000002269', 'P1', 2269, 5, 89, '202120993657', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(220, 2, '2022-10-28 12:36:14.347', 258, '110000002270', 'P1', 2270, 6, 89, '202120993658', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(221, 2, '2022-10-28 12:36:14.373', 258, '110000002271', 'P1', 2271, 7, 89, '202120993659', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(222, 2, '2022-10-28 12:36:14.398', 258, '110000002272', 'P1', 2272, 8, 89, '202120993660', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(223, 2, '2022-10-28 12:36:14.424', 258, '110000002273', 'P1', 2273, 9, 89, '202120993661', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(224, 2, '2022-10-28 12:36:14.451', 258, '110000002274', 'P1', 2274, 10, 89, '202120993662', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(225, 2, '2022-10-28 12:36:14.477', 258, '110000002275', 'P1', 2275, 11, 89, '202120993663', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(226, 2, '2022-10-28 12:36:14.503', 258, '110000002276', 'P1', 2276, 12, 89, '202120993664', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(227, 2, '2022-10-28 12:36:14.530', 258, '110000002277', 'P1', 2277, 13, 89, '202120993665', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(228, 2, '2022-10-28 12:36:14.558', 258, '110000002278', 'P1', 2278, 14, 89, '202120993666', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(229, 2, '2022-10-28 12:36:14.584', 258, '110000002279', 'P1', 2279, 15, 89, '202120993667', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(230, 2, '2022-10-28 12:36:14.611', 258, '110000002280', 'P1', 2280, 16, 89, '202120993668', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(231, 2, '2022-10-28 12:36:14.641', 258, '110000002281', 'P1', 2281, 17, 89, '202120993669', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(232, 2, '2022-10-28 12:36:14.666', 258, '110000002282', 'P1', 2282, 18, 89, '202120993670', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(233, 2, '2022-10-28 12:36:14.693', 258, '110000002283', 'P1', 2283, 19, 89, '202120993701', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(234, 2, '2022-10-28 12:36:14.718', 258, '110000002284', 'P1', 2284, 20, 89, '202120993702', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(235, 2, '2022-10-28 12:36:14.745', 258, '110000002285', 'P1', 2285, 21, 89, '202120993703', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(236, 2, '2022-10-28 12:36:14.771', 258, '110000002286', 'P1', 2286, 22, 89, '202120993704', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(237, 2, '2022-10-28 12:36:14.798', 258, '110000002287', 'P1', 2287, 23, 89, '202120993705', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(238, 2, '2022-10-28 12:36:14.825', 258, '110000002288', 'P1', 2288, 24, 89, '202120993706', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(239, 2, '2022-10-28 12:36:14.851', 258, '110000002289', 'P1', 2289, 25, 89, '202120993707', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(240, 2, '2022-10-28 12:36:14.877', 258, '110000002290', 'P1', 2290, 26, 89, '202120993708', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(241, 2, '2022-10-28 12:36:14.903', 258, '110000002291', 'P1', 2291, 27, 89, '202120993709', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(242, 2, '2022-10-28 12:36:14.930', 258, '110000002292', 'P1', 2292, 28, 89, '202120993710', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(243, 2, '2022-10-28 12:36:14.959', 258, '110000002293', 'P1', 2293, 29, 89, '202120993711', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(244, 2, '2022-10-28 12:36:14.986', 258, '110000002294', 'P1', 2294, 30, 89, '202120993712', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(245, 2, '2022-10-28 12:36:15.012', 258, '110000002295', 'P1', 2295, 31, 89, '202120993713', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(246, 2, '2022-10-28 12:36:15.040', 258, '110000002296', 'P1', 2296, 32, 89, '202120993714', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(247, 2, '2022-10-28 12:36:15.068', 258, '110000002297', 'P1', 2297, 33, 89, '202120993715', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(248, 2, '2022-10-28 12:36:15.096', 258, '110000002298', 'P1', 2298, 34, 89, '202120993716', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(249, 2, '2022-10-28 12:36:15.125', 258, '110000002299', 'P1', 2299, 35, 89, '202120993717', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(250, 2, '2022-10-28 12:36:15.153', 258, '110000002300', 'P1', 2300, 36, 89, '202120993718', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(251, 2, '2022-10-28 12:36:15.184', 258, '110000002301', 'P1', 2301, 37, 89, '202120993719', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(252, 2, '2022-10-28 12:36:15.212', 258, '110000002302', 'P1', 2302, 38, 89, '202120993720', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(253, 2, '2022-10-28 12:36:15.241', 258, '110000002303', 'P1', 2303, 39, 89, '202120993721', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(254, 2, '2022-10-28 12:36:15.269', 258, '110000006028', 'P1', 6028, 40, 89, '202120702867', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(255, 2, '2022-10-28 12:36:15.299', 258, '110000189636', 'P1', 189636, 41, 89, '202102022206', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(256, 2, '2022-10-28 12:36:15.323', 259, '110000000489', 'P1', 489, 1, 89, '202114285331', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(257, 2, '2022-10-28 12:36:15.348', 259, '110000000490', 'P1', 490, 2, 89, '202114285332', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(258, 2, '2022-10-28 12:36:15.375', 259, '110000000491', 'P1', 491, 3, 89, '202114285341', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(259, 2, '2022-10-28 12:36:15.402', 259, '110000000492', 'P1', 492, 4, 89, '202114285342', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(260, 2, '2022-10-28 12:36:15.427', 259, '110000002304', 'P1', 2304, 5, 89, '202120994733', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(261, 2, '2022-10-28 12:36:15.453', 259, '110000002305', 'P1', 2305, 6, 89, '202120994734', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(262, 2, '2022-10-28 12:36:15.479', 259, '110000002306', 'P1', 2306, 7, 89, '202120994735', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(263, 2, '2022-10-28 12:36:15.504', 259, '110000002307', 'P1', 2307, 8, 89, '202120994746', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(264, 2, '2022-10-28 12:36:15.528', 259, '110000002308', 'P1', 2308, 9, 89, '202120994747', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(265, 2, '2022-10-28 12:36:15.554', 259, '110000002309', 'P1', 2309, 10, 89, '202120994748', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(266, 2, '2022-10-28 12:36:15.580', 259, '110000002310', 'P1', 2310, 11, 89, '202120994749', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(267, 2, '2022-10-28 12:36:15.605', 259, '110000002311', 'P1', 2311, 12, 89, '202120994750', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(268, 2, '2022-10-28 12:36:15.632', 259, '110000002312', 'P1', 2312, 13, 89, '202120994751', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(269, 2, '2022-10-28 12:36:15.658', 259, '110000002313', 'P1', 2313, 14, 89, '202120994762', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(270, 2, '2022-10-28 12:36:15.710', 259, '110000002314', 'P1', 2314, 15, 89, '202120994763', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(271, 2, '2022-10-28 12:36:15.740', 259, '110000002315', 'P1', 2315, 16, 89, '202120994764', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(272, 2, '2022-10-28 12:36:15.766', 259, '110000002316', 'P1', 2316, 17, 89, '202120994765', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(273, 2, '2022-10-28 12:36:15.793', 259, '110000002317', 'P1', 2317, 18, 89, '202120994766', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(274, 2, '2022-10-28 12:36:15.820', 259, '110000002318', 'P1', 2318, 19, 89, '202120994767', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(275, 2, '2022-10-28 12:36:15.847', 259, '110000002319', 'P1', 2319, 20, 89, '202120994778', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(276, 2, '2022-10-28 12:36:15.874', 259, '110000002320', 'P1', 2320, 21, 89, '202120994779', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(277, 2, '2022-10-28 12:36:15.901', 259, '110000002321', 'P1', 2321, 22, 89, '202120994780', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(278, 2, '2022-10-28 12:36:15.932', 259, '110000002322', 'P1', 2322, 23, 89, '202120994801', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(279, 2, '2022-10-28 12:36:15.960', 259, '110000002323', 'P1', 2323, 24, 89, '202120994802', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(280, 2, '2022-10-28 12:36:15.987', 259, '110000002324', 'P1', 2324, 25, 89, '202120994803', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(281, 2, '2022-10-28 12:36:16.014', 259, '110000006035', 'P1', 6035, 26, 89, '202120702824', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(282, 2, '2022-10-28 12:36:16.041', 259, '110000189647', 'P1', 189647, 27, 89, '202102022224', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(283, 2, '2022-10-28 12:36:16.064', 260, '110000000501', 'P1', 501, 1, 89, '202114276011', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(284, 2, '2022-10-28 12:36:16.092', 260, '110000000502', 'P1', 502, 2, 89, '202114276012', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(285, 2, '2022-10-28 12:36:16.116', 260, '110000000503', 'P1', 503, 3, 89, '202114276021', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(286, 2, '2022-10-28 12:36:16.141', 260, '110000000504', 'P1', 504, 4, 89, '202114276022', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(287, 2, '2022-10-28 12:36:16.165', 260, '110000000505', 'P1', 505, 5, 89, '202114276031', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(288, 2, '2022-10-28 12:36:16.190', 260, '110000000506', 'P1', 506, 6, 89, '202114276032', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(289, 2, '2022-10-28 12:36:16.215', 260, '110000000507', 'P1', 507, 7, 89, '202114276041', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(290, 2, '2022-10-28 12:36:16.240', 260, '110000000508', 'P1', 508, 8, 89, '202114276042', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(291, 2, '2022-10-28 12:36:16.265', 260, '110000000509', 'P1', 509, 9, 89, '202114276051', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(292, 2, '2022-10-28 12:36:16.289', 260, '110000000510', 'P1', 510, 10, 89, '202114276052', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(293, 2, '2022-10-28 12:36:16.319', 260, '110000000511', 'P1', 511, 11, 89, '202114276061', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(294, 2, '2022-10-28 12:36:16.345', 260, '110000000512', 'P1', 512, 12, 89, '202114276062', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(295, 2, '2022-10-28 12:36:16.372', 260, '110000000513', 'P1', 513, 13, 89, '202114276071', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(296, 2, '2022-10-28 12:36:16.398', 260, '110000000514', 'P1', 514, 14, 89, '202114276072', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(297, 2, '2022-10-28 12:36:16.426', 260, '110000000515', 'P1', 515, 15, 89, '202114276081', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(298, 2, '2022-10-28 12:36:16.455', 260, '110000000516', 'P1', 516, 16, 89, '202114276082', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(299, 2, '2022-10-28 12:36:16.484', 260, '110000000517', 'P1', 517, 17, 89, '202114276091', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(300, 2, '2022-10-28 12:36:16.512', 260, '110000000518', 'P1', 518, 18, 89, '202114276092', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(301, 2, '2022-10-28 12:36:16.540', 260, '110000000519', 'P1', 519, 19, 89, '202114276101', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(302, 2, '2022-10-28 12:36:16.567', 260, '110000000520', 'P1', 520, 20, 89, '202114276102', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(303, 2, '2022-10-28 12:36:16.595', 260, '110000000521', 'P1', 521, 21, 89, '202114276111', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(304, 2, '2022-10-28 12:36:16.622', 260, '110000000522', 'P1', 522, 22, 89, '202114276112', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(305, 2, '2022-10-28 12:36:16.648', 260, '110000000523', 'P1', 523, 23, 89, '202114276121', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(306, 2, '2022-10-28 12:36:16.672', 260, '110000000524', 'P1', 524, 24, 89, '202114276122', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(307, 2, '2022-10-28 12:36:16.698', 260, '110000000525', 'P1', 525, 25, 89, '202114276131', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(308, 2, '2022-10-28 12:36:16.727', 260, '110000000526', 'P1', 526, 26, 89, '202114276132', '100', NULL, 2022, '2022-10-12 10:00:00.000'),
(309, 2, '2022-10-28 12:36:16.755', 260, '110000000527', NULL, 527, 27, 89, '202114276141', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(310, 2, '2022-10-28 12:36:16.783', 260, '110000000528', NULL, 528, 28, 89, '202114276142', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(311, 2, '2022-10-28 12:36:16.810', 260, '110000000529', NULL, 529, 29, 89, '202114276151', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(312, 2, '2022-10-28 12:36:16.851', 260, '110000000530', NULL, 530, 30, 89, '202114276152', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(313, 2, '2022-10-28 12:36:16.877', 260, '110000000531', NULL, 531, 31, 89, '202114276161', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(314, 2, '2022-10-28 12:36:16.904', 260, '110000000532', NULL, 532, 32, 89, '202114276162', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(315, 2, '2022-10-28 12:36:16.930', 260, '110000000533', NULL, 533, 33, 89, '202114276171', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(316, 2, '2022-10-28 12:36:16.959', 260, '110000000534', NULL, 534, 34, 89, '202114276172', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(317, 2, '2022-10-28 12:36:16.989', 260, '110000000535', NULL, 535, 35, 89, '202114276181', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(318, 2, '2022-10-28 12:36:17.016', 260, '110000000536', NULL, 536, 36, 89, '202114276182', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(319, 2, '2022-10-28 12:36:17.045', 260, '110000000537', NULL, 537, 37, 89, '202114276191', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(320, 2, '2022-10-28 12:36:17.073', 260, '110000000538', NULL, 538, 38, 89, '202114276192', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(321, 2, '2022-10-28 12:36:17.103', 260, '110000000539', NULL, 539, 39, 89, '202114276201', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(322, 2, '2022-10-28 12:36:17.132', 260, '110000000540', NULL, 540, 40, 89, '202114276202', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(323, 2, '2022-10-28 12:36:17.160', 260, '110000000541', NULL, 541, 41, 89, '202114285031', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(324, 2, '2022-10-28 12:36:17.189', 260, '110000000542', NULL, 542, 42, 89, '202114285032', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(325, 2, '2022-10-28 12:36:17.218', 260, '110000000543', NULL, 543, 43, 89, '202114285041', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(326, 2, '2022-10-28 12:36:17.246', 260, '110000000544', NULL, 544, 44, 89, '202114285042', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(327, 2, '2022-10-28 12:36:17.274', 260, '110000002340', NULL, 2340, 45, 89, '202120991516', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(328, 2, '2022-10-28 12:36:17.304', 260, '110000002341', NULL, 2341, 46, 89, '202120991517', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(329, 2, '2022-10-28 12:36:17.334', 260, '110000002342', NULL, 2342, 47, 89, '202120991518', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(330, 2, '2022-10-28 12:36:17.364', 260, '110000002343', NULL, 2343, 48, 89, '202120991519', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(331, 2, '2022-10-28 12:36:17.393', 260, '110000002344', NULL, 2344, 49, 89, '202120991520', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(332, 2, '2022-10-28 12:36:17.424', 260, '110000002345', NULL, 2345, 50, 89, '202120991521', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(333, 2, '2022-10-28 12:36:17.453', 260, '110000002346', NULL, 2346, 51, 89, '202120991522', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(334, 2, '2022-10-28 12:36:17.488', 260, '110000002347', NULL, 2347, 52, 89, '202120991523', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(335, 2, '2022-10-28 12:36:17.520', 260, '110000002348', NULL, 2348, 53, 89, '202120991524', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(336, 2, '2022-10-28 12:36:17.551', 260, '110000002349', NULL, 2349, 54, 89, '202120991525', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(337, 2, '2022-10-28 12:36:17.580', 260, '110000002350', NULL, 2350, 55, 89, '202120991526', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(338, 2, '2022-10-28 12:36:17.611', 260, '110000002351', NULL, 2351, 56, 89, '202120991527', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(339, 2, '2022-10-28 12:36:17.641', 260, '110000002352', NULL, 2352, 57, 89, '202120991528', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(340, 2, '2022-10-28 12:36:17.672', 260, '110000002353', NULL, 2353, 58, 89, '202120991529', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(341, 2, '2022-10-28 12:36:17.704', 260, '110000002354', NULL, 2354, 59, 89, '202120991531', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(342, 2, '2022-10-28 12:36:17.735', 260, '110000002355', NULL, 2355, 60, 89, '202120991532', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(343, 2, '2022-10-28 12:36:17.766', 260, '110000002356', NULL, 2356, 61, 89, '202120991533', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(344, 2, '2022-10-28 12:36:17.796', 260, '110000002357', NULL, 2357, 62, 89, '202120991534', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(345, 2, '2022-10-28 12:36:17.827', 260, '110000002358', NULL, 2358, 63, 89, '202120991535', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(346, 2, '2022-10-28 12:36:17.858', 260, '110000002359', NULL, 2359, 64, 89, '202120991536', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(347, 2, '2022-10-28 12:36:17.888', 260, '110000002360', NULL, 2360, 65, 89, '202120991537', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(348, 2, '2022-10-28 12:36:17.925', 260, '110000002361', NULL, 2361, 66, 89, '202120991538', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(349, 2, '2022-10-28 12:36:17.964', 260, '110000002362', NULL, 2362, 67, 89, '202120991539', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(350, 2, '2022-10-28 12:36:18.009', 260, '110000002363', NULL, 2363, 68, 89, '202120991540', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(351, 2, '2022-10-28 12:36:18.064', 260, '110000002364', NULL, 2364, 69, 89, '202120991541', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(352, 2, '2022-10-28 12:36:18.108', 260, '110000002365', NULL, 2365, 70, 89, '202120991542', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(353, 2, '2022-10-28 12:36:18.151', 260, '110000002366', NULL, 2366, 71, 89, '202120991543', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(354, 2, '2022-10-28 12:36:18.193', 260, '110000002367', NULL, 2367, 72, 89, '202120991544', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(355, 2, '2022-10-28 12:36:18.228', 260, '110000002368', NULL, 2368, 73, 89, '202120991545', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(356, 2, '2022-10-28 12:36:18.260', 260, '110000002369', NULL, 2369, 74, 89, '202120991546', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(357, 2, '2022-10-28 12:36:18.292', 260, '110000002370', NULL, 2370, 75, 89, '202120991547', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(358, 2, '2022-10-28 12:36:18.324', 260, '110000002371', NULL, 2371, 76, 89, '202120991548', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(359, 2, '2022-10-28 12:36:18.357', 260, '110000002372', NULL, 2372, 77, 89, '202120991549', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(360, 2, '2022-10-28 12:36:18.402', 260, '110000002373', NULL, 2373, 78, 89, '202120991550', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(361, 2, '2022-10-28 12:36:18.443', 260, '110000006041', NULL, 6041, 79, 89, '202120702893', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(362, 2, '2022-10-28 12:36:18.484', 260, '110000248503', NULL, 248503, 80, 89, '202120991530', NULL, NULL, 2022, '2022-10-12 10:00:00.000');
INSERT INTO `lote` (`id`, `created_by`, `created_at`, `id_genotipo`, `cod_lote`, `fase`, `id_dados`, `id_s2`, `id_safra`, `ncc`, `peso`, `quant_sementes`, `year`, `dt_export`) VALUES
(363, 2, '2022-10-28 12:36:18.514', 261, '110000000875', NULL, 875, 1, 89, '202114285311', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(364, 2, '2022-10-28 12:36:18.542', 261, '110000000876', NULL, 876, 2, 89, '202114285312', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(365, 2, '2022-10-28 12:36:18.572', 261, '110000000877', NULL, 877, 3, 89, '202114285321', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(366, 2, '2022-10-28 12:36:18.598', 261, '110000000878', NULL, 878, 4, 89, '202114285322', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(367, 2, '2022-10-28 12:36:18.624', 261, '110000002577', NULL, 2577, 5, 89, '202120994833', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(368, 2, '2022-10-28 12:36:18.651', 261, '110000002578', NULL, 2578, 6, 89, '202120994834', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(369, 2, '2022-10-28 12:36:18.679', 261, '110000002579', NULL, 2579, 7, 89, '202120994841', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(370, 2, '2022-10-28 12:36:18.707', 261, '110000002580', NULL, 2580, 8, 89, '202120994842', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(371, 2, '2022-10-28 12:36:18.738', 261, '110000002581', NULL, 2581, 9, 89, '202120994855', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(372, 2, '2022-10-28 12:36:18.766', 261, '110000002582', NULL, 2582, 10, 89, '202120994856', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(373, 2, '2022-10-28 12:36:18.794', 261, '110000002583', NULL, 2583, 11, 89, '202120994857', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(374, 2, '2022-10-28 12:36:18.823', 261, '110000002584', NULL, 2584, 12, 89, '202120994858', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(375, 2, '2022-10-28 12:36:18.850', 261, '110000002585', NULL, 2585, 13, 89, '202120994871', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(376, 2, '2022-10-28 12:36:18.877', 261, '110000002586', NULL, 2586, 14, 89, '202120994872', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(377, 2, '2022-10-28 12:36:18.905', 262, '110000000938', NULL, 938, 1, 89, '202114285271', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(378, 2, '2022-10-28 12:36:18.943', 262, '110000000939', NULL, 939, 2, 89, '202114285272', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(379, 2, '2022-10-28 12:36:18.972', 262, '110000000940', NULL, 940, 3, 89, '202114285281', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(380, 2, '2022-10-28 12:36:19.004', 262, '110000000941', NULL, 941, 4, 89, '202114285282', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(381, 2, '2022-10-28 12:36:19.034', 262, '110000002599', NULL, 2599, 5, 89, '202120990001', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(382, 2, '2022-10-28 12:36:19.063', 262, '110000002600', NULL, 2600, 6, 89, '202120990002', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(383, 2, '2022-10-28 12:36:19.093', 262, '110000002601', NULL, 2601, 7, 89, '202120990003', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(384, 2, '2022-10-28 12:36:19.122', 262, '110000002602', NULL, 2602, 8, 89, '202120990004', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(385, 2, '2022-10-28 12:36:19.151', 262, '110000002603', NULL, 2603, 9, 89, '202120990005', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(386, 2, '2022-10-28 12:36:19.178', 262, '110000002604', NULL, 2604, 10, 89, '202120990006', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(387, 2, '2022-10-28 12:36:19.206', 262, '110000002605', NULL, 2605, 11, 89, '202120990007', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(388, 2, '2022-10-28 12:36:19.234', 262, '110000002606', NULL, 2606, 12, 89, '202120990008', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(389, 2, '2022-10-28 12:36:19.261', 262, '110000002607', NULL, 2607, 13, 89, '202120994873', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(390, 2, '2022-10-28 12:36:19.289', 262, '110000002608', NULL, 2608, 14, 89, '202120994874', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(391, 2, '2022-10-28 12:36:19.315', 262, '110000002609', NULL, 2609, 15, 89, '202120994901', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(392, 2, '2022-10-28 12:36:19.346', 262, '110000002610', NULL, 2610, 16, 89, '202120994902', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(393, 2, '2022-10-28 12:36:19.374', 262, '110000002611', NULL, 2611, 17, 89, '202120994913', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(394, 2, '2022-10-28 12:36:19.403', 262, '110000002612', NULL, 2612, 18, 89, '202120994914', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(395, 2, '2022-10-28 12:36:19.433', 262, '110000002613', NULL, 2613, 19, 89, '202120994915', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(396, 2, '2022-10-28 12:36:19.461', 262, '110000002614', NULL, 2614, 20, 89, '202120994916', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(397, 2, '2022-10-28 12:36:19.487', 262, '110000002615', NULL, 2615, 21, 89, '202120994927', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(398, 2, '2022-10-28 12:36:19.516', 262, '110000002616', NULL, 2616, 22, 89, '202120994928', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(399, 2, '2022-10-28 12:36:19.546', 262, '110000002617', NULL, 2617, 23, 89, '202120994929', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(400, 2, '2022-10-28 12:36:19.575', 262, '110000002618', NULL, 2618, 24, 89, '202120994930', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(401, 2, '2022-10-28 12:36:19.602', 262, '110000002619', NULL, 2619, 25, 89, '202120994936', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(402, 2, '2022-10-28 12:36:19.631', 262, '110000002620', NULL, 2620, 26, 89, '202120994937', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(403, 2, '2022-10-28 12:36:19.659', 262, '110000002621', NULL, 2621, 27, 89, '202120994943', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(404, 2, '2022-10-28 12:36:19.686', 262, '110000002622', NULL, 2622, 28, 89, '202120994944', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(405, 2, '2022-10-28 12:36:19.710', 263, '110000001857', NULL, 1857, 1, 89, '202114285251', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(406, 2, '2022-10-28 12:36:19.736', 263, '110000001858', NULL, 1858, 2, 89, '202114285252', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(407, 2, '2022-10-28 12:36:19.760', 263, '110000001859', NULL, 1859, 3, 89, '202114285261', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(408, 2, '2022-10-28 12:36:19.786', 263, '110000001860', NULL, 1860, 4, 89, '202114285262', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(409, 2, '2022-10-28 12:36:19.808', 263, '110000003592', NULL, 3592, 5, 89, '202120987028', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(410, 2, '2022-10-28 12:36:19.834', 263, '110000003593', NULL, 3593, 6, 89, '202120987029', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(411, 2, '2022-10-28 12:36:19.860', 263, '110000003594', NULL, 3594, 7, 89, '202120987030', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(412, 2, '2022-10-28 12:36:19.885', 263, '110000003595', NULL, 3595, 8, 89, '202120995036', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(413, 2, '2022-10-28 12:36:19.910', 263, '110000003596', NULL, 3596, 9, 89, '202120995037', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(414, 2, '2022-10-28 12:36:19.937', 263, '110000003597', NULL, 3597, 10, 89, '202120995048', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(415, 2, '2022-10-28 12:36:19.963', 263, '110000003598', NULL, 3598, 11, 89, '202120995049', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(416, 2, '2022-10-28 12:36:19.990', 263, '110000003599', NULL, 3599, 12, 89, '202120995050', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(417, 2, '2022-10-28 12:36:20.018', 263, '110000003600', NULL, 3600, 13, 89, '202120995051', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(418, 2, '2022-10-28 12:36:20.045', 263, '110000003601', NULL, 3601, 14, 89, '202120995062', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(419, 2, '2022-10-28 12:36:20.073', 263, '110000003602', NULL, 3602, 15, 89, '202120995063', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(420, 2, '2022-10-28 12:36:20.101', 263, '110000003603', NULL, 3603, 16, 89, '202120995064', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(421, 2, '2022-10-28 12:36:20.132', 263, '110000003604', NULL, 3604, 17, 89, '202120995065', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(422, 2, '2022-10-28 12:36:20.159', 263, '110000003605', NULL, 3605, 18, 89, '202120995101', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(423, 2, '2022-10-28 12:36:20.187', 263, '110000003606', NULL, 3606, 19, 89, '202120995102', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(424, 2, '2022-10-28 12:36:20.215', 263, '110000003607', NULL, 3607, 20, 89, '202120995111', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(425, 2, '2022-10-28 12:36:20.244', 263, '110000003608', NULL, 3608, 21, 89, '202120995112', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(426, 2, '2022-10-28 12:36:20.274', 263, '110000003609', NULL, 3609, 22, 89, '202120995113', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(427, 2, '2022-10-28 12:36:20.302', 263, '110000003610', NULL, 3610, 23, 89, '202120995114', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(428, 2, '2022-10-28 12:36:20.331', 263, '110000003611', NULL, 3611, 24, 89, '202120995123', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(429, 2, '2022-10-28 12:36:20.361', 263, '110000003612', NULL, 3612, 25, 89, '202120995124', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(430, 2, '2022-10-28 12:36:20.389', 263, '110000003613', NULL, 3613, 26, 89, '202120995125', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(431, 2, '2022-10-28 12:36:20.418', 263, '110000003614', NULL, 3614, 27, 89, '202120995126', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(432, 2, '2022-10-28 12:36:20.447', 263, '110000003615', NULL, 3615, 28, 89, '202120995131', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(433, 2, '2022-10-28 12:36:20.476', 263, '110000003616', NULL, 3616, 29, 89, '202120995132', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(434, 2, '2022-10-28 12:36:20.505', 263, '110000003617', NULL, 3617, 30, 89, '202120995141', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(435, 2, '2022-10-28 12:36:20.534', 263, '110000003618', NULL, 3618, 31, 89, '202120995142', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(436, 2, '2022-10-28 12:36:20.566', 263, '110000003619', NULL, 3619, 32, 89, '202120995143', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(437, 2, '2022-10-28 12:36:20.595', 263, '110000003620', NULL, 3620, 33, 89, '202120995144', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(438, 2, '2022-10-28 12:36:20.624', 263, '110000003621', NULL, 3621, 34, 89, '202120995153', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(439, 2, '2022-10-28 12:36:20.654', 263, '110000003622', NULL, 3622, 35, 89, '202120995154', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(440, 2, '2022-10-28 12:36:20.686', 263, '110000003623', NULL, 3623, 36, 89, '202120995155', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(441, 2, '2022-10-28 12:36:20.718', 263, '110000003624', NULL, 3624, 37, 89, '202120995156', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(442, 2, '2022-10-28 12:36:20.748', 263, '110000010315', NULL, 10315, 38, 89, '202120702848', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(443, 2, '2022-10-28 12:36:20.779', 263, '110000189642', NULL, 189642, 39, 89, '202102022213', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(444, 2, '2022-10-28 12:36:20.804', 264, '110000001991', NULL, 1991, 1, 89, '202114250161', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(445, 2, '2022-10-28 12:36:20.831', 264, '110000001992', NULL, 1992, 2, 89, '202114250162', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(446, 2, '2022-10-28 12:36:20.857', 264, '110000001993', NULL, 1993, 3, 89, '202114250163', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(447, 2, '2022-10-28 12:36:20.883', 264, '110000001994', NULL, 1994, 4, 89, '202114250171', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(448, 2, '2022-10-28 12:36:20.910', 264, '110000001995', NULL, 1995, 5, 89, '202114250172', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(449, 2, '2022-10-28 12:36:20.938', 264, '110000001996', NULL, 1996, 6, 89, '202114250173', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(450, 2, '2022-10-28 12:36:20.967', 264, '110000001997', NULL, 1997, 7, 89, '202114250181', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(451, 2, '2022-10-28 12:36:20.993', 264, '110000001998', NULL, 1998, 8, 89, '202114250182', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(452, 2, '2022-10-28 12:36:21.019', 264, '110000001999', NULL, 1999, 9, 89, '202114250183', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(453, 2, '2022-10-28 12:36:21.045', 264, '110000002000', NULL, 2000, 10, 89, '202114250191', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(454, 2, '2022-10-28 12:36:21.074', 264, '110000002001', NULL, 2001, 11, 89, '202114250192', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(455, 2, '2022-10-28 12:36:21.099', 264, '110000002002', NULL, 2002, 12, 89, '202114250193', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(456, 2, '2022-10-28 12:36:21.127', 264, '110000002003', NULL, 2003, 13, 89, '202114250201', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(457, 2, '2022-10-28 12:36:21.155', 264, '110000002004', NULL, 2004, 14, 89, '202114250202', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(458, 2, '2022-10-28 12:36:21.180', 264, '110000002005', NULL, 2005, 15, 89, '202114250203', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(459, 2, '2022-10-28 12:36:21.207', 264, '110000002006', NULL, 2006, 16, 89, '202114250211', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(460, 2, '2022-10-28 12:36:21.236', 264, '110000002007', NULL, 2007, 17, 89, '202114250212', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(461, 2, '2022-10-28 12:36:21.265', 264, '110000002008', NULL, 2008, 18, 89, '202114250213', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(462, 2, '2022-10-28 12:36:21.294', 264, '110000002009', NULL, 2009, 19, 89, '202114250221', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(463, 2, '2022-10-28 12:36:21.324', 264, '110000002010', NULL, 2010, 20, 89, '202114250222', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(464, 2, '2022-10-28 12:36:21.354', 264, '110000002011', NULL, 2011, 21, 89, '202114250223', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(465, 2, '2022-10-28 12:36:21.385', 264, '110000002012', NULL, 2012, 22, 89, '202114250231', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(466, 2, '2022-10-28 12:36:21.416', 264, '110000002013', NULL, 2013, 23, 89, '202114250232', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(467, 2, '2022-10-28 12:36:21.465', 264, '110000002014', NULL, 2014, 24, 89, '202114250233', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(468, 2, '2022-10-28 12:36:21.497', 264, '110000002015', NULL, 2015, 25, 89, '202114250241', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(469, 2, '2022-10-28 12:36:21.527', 264, '110000002016', NULL, 2016, 26, 89, '202114250242', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(470, 2, '2022-10-28 12:36:21.557', 264, '110000002017', NULL, 2017, 27, 89, '202114250243', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(471, 2, '2022-10-28 12:36:21.588', 264, '110000002018', NULL, 2018, 28, 89, '202114250251', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(472, 2, '2022-10-28 12:36:21.617', 264, '110000002019', NULL, 2019, 29, 89, '202114250252', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(473, 2, '2022-10-28 12:36:21.646', 264, '110000002020', NULL, 2020, 30, 89, '202114250253', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(474, 2, '2022-10-28 12:36:21.676', 264, '110000002021', NULL, 2021, 31, 89, '202114250261', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(475, 2, '2022-10-28 12:36:21.706', 264, '110000002022', NULL, 2022, 32, 89, '202114250262', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(476, 2, '2022-10-28 12:36:21.735', 264, '110000002023', NULL, 2023, 33, 89, '202114250263', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(477, 2, '2022-10-28 12:36:21.763', 264, '110000002024', NULL, 2024, 34, 89, '202114250271', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(478, 2, '2022-10-28 12:36:21.791', 264, '110000002025', NULL, 2025, 35, 89, '202114250272', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(479, 2, '2022-10-28 12:36:21.819', 264, '110000002026', NULL, 2026, 36, 89, '202114250273', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(480, 2, '2022-10-28 12:36:21.849', 264, '110000002027', NULL, 2027, 37, 89, '202114250281', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(481, 2, '2022-10-28 12:36:21.878', 264, '110000002028', NULL, 2028, 38, 89, '202114250282', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(482, 2, '2022-10-28 12:36:21.907', 264, '110000002029', NULL, 2029, 39, 89, '202114250283', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(483, 2, '2022-10-28 12:36:21.937', 264, '110000002030', NULL, 2030, 40, 89, '202114250291', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(484, 2, '2022-10-28 12:36:21.967', 264, '110000002031', NULL, 2031, 41, 89, '202114250292', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(485, 2, '2022-10-28 12:36:21.995', 264, '110000002032', NULL, 2032, 42, 89, '202114250293', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(486, 2, '2022-10-28 12:36:22.025', 264, '110000002033', NULL, 2033, 43, 89, '202114250301', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(487, 2, '2022-10-28 12:36:22.055', 264, '110000002034', NULL, 2034, 44, 89, '202114250302', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(488, 2, '2022-10-28 12:36:22.084', 264, '110000002035', NULL, 2035, 45, 89, '202114250303', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(489, 2, '2022-10-28 12:36:22.114', 264, '110000002036', NULL, 2036, 46, 89, '202114288391', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(490, 2, '2022-10-28 12:36:22.145', 264, '110000002037', NULL, 2037, 47, 89, '202114288392', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(491, 2, '2022-10-28 12:36:22.174', 264, '110000002038', NULL, 2038, 48, 89, '202114288401', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(492, 2, '2022-10-28 12:36:22.203', 264, '110000002039', NULL, 2039, 49, 89, '202114288402', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(493, 2, '2022-10-28 12:36:22.232', 264, '110000002040', NULL, 2040, 50, 89, '202114289271', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(494, 2, '2022-10-28 12:36:22.262', 264, '110000002041', NULL, 2041, 51, 89, '202114289272', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(495, 2, '2022-10-28 12:36:22.290', 264, '110000002042', NULL, 2042, 52, 89, '202114289281', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(496, 2, '2022-10-28 12:36:22.319', 264, '110000002043', NULL, 2043, 53, 89, '202114289282', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(497, 2, '2022-10-28 12:36:22.351', 264, '110000002044', NULL, 2044, 54, 89, '202114289291', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(498, 2, '2022-10-28 12:36:22.381', 264, '110000002045', NULL, 2045, 55, 89, '202114289292', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(499, 2, '2022-10-28 12:36:22.410', 264, '110000002046', NULL, 2046, 56, 89, '202114289301', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(500, 2, '2022-10-28 12:36:22.440', 264, '110000002047', NULL, 2047, 57, 89, '202114289302', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(501, 2, '2022-10-28 12:36:22.471', 264, '110000002048', NULL, 2048, 58, 89, '202114289311', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(502, 2, '2022-10-28 12:36:22.501', 264, '110000002049', NULL, 2049, 59, 89, '202114289312', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(503, 2, '2022-10-28 12:36:22.532', 264, '110000002050', NULL, 2050, 60, 89, '202114289321', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(504, 2, '2022-10-28 12:36:22.564', 264, '110000002051', NULL, 2051, 61, 89, '202114289322', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(505, 2, '2022-10-28 12:36:22.597', 264, '110000003712', NULL, 3712, 62, 89, '202120990421', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(506, 2, '2022-10-28 12:36:22.627', 264, '110000003713', NULL, 3713, 63, 89, '202120990422', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(507, 2, '2022-10-28 12:36:22.658', 264, '110000003714', NULL, 3714, 64, 89, '202120990423', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(508, 2, '2022-10-28 12:36:22.689', 264, '110000003715', NULL, 3715, 65, 89, '202120990424', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(509, 2, '2022-10-28 12:36:22.721', 264, '110000003716', NULL, 3716, 66, 89, '202120990425', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(510, 2, '2022-10-28 12:36:22.753', 264, '110000003717', NULL, 3717, 67, 89, '202120990426', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(511, 2, '2022-10-28 12:36:22.786', 264, '110000003718', NULL, 3718, 68, 89, '202120990427', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(512, 2, '2022-10-28 12:36:22.818', 264, '110000003719', NULL, 3719, 69, 89, '202120990428', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(513, 2, '2022-10-28 12:36:22.852', 264, '110000003720', NULL, 3720, 70, 89, '202120990429', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(514, 2, '2022-10-28 12:36:22.884', 264, '110000003721', NULL, 3721, 71, 89, '202120990430', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(515, 2, '2022-10-28 12:36:22.915', 264, '110000003722', NULL, 3722, 72, 89, '202120990431', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(516, 2, '2022-10-28 12:36:22.947', 264, '110000003723', NULL, 3723, 73, 89, '202120990432', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(517, 2, '2022-10-28 12:36:22.978', 264, '110000003724', NULL, 3724, 74, 89, '202120990501', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(518, 2, '2022-10-28 12:36:23.010', 264, '110000003725', NULL, 3725, 75, 89, '202120990502', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(519, 2, '2022-10-28 12:36:23.054', 264, '110000010323', NULL, 10323, 76, 89, '202120702903', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(520, 2, '2022-10-28 12:36:23.086', 264, '110000189643', NULL, 189643, 77, 89, '202102022218', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(521, 2, '2022-10-28 12:36:23.114', 265, '110000002513', NULL, 2513, 1, 89, '202120993906', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(522, 2, '2022-10-28 12:36:23.140', 265, '110000002514', NULL, 2514, 2, 89, '202120993907', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(523, 2, '2022-10-28 12:36:23.165', 265, '110000002515', NULL, 2515, 3, 89, '202120993908', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(524, 2, '2022-10-28 12:36:23.189', 265, '110000002516', NULL, 2516, 4, 89, '202120993909', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(525, 2, '2022-10-28 12:36:23.215', 265, '110000002517', NULL, 2517, 5, 89, '202120993910', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(526, 2, '2022-10-28 12:36:23.241', 265, '110000002518', NULL, 2518, 6, 89, '202120993911', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(527, 2, '2022-10-28 12:36:23.267', 265, '110000002519', NULL, 2519, 7, 89, '202120993912', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(528, 2, '2022-10-28 12:36:23.294', 265, '110000002520', NULL, 2520, 8, 89, '202120993913', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(529, 2, '2022-10-28 12:36:23.322', 265, '110000002521', NULL, 2521, 9, 89, '202120993914', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(530, 2, '2022-10-28 12:36:23.348', 265, '110000002522', NULL, 2522, 10, 89, '202120993915', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(531, 2, '2022-10-28 12:36:23.375', 265, '110000002523', NULL, 2523, 11, 89, '202120993916', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(532, 2, '2022-10-28 12:36:23.402', 265, '110000002524', NULL, 2524, 12, 89, '202120993917', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(533, 2, '2022-10-28 12:36:23.428', 265, '110000002525', NULL, 2525, 13, 89, '202120993918', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(534, 2, '2022-10-28 12:36:23.457', 265, '110000002526', NULL, 2526, 14, 89, '202120993919', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(535, 2, '2022-10-28 12:36:23.484', 265, '110000002527', NULL, 2527, 15, 89, '202120993920', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(536, 2, '2022-10-28 12:36:23.512', 265, '110000002528', NULL, 2528, 16, 89, '202120993921', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(537, 2, '2022-10-28 12:36:23.538', 265, '110000002529', NULL, 2529, 17, 89, '202120993922', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(538, 2, '2022-10-28 12:36:23.570', 265, '110000002530', NULL, 2530, 18, 89, '202120993923', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(539, 2, '2022-10-28 12:36:23.596', 265, '110000002531', NULL, 2531, 19, 89, '202120993924', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(540, 2, '2022-10-28 12:36:23.622', 265, '110000002532', NULL, 2532, 20, 89, '202120993925', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(541, 2, '2022-10-28 12:36:23.649', 265, '110000002533', NULL, 2533, 21, 89, '202120993926', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(542, 2, '2022-10-28 12:36:23.675', 265, '110000002534', NULL, 2534, 22, 89, '202120993927', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(543, 2, '2022-10-28 12:36:23.703', 265, '110000002535', NULL, 2535, 23, 89, '202120993928', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(544, 2, '2022-10-28 12:36:23.731', 265, '110000002536', NULL, 2536, 24, 89, '202120993929', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(545, 2, '2022-10-28 12:36:23.760', 265, '110000002537', NULL, 2537, 25, 89, '202120993930', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(546, 2, '2022-10-28 12:36:23.789', 265, '110000002538', NULL, 2538, 26, 89, '202120993931', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(547, 2, '2022-10-28 12:36:23.817', 265, '110000002539', NULL, 2539, 27, 89, '202120993932', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(548, 2, '2022-10-28 12:36:23.845', 265, '110000002540', NULL, 2540, 28, 89, '202120993933', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(549, 2, '2022-10-28 12:36:23.872', 265, '110000002541', NULL, 2541, 29, 89, '202120993934', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(550, 2, '2022-10-28 12:36:23.899', 265, '110000002542', NULL, 2542, 30, 89, '202120993935', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(551, 2, '2022-10-28 12:36:23.928', 265, '110000002543', NULL, 2543, 31, 89, '202120993936', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(552, 2, '2022-10-28 12:36:23.958', 265, '110000002544', NULL, 2544, 32, 89, '202120993938', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(553, 2, '2022-10-28 12:36:23.988', 265, '110000002545', NULL, 2545, 33, 89, '202120993939', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(554, 2, '2022-10-28 12:36:24.017', 265, '110000002546', NULL, 2546, 34, 89, '202120993940', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(555, 2, '2022-10-28 12:36:24.047', 265, '110000002547', NULL, 2547, 35, 89, '202120993941', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(556, 2, '2022-10-28 12:36:24.077', 265, '110000002548', NULL, 2548, 36, 89, '202120993942', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(557, 2, '2022-10-28 12:36:24.107', 265, '110000002549', NULL, 2549, 37, 89, '202120993943', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(558, 2, '2022-10-28 12:36:24.137', 265, '110000002550', NULL, 2550, 38, 89, '202120993944', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(559, 2, '2022-10-28 12:36:24.166', 265, '110000002551', NULL, 2551, 39, 89, '202120993945', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(560, 2, '2022-10-28 12:36:24.193', 265, '110000002552', NULL, 2552, 40, 89, '202120993946', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(561, 2, '2022-10-28 12:36:24.221', 265, '110000002553', NULL, 2553, 41, 89, '202120993947', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(562, 2, '2022-10-28 12:36:24.249', 265, '110000002554', NULL, 2554, 42, 89, '202120993948', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(563, 2, '2022-10-28 12:36:24.277', 265, '110000002555', NULL, 2555, 43, 89, '202120993949', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(564, 2, '2022-10-28 12:36:24.305', 265, '110000002556', NULL, 2556, 44, 89, '202120993950', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(565, 2, '2022-10-28 12:36:24.336', 265, '110000002557', NULL, 2557, 45, 89, '202120994001', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(566, 2, '2022-10-28 12:36:24.366', 265, '110000002558', NULL, 2558, 46, 89, '202120994002', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(567, 2, '2022-10-28 12:36:24.396', 265, '110000002559', NULL, 2559, 47, 89, '202120994003', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(568, 2, '2022-10-28 12:36:24.426', 265, '110000002560', NULL, 2560, 48, 89, '202120994004', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(569, 2, '2022-10-28 12:36:24.459', 265, '110000002561', NULL, 2561, 49, 89, '202120994005', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(570, 2, '2022-10-28 12:36:24.489', 265, '110000002562', NULL, 2562, 50, 89, '202120994006', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(571, 2, '2022-10-28 12:36:24.518', 265, '110000002563', NULL, 2563, 51, 89, '202120994007', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(572, 2, '2022-10-28 12:36:24.549', 265, '110000002564', NULL, 2564, 52, 89, '202120994008', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(573, 2, '2022-10-28 12:36:24.580', 265, '110000002565', NULL, 2565, 53, 89, '202120994009', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(574, 2, '2022-10-28 12:36:24.610', 265, '110000002566', NULL, 2566, 54, 89, '202120994010', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(575, 2, '2022-10-28 12:36:24.641', 265, '110000002567', NULL, 2567, 55, 89, '202120994011', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(576, 2, '2022-10-28 12:36:24.671', 265, '110000002568', NULL, 2568, 56, 89, '202120994012', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(577, 2, '2022-10-28 12:36:24.701', 265, '110000002569', NULL, 2569, 57, 89, '202120994013', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(578, 2, '2022-10-28 12:36:24.731', 265, '110000002570', NULL, 2570, 58, 89, '202120994014', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(579, 2, '2022-10-28 12:36:24.761', 265, '110000002571', NULL, 2571, 59, 89, '202120994015', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(580, 2, '2022-10-28 12:36:24.819', 265, '110000002572', NULL, 2572, 60, 89, '202120994016', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(581, 2, '2022-10-28 12:36:24.866', 266, '110000003819', 'VCU2', 3819, 1, 89, '202120993138', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(582, 2, '2022-10-28 12:36:24.897', 266, '110000003820', 'VCU2', 3820, 2, 89, '202120993139', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(583, 2, '2022-10-28 12:36:24.923', 266, '110000003821', 'VCU2', 3821, 3, 89, '202120993140', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(584, 2, '2022-10-28 12:36:24.968', 266, '110000003822', 'VCU2', 3822, 4, 89, '202120993141', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(585, 2, '2022-10-28 12:36:24.992', 267, '110000016338', 'INT', 16338, 1, 89, '202120724873', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(586, 2, '2022-10-28 12:36:25.018', 268, '110000016344', 'INT', 16344, 1, 89, '202120724872', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(587, 2, '2022-10-28 12:36:25.048', 269, '110000016352', 'INT', 16352, 1, 89, '202120724884', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(588, 2, '2022-10-28 12:36:25.076', 270, '110000016356', 'INT', 16356, 1, 89, '202120724885', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(589, 2, '2022-10-28 12:36:25.104', 271, '110000016361', 'INT', 16361, 1, 89, '202120724878', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(590, 2, '2022-10-28 12:36:25.136', 272, '110000016362', 'INT', 16362, 1, 89, '202120724877', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(591, 2, '2022-10-28 12:36:25.170', 273, '110000016363', 'INT', 16363, 1, 89, '202120724875', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(592, 2, '2022-10-28 12:36:25.199', 274, '110000016364', 'INT', 16364, 1, 89, '202120724874', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(593, 2, '2022-10-28 12:36:25.227', 275, '110000016365', 'INT', 16365, 1, 89, '202120724876', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(594, 2, '2022-10-28 12:36:25.252', 276, '110000017578', 'INT', 17578, 1, 89, '202120726101', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(595, 2, '2022-10-28 12:36:25.286', 277, '110000017579', 'INT', 17579, 1, 89, '202120726102', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(596, 2, '2022-10-28 12:36:25.321', 278, '110000017580', 'INT', 17580, 1, 89, '202120726103', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(597, 2, '2022-10-28 12:36:25.356', 279, '110000017581', 'INT', 17581, 1, 89, '202120726104', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(598, 2, '2022-10-28 12:36:25.400', 280, '110000017582', 'INT', 17582, 1, 89, '202120726105', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(599, 2, '2022-10-28 12:36:25.427', 281, '110000017583', 'INT', 17583, 1, 89, '202120726106', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(600, 2, '2022-10-28 12:36:25.451', 282, '110000017584', 'INT', 17584, 1, 89, '202120726107', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(601, 2, '2022-10-28 12:36:25.481', 283, '110000017585', 'INT', 17585, 1, 89, '202120726108', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(602, 2, '2022-10-28 12:36:25.508', 284, '110000017586', 'INT', 17586, 1, 89, '202120726109', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(603, 2, '2022-10-28 12:36:25.560', 285, '110000017587', 'INT', 17587, 1, 89, '202120726110', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(604, 2, '2022-10-28 12:36:25.592', 286, '110000017588', 'INT', 17588, 1, 89, '202120726111', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(605, 2, '2022-10-28 12:36:25.618', 287, '110000017589', 'INT', 17589, 1, 89, '202120726112', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(606, 2, '2022-10-28 12:36:25.648', 288, '110000017590', 'INT', 17590, 1, 89, '202120726113', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(607, 2, '2022-10-28 12:36:25.696', 289, '110000017591', 'INT', 17591, 1, 89, '202120726114', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(608, 2, '2022-10-28 12:36:25.750', 290, '110000017592', 'INT', 17592, 1, 89, '202120726115', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(609, 2, '2022-10-28 12:36:25.807', 291, '110000017593', 'INT', 17593, 1, 89, '202120726116', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(610, 2, '2022-10-28 12:36:25.832', 292, '110000017594', 'INT', 17594, 1, 89, '202120726117', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(611, 2, '2022-10-28 12:36:25.858', 293, '110000017595', 'INT', 17595, 1, 89, '202120726118', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(612, 2, '2022-10-28 12:36:25.894', 294, '110000017597', 'INT', 17597, 1, 89, '202120726120', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(613, 2, '2022-10-28 12:36:25.930', 295, '110000017598', 'INT', 17598, 1, 89, '202120726121', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(614, 2, '2022-10-28 12:36:25.964', 296, '110000017599', 'INT', 17599, 1, 89, '202120726122', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(615, 2, '2022-10-28 12:36:25.995', 297, '110000017600', 'INT', 17600, 1, 89, '202120726123', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(616, 2, '2022-10-28 12:36:26.030', 298, '110000017601', 'INT', 17601, 1, 89, '202120726124', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(617, 2, '2022-10-28 12:36:26.079', 299, '110000017602', 'INT', 17602, 1, 89, '202120726125', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(618, 2, '2022-10-28 12:36:26.111', 300, '110000017603', 'INT', 17603, 1, 89, '202120726126', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(619, 2, '2022-10-28 12:36:26.136', 301, '110000017604', 'INT', 17604, 1, 89, '202120726127', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(620, 2, '2022-10-28 12:36:26.165', 302, '110000017605', 'INT', 17605, 1, 89, '202120726128', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(621, 2, '2022-10-28 12:36:26.194', 303, '110000017606', 'INT', 17606, 1, 89, '202120726129', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(622, 2, '2022-10-28 12:36:26.242', 304, '110000017608', 'INT', 17608, 1, 89, '202120726131', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(623, 2, '2022-10-28 12:36:26.276', 305, '110000017609', 'INT', 17609, 1, 89, '202120726132', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(624, 2, '2022-10-28 12:36:26.304', 306, '110000017610', 'INT', 17610, 1, 89, '202120726133', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(625, 2, '2022-10-28 12:36:26.330', 307, '110000017611', 'INT', 17611, 1, 89, '202120726134', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(626, 2, '2022-10-28 12:36:26.360', 308, '110000017612', 'INT', 17612, 1, 89, '202120726135', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(627, 2, '2022-10-28 12:36:26.389', 309, '110000017613', 'INT', 17613, 1, 89, '202120726136', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(628, 2, '2022-10-28 12:36:26.419', 310, '110000017614', 'INT', 17614, 1, 89, '202120726137', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(629, 2, '2022-10-28 12:36:26.443', 311, '110000017615', 'INT', 17615, 1, 89, '202120726138', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(630, 2, '2022-10-28 12:36:26.480', 312, '110000017616', 'INT', 17616, 1, 89, '202120726139', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(631, 2, '2022-10-28 12:36:26.513', 313, '110000017617', 'INT', 17617, 1, 89, '202120726140', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(632, 2, '2022-10-28 12:36:26.544', 314, '110000017618', 'INT', 17618, 1, 89, '202120726141', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(633, 2, '2022-10-28 12:36:26.573', 315, '110000017619', 'INT', 17619, 1, 89, '202120726142', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(634, 2, '2022-10-28 12:36:26.607', 316, '110000017621', 'INT', 17621, 1, 89, '202120726144', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(635, 2, '2022-10-28 12:36:26.634', 317, '110000017622', 'INT', 17622, 1, 89, '202120726145', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(636, 2, '2022-10-28 12:36:26.663', 318, '110000017623', 'INT', 17623, 1, 89, '202120726146', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(637, 2, '2022-10-28 12:36:26.700', 319, '110000017624', 'INT', 17624, 1, 89, '202120726147', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(638, 2, '2022-10-28 12:36:26.736', 320, '110000017625', 'INT', 17625, 1, 89, '202120726148', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(639, 2, '2022-10-28 12:36:26.773', 321, '110000017626', 'INT', 17626, 1, 89, '202120726149', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(640, 2, '2022-10-28 12:36:26.803', 322, '110000017627', 'INT', 17627, 1, 89, '202120726150', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(641, 2, '2022-10-28 12:36:26.830', 323, '110000017628', 'INT', 17628, 1, 89, '202120726151', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(642, 2, '2022-10-28 12:36:26.865', 324, '110000017629', 'INT', 17629, 1, 89, '202120726152', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(643, 2, '2022-10-28 12:36:26.899', 325, '110000017631', 'INT', 17631, 1, 89, '202120726154', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(644, 2, '2022-10-28 12:36:26.930', 326, '110000017632', 'INT', 17632, 1, 89, '202120726155', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(645, 2, '2022-10-28 12:36:26.961', 327, '110000017633', 'INT', 17633, 1, 89, '202120726156', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(646, 2, '2022-10-28 12:36:26.994', 328, '110000017636', 'INT', 17636, 1, 89, '202120726159', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(647, 2, '2022-10-28 12:36:27.035', 329, '110000017638', 'INT', 17638, 1, 89, '202120726162', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(648, 2, '2022-10-28 12:36:27.368', 330, '110000017639', 'INT', 17639, 1, 89, '202120726163', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(649, 2, '2022-10-28 12:36:27.414', 331, '110000017640', 'INT', 17640, 1, 89, '202120726164', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(650, 2, '2022-10-28 12:36:27.443', 332, '110000017642', 'INT', 17642, 1, 89, '202120726166', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(651, 2, '2022-10-28 12:36:27.473', 333, '110000017643', 'INT', 17643, 1, 89, '202120726167', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(652, 2, '2022-10-28 12:36:27.499', 334, '110000017644', 'INT', 17644, 1, 89, '202120726168', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(653, 2, '2022-10-28 12:36:27.524', 335, '110000017645', 'INT', 17645, 1, 89, '202120726169', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(654, 2, '2022-10-28 12:36:27.557', 336, '110000017646', 'INT', 17646, 1, 89, '202120724801', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(655, 2, '2022-10-28 12:36:27.634', 337, '110000017647', 'INT', 17647, 1, 89, '202120724802', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(656, 2, '2022-10-28 12:36:27.668', 338, '110000017648', 'INT', 17648, 1, 89, '202120724803', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(657, 2, '2022-10-28 12:36:27.702', 339, '110000017649', 'INT', 17649, 1, 89, '202120724804', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(658, 2, '2022-10-28 12:36:27.729', 340, '110000017650', 'INT', 17650, 1, 89, '202120724805', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(659, 2, '2022-10-28 12:36:27.752', 341, '110000017651', 'INT', 17651, 1, 89, '202120724806', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(660, 2, '2022-10-28 12:36:27.795', 342, '110000017652', 'INT', 17652, 1, 89, '202120724807', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(661, 2, '2022-10-28 12:36:27.841', 343, '110000017653', 'INT', 17653, 1, 89, '202120724808', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(662, 2, '2022-10-28 12:36:27.867', 344, '110000017654', 'INT', 17654, 1, 89, '202120724809', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(663, 2, '2022-10-28 12:36:27.894', 345, '110000017655', 'INT', 17655, 1, 89, '202120724810', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(664, 2, '2022-10-28 12:36:27.927', 346, '110000017656', 'INT', 17656, 1, 89, '202120724811', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(665, 2, '2022-10-28 12:36:27.961', 347, '110000017657', 'INT', 17657, 1, 89, '202120724812', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(666, 2, '2022-10-28 12:36:27.989', 348, '110000017658', 'INT', 17658, 1, 89, '202120724813', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(667, 2, '2022-10-28 12:36:28.021', 349, '110000017659', 'INT', 17659, 1, 89, '202120724814', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(668, 2, '2022-10-28 12:36:28.046', 350, '110000017660', 'INT', 17660, 1, 89, '202120724815', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(669, 2, '2022-10-28 12:36:28.071', 351, '110000017662', 'INT', 17662, 1, 89, '202120725202', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(670, 2, '2022-10-28 12:36:28.097', 352, '110000017663', 'INT', 17663, 1, 89, '202120725203', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(671, 2, '2022-10-28 12:36:28.125', 353, '110000017664', 'INT', 17664, 1, 89, '202120725204', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(672, 2, '2022-10-28 12:36:28.149', 354, '110000017665', 'INT', 17665, 1, 89, '202120725205', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(673, 2, '2022-10-28 12:36:28.177', 355, '110000017666', 'INT', 17666, 1, 89, '202120725206', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(674, 2, '2022-10-28 12:36:28.203', 356, '110000017668', 'INT', 17668, 1, 89, '202120725208', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(675, 2, '2022-10-28 12:36:28.228', 357, '110000017669', 'INT', 17669, 1, 89, '202120725209', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(676, 2, '2022-10-28 12:36:28.252', 358, '110000017670', 'INT', 17670, 1, 89, '202120725210', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(677, 2, '2022-10-28 12:36:28.279', 359, '110000017671', 'INT', 17671, 1, 89, '202120725211', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(678, 2, '2022-10-28 12:36:28.303', 360, '110000017672', 'INT', 17672, 1, 89, '202120725212', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(679, 2, '2022-10-28 12:36:28.338', 361, '110000017673', 'INT', 17673, 1, 89, '202120726170', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(680, 2, '2022-10-28 12:36:28.371', 362, '110000017674', 'INT', 17674, 1, 89, '202120726171', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(681, 2, '2022-10-28 12:36:28.397', 363, '110000017677', 'INT', 17677, 1, 89, '202120726174', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(682, 2, '2022-10-28 12:36:28.422', 364, '110000017678', 'INT', 17678, 1, 89, '202120726175', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(683, 2, '2022-10-28 12:36:28.447', 365, '110000017679', 'INT', 17679, 1, 89, '202120726176', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(684, 2, '2022-10-28 12:36:28.480', 366, '110000017682', 'INT', 17682, 1, 89, '202120726179', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(685, 2, '2022-10-28 12:36:28.508', 367, '110000017683', 'INT', 17683, 1, 89, '202120726180', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(686, 2, '2022-10-28 12:36:28.537', 368, '110000017685', 'INT', 17685, 1, 89, '202120726182', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(687, 2, '2022-10-28 12:36:28.562', 369, '110000017686', 'INT', 17686, 1, 89, '202120726183', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(688, 2, '2022-10-28 12:36:28.590', 370, '110000017687', 'INT', 17687, 1, 89, '202120726184', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(689, 2, '2022-10-28 12:36:28.618', 371, '110000017689', 'INT', 17689, 1, 89, '202120726186', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(690, 2, '2022-10-28 12:36:28.647', 372, '110000017691', 'INT', 17691, 1, 89, '202120726188', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(691, 2, '2022-10-28 12:36:28.671', 373, '110000017692', 'INT', 17692, 1, 89, '202120726189', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(692, 2, '2022-10-28 12:36:28.700', 374, '110000017694', 'INT', 17694, 1, 89, '202120726191', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(693, 2, '2022-10-28 12:36:28.725', 375, '110000017695', 'INT', 17695, 1, 89, '202120726192', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(694, 2, '2022-10-28 12:36:28.755', 376, '110000017696', 'INT', 17696, 1, 89, '202120726193', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(695, 2, '2022-10-28 12:36:28.786', 377, '110000017697', 'INT', 17697, 1, 89, '202120726194', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(696, 2, '2022-10-28 12:36:28.815', 378, '110000017698', 'INT', 17698, 1, 89, '202120726195', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(697, 2, '2022-10-28 12:36:28.845', 379, '110000017699', 'INT', 17699, 1, 89, '202120726196', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(698, 2, '2022-10-28 12:36:28.868', 380, '110000017700', 'INT', 17700, 1, 89, '202120726197', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(699, 2, '2022-10-28 12:36:28.893', 381, '110000017701', 'INT', 17701, 1, 89, '202120726198', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(700, 2, '2022-10-28 12:36:28.923', 382, '110000017702', 'INT', 17702, 1, 89, '202120726199', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(701, 2, '2022-10-28 12:36:28.951', 383, '110000017703', 'INT', 17703, 1, 89, '202120726200', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(702, 2, '2022-10-28 12:36:28.977', 384, '110000017704', 'INT', 17704, 1, 89, '202120726201', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(703, 2, '2022-10-28 12:36:29.021', 385, '110000017705', 'INT', 17705, 1, 89, '202120726202', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(704, 2, '2022-10-28 12:36:29.053', 386, '110000017706', 'INT', 17706, 1, 89, '202120726203', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(705, 2, '2022-10-28 12:36:29.079', 387, '110000017710', 'INT', 17710, 1, 89, '202120726207', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(706, 2, '2022-10-28 12:36:29.107', 388, '110000017711', 'INT', 17711, 1, 89, '202120726208', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(707, 2, '2022-10-28 12:36:29.139', 389, '110000017712', 'INT', 17712, 1, 89, '202120726209', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(708, 2, '2022-10-28 12:36:29.172', 390, '110000017713', 'INT', 17713, 1, 89, '202120726210', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(709, 2, '2022-10-28 12:36:29.204', 391, '110000017714', 'INT', 17714, 1, 89, '202120726211', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(710, 2, '2022-10-28 12:36:29.340', 392, '110000017715', 'INT', 17715, 1, 89, '202120726212', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(711, 2, '2022-10-28 12:36:29.377', 393, '110000017716', 'INT', 17716, 1, 89, '202120726213', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(712, 2, '2022-10-28 12:36:29.405', 394, '110000017717', 'INT', 17717, 1, 89, '202120726214', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(713, 2, '2022-10-28 12:36:29.434', 395, '110000017719', 'INT', 17719, 1, 89, '202120726216', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(714, 2, '2022-10-28 12:36:29.461', 396, '110000017720', 'INT', 17720, 1, 89, '202120726217', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(715, 2, '2022-10-28 12:36:29.489', 397, '110000017721', 'INT', 17721, 1, 89, '202120726218', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(716, 2, '2022-10-28 12:36:29.518', 398, '110000017722', 'INT', 17722, 1, 89, '202120726219', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(717, 2, '2022-10-28 12:36:29.545', 399, '110000017723', 'INT', 17723, 1, 89, '202120726220', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(718, 2, '2022-10-28 12:36:29.589', 400, '110000017724', 'INT', 17724, 1, 89, '202120726221', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(719, 2, '2022-10-28 12:36:29.623', 401, '110000017725', 'INT', 17725, 1, 89, '202120726222', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(720, 2, '2022-10-28 12:36:29.653', 402, '110000017726', 'INT', 17726, 1, 89, '202120726223', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(721, 2, '2022-10-28 12:36:29.682', 403, '110000017727', 'INT', 17727, 1, 89, '202120726224', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(722, 2, '2022-10-28 12:36:29.723', 404, '110000017728', 'INT', 17728, 1, 89, '202120726225', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(723, 2, '2022-10-28 12:36:29.758', 405, '110000017729', 'INT', 17729, 1, 89, '202120726226', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(724, 2, '2022-10-28 12:36:29.801', 406, '110000017730', 'INT', 17730, 1, 89, '202120726227', NULL, NULL, 2022, '2022-10-12 10:00:00.000');
INSERT INTO `lote` (`id`, `created_by`, `created_at`, `id_genotipo`, `cod_lote`, `fase`, `id_dados`, `id_s2`, `id_safra`, `ncc`, `peso`, `quant_sementes`, `year`, `dt_export`) VALUES
(725, 2, '2022-10-28 12:36:29.837', 407, '110000017731', 'INT', 17731, 1, 89, '202120726228', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(726, 2, '2022-10-28 12:36:29.873', 408, '110000017733', 'INT', 17733, 1, 89, '202120726230', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(727, 2, '2022-10-28 12:36:29.909', 409, '110000017734', 'INT', 17734, 1, 89, '202120726231', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(728, 2, '2022-10-28 12:36:29.942', 410, '110000017735', 'INT', 17735, 1, 89, '202120726232', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(729, 2, '2022-10-28 12:36:29.975', 411, '110000017736', 'INT', 17736, 1, 89, '202120726233', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(730, 2, '2022-10-28 12:36:30.008', 412, '110000017737', 'INT', 17737, 1, 89, '202120726234', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(731, 2, '2022-10-28 12:36:30.037', 413, '110000017738', 'INT', 17738, 1, 89, '202120726235', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(732, 2, '2022-10-28 12:36:30.067', 414, '110000017739', 'INT', 17739, 1, 89, '202120726236', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(733, 2, '2022-10-28 12:36:30.141', 415, '110000017741', 'INT', 17741, 1, 89, '202120726238', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(734, 2, '2022-10-28 12:36:30.178', 416, '110000017744', 'INT', 17744, 1, 89, '202120726241', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(735, 2, '2022-10-28 12:36:30.206', 417, '110000017745', 'INT', 17745, 1, 89, '202120726242', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(736, 2, '2022-10-28 12:36:30.234', 418, '110000017747', 'INT', 17747, 1, 89, '202120726244', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(737, 2, '2022-10-28 12:36:30.261', 419, '110000017748', 'INT', 17748, 1, 89, '202120726245', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(738, 2, '2022-10-28 12:36:30.294', 420, '110000017750', 'INT', 17750, 1, 89, '202120726247', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(739, 2, '2022-10-28 12:36:30.326', 421, '110000017751', 'INT', 17751, 1, 89, '202120726248', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(740, 2, '2022-10-28 12:36:30.353', 422, '110000017757', 'INT', 17757, 1, 89, '202120726254', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(741, 2, '2022-10-28 12:36:30.380', 423, '110000017758', 'INT', 17758, 1, 89, '202120726255', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(742, 2, '2022-10-28 12:36:30.408', 424, '110000017759', 'INT', 17759, 1, 89, '202120726256', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(743, 2, '2022-10-28 12:36:30.433', 425, '110000017760', 'INT', 17760, 1, 89, '202120726257', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(744, 2, '2022-10-28 12:36:30.459', 426, '110000017761', 'INT', 17761, 1, 89, '202120726258', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(745, 2, '2022-10-28 12:36:30.488', 427, '110000017762', 'INT', 17762, 1, 89, '202120726259', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(746, 2, '2022-10-28 12:36:30.514', 428, '110000017763', 'INT', 17763, 1, 89, '202120726260', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(747, 2, '2022-10-28 12:36:30.542', 429, '110000017764', 'INT', 17764, 1, 89, '202120726261', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(748, 2, '2022-10-28 12:36:30.567', 430, '110000017765', 'INT', 17765, 1, 89, '202120726262', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(749, 2, '2022-10-28 12:36:30.594', 431, '110000017767', 'INT', 17767, 1, 89, '202120726264', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(750, 2, '2022-10-28 12:36:30.620', 432, '110000017769', 'INT', 17769, 1, 89, '202120726266', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(751, 2, '2022-10-28 12:36:30.649', 433, '110000017774', 'INT', 17774, 1, 89, '202120726271', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(752, 2, '2022-10-28 12:36:30.675', 434, '110000017776', 'INT', 17776, 1, 89, '202120726273', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(753, 2, '2022-10-28 12:36:30.701', 435, '110000017777', 'INT', 17777, 1, 89, '202120726274', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(754, 2, '2022-10-28 12:36:30.728', 436, '110000017778', 'INT', 17778, 1, 89, '202120724816', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(755, 2, '2022-10-28 12:36:30.756', 437, '110000017779', 'INT', 17779, 1, 89, '202120724817', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(756, 2, '2022-10-28 12:36:30.785', 438, '110000017780', 'INT', 17780, 1, 89, '202120724818', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(757, 2, '2022-10-28 12:36:30.811', 439, '110000017782', 'INT', 17782, 1, 89, '202120724820', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(758, 2, '2022-10-28 12:36:30.838', 440, '110000017783', 'INT', 17783, 1, 89, '202120724821', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(759, 2, '2022-10-28 12:36:30.864', 441, '110000017785', 'INT', 17785, 1, 89, '202120724823', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(760, 2, '2022-10-28 12:36:30.892', 442, '110000017786', 'INT', 17786, 1, 89, '202120724824', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(761, 2, '2022-10-28 12:36:30.917', 443, '110000017787', 'INT', 17787, 1, 89, '202120724825', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(762, 2, '2022-10-28 12:36:30.946', 444, '110000017788', 'INT', 17788, 1, 89, '202120724826', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(763, 2, '2022-10-28 12:36:30.973', 445, '110000017789', 'INT', 17789, 1, 89, '202120724827', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(764, 2, '2022-10-28 12:36:31.003', 446, '110000017790', 'INT', 17790, 1, 89, '202120724828', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(765, 2, '2022-10-28 12:36:31.029', 447, '110000017791', 'INT', 17791, 1, 89, '202120724829', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(766, 2, '2022-10-28 12:36:31.056', 448, '110000017792', 'INT', 17792, 1, 89, '202120724830', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(767, 2, '2022-10-28 12:36:31.084', 449, '110000017793', 'INT', 17793, 1, 89, '202120724831', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(768, 2, '2022-10-28 12:36:31.112', 450, '110000017794', 'INT', 17794, 1, 89, '202120724832', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(769, 2, '2022-10-28 12:36:31.138', 451, '110000017795', 'INT', 17795, 1, 89, '202120724833', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(770, 2, '2022-10-28 12:36:31.164', 452, '110000017797', 'INT', 17797, 1, 89, '202120724835', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(771, 2, '2022-10-28 12:36:31.187', 453, '110000017798', 'INT', 17798, 1, 89, '202120724836', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(772, 2, '2022-10-28 12:36:31.210', 454, '110000017799', 'INT', 17799, 1, 89, '202120724837', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(773, 2, '2022-10-28 12:36:31.234', 455, '110000017800', 'INT', 17800, 1, 89, '202120724838', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(774, 2, '2022-10-28 12:36:31.263', 456, '110000017801', 'INT', 17801, 1, 89, '202120724839', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(775, 2, '2022-10-28 12:36:31.287', 457, '110000017803', 'INT', 17803, 1, 89, '202120724841', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(776, 2, '2022-10-28 12:36:31.315', 458, '110000017804', 'INT', 17804, 1, 89, '202120724842', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(777, 2, '2022-10-28 12:36:31.338', 459, '110000017805', 'INT', 17805, 1, 89, '202120724843', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(778, 2, '2022-10-28 12:36:31.364', 460, '110000017806', 'INT', 17806, 1, 89, '202120724844', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(779, 2, '2022-10-28 12:36:31.389', 461, '110000017807', 'INT', 17807, 1, 89, '202120724845', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(780, 2, '2022-10-28 12:36:31.412', 462, '110000017808', 'INT', 17808, 1, 89, '202120724846', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(781, 2, '2022-10-28 12:36:31.435', 463, '110000017809', 'INT', 17809, 1, 89, '202120724847', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(782, 2, '2022-10-28 12:36:31.476', 464, '110000017810', 'INT', 17810, 1, 89, '202120724848', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(783, 2, '2022-10-28 12:36:31.504', 465, '110000017811', 'INT', 17811, 1, 89, '202120724849', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(784, 2, '2022-10-28 12:36:31.532', 466, '110000017812', 'INT', 17812, 1, 89, '202120724850', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(785, 2, '2022-10-28 12:36:31.558', 467, '110000017813', 'INT', 17813, 1, 89, '202120724851', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(786, 2, '2022-10-28 12:36:31.584', 468, '110000017814', 'INT', 17814, 1, 89, '202120724852', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(787, 2, '2022-10-28 12:36:31.609', 469, '110000017815', 'INT', 17815, 1, 89, '202120724853', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(788, 2, '2022-10-28 12:36:31.633', 470, '110000017816', 'INT', 17816, 1, 89, '202120724854', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(789, 2, '2022-10-28 12:36:31.657', 471, '110000017817', 'INT', 17817, 1, 89, '202120724855', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(790, 2, '2022-10-28 12:36:31.683', 472, '110000017818', 'INT', 17818, 1, 89, '202120724856', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(791, 2, '2022-10-28 12:36:31.706', 473, '110000017819', 'INT', 17819, 1, 89, '202120724857', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(792, 2, '2022-10-28 12:36:31.730', 474, '110000017820', 'INT', 17820, 1, 89, '202120724858', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(793, 2, '2022-10-28 12:36:31.753', 475, '110000017821', 'INT', 17821, 1, 89, '202120724859', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(794, 2, '2022-10-28 12:36:31.776', 476, '110000017822', 'INT', 17822, 1, 89, '202120724860', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(795, 2, '2022-10-28 12:36:31.800', 477, '110000017824', 'INT', 17824, 1, 89, '202120724862', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(796, 2, '2022-10-28 12:36:31.825', 478, '110000017825', 'INT', 17825, 1, 89, '202120724863', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(797, 2, '2022-10-28 12:36:31.848', 479, '110000017826', 'INT', 17826, 1, 89, '202120724864', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(798, 2, '2022-10-28 12:36:31.870', 480, '110000017827', 'INT', 17827, 1, 89, '202120724865', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(799, 2, '2022-10-28 12:36:31.893', 481, '110000017830', 'INT', 17830, 1, 89, '202120724868', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(800, 2, '2022-10-28 12:36:31.919', 482, '110000017831', 'INT', 17831, 1, 89, '202120724869', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(801, 2, '2022-10-28 12:36:31.944', 483, '110000017832', 'INT', 17832, 1, 89, '202120724870', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(802, 2, '2022-10-28 12:36:31.967', 484, '110000017834', 'INT', 17834, 1, 89, '202120724880', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(803, 2, '2022-10-28 12:36:31.990', 485, '110000017835', 'INT', 17835, 1, 89, '202120724881', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(804, 2, '2022-10-28 12:36:32.013', 486, '110000017836', 'INT', 17836, 1, 89, '202120724882', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(805, 2, '2022-10-28 12:36:32.035', 487, '110000017837', 'INT', 17837, 1, 89, '202120724883', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(806, 2, '2022-10-28 12:36:32.058', 488, '110000017838', 'INT', 17838, 1, 89, '202120724886', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(807, 2, '2022-10-28 12:36:32.082', 489, '110000017839', 'INT', 17839, 1, 89, '202120724887', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(808, 2, '2022-10-28 12:36:32.106', 490, '110000017840', 'INT', 17840, 1, 89, '202120724888', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(809, 2, '2022-10-28 12:36:32.130', 491, '110000017841', 'INT', 17841, 1, 89, '202120724889', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(810, 2, '2022-10-28 12:36:32.153', 492, '110000017842', 'INT', 17842, 1, 89, '202120724890', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(811, 2, '2022-10-28 12:36:32.175', 493, '110000017844', 'INT', 17844, 1, 89, '202120724893', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(812, 2, '2022-10-28 12:36:32.198', 494, '110000017845', 'INT', 17845, 1, 89, '202120724894', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(813, 2, '2022-10-28 12:36:32.223', 495, '110000017846', 'INT', 17846, 1, 89, '202120724895', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(814, 2, '2022-10-28 12:36:32.246', 496, '110000017847', 'INT', 17847, 1, 89, '202120724896', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(815, 2, '2022-10-28 12:36:32.271', 497, '110000189795', 'INT', 189795, 1, 89, '202120724879', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(816, 2, '2022-10-28 12:36:32.300', 498, '110000189796', 'INT', 189796, 1, 89, '202120724891', NULL, NULL, 2022, '2022-10-12 10:00:00.000'),
(817, 23, '2022-10-28 19:08:44.855', 251, 'XXXX', 'P1', 156569, 2, 91, '1234567890', '100', NULL, 2023, NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `module` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `modules`
--

INSERT INTO `modules` (`id`, `module`) VALUES
(28, 'ambiente'),
(26, 'assayList'),
(2, 'cultura'),
(7, 'delineamento'),
(11, 'department'),
(18, 'disparos'),
(15, 'epoca'),
(29, 'etiquetagem'),
(22, 'experimento'),
(6, 'foco'),
(10, 'genotipo'),
(27, 'genotypeTreatment'),
(20, 'grupos'),
(19, 'layout_children'),
(5, 'layout_quadra'),
(4, 'local'),
(12, 'lote'),
(13, 'lote_portfolio'),
(23, 'materiais'),
(14, 'npe'),
(30, 'parcelas'),
(17, 'quadras'),
(25, 'RD'),
(3, 'safra'),
(16, 'sequencia_delineamento'),
(8, 'tecnologia'),
(9, 'tipo-ensaio'),
(24, 'type_assay_children'),
(21, 'unidadeCultura'),
(1, 'usuario');

-- --------------------------------------------------------

--
-- Estrutura para tabela `npe`
--

CREATE TABLE `npe` (
  `id` int(11) NOT NULL,
  `npei` int(11) NOT NULL,
  `npef` int(11) DEFAULT NULL,
  `npei_i` int(11) DEFAULT '0',
  `prox_npe` int(11) DEFAULT NULL,
  `npeQT` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `epoca` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `focoId` int(11) DEFAULT NULL,
  `localId` int(11) DEFAULT NULL,
  `safraId` int(11) DEFAULT NULL,
  `groupId` int(11) DEFAULT NULL,
  `typeAssayId` int(11) DEFAULT NULL,
  `tecnologiaId` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `edited` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `npe`
--

INSERT INTO `npe` (`id`, `npei`, `npef`, `npei_i`, `prox_npe`, `npeQT`, `created_by`, `epoca`, `focoId`, `localId`, `safraId`, `groupId`, `typeAssayId`, `tecnologiaId`, `status`, `edited`, `created_at`) VALUES
(1, 663001, 663001, 663001, 663001, NULL, 2, '2', 4, 8, 85, 19, 6, 12, 1, 0, '2022-10-28 12:48:16.800'),
(2, 664001, 664001, 664001, 664001, NULL, 2, '1', 4, 8, 85, 19, 6, 12, 1, 0, '2022-10-28 12:48:16.800'),
(3, 665001, 665001, 665001, 665001, NULL, 2, '1', 4, 9, 85, 19, 6, 12, 1, 0, '2022-10-28 12:48:16.800'),
(4, 663001, 663180, 663001, 663181, 820, 2, '1', 4, 12, 84, 11, 6, 12, 3, 0, '2022-10-28 14:35:02.871'),
(5, 664001, 664001, 664001, 664001, NULL, 2, '1', 4, 8, 84, 11, 6, 12, 1, 0, '2022-10-28 14:35:02.871'),
(6, 665001, 665001, 665001, 665001, NULL, 2, '1', 4, 9, 84, 11, 6, 12, 1, 0, '2022-10-28 14:35:02.871'),
(7, 663001, 663001, 663001, 663001, NULL, 2, '1', 11, 2, 89, 20, 6, 12, 1, 0, '2022-10-29 15:28:57.445'),
(8, 664001, 664001, 664001, 664001, NULL, 2, '1', 11, 8, 89, 20, 6, 12, 1, 0, '2022-10-29 15:28:57.445'),
(9, 665001, 665001, 665001, 665001, NULL, 2, '1', 11, 9, 89, 20, 6, 12, 1, 0, '2022-10-29 15:28:57.445');

-- --------------------------------------------------------

--
-- Estrutura para tabela `PrintHistory`
--

CREATE TABLE `PrintHistory` (
  `id` int(11) NOT NULL,
  `experimentGenotypeId` int(11) NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int(11) NOT NULL,
  `changes` int(11) DEFAULT NULL,
  `changedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `acess_permission` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `profile`
--

INSERT INTO `profile` (`id`, `name`, `acess_permission`, `created_at`, `created_by`, `status`) VALUES
(1, 'admin', '\"admin\"', '2022-03-23 00:00:00.000', 0, 1),
(2, 'Gestão', '{\"users\", \"\", \"\"]', '2022-03-23 00:00:00.000', 1, 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `quadra`
--

CREATE TABLE `quadra` (
  `id` int(11) NOT NULL,
  `cod_quadra` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_culture` int(11) NOT NULL,
  `local_plantio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `larg_q` decimal(4,2) NOT NULL,
  `comp_p` decimal(4,2) NOT NULL,
  `linha_p` int(11) NOT NULL,
  `comp_c` decimal(4,2) NOT NULL,
  `esquema` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tiro_fixo` int(11) DEFAULT NULL,
  `disparo_fixo` int(11) DEFAULT NULL,
  `q` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `id_safra` int(11) NOT NULL,
  `id_local` int(11) NOT NULL,
  `allocation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'IMPORTADO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `reportes`
--

CREATE TABLE `reportes` (
  `id` int(11) NOT NULL,
  `madeBy` int(11) DEFAULT NULL,
  `madeIn` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `module` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idOperation` int(11) DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `reportes`
--

INSERT INTO `reportes` (`id`, `madeBy`, `madeIn`, `module`, `operation`, `idOperation`, `name`, `ip`) VALUES
(137, 23, '2022-10-04 20:12:58.776', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(138, 23, '2022-10-04 20:12:59.574', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(139, NULL, '2022-10-04 20:15:23.312', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(140, NULL, '2022-10-04 20:15:23.479', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(141, NULL, '2022-10-04 20:15:23.505', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(142, NULL, '2022-10-04 20:15:23.762', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(143, NULL, '2022-10-04 20:15:23.956', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(144, NULL, '2022-10-04 20:15:24.070', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(145, NULL, '2022-10-04 20:15:24.238', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(146, NULL, '2022-10-04 20:15:24.431', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(147, NULL, '2022-10-04 20:15:24.458', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(148, NULL, '2022-10-04 20:15:24.598', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(149, NULL, '2022-10-04 20:15:24.643', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(150, NULL, '2022-10-04 20:15:24.707', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(151, NULL, '2022-10-04 20:15:24.783', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(152, NULL, '2022-10-04 20:15:24.787', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(153, NULL, '2022-10-04 20:15:24.884', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(154, NULL, '2022-10-04 20:15:24.931', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(155, NULL, '2022-10-04 20:15:24.973', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(156, NULL, '2022-10-04 20:15:25.118', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(157, NULL, '2022-10-04 20:15:25.279', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(158, NULL, '2022-10-04 20:15:25.433', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(159, NULL, '2022-10-04 20:15:25.461', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(160, NULL, '2022-10-04 20:15:25.597', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(161, NULL, '2022-10-04 20:15:25.619', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(162, NULL, '2022-10-04 20:15:25.750', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(163, NULL, '2022-10-04 20:15:25.779', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(164, NULL, '2022-10-04 20:15:25.916', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(165, NULL, '2022-10-04 20:15:25.938', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(166, NULL, '2022-10-04 20:15:26.083', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(167, NULL, '2022-10-04 20:15:26.093', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(168, NULL, '2022-10-04 20:15:26.239', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(169, NULL, '2022-10-04 20:15:26.267', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(170, NULL, '2022-10-04 20:15:26.387', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(171, NULL, '2022-10-04 20:15:26.418', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(172, NULL, '2022-10-04 20:15:26.573', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(173, NULL, '2022-10-04 20:15:26.578', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(174, NULL, '2022-10-04 20:15:26.727', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(175, NULL, '2022-10-04 20:15:26.755', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(176, NULL, '2022-10-04 20:15:26.887', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(177, NULL, '2022-10-04 20:15:26.918', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(178, NULL, '2022-10-04 20:15:27.052', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(179, NULL, '2022-10-04 20:15:27.065', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(180, NULL, '2022-10-04 20:15:27.223', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(181, NULL, '2022-10-04 20:15:27.382', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(182, NULL, '2022-10-04 20:15:27.402', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(183, NULL, '2022-10-04 20:15:27.536', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(184, NULL, '2022-10-04 20:15:27.567', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(185, NULL, '2022-10-04 20:15:27.720', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(186, NULL, '2022-10-04 20:15:28.038', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(187, NULL, '2022-10-04 20:15:28.192', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(188, NULL, '2022-10-04 20:15:28.195', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(189, NULL, '2022-10-04 20:15:28.222', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(190, NULL, '2022-10-04 20:15:28.361', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(191, NULL, '2022-10-04 20:15:28.378', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(192, NULL, '2022-10-04 20:15:28.533', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(193, NULL, '2022-10-04 20:15:28.549', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(194, NULL, '2022-10-04 20:15:28.694', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(195, NULL, '2022-10-04 20:15:28.718', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(196, NULL, '2022-10-04 20:15:28.873', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(197, NULL, '2022-10-04 20:15:28.880', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(198, NULL, '2022-10-04 20:15:29.032', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(199, NULL, '2022-10-04 20:15:29.218', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(200, NULL, '2022-10-04 20:15:30.514', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(201, NULL, '2022-10-04 20:15:30.584', 'Usuários', 'Edição', 10, NULL, '\"143.0.57.156\"'),
(202, NULL, '2022-10-04 20:15:31.265', 'Usuários', 'Edição', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(203, 23, '2022-10-04 20:16:22.755', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(204, 23, '2022-10-04 20:16:22.915', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(205, 23, '2022-10-04 20:16:23.009', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(206, 23, '2022-10-04 20:16:23.091', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(207, 23, '2022-10-04 20:16:23.135', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(208, 23, '2022-10-04 20:16:23.293', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(209, 23, '2022-10-04 20:16:23.458', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(210, 23, '2022-10-04 20:16:23.607', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(211, 23, '2022-10-04 20:16:23.778', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(212, 23, '2022-10-04 20:16:23.928', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(213, 23, '2022-10-04 20:16:24.112', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(214, 23, '2022-10-04 20:16:24.308', 'Cultura', 'Inativação', 21, 'PEDRO', '\"143.0.57.156\"'),
(215, NULL, '2022-10-04 20:18:18.501', 'Usuários', 'Inativação', 10, NULL, '\"143.0.57.156\"'),
(216, NULL, '2022-10-04 20:18:18.689', 'Usuários', 'Inativação', 10, 'Pedro Soares Neves', '\"143.0.57.156\"'),
(217, NULL, '2022-10-04 20:19:20.788', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(218, 23, '2022-10-04 20:19:20.988', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(219, NULL, '2022-10-04 20:19:23.122', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(220, 23, '2022-10-04 20:19:23.312', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(221, NULL, '2022-10-04 20:19:37.727', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(222, 23, '2022-10-04 20:19:37.917', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(223, NULL, '2022-10-04 20:19:40.845', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(224, 23, '2022-10-04 20:19:41.034', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(225, NULL, '2022-10-04 20:20:01.967', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(226, NULL, '2022-10-04 20:20:02.074', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(227, 23, '2022-10-04 20:20:02.209', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(228, NULL, '2022-10-04 20:20:02.251', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(229, 23, '2022-10-04 20:20:02.262', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(230, 23, '2022-10-04 20:20:02.444', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(231, NULL, '2022-10-04 20:20:02.496', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(232, NULL, '2022-10-04 20:20:02.643', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(233, NULL, '2022-10-04 20:20:02.827', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(234, 23, '2022-10-04 20:20:03.013', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(235, NULL, '2022-10-04 20:20:03.190', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(236, 23, '2022-10-04 20:20:03.439', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(237, NULL, '2022-10-04 20:20:03.769', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(238, NULL, '2022-10-04 20:20:03.959', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(239, 23, '2022-10-04 20:20:04.070', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(240, NULL, '2022-10-04 20:20:04.177', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(241, NULL, '2022-10-04 20:20:04.261', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(242, 23, '2022-10-04 20:20:04.371', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(243, NULL, '2022-10-04 20:20:04.452', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(244, 23, '2022-10-04 20:20:04.560', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(245, 23, '2022-10-04 20:20:04.642', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(246, 23, '2022-10-04 20:20:04.747', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(247, NULL, '2022-10-04 20:20:04.919', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(248, 23, '2022-10-04 20:20:05.112', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(249, NULL, '2022-10-04 20:20:05.652', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(250, 23, '2022-10-04 20:20:05.797', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(251, 23, '2022-10-04 20:20:05.849', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(252, NULL, '2022-10-04 20:20:05.942', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(253, 23, '2022-10-04 20:20:06.202', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(254, 23, '2022-10-04 20:20:07.256', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(255, 23, '2022-10-04 20:20:47.981', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(256, 23, '2022-10-04 20:20:48.144', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(257, 23, '2022-10-04 20:20:48.185', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(258, 23, '2022-10-04 20:20:48.320', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(259, 23, '2022-10-04 20:20:48.331', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(260, 23, '2022-10-04 20:20:48.441', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(261, 23, '2022-10-04 20:20:48.497', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(262, 23, '2022-10-04 20:20:48.511', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(263, 23, '2022-10-04 20:20:48.625', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(264, 23, '2022-10-04 20:20:48.630', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(265, 23, '2022-10-04 20:20:48.687', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(266, 23, '2022-10-04 20:20:48.796', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(267, 23, '2022-10-04 20:20:48.816', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(268, 23, '2022-10-04 20:20:48.969', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(269, 23, '2022-10-04 20:20:48.980', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(270, 23, '2022-10-04 20:20:49.160', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(271, 23, '2022-10-04 20:20:49.486', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(272, 23, '2022-10-04 20:20:49.638', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(273, 23, '2022-10-04 20:20:49.673', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(274, 23, '2022-10-04 20:20:49.842', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(275, 23, '2022-10-04 20:20:49.848', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(276, 23, '2022-10-04 20:20:49.906', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(277, 23, '2022-10-04 20:20:50.010', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(278, 23, '2022-10-04 20:20:50.098', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(279, 23, '2022-10-04 20:20:50.105', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(280, 23, '2022-10-04 20:20:50.195', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(281, 23, '2022-10-04 20:20:50.232', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(282, 23, '2022-10-04 20:20:50.288', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(283, 23, '2022-10-04 20:20:50.349', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(284, 23, '2022-10-04 20:20:50.383', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(285, 23, '2022-10-04 20:20:50.475', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(286, 23, '2022-10-04 20:20:50.505', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(287, 23, '2022-10-04 20:20:50.535', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(288, 23, '2022-10-04 20:20:50.696', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(289, 23, '2022-10-04 20:20:50.751', 'Usuários', 'Inativação', 3, NULL, '\"143.0.57.156\"'),
(290, 23, '2022-10-04 20:20:50.939', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(291, 23, '2022-10-04 20:20:52.470', 'Usuários', 'Edição', 3, NULL, '\"143.0.57.156\"'),
(292, 23, '2022-10-04 20:20:52.658', 'Usuários', 'Edição', 3, 'Paulo Cesar2', '\"143.0.57.156\"'),
(293, 2, '2022-10-04 22:52:34.533', 'Qtd de Sementes', 'Cadastro', 8, '2', '\"35.199.125.186\"'),
(294, 2, '2022-10-04 22:54:20.116', 'Delineamento', 'Inativação', 1, 'DBC-20', '\"35.199.125.186\"'),
(295, 2, '2022-10-04 22:54:20.310', 'Delineamento', 'Inativação', 2, 'DBC-60', '\"35.199.125.186\"'),
(296, 2, '2022-10-04 22:54:21.333', 'Delineamento', 'Inativação', 3, 'ED10T_04XR2', '\"35.199.125.186\"'),
(297, 2, '2022-10-04 22:54:21.798', 'Delineamento', 'Inativação', 4, 'ED4D_11XR2', '\"35.199.125.186\"'),
(298, 2, '2022-10-04 22:54:22.272', 'Delineamento', 'Inativação', 6, 'P2/32T/2R/S01/01', '\"35.199.125.186\"'),
(299, 2, '2022-10-04 22:54:22.725', 'Delineamento', 'Inativação', 5, 'P1-80', '\"35.199.125.186\"'),
(300, 2, '2022-10-04 22:54:23.140', 'Delineamento', 'Inativação', 7, 'DBC-80', '\"35.199.125.186\"'),
(301, 2, '2022-10-04 22:54:23.571', 'Delineamento', 'Inativação', 8, 'DBC-90', '\"35.199.125.186\"'),
(302, 23, '2022-10-04 22:54:23.982', 'Delineamento', 'Inativação', 24, 'TESTE', '\"35.199.125.186\"'),
(303, 23, '2022-10-04 23:19:50.566', 'Foco', 'Edição', 2, 'NORTE', '\"143.0.57.156\"'),
(304, 23, '2022-10-04 23:30:20.829', 'Foco-Grupo', 'Cadastro', 17, '4', '\"143.0.57.156\"'),
(305, 23, '2022-10-05 13:57:32.038', 'Foco', 'Inativação', 2, 'NORTE', '\"35.199.125.186\"'),
(306, 23, '2022-10-05 13:57:33.695', 'Foco', 'Inativação', 2, 'NORTE', '\"35.199.125.186\"'),
(307, 2, '2022-10-05 13:57:41.453', 'Foco', 'Cadastro', 7, 'NORTE', '\"35.199.125.186\"'),
(308, 23, '2022-10-05 23:30:29.203', 'Cultura', 'Edição', 21, 'PEDRO', '\"143.0.57.156\"'),
(309, 3, '2022-10-05 23:31:09.343', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(310, 2, '2022-10-06 12:32:38.208', 'Foco', 'Cadastro', 8, 'Teste', '\"35.199.125.186\"'),
(311, 2, '2022-10-07 12:30:11.195', 'Usuários', 'Cadastro', 37, 'Teste2222', '\"35.199.125.186\"'),
(312, 2, '2022-10-07 12:30:43.323', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(313, 2, '2022-10-07 12:32:37.620', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(314, 2, '2022-10-07 12:33:10.007', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(315, 2, '2022-10-07 12:33:30.984', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(316, 23, '2022-10-07 15:19:25.514', 'Cultura', 'Cadastro', 25, 'TESTE', '\"35.199.125.186\"'),
(317, 3, '2022-10-07 15:24:10.951', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(318, 23, '2022-10-07 15:24:25.862', 'Foco', 'Cadastro', 9, 'TESTE', '\"35.199.125.186\"'),
(319, 2, '2022-10-10 12:06:55.785', 'Npe', 'Inativação', 1, '84', '\"35.199.125.186\"'),
(320, 23, '2022-10-10 16:30:12.781', 'NPE', 'Exclusão', 5, NULL, '\"143.0.56.95\"'),
(321, 2, '2022-10-10 18:48:33.888', 'Tipo de Ensaio', 'Cadastro', 10, 'F4', '\"35.199.125.186\"'),
(322, 2, '2022-10-11 15:35:41.663', 'NPE', 'Exclusão', 7, NULL, '\"35.199.125.186\"'),
(323, 23, '2022-10-13 21:40:21.261', 'Safra', 'Cadastro', 88, '2020/21', '\"143.0.57.181\"'),
(324, 23, '2022-10-15 00:11:18.688', 'Foco-Grupo', 'Cadastro', 18, '3', '\"35.199.125.186\"'),
(325, 2, '2022-10-17 13:11:23.878', 'Foco', 'Edição', 4, 'SUL', '\"35.199.125.186\"'),
(326, 2, '2022-10-17 13:11:39.588', 'Tipo de Ensaio', 'Edição', 6, 'INT', '\"35.199.125.186\"'),
(327, 2, '2022-10-17 14:09:00.053', 'Safra', 'Cadastro', 89, '2022/22', '\"35.199.125.186\"'),
(328, 2, '2022-10-19 19:19:24.415', 'NPE', 'Exclusão', 8, NULL, '\"35.199.125.186\"'),
(329, 2, '2022-10-20 18:54:25.345', 'Foco', 'Inativação', 7, 'NORTE', '\"35.199.125.186\"'),
(330, 2, '2022-10-20 18:55:13.863', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(331, 2, '2022-10-20 18:55:44.256', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(332, 2, '2022-10-20 18:55:57.258', 'Usuários', 'Edição', 37, 'Teste2222', '\"35.199.125.186\"'),
(333, 2, '2022-10-20 19:04:34.625', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(334, 23, '2022-10-20 19:04:55.124', 'Foco', 'Edição', 2, 'NORTE', '\"189.123.96.3\"'),
(335, 2, '2022-10-20 19:05:35.188', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(336, 2, '2022-10-20 19:06:00.547', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(337, 2, '2022-10-20 19:07:36.919', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(338, 2, '2022-10-20 19:08:14.690', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(339, 2, '2022-10-20 19:08:51.353', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(340, 2, '2022-10-20 19:08:58.337', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(341, 2, '2022-10-20 19:09:02.691', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(342, 23, '2022-10-20 19:09:16.572', 'Foco', 'Inativação', 2, 'NORTE', '\"189.123.96.3\"'),
(343, 23, '2022-10-20 19:09:26.134', 'Foco', 'Edição', 2, 'NORTE', '\"189.123.96.3\"'),
(344, 2, '2022-10-20 19:09:35.094', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(345, 23, '2022-10-20 19:09:38.012', 'Foco', 'Inativação', 2, 'NORTE', '\"189.123.96.3\"'),
(346, 2, '2022-10-20 19:09:39.992', 'Foco', 'Inativação', 3, 'CO', '\"189.123.96.3\"'),
(347, 2, '2022-10-20 19:09:46.405', 'Foco', 'Inativação', 3, 'CO', '\"189.123.96.3\"'),
(348, 2, '2022-10-20 19:10:30.260', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(349, 2, '2022-10-20 19:14:11.512', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(350, 2, '2022-10-20 19:14:29.029', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(351, 23, '2022-10-20 19:14:31.484', 'Foco', 'Edição', 2, 'NORTE', '\"189.123.96.3\"'),
(352, 2, '2022-10-20 19:14:35.675', 'Foco', 'Edição', 3, 'CO', '\"189.123.96.3\"'),
(353, 2, '2022-10-20 19:14:41.568', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(354, 2, '2022-10-20 19:18:00.557', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(355, 2, '2022-10-20 19:22:37.814', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(356, 23, '2022-10-20 19:22:42.767', 'Foco', 'Inativação', 2, 'NORTE', '\"189.123.96.3\"'),
(357, 23, '2022-10-20 19:22:45.787', 'Foco', 'Edição', 2, 'NORTE', '\"189.123.96.3\"'),
(358, 23, '2022-10-20 19:22:53.207', 'Foco', 'Inativação', 2, 'NORTE', '\"189.123.96.3\"'),
(359, 2, '2022-10-20 19:22:55.917', 'Foco', 'Inativação', 3, 'CO', '\"189.123.96.3\"'),
(360, 2, '2022-10-20 19:23:04.271', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(361, 23, '2022-10-20 19:25:55.705', 'Foco', 'Inativação', 1, 'SUL', '\"189.123.96.3\"'),
(362, 2, '2022-10-20 19:33:06.614', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(363, 2, '2022-10-20 19:37:58.488', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(364, 23, '2022-10-20 19:38:02.267', 'Foco', 'Edição', 2, 'NORTE', '\"189.123.96.3\"'),
(365, 2, '2022-10-20 19:38:40.519', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(366, 23, '2022-10-20 19:38:41.913', 'Foco', 'Inativação', 2, 'NORTE', '\"189.123.96.3\"'),
(367, 2, '2022-10-20 19:38:48.414', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(368, 2, '2022-10-20 19:38:49.576', 'Foco', 'Edição', 7, 'NORTE', '\"189.123.96.3\"'),
(369, 2, '2022-10-20 19:38:51.099', 'Foco', 'Edição', 3, 'CO', '\"189.123.96.3\"'),
(370, 2, '2022-10-21 16:51:26.310', 'Cultura', 'Cadastro', 26, 'Soja', '\"35.199.125.186\"'),
(371, 2, '2022-10-21 17:41:51.407', 'NPE', 'Exclusão', 17, NULL, '\"35.199.125.186\"'),
(372, 2, '2022-10-21 17:41:53.074', 'NPE', 'Exclusão', 18, NULL, '\"35.199.125.186\"'),
(373, 2, '2022-10-21 17:41:54.577', 'NPE', 'Exclusão', 19, NULL, '\"35.199.125.186\"'),
(374, 2, '2022-10-21 17:41:56.129', 'NPE', 'Exclusão', 4, NULL, '\"35.199.125.186\"'),
(375, 2, '2022-10-21 17:41:57.175', 'NPE', 'Exclusão', 5, NULL, '\"35.199.125.186\"'),
(376, 2, '2022-10-21 17:42:01.629', 'NPE', 'Exclusão', 6, NULL, '\"35.199.125.186\"'),
(377, 2, '2022-10-21 17:42:02.922', 'NPE', 'Exclusão', 20, NULL, '\"35.199.125.186\"'),
(378, 2, '2022-10-21 17:42:04.574', 'NPE', 'Exclusão', 21, NULL, '\"35.199.125.186\"'),
(379, 2, '2022-10-21 17:42:06.794', 'NPE', 'Exclusão', 22, NULL, '\"35.199.125.186\"'),
(380, 2, '2022-10-21 17:43:35.637', 'NPE', 'Exclusão', 23, NULL, '\"35.199.125.186\"'),
(381, 2, '2022-10-21 17:43:37.274', 'NPE', 'Exclusão', 24, NULL, '\"35.199.125.186\"'),
(382, 2, '2022-10-21 17:43:38.966', 'NPE', 'Exclusão', 25, NULL, '\"35.199.125.186\"'),
(383, 2, '2022-10-21 18:26:48.353', 'Foco-Grupo', 'Cadastro', 19, '4', '\"35.199.125.186\"'),
(384, 23, '2022-10-21 19:44:04.576', 'Safra', 'Cadastro', 90, '2022/23', '\"143.0.57.181\"'),
(385, 2, '2022-10-24 12:37:02.764', 'Foco', 'Inativação', 7, 'NORTE', '\"35.199.125.186\"'),
(386, 23, '2022-10-24 12:37:27.971', 'Foco', 'Edição', 2, 'NORTE', '\"35.199.125.186\"'),
(387, 23, '2022-10-24 12:37:28.928', 'Foco', 'Inativação', 2, 'NORTE', '\"35.199.125.186\"'),
(388, 2, '2022-10-26 16:24:58.048', 'Usuários', 'Inativação', 20, NULL, '\"35.199.125.186\"'),
(389, 2, '2022-10-26 16:24:58.254', 'Usuários', 'Inativação', 20, 'T2', '\"35.199.125.186\"'),
(390, 2, '2022-10-26 16:24:59.116', 'Usuários', 'Inativação', 19, NULL, '\"35.199.125.186\"'),
(391, 2, '2022-10-26 16:24:59.267', 'Usuários', 'Inativação', 19, 'T1', '\"35.199.125.186\"'),
(392, 2, '2022-10-26 16:25:17.308', 'Usuários', 'Inativação', 36, NULL, '\"35.199.125.186\"'),
(393, 2, '2022-10-26 16:25:17.456', 'Usuários', 'Inativação', 36, 'TELA ', '\"35.199.125.186\"'),
(394, 2, '2022-10-26 16:25:18.230', 'Usuários', 'Edição', 36, NULL, '\"35.199.125.186\"'),
(395, 2, '2022-10-26 16:25:18.387', 'Usuários', 'Edição', 36, 'TELA ', '\"35.199.125.186\"'),
(396, 2, '2022-10-26 16:25:24.803', 'Foco', 'Inativação', 3, 'CO', '\"35.199.125.186\"'),
(397, 2, '2022-10-26 16:25:37.625', 'Foco', 'Edição', 3, 'CO', '\"35.199.125.186\"'),
(398, 2, '2022-10-26 16:25:47.430', 'Cultura', 'Inativação', 25, 'TESTE', '\"35.199.125.186\"'),
(399, 2, '2022-10-26 16:26:01.496', 'Cultura', 'Edição', 25, 'TESTE', '\"35.199.125.186\"'),
(400, 2, '2022-10-26 16:27:53.316', 'Foco', 'Inativação', 3, 'CO', '\"35.199.125.186\"'),
(401, 2, '2022-10-26 16:27:58.416', 'Foco', 'Edição', 3, 'CO', '\"35.199.125.186\"'),
(402, 2, '2022-10-26 16:32:04.667', 'Cultura', 'Inativação', 25, 'TESTE', '\"35.199.125.186\"'),
(403, 2, '2022-10-26 16:32:06.057', 'Cultura', 'Edição', 25, 'TESTE', '\"35.199.125.186\"'),
(404, 2, '2022-10-26 16:32:11.396', 'Cultura', 'Inativação', 25, 'TESTE', '\"35.199.125.186\"'),
(405, 2, '2022-10-26 16:32:24.707', 'Cultura', 'Edição', 25, 'TESTE', '\"35.199.125.186\"'),
(406, 2, '2022-10-26 16:43:56.803', 'Usuários', 'Inativação', 3, NULL, '\"35.199.125.186\"'),
(407, 2, '2022-10-26 16:43:56.970', 'Usuários', 'Inativação', 3, 'Paulo Cesar2', '\"35.199.125.186\"'),
(408, 2, '2022-10-26 16:43:58.915', 'Usuários', 'Inativação', 33, NULL, '\"35.199.125.186\"'),
(409, 2, '2022-10-26 16:43:59.062', 'Usuários', 'Inativação', 33, 'Rian', '\"35.199.125.186\"'),
(410, 2, '2022-10-26 16:44:01.603', 'Usuários', 'Inativação', 8, NULL, '\"35.199.125.186\"'),
(411, 2, '2022-10-26 16:44:01.765', 'Usuários', 'Inativação', 8, 'Sérgio Kazuo Kasahara', '\"35.199.125.186\"'),
(412, 2, '2022-10-26 16:44:02.316', 'Usuários', 'Inativação', 9, NULL, '\"35.199.125.186\"'),
(413, 2, '2022-10-26 16:44:02.481', 'Usuários', 'Inativação', 9, 'Sergio Suzuki', '\"35.199.125.186\"'),
(414, 2, '2022-10-26 16:44:04.477', 'Usuários', 'Inativação', 14, NULL, '\"35.199.125.186\"'),
(415, 2, '2022-10-26 16:44:04.705', 'Usuários', 'Inativação', 14, 'Teste', '\"35.199.125.186\"'),
(416, 2, '2022-10-26 16:44:05.122', 'Usuários', 'Inativação', 29, NULL, '\"35.199.125.186\"'),
(417, 2, '2022-10-26 16:44:05.321', 'Usuários', 'Inativação', 29, 'Teste1', '\"35.199.125.186\"'),
(418, 2, '2022-10-26 16:44:05.934', 'Usuários', 'Inativação', 37, NULL, '\"35.199.125.186\"'),
(419, 2, '2022-10-26 16:44:06.122', 'Usuários', 'Inativação', 37, 'Teste2222', '\"35.199.125.186\"'),
(420, 2, '2022-10-26 16:44:07.933', 'Usuários', 'Inativação', 36, NULL, '\"35.199.125.186\"'),
(421, 2, '2022-10-26 16:44:08.133', 'Usuários', 'Inativação', 36, 'TELA ', '\"35.199.125.186\"'),
(422, 2, '2022-10-26 16:44:10.064', 'Usuários', 'Inativação', 31, NULL, '\"35.199.125.186\"'),
(423, 2, '2022-10-26 16:44:10.224', 'Usuários', 'Inativação', 31, 'Hugo Varella', '\"35.199.125.186\"'),
(424, 2, '2022-10-26 16:44:21.002', 'Usuários', 'Inativação', 18, NULL, '\"35.199.125.186\"'),
(425, 2, '2022-10-26 16:44:21.164', 'Usuários', 'Inativação', 18, 'Amanda Alves', '\"35.199.125.186\"'),
(426, 2, '2022-10-26 16:44:24.817', 'Usuários', 'Inativação', 35, NULL, '\"35.199.125.186\"'),
(427, 2, '2022-10-26 16:44:24.965', 'Usuários', 'Inativação', 35, 'Abner', '\"35.199.125.186\"'),
(428, 2, '2022-10-26 16:44:27.776', 'Usuários', 'Edição', 35, NULL, '\"35.199.125.186\"'),
(429, 2, '2022-10-26 16:44:27.931', 'Usuários', 'Edição', 35, 'Abner', '\"35.199.125.186\"'),
(430, 2, '2022-10-26 16:44:28.546', 'Usuários', 'Inativação', 34, NULL, '\"35.199.125.186\"'),
(431, 2, '2022-10-26 16:44:28.692', 'Usuários', 'Inativação', 34, 'Aaaaaa', '\"35.199.125.186\"'),
(432, 2, '2022-10-26 16:49:27.227', 'Qtd de Sementes', 'Cadastro', 9, '2', '\"35.199.125.186\"'),
(433, 2, '2022-10-28 13:50:09.561', 'Qtd de Sementes', 'Cadastro', 10, '1', '\"35.199.125.186\"'),
(434, 2, '2022-10-28 16:53:10.380', 'Foco', 'Inativação', 8, 'Teste', '\"35.199.125.186\"'),
(435, 2, '2022-10-28 16:56:35.136', 'Foco', 'Edição', 8, 'Teste', '\"35.199.125.186\"'),
(436, 23, '2022-10-28 16:56:35.889', 'Foco', 'Edição', 1, 'SUL', '\"35.199.125.186\"'),
(437, 2, '2022-10-28 16:56:47.053', 'Cultura', 'Inativação', 25, 'TESTE', '\"35.199.125.186\"'),
(438, 2, '2022-10-28 16:57:05.544', 'Foco', 'Inativação', 8, 'Teste', '\"35.199.125.186\"'),
(439, 23, '2022-10-28 18:21:50.991', 'Tipo de Ensaio', 'Inativação', 1, 'VBA', '\"35.199.125.186\"'),
(440, 2, '2022-10-28 18:21:57.380', 'Tipo de Ensaio', 'Inativação', 3, 'F2', '\"35.199.125.186\"'),
(441, 2, '2022-10-28 18:21:59.871', 'Tipo de Ensaio', 'Edição', 3, 'F2', '\"35.199.125.186\"'),
(442, 23, '2022-10-28 18:22:01.021', 'Tipo de Ensaio', 'Edição', 1, 'VBA', '\"35.199.125.186\"'),
(443, 23, '2022-10-28 18:22:02.073', 'Tipo de Ensaio', 'Inativação', 1, 'VBA', '\"35.199.125.186\"'),
(444, 23, '2022-10-28 18:22:23.956', 'Foco', 'Edição', 2, 'NORTE', '\"35.199.125.186\"'),
(445, 23, '2022-10-28 18:22:34.954', 'Foco', 'Inativação', 2, 'NORTE', '\"35.199.125.186\"'),
(446, 2, '2022-10-28 18:23:27.667', 'Foco', 'Inativação', 4, 'SUL', '\"35.199.125.186\"'),
(447, 2, '2022-10-28 18:23:40.924', 'Foco', 'Edição', 4, 'SUL', '\"35.199.125.186\"'),
(448, 2, '2022-10-28 18:25:32.199', 'Foco', 'Edição', 7, 'NORTE', '\"35.199.125.186\"'),
(449, 2, '2022-10-28 18:40:39.814', 'Foco', 'Inativação', 7, 'NORTE', '\"189.123.96.3\"'),
(450, 3, '2022-10-28 18:49:40.255', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(451, 2, '2022-10-28 18:59:22.604', 'Usuários', 'Cadastro', 38, 'Talita Borges', '\"35.199.125.186\"'),
(452, 2, '2022-10-28 18:59:40.312', 'Usuários', 'Edição', 38, 'Talita Borges', '\"35.199.125.186\"'),
(453, 2, '2022-10-28 18:59:44.436', 'Usuários', 'Edição', 38, 'Talita Borges', '\"35.199.125.186\"'),
(454, 2, '2022-10-28 19:00:09.443', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(455, 2, '2022-10-28 19:00:16.865', 'Foco', 'Inativação', 3, 'CO', '\"189.123.96.3\"'),
(456, 2, '2022-10-28 19:01:22.250', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(457, 38, '2022-10-28 19:02:01.658', 'Cultura', 'Cadastro', 27, 'Abacate', '\"35.199.125.186\"'),
(458, 2, '2022-10-28 19:02:34.762', 'Usuários', 'Edição', 38, 'Talita Borges', '\"35.199.125.186\"'),
(459, 2, '2022-10-28 19:02:37.393', 'Usuários', 'Edição', 38, 'Talita Borges', '\"35.199.125.186\"'),
(460, 2, '2022-10-28 19:03:08.255', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(461, 2, '2022-10-28 19:03:09.077', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(462, 2, '2022-10-28 19:03:15.515', 'Foco', 'Edição', 4, 'SUL', '\"189.123.96.3\"'),
(463, 38, '2022-10-28 19:03:21.660', 'Safra', 'Cadastro', 91, '2023V', '\"35.199.125.186\"'),
(464, 2, '2022-10-28 19:03:21.741', 'Foco', 'Inativação', 4, 'SUL', '\"189.123.96.3\"'),
(465, 2, '2022-10-28 19:03:28.782', 'Foco', 'Edição', 7, 'NORTE', '\"189.123.96.3\"'),
(466, 2, '2022-10-28 19:03:36.389', 'Foco', 'Inativação', 7, 'NORTE', '\"189.123.96.3\"'),
(467, 38, '2022-10-28 19:10:32.858', 'Foco', 'Cadastro', 10, 'SUL', '\"35.199.125.186\"'),
(468, 38, '2022-10-28 19:12:18.500', 'Tipo de Ensaio', 'Cadastro', 11, 'INT', '\"35.199.125.186\"'),
(469, 3, '2022-10-28 19:24:07.627', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(470, 3, '2022-10-28 19:24:21.803', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(471, 3, '2022-10-28 19:24:26.938', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(472, 3, '2022-10-28 19:24:31.740', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(473, 3, '2022-10-28 19:24:38.966', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(474, 3, '2022-10-28 19:24:49.690', 'Usuários', 'Edição', 23, 'Felipe Couto', '\"35.199.125.186\"'),
(475, 2, '2022-10-29 15:05:32.508', 'Safra', 'Cadastro', 92, '2021/21', '\"35.199.125.186\"'),
(476, 2, '2022-10-29 15:18:20.742', 'Foco', 'Cadastro', 11, 'SUL', '\"35.199.125.186\"'),
(477, 2, '2022-10-29 15:18:27.691', 'Tipo de Ensaio', 'Cadastro', 12, 'INT', '\"35.199.125.186\"'),
(478, 2, '2022-10-29 15:18:33.109', 'Qtd de Sementes', 'Cadastro', 11, '12', '\"35.199.125.186\"'),
(479, 2, '2022-10-29 15:28:46.160', 'Foco-Grupo', 'Cadastro', 20, '11', '\"35.199.125.186\"'),
(480, 38, '2022-10-30 17:17:36.238', 'Safra', 'Cadastro', 93, '2024V', '\"35.199.125.186\"'),
(481, 23, '2022-10-31 18:16:02.994', 'Usuários', 'Cadastro', 39, 'Pedro', '\"35.199.125.186\"'),
(482, 23, '2022-10-31 18:17:38.856', 'Usuários', 'Cadastro', 40, 'Ben', '\"35.199.125.186\"');

-- --------------------------------------------------------

--
-- Estrutura para tabela `safra`
--

CREATE TABLE `safra` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `plantingStartTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plantingEndTime` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_safra` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `safraName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `safra`
--

INSERT INTO `safra` (`id`, `id_culture`, `year`, `plantingStartTime`, `plantingEndTime`, `main_safra`, `status`, `created_by`, `created_at`, `safraName`) VALUES
(81, 21, 2022, NULL, NULL, 0, 1, 10, '2022-09-19 17:22:38.904', '2022/23'),
(82, 21, 2024, NULL, NULL, 0, 1, 10, '2022-09-19 17:23:04.127', '2024/25'),
(83, 22, 2022, NULL, NULL, 0, 1, 2, '2022-09-19 17:27:24.886', '2021/22'),
(84, 22, 2022, NULL, NULL, 0, 1, 2, '2022-09-19 17:27:41.289', '2022/22'),
(85, 22, 2022, NULL, NULL, 0, 1, 2, '2022-09-19 17:28:20.351', '2022/23'),
(86, 24, 2022, NULL, NULL, 0, 1, 2, '2022-09-28 21:45:15.431', '2022_22'),
(87, 24, 2022, NULL, NULL, 0, 1, 2, '2022-09-28 21:49:26.686', '2022/23'),
(88, 22, 2021, NULL, NULL, 0, 1, 23, '2022-10-13 21:40:21.215', '2020/21'),
(89, 23, 2022, NULL, NULL, 0, 1, 2, '2022-10-17 14:09:00.030', '2022/22'),
(90, 25, 2022, NULL, NULL, 0, 1, 23, '2022-10-21 19:44:04.518', '2022/23'),
(91, 27, 2023, NULL, NULL, 0, 1, 38, '2022-10-28 19:03:21.625', '2023V'),
(92, 23, 2021, NULL, NULL, 0, 1, 2, '2022-10-29 15:05:32.491', '2021/21'),
(93, 27, 2024, NULL, NULL, 0, 1, 38, '2022-10-30 17:17:36.102', '2024V');

-- --------------------------------------------------------

--
-- Estrutura para tabela `sequencia_delineamento`
--

CREATE TABLE `sequencia_delineamento` (
  `id` int(11) NOT NULL,
  `id_delineamento` int(11) NOT NULL,
  `repeticao` int(11) NOT NULL,
  `sorteio` int(11) NOT NULL,
  `nt` int(11) NOT NULL,
  `bloco` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `sequencia_delineamento`
--

INSERT INTO `sequencia_delineamento` (`id`, `id_delineamento`, `repeticao`, `sorteio`, `nt`, `bloco`, `status`, `created_by`, `created_at`) VALUES
(1, 1, 1, 1, 1, 1, 1, 2, '2022-10-28 14:29:19.477'),
(2, 1, 1, 2, 2, 1, 1, 2, '2022-10-28 14:29:19.534'),
(3, 1, 1, 3, 3, 1, 1, 2, '2022-10-28 14:29:19.559'),
(4, 1, 1, 4, 4, 1, 1, 2, '2022-10-28 14:29:19.578'),
(5, 1, 1, 5, 5, 1, 1, 2, '2022-10-28 14:29:19.598'),
(6, 1, 1, 6, 6, 1, 1, 2, '2022-10-28 14:29:19.618'),
(7, 1, 1, 7, 7, 1, 1, 2, '2022-10-28 14:29:19.638'),
(8, 1, 1, 8, 8, 1, 1, 2, '2022-10-28 14:29:19.657'),
(9, 1, 1, 9, 9, 1, 1, 2, '2022-10-28 14:29:19.676'),
(10, 1, 1, 10, 10, 1, 1, 2, '2022-10-28 14:29:19.696'),
(11, 1, 1, 11, 11, 1, 1, 2, '2022-10-28 14:29:19.717'),
(12, 1, 1, 12, 12, 1, 1, 2, '2022-10-28 14:29:19.738'),
(13, 1, 1, 13, 13, 1, 1, 2, '2022-10-28 14:29:19.759'),
(14, 1, 1, 14, 14, 1, 1, 2, '2022-10-28 14:29:19.779'),
(15, 1, 1, 15, 15, 1, 1, 2, '2022-10-28 14:29:19.798'),
(16, 1, 1, 16, 16, 1, 1, 2, '2022-10-28 14:29:19.818'),
(17, 1, 1, 17, 17, 1, 1, 2, '2022-10-28 14:29:19.836'),
(18, 1, 1, 18, 18, 1, 1, 2, '2022-10-28 14:29:19.856'),
(19, 1, 1, 19, 19, 1, 1, 2, '2022-10-28 14:29:19.873'),
(20, 1, 1, 20, 20, 1, 1, 2, '2022-10-28 14:29:19.891'),
(21, 1, 1, 21, 21, 1, 1, 2, '2022-10-28 14:29:19.910'),
(22, 1, 1, 22, 22, 1, 1, 2, '2022-10-28 14:29:19.929'),
(23, 1, 1, 23, 23, 1, 1, 2, '2022-10-28 14:29:19.947'),
(24, 1, 1, 24, 24, 1, 1, 2, '2022-10-28 14:29:19.965'),
(25, 1, 1, 25, 25, 1, 1, 2, '2022-10-28 14:29:19.983'),
(26, 1, 1, 26, 26, 1, 1, 2, '2022-10-28 14:29:20.003'),
(27, 1, 1, 27, 27, 1, 1, 2, '2022-10-28 14:29:20.021'),
(28, 1, 1, 28, 28, 1, 1, 2, '2022-10-28 14:29:20.038'),
(29, 1, 1, 29, 29, 1, 1, 2, '2022-10-28 14:29:20.056'),
(30, 1, 1, 30, 30, 1, 1, 2, '2022-10-28 14:29:20.075'),
(31, 1, 2, 31, 1, 2, 1, 2, '2022-10-28 14:29:20.094'),
(32, 1, 2, 32, 15, 2, 1, 2, '2022-10-28 14:29:20.115'),
(33, 1, 2, 33, 6, 2, 1, 2, '2022-10-28 14:29:20.133'),
(34, 1, 2, 34, 11, 2, 1, 2, '2022-10-28 14:29:20.152'),
(35, 1, 2, 35, 29, 2, 1, 2, '2022-10-28 14:29:20.172'),
(36, 1, 2, 36, 8, 2, 1, 2, '2022-10-28 14:29:20.191'),
(37, 1, 2, 37, 28, 2, 1, 2, '2022-10-28 14:29:20.209'),
(38, 1, 2, 38, 7, 2, 1, 2, '2022-10-28 14:29:20.229'),
(39, 1, 2, 39, 27, 2, 1, 2, '2022-10-28 14:29:20.249'),
(40, 1, 2, 40, 5, 2, 1, 2, '2022-10-28 14:29:20.270'),
(41, 1, 2, 41, 24, 2, 1, 2, '2022-10-28 14:29:20.290'),
(42, 1, 2, 42, 10, 2, 1, 2, '2022-10-28 14:29:20.308'),
(43, 1, 2, 43, 4, 2, 1, 2, '2022-10-28 14:29:20.327'),
(44, 1, 2, 44, 21, 2, 1, 2, '2022-10-28 14:29:20.345'),
(45, 1, 2, 45, 19, 2, 1, 2, '2022-10-28 14:29:20.363'),
(46, 1, 2, 46, 16, 2, 1, 2, '2022-10-28 14:29:20.382'),
(47, 1, 2, 47, 20, 2, 1, 2, '2022-10-28 14:29:20.403'),
(48, 1, 2, 48, 2, 2, 1, 2, '2022-10-28 14:29:20.422'),
(49, 1, 2, 49, 18, 2, 1, 2, '2022-10-28 14:29:20.441'),
(50, 1, 2, 50, 23, 2, 1, 2, '2022-10-28 14:29:20.459'),
(51, 1, 2, 51, 14, 2, 1, 2, '2022-10-28 14:29:20.479'),
(52, 1, 2, 52, 30, 2, 1, 2, '2022-10-28 14:29:20.498'),
(53, 1, 2, 53, 17, 2, 1, 2, '2022-10-28 14:29:20.516'),
(54, 1, 2, 54, 22, 2, 1, 2, '2022-10-28 14:29:20.535'),
(55, 1, 2, 55, 3, 2, 1, 2, '2022-10-28 14:29:20.555'),
(56, 1, 2, 56, 12, 2, 1, 2, '2022-10-28 14:29:20.577'),
(57, 1, 2, 57, 9, 2, 1, 2, '2022-10-28 14:29:20.597'),
(58, 1, 2, 58, 26, 2, 1, 2, '2022-10-28 14:29:20.615'),
(59, 1, 2, 59, 25, 2, 1, 2, '2022-10-28 14:29:20.634'),
(60, 1, 2, 60, 13, 2, 1, 2, '2022-10-28 14:29:20.653'),
(61, 1, 3, 61, 7, 3, 1, 2, '2022-10-28 14:29:20.675'),
(62, 1, 3, 62, 8, 3, 1, 2, '2022-10-28 14:29:20.694'),
(63, 1, 3, 63, 10, 3, 1, 2, '2022-10-28 14:29:20.713'),
(64, 1, 3, 64, 16, 3, 1, 2, '2022-10-28 14:29:20.731'),
(65, 1, 3, 65, 23, 3, 1, 2, '2022-10-28 14:29:20.752'),
(66, 1, 3, 66, 1, 3, 1, 2, '2022-10-28 14:29:20.774'),
(67, 1, 3, 67, 25, 3, 1, 2, '2022-10-28 14:29:20.794'),
(68, 1, 3, 68, 30, 3, 1, 2, '2022-10-28 14:29:20.814'),
(69, 1, 3, 69, 28, 3, 1, 2, '2022-10-28 14:29:20.836'),
(70, 1, 3, 70, 29, 3, 1, 2, '2022-10-28 14:29:20.855'),
(71, 1, 3, 71, 27, 3, 1, 2, '2022-10-28 14:29:20.877'),
(72, 1, 3, 72, 22, 3, 1, 2, '2022-10-28 14:29:20.898'),
(73, 1, 3, 73, 3, 3, 1, 2, '2022-10-28 14:29:20.919'),
(74, 1, 3, 74, 24, 3, 1, 2, '2022-10-28 14:29:20.940'),
(75, 1, 3, 75, 18, 3, 1, 2, '2022-10-28 14:29:20.960'),
(76, 1, 3, 76, 20, 3, 1, 2, '2022-10-28 14:29:20.980'),
(77, 1, 3, 77, 15, 3, 1, 2, '2022-10-28 14:29:20.999'),
(78, 1, 3, 78, 5, 3, 1, 2, '2022-10-28 14:29:21.020'),
(79, 1, 3, 79, 12, 3, 1, 2, '2022-10-28 14:29:21.039'),
(80, 1, 3, 80, 6, 3, 1, 2, '2022-10-28 14:29:21.059'),
(81, 1, 3, 81, 4, 3, 1, 2, '2022-10-28 14:29:21.079'),
(82, 1, 3, 82, 11, 3, 1, 2, '2022-10-28 14:29:21.098'),
(83, 1, 3, 83, 14, 3, 1, 2, '2022-10-28 14:29:21.118'),
(84, 1, 3, 84, 19, 3, 1, 2, '2022-10-28 14:29:21.137'),
(85, 1, 3, 85, 13, 3, 1, 2, '2022-10-28 14:29:21.156'),
(86, 1, 3, 86, 9, 3, 1, 2, '2022-10-28 14:29:21.175'),
(87, 1, 3, 87, 21, 3, 1, 2, '2022-10-28 14:29:21.194'),
(88, 1, 3, 88, 26, 3, 1, 2, '2022-10-28 14:29:21.220'),
(89, 1, 3, 89, 2, 3, 1, 2, '2022-10-28 14:29:21.243'),
(90, 1, 3, 90, 17, 3, 1, 2, '2022-10-28 14:29:21.265'),
(91, 2, 1, 1, 1, 1, 1, 2, '2022-10-28 14:29:21.288'),
(92, 2, 1, 2, 2, 1, 1, 2, '2022-10-28 14:29:21.309'),
(93, 2, 1, 3, 3, 1, 1, 2, '2022-10-28 14:29:21.329'),
(94, 2, 1, 4, 4, 1, 1, 2, '2022-10-28 14:29:21.347'),
(95, 2, 1, 5, 5, 1, 1, 2, '2022-10-28 14:29:21.368'),
(96, 2, 1, 6, 6, 1, 1, 2, '2022-10-28 14:29:21.386'),
(97, 2, 1, 7, 7, 1, 1, 2, '2022-10-28 14:29:21.404'),
(98, 2, 1, 8, 8, 1, 1, 2, '2022-10-28 14:29:21.422'),
(99, 2, 1, 9, 9, 1, 1, 2, '2022-10-28 14:29:21.442'),
(100, 2, 1, 10, 10, 1, 1, 2, '2022-10-28 14:29:21.461'),
(101, 2, 1, 11, 11, 1, 1, 2, '2022-10-28 14:29:21.480'),
(102, 2, 1, 12, 12, 1, 1, 2, '2022-10-28 14:29:21.499'),
(103, 2, 1, 13, 13, 1, 1, 2, '2022-10-28 14:29:21.517'),
(104, 2, 1, 14, 14, 1, 1, 2, '2022-10-28 14:29:21.535'),
(105, 2, 1, 15, 15, 1, 1, 2, '2022-10-28 14:29:21.554'),
(106, 2, 1, 16, 16, 1, 1, 2, '2022-10-28 14:29:21.575'),
(107, 2, 1, 17, 17, 1, 1, 2, '2022-10-28 14:29:21.594'),
(108, 2, 1, 18, 18, 1, 1, 2, '2022-10-28 14:29:21.613'),
(109, 2, 1, 19, 19, 1, 1, 2, '2022-10-28 14:29:21.632'),
(110, 2, 1, 20, 20, 1, 1, 2, '2022-10-28 14:29:21.649'),
(111, 2, 1, 21, 21, 1, 1, 2, '2022-10-28 14:29:21.666'),
(112, 2, 1, 22, 22, 1, 1, 2, '2022-10-28 14:29:21.682'),
(113, 2, 1, 23, 23, 1, 1, 2, '2022-10-28 14:29:21.701'),
(114, 2, 1, 24, 24, 1, 1, 2, '2022-10-28 14:29:21.719'),
(115, 2, 1, 25, 25, 1, 1, 2, '2022-10-28 14:29:21.737'),
(116, 2, 2, 26, 1, 2, 1, 2, '2022-10-28 14:29:21.772'),
(117, 2, 2, 27, 15, 2, 1, 2, '2022-10-28 14:29:21.797'),
(118, 2, 2, 28, 6, 2, 1, 2, '2022-10-28 14:29:21.820'),
(119, 2, 2, 29, 11, 2, 1, 2, '2022-10-28 14:29:21.853'),
(120, 2, 2, 30, 8, 2, 1, 2, '2022-10-28 14:29:21.871'),
(121, 2, 2, 31, 7, 2, 1, 2, '2022-10-28 14:29:21.890'),
(122, 2, 2, 32, 5, 2, 1, 2, '2022-10-28 14:29:21.907'),
(123, 2, 2, 33, 24, 2, 1, 2, '2022-10-28 14:29:21.926'),
(124, 2, 2, 34, 10, 2, 1, 2, '2022-10-28 14:29:21.944'),
(125, 2, 2, 35, 4, 2, 1, 2, '2022-10-28 14:29:21.962'),
(126, 2, 2, 36, 21, 2, 1, 2, '2022-10-28 14:29:21.982'),
(127, 2, 2, 37, 19, 2, 1, 2, '2022-10-28 14:29:22.000'),
(128, 2, 2, 38, 16, 2, 1, 2, '2022-10-28 14:29:22.019'),
(129, 2, 2, 39, 20, 2, 1, 2, '2022-10-28 14:29:22.039'),
(130, 2, 2, 40, 2, 2, 1, 2, '2022-10-28 14:29:22.058'),
(131, 2, 2, 41, 18, 2, 1, 2, '2022-10-28 14:29:22.079'),
(132, 2, 2, 42, 23, 2, 1, 2, '2022-10-28 14:29:22.099'),
(133, 2, 2, 43, 14, 2, 1, 2, '2022-10-28 14:29:22.119'),
(134, 2, 2, 44, 17, 2, 1, 2, '2022-10-28 14:29:22.137'),
(135, 2, 2, 45, 22, 2, 1, 2, '2022-10-28 14:29:22.155'),
(136, 2, 2, 46, 3, 2, 1, 2, '2022-10-28 14:29:22.173'),
(137, 2, 2, 47, 12, 2, 1, 2, '2022-10-28 14:29:22.191'),
(138, 2, 2, 48, 9, 2, 1, 2, '2022-10-28 14:29:22.209'),
(139, 2, 2, 49, 25, 2, 1, 2, '2022-10-28 14:29:22.227'),
(140, 2, 2, 50, 13, 2, 1, 2, '2022-10-28 14:29:22.246'),
(141, 2, 3, 51, 7, 3, 1, 2, '2022-10-28 14:29:22.264'),
(142, 2, 3, 52, 8, 3, 1, 2, '2022-10-28 14:29:22.284'),
(143, 2, 3, 53, 10, 3, 1, 2, '2022-10-28 14:29:22.303'),
(144, 2, 3, 54, 16, 3, 1, 2, '2022-10-28 14:29:22.321'),
(145, 2, 3, 55, 23, 3, 1, 2, '2022-10-28 14:29:22.340'),
(146, 2, 3, 56, 1, 3, 1, 2, '2022-10-28 14:29:22.359'),
(147, 2, 3, 57, 25, 3, 1, 2, '2022-10-28 14:29:22.379'),
(148, 2, 3, 58, 22, 3, 1, 2, '2022-10-28 14:29:22.398'),
(149, 2, 3, 59, 3, 3, 1, 2, '2022-10-28 14:29:22.416'),
(150, 2, 3, 60, 24, 3, 1, 2, '2022-10-28 14:29:22.434'),
(151, 2, 3, 61, 18, 3, 1, 2, '2022-10-28 14:29:22.452'),
(152, 2, 3, 62, 20, 3, 1, 2, '2022-10-28 14:29:22.472'),
(153, 2, 3, 63, 15, 3, 1, 2, '2022-10-28 14:29:22.492'),
(154, 2, 3, 64, 5, 3, 1, 2, '2022-10-28 14:29:22.511'),
(155, 2, 3, 65, 12, 3, 1, 2, '2022-10-28 14:29:22.529'),
(156, 2, 3, 66, 6, 3, 1, 2, '2022-10-28 14:29:22.548'),
(157, 2, 3, 67, 4, 3, 1, 2, '2022-10-28 14:29:22.570'),
(158, 2, 3, 68, 11, 3, 1, 2, '2022-10-28 14:29:22.591'),
(159, 2, 3, 69, 14, 3, 1, 2, '2022-10-28 14:29:22.608'),
(160, 2, 3, 70, 19, 3, 1, 2, '2022-10-28 14:29:22.627'),
(161, 2, 3, 71, 13, 3, 1, 2, '2022-10-28 14:29:22.646'),
(162, 2, 3, 72, 9, 3, 1, 2, '2022-10-28 14:29:22.665'),
(163, 2, 3, 73, 21, 3, 1, 2, '2022-10-28 14:29:22.684'),
(164, 2, 3, 74, 2, 3, 1, 2, '2022-10-28 14:29:22.704'),
(165, 2, 3, 75, 17, 3, 1, 2, '2022-10-28 14:29:22.724'),
(166, 3, 1, 1, 1, 1, 1, 2, '2022-10-29 15:29:43.711'),
(167, 3, 1, 2, 2, 1, 1, 2, '2022-10-29 15:29:43.748'),
(168, 3, 1, 3, 3, 1, 1, 2, '2022-10-29 15:29:43.767'),
(169, 3, 1, 4, 4, 1, 1, 2, '2022-10-29 15:29:43.787'),
(170, 3, 1, 5, 5, 1, 1, 2, '2022-10-29 15:29:43.806'),
(171, 3, 1, 6, 6, 1, 1, 2, '2022-10-29 15:29:43.827'),
(172, 3, 1, 7, 7, 1, 1, 2, '2022-10-29 15:29:43.846'),
(173, 3, 1, 8, 8, 1, 1, 2, '2022-10-29 15:29:43.865'),
(174, 3, 1, 9, 9, 1, 1, 2, '2022-10-29 15:29:43.883'),
(175, 3, 1, 10, 10, 1, 1, 2, '2022-10-29 15:29:43.902'),
(176, 3, 1, 11, 11, 1, 1, 2, '2022-10-29 15:29:43.920'),
(177, 3, 1, 12, 12, 1, 1, 2, '2022-10-29 15:29:43.938'),
(178, 3, 1, 13, 13, 1, 1, 2, '2022-10-29 15:29:43.956'),
(179, 3, 1, 14, 14, 1, 1, 2, '2022-10-29 15:29:43.975'),
(180, 3, 1, 15, 15, 1, 1, 2, '2022-10-29 15:29:43.994'),
(181, 3, 1, 16, 16, 1, 1, 2, '2022-10-29 15:29:44.014'),
(182, 3, 1, 17, 17, 1, 1, 2, '2022-10-29 15:29:44.035'),
(183, 3, 1, 18, 18, 1, 1, 2, '2022-10-29 15:29:44.057'),
(184, 3, 1, 19, 19, 1, 1, 2, '2022-10-29 15:29:44.075'),
(185, 3, 1, 20, 20, 1, 1, 2, '2022-10-29 15:29:44.092'),
(186, 3, 1, 21, 21, 1, 1, 2, '2022-10-29 15:29:44.116'),
(187, 3, 1, 22, 22, 1, 1, 2, '2022-10-29 15:29:44.135'),
(188, 3, 1, 23, 23, 1, 1, 2, '2022-10-29 15:29:44.153'),
(189, 3, 1, 24, 24, 1, 1, 2, '2022-10-29 15:29:44.170'),
(190, 3, 1, 25, 25, 1, 1, 2, '2022-10-29 15:29:44.187'),
(191, 3, 1, 26, 26, 1, 1, 2, '2022-10-29 15:29:44.204'),
(192, 3, 1, 27, 27, 1, 1, 2, '2022-10-29 15:29:44.222'),
(193, 3, 1, 28, 28, 1, 1, 2, '2022-10-29 15:29:44.241'),
(194, 3, 1, 29, 29, 1, 1, 2, '2022-10-29 15:29:44.259'),
(195, 3, 1, 30, 30, 1, 1, 2, '2022-10-29 15:29:44.277'),
(196, 3, 2, 31, 1, 2, 1, 2, '2022-10-29 15:29:44.295'),
(197, 3, 2, 32, 15, 2, 1, 2, '2022-10-29 15:29:44.313'),
(198, 3, 2, 33, 6, 2, 1, 2, '2022-10-29 15:29:44.331'),
(199, 3, 2, 34, 11, 2, 1, 2, '2022-10-29 15:29:44.350'),
(200, 3, 2, 35, 29, 2, 1, 2, '2022-10-29 15:29:44.370'),
(201, 3, 2, 36, 8, 2, 1, 2, '2022-10-29 15:29:44.389'),
(202, 3, 2, 37, 28, 2, 1, 2, '2022-10-29 15:29:44.407'),
(203, 3, 2, 38, 7, 2, 1, 2, '2022-10-29 15:29:44.424'),
(204, 3, 2, 39, 27, 2, 1, 2, '2022-10-29 15:29:44.442'),
(205, 3, 2, 40, 5, 2, 1, 2, '2022-10-29 15:29:44.462'),
(206, 3, 2, 41, 24, 2, 1, 2, '2022-10-29 15:29:44.480'),
(207, 3, 2, 42, 10, 2, 1, 2, '2022-10-29 15:29:44.498'),
(208, 3, 2, 43, 4, 2, 1, 2, '2022-10-29 15:29:44.517'),
(209, 3, 2, 44, 21, 2, 1, 2, '2022-10-29 15:29:44.536'),
(210, 3, 2, 45, 19, 2, 1, 2, '2022-10-29 15:29:44.555'),
(211, 3, 2, 46, 16, 2, 1, 2, '2022-10-29 15:29:44.573'),
(212, 3, 2, 47, 20, 2, 1, 2, '2022-10-29 15:29:44.592'),
(213, 3, 2, 48, 2, 2, 1, 2, '2022-10-29 15:29:44.609'),
(214, 3, 2, 49, 18, 2, 1, 2, '2022-10-29 15:29:44.626'),
(215, 3, 2, 50, 23, 2, 1, 2, '2022-10-29 15:29:44.643'),
(216, 3, 2, 51, 14, 2, 1, 2, '2022-10-29 15:29:44.662'),
(217, 3, 2, 52, 30, 2, 1, 2, '2022-10-29 15:29:44.681'),
(218, 3, 2, 53, 17, 2, 1, 2, '2022-10-29 15:29:44.699'),
(219, 3, 2, 54, 22, 2, 1, 2, '2022-10-29 15:29:44.717'),
(220, 3, 2, 55, 3, 2, 1, 2, '2022-10-29 15:29:44.735'),
(221, 3, 2, 56, 12, 2, 1, 2, '2022-10-29 15:29:44.753'),
(222, 3, 2, 57, 9, 2, 1, 2, '2022-10-29 15:29:44.775'),
(223, 3, 2, 58, 26, 2, 1, 2, '2022-10-29 15:29:44.795'),
(224, 3, 2, 59, 25, 2, 1, 2, '2022-10-29 15:29:44.815'),
(225, 3, 2, 60, 13, 2, 1, 2, '2022-10-29 15:29:44.833'),
(226, 3, 3, 61, 7, 3, 1, 2, '2022-10-29 15:29:44.851'),
(227, 3, 3, 62, 8, 3, 1, 2, '2022-10-29 15:29:44.869'),
(228, 3, 3, 63, 10, 3, 1, 2, '2022-10-29 15:29:44.887'),
(229, 3, 3, 64, 16, 3, 1, 2, '2022-10-29 15:29:44.907'),
(230, 3, 3, 65, 23, 3, 1, 2, '2022-10-29 15:29:44.925'),
(231, 3, 3, 66, 1, 3, 1, 2, '2022-10-29 15:29:44.944'),
(232, 3, 3, 67, 25, 3, 1, 2, '2022-10-29 15:29:44.963'),
(233, 3, 3, 68, 30, 3, 1, 2, '2022-10-29 15:29:44.983'),
(234, 3, 3, 69, 28, 3, 1, 2, '2022-10-29 15:29:45.004'),
(235, 3, 3, 70, 29, 3, 1, 2, '2022-10-29 15:29:45.026'),
(236, 3, 3, 71, 27, 3, 1, 2, '2022-10-29 15:29:45.046'),
(237, 3, 3, 72, 22, 3, 1, 2, '2022-10-29 15:29:45.067'),
(238, 3, 3, 73, 3, 3, 1, 2, '2022-10-29 15:29:45.087'),
(239, 3, 3, 74, 24, 3, 1, 2, '2022-10-29 15:29:45.107'),
(240, 3, 3, 75, 18, 3, 1, 2, '2022-10-29 15:29:45.127'),
(241, 3, 3, 76, 20, 3, 1, 2, '2022-10-29 15:29:45.150'),
(242, 3, 3, 77, 15, 3, 1, 2, '2022-10-29 15:29:45.169'),
(243, 3, 3, 78, 5, 3, 1, 2, '2022-10-29 15:29:45.188'),
(244, 3, 3, 79, 12, 3, 1, 2, '2022-10-29 15:29:45.209'),
(245, 3, 3, 80, 6, 3, 1, 2, '2022-10-29 15:29:45.229'),
(246, 3, 3, 81, 4, 3, 1, 2, '2022-10-29 15:29:45.247'),
(247, 3, 3, 82, 11, 3, 1, 2, '2022-10-29 15:29:45.267'),
(248, 3, 3, 83, 14, 3, 1, 2, '2022-10-29 15:29:45.286'),
(249, 3, 3, 84, 19, 3, 1, 2, '2022-10-29 15:29:45.307'),
(250, 3, 3, 85, 13, 3, 1, 2, '2022-10-29 15:29:45.326'),
(251, 3, 3, 86, 9, 3, 1, 2, '2022-10-29 15:29:45.344'),
(252, 3, 3, 87, 21, 3, 1, 2, '2022-10-29 15:29:45.364'),
(253, 3, 3, 88, 26, 3, 1, 2, '2022-10-29 15:29:45.390'),
(254, 3, 3, 89, 2, 3, 1, 2, '2022-10-29 15:29:45.410'),
(255, 3, 3, 90, 17, 3, 1, 2, '2022-10-29 15:29:45.431'),
(256, 4, 1, 1, 1, 1, 1, 2, '2022-10-29 15:29:45.455'),
(257, 4, 1, 2, 2, 1, 1, 2, '2022-10-29 15:29:45.473'),
(258, 4, 1, 3, 3, 1, 1, 2, '2022-10-29 15:29:45.491'),
(259, 4, 1, 4, 4, 1, 1, 2, '2022-10-29 15:29:45.510'),
(260, 4, 1, 5, 5, 1, 1, 2, '2022-10-29 15:29:45.527'),
(261, 4, 1, 6, 6, 1, 1, 2, '2022-10-29 15:29:45.546'),
(262, 4, 1, 7, 7, 1, 1, 2, '2022-10-29 15:29:45.565'),
(263, 4, 1, 8, 8, 1, 1, 2, '2022-10-29 15:29:45.583'),
(264, 4, 1, 9, 9, 1, 1, 2, '2022-10-29 15:29:45.602'),
(265, 4, 1, 10, 10, 1, 1, 2, '2022-10-29 15:29:45.619'),
(266, 4, 1, 11, 11, 1, 1, 2, '2022-10-29 15:29:45.642'),
(267, 4, 1, 12, 12, 1, 1, 2, '2022-10-29 15:29:45.660'),
(268, 4, 1, 13, 13, 1, 1, 2, '2022-10-29 15:29:45.678'),
(269, 4, 1, 14, 14, 1, 1, 2, '2022-10-29 15:29:45.700'),
(270, 4, 1, 15, 15, 1, 1, 2, '2022-10-29 15:29:45.718'),
(271, 4, 1, 16, 16, 1, 1, 2, '2022-10-29 15:29:45.735'),
(272, 4, 1, 17, 17, 1, 1, 2, '2022-10-29 15:29:45.751'),
(273, 4, 1, 18, 18, 1, 1, 2, '2022-10-29 15:29:45.769'),
(274, 4, 1, 19, 19, 1, 1, 2, '2022-10-29 15:29:45.786'),
(275, 4, 1, 20, 20, 1, 1, 2, '2022-10-29 15:29:45.803'),
(276, 4, 1, 21, 21, 1, 1, 2, '2022-10-29 15:29:45.823'),
(277, 4, 1, 22, 22, 1, 1, 2, '2022-10-29 15:29:45.841'),
(278, 4, 1, 23, 23, 1, 1, 2, '2022-10-29 15:29:45.857'),
(279, 4, 1, 24, 24, 1, 1, 2, '2022-10-29 15:29:45.876'),
(280, 4, 1, 25, 25, 1, 1, 2, '2022-10-29 15:29:45.895'),
(281, 4, 2, 26, 1, 2, 1, 2, '2022-10-29 15:29:45.914'),
(282, 4, 2, 27, 15, 2, 1, 2, '2022-10-29 15:29:45.933'),
(283, 4, 2, 28, 6, 2, 1, 2, '2022-10-29 15:29:45.953'),
(284, 4, 2, 29, 11, 2, 1, 2, '2022-10-29 15:29:45.972'),
(285, 4, 2, 30, 8, 2, 1, 2, '2022-10-29 15:29:45.992'),
(286, 4, 2, 31, 7, 2, 1, 2, '2022-10-29 15:29:46.011'),
(287, 4, 2, 32, 5, 2, 1, 2, '2022-10-29 15:29:46.029'),
(288, 4, 2, 33, 24, 2, 1, 2, '2022-10-29 15:29:46.047'),
(289, 4, 2, 34, 10, 2, 1, 2, '2022-10-29 15:29:46.067'),
(290, 4, 2, 35, 4, 2, 1, 2, '2022-10-29 15:29:46.085'),
(291, 4, 2, 36, 21, 2, 1, 2, '2022-10-29 15:29:46.104'),
(292, 4, 2, 37, 19, 2, 1, 2, '2022-10-29 15:29:46.123'),
(293, 4, 2, 38, 16, 2, 1, 2, '2022-10-29 15:29:46.142'),
(294, 4, 2, 39, 20, 2, 1, 2, '2022-10-29 15:29:46.161'),
(295, 4, 2, 40, 2, 2, 1, 2, '2022-10-29 15:29:46.179'),
(296, 4, 2, 41, 18, 2, 1, 2, '2022-10-29 15:29:46.197'),
(297, 4, 2, 42, 23, 2, 1, 2, '2022-10-29 15:29:46.216'),
(298, 4, 2, 43, 14, 2, 1, 2, '2022-10-29 15:29:46.236'),
(299, 4, 2, 44, 17, 2, 1, 2, '2022-10-29 15:29:46.254'),
(300, 4, 2, 45, 22, 2, 1, 2, '2022-10-29 15:29:46.273'),
(301, 4, 2, 46, 3, 2, 1, 2, '2022-10-29 15:29:46.292'),
(302, 4, 2, 47, 12, 2, 1, 2, '2022-10-29 15:29:46.310'),
(303, 4, 2, 48, 9, 2, 1, 2, '2022-10-29 15:29:46.328'),
(304, 4, 2, 49, 25, 2, 1, 2, '2022-10-29 15:29:46.346'),
(305, 4, 2, 50, 13, 2, 1, 2, '2022-10-29 15:29:46.366'),
(306, 4, 3, 51, 7, 3, 1, 2, '2022-10-29 15:29:46.386'),
(307, 4, 3, 52, 8, 3, 1, 2, '2022-10-29 15:29:46.404'),
(308, 4, 3, 53, 10, 3, 1, 2, '2022-10-29 15:29:46.421'),
(309, 4, 3, 54, 16, 3, 1, 2, '2022-10-29 15:29:46.440'),
(310, 4, 3, 55, 23, 3, 1, 2, '2022-10-29 15:29:46.458'),
(311, 4, 3, 56, 1, 3, 1, 2, '2022-10-29 15:29:46.476'),
(312, 4, 3, 57, 25, 3, 1, 2, '2022-10-29 15:29:46.494'),
(313, 4, 3, 58, 22, 3, 1, 2, '2022-10-29 15:29:46.513'),
(314, 4, 3, 59, 3, 3, 1, 2, '2022-10-29 15:29:46.531'),
(315, 4, 3, 60, 24, 3, 1, 2, '2022-10-29 15:29:46.552'),
(316, 4, 3, 61, 18, 3, 1, 2, '2022-10-29 15:29:46.571'),
(317, 4, 3, 62, 20, 3, 1, 2, '2022-10-29 15:29:46.592'),
(318, 4, 3, 63, 15, 3, 1, 2, '2022-10-29 15:29:46.611'),
(319, 4, 3, 64, 5, 3, 1, 2, '2022-10-29 15:29:46.629'),
(320, 4, 3, 65, 12, 3, 1, 2, '2022-10-29 15:29:46.646'),
(321, 4, 3, 66, 6, 3, 1, 2, '2022-10-29 15:29:46.666'),
(322, 4, 3, 67, 4, 3, 1, 2, '2022-10-29 15:29:46.683'),
(323, 4, 3, 68, 11, 3, 1, 2, '2022-10-29 15:29:46.702'),
(324, 4, 3, 69, 14, 3, 1, 2, '2022-10-29 15:29:46.721'),
(325, 4, 3, 70, 19, 3, 1, 2, '2022-10-29 15:29:46.739'),
(326, 4, 3, 71, 13, 3, 1, 2, '2022-10-29 15:29:46.759'),
(327, 4, 3, 72, 9, 3, 1, 2, '2022-10-29 15:29:46.779'),
(328, 4, 3, 73, 21, 3, 1, 2, '2022-10-29 15:29:46.798'),
(329, 4, 3, 74, 2, 3, 1, 2, '2022-10-29 15:29:46.817'),
(330, 4, 3, 75, 17, 3, 1, 2, '2022-10-29 15:29:46.837');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tecnologia`
--

CREATE TABLE `tecnologia` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `desc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cod_tec` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `dt_export` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `tecnologia`
--

INSERT INTO `tecnologia` (`id`, `id_culture`, `name`, `created_by`, `created_at`, `desc`, `cod_tec`, `dt_export`) VALUES
(1, 22, 'HAHB4', 23, '2022-10-28 12:31:28.830', 'HB4', '06', '2022-10-25 09:07:06.000'),
(2, 22, 'RR1', 23, '2022-10-28 12:31:28.836', 'RR1', '01', '2022-10-25 09:07:06.000'),
(3, 22, 'INTACTA(RR2+BT)', 23, '2022-10-28 12:31:28.839', 'RR2BT', '02', '2022-10-25 09:07:06.000'),
(4, 22, 'E3', 23, '2022-10-28 12:31:28.839', 'E3', '03', '2022-10-25 09:07:06.000'),
(5, 22, 'INTACTA 2 XTEND', 23, '2022-10-28 12:31:28.840', 'I2XTEND', '08', '2022-10-25 09:07:06.000'),
(6, 22, 'FG72-LL', 23, '2022-10-28 12:31:28.844', 'FG-LL', '09', '2022-10-25 09:07:06.000'),
(7, 22, 'XTEND', 23, '2022-10-28 12:31:28.845', 'XTEND', '10', '2022-10-25 09:07:06.000'),
(8, 22, 'CAL', 23, '2022-10-28 12:31:28.850', 'CAL', '11', '2022-10-25 09:07:06.000'),
(9, 22, 'HAHB4 + RR1', 23, '2022-10-28 12:31:28.856', 'HB4+RR1', '07', '2022-10-25 09:07:06.000'),
(10, 22, 'XP', 23, '2022-10-28 12:31:28.849', 'XP', '12', '2022-10-25 09:07:06.000'),
(11, 22, 'E2', 23, '2022-10-28 12:31:28.877', 'E2', '04', '2022-10-25 09:07:06.000'),
(12, 22, 'RR2', 23, '2022-10-28 12:35:32.545', 'RR2', '00', '2022-10-25 09:07:06.000'),
(13, 27, 'HHH', 38, '2022-10-28 19:03:45.925', 'HH', '17', '2022-10-01 04:10:10.000'),
(14, 27, 'DDD', 38, '2022-10-28 19:03:45.925', 'DD', '13', '2022-10-01 04:10:10.000'),
(15, 27, 'MMA23', 38, '2022-10-28 19:03:45.926', 'MM', '10', '2022-10-01 04:10:10.000'),
(16, 27, 'CCC', 38, '2022-10-28 19:03:45.928', 'CC', '12', '2022-10-01 04:10:10.000'),
(17, 27, 'BBB', 38, '2022-10-28 19:03:45.927', 'BB', '11', '2022-10-01 04:10:10.000'),
(18, 27, 'EEE', 38, '2022-10-28 19:03:45.928', 'EE', '14', '2022-10-01 04:10:10.000'),
(19, 27, 'OOC67', 38, '2022-10-28 19:03:45.929', 'FF', '15', '2022-10-01 04:10:10.000'),
(20, 27, 'GGG', 38, '2022-10-28 19:03:45.930', 'GG', '16', '2022-10-01 04:10:10.000'),
(21, 23, 'RR1', 2, '2022-10-29 15:01:45.908', 'RR1', '01', '2022-09-26 09:07:05.795'),
(22, 23, 'HAHB4', 2, '2022-10-29 15:01:45.941', 'HB4', '06', '2022-09-26 09:07:05.795'),
(23, 23, 'conv', 2, '2022-10-29 15:01:45.940', 'conv', '00', '2022-09-26 09:07:05.795'),
(24, 23, 'INTACTA 2 XTEND', 2, '2022-10-29 15:01:45.944', 'I2XTEND', '08', '2022-09-26 09:07:05.795'),
(25, 23, 'CONV', 2, '2022-10-29 15:01:45.951', 'CONV', '00', '2022-09-26 09:07:05.795'),
(26, 23, 'E3', 2, '2022-10-29 15:01:45.952', 'E3', '03', '2022-09-26 09:07:05.795'),
(27, 23, 'IR-E3', 2, '2022-10-29 15:01:45.953', 'CE3', '04', '2022-09-26 09:07:05.795'),
(28, 23, 'FG72-LL', 2, '2022-10-29 15:01:45.966', 'FG-LL', '09', '2022-09-26 09:07:05.795'),
(29, 23, 'XTEND', 2, '2022-10-29 15:01:46.019', 'XTEND', '10', '2022-09-26 09:07:05.795'),
(30, 23, 'XP', 2, '2022-10-29 15:01:46.020', 'XP', '12', '2022-09-26 09:07:05.795'),
(31, 23, 'HAHB4 + RR1', 2, '2022-10-29 15:01:46.071', 'HB4+RR1', '07', '2022-09-26 09:07:05.795'),
(32, 23, 'INTACTA(RR2+BT)', 2, '2022-10-29 15:01:46.226', 'RR2BT', '02', '2022-09-26 09:07:05.795'),
(33, 23, 'CAL', 2, '2022-10-29 15:01:46.227', 'CAL', '11', '2022-09-26 09:07:05.795'),
(34, 27, 'OOC67', 38, '2022-10-30 17:23:23.012', 'OO', '30', '2022-10-01 04:10:10.000'),
(35, 27, 'QQE01', 38, '2022-10-30 17:23:23.014', 'QQ', '50', '2022-10-01 04:10:10.000'),
(36, 27, 'RRF12', 38, '2022-10-30 17:23:23.016', 'RR', '60', '2022-10-01 04:10:10.000'),
(37, 27, 'PPD89', 38, '2022-10-30 17:23:23.028', 'PP', '40', '2022-10-01 04:10:10.000'),
(38, 27, 'SSG32', 38, '2022-10-30 17:23:23.030', 'SS', '70', '2022-10-01 04:10:10.000'),
(39, 27, 'TTH42', 38, '2022-10-30 17:23:23.033', 'TT', '80', '2022-10-01 04:10:10.000'),
(40, 27, 'NNB45', 38, '2022-10-30 17:23:23.100', 'NN', '20', '2022-10-01 04:10:10.000'),
(71, 24, 'XP', 23, '2022-10-31 15:44:53.195', 'XP', '12', '2022-09-26 09:07:05.795'),
(72, 24, 'INTACTA 2 XTEND', 23, '2022-10-31 15:44:53.231', 'I2XTEND', '08', '2022-09-26 09:07:05.795'),
(73, 24, 'CAL', 23, '2022-10-31 15:44:53.329', 'CAL', '11', '2022-09-26 09:07:05.795'),
(74, 24, 'HAHB4 + RR1', 23, '2022-10-31 15:44:53.398', 'HB4+RR1', '07', '2022-09-26 09:07:05.795'),
(75, 24, 'E3', 23, '2022-10-31 15:44:53.464', 'E3', '03', '2022-09-26 09:07:05.795'),
(76, 24, 'FG72-LL', 23, '2022-10-31 15:44:53.460', 'FG-LL', '09', '2022-09-26 09:07:05.795'),
(77, 24, 'CONV', 23, '2022-10-31 15:44:53.469', 'gg', '00', '2022-09-25 09:07:06.000'),
(78, 24, 'HAHB4', 23, '2022-10-31 15:44:53.466', 'HB4', '06', '2022-09-26 09:07:05.795'),
(79, 24, 'IR-E3', 23, '2022-10-31 15:44:53.465', 'CE3', '04', '2022-09-26 09:07:05.795'),
(80, 24, 'XTEND', 23, '2022-10-31 15:44:53.466', 'XTEND', '10', '2022-09-26 09:07:05.795'),
(81, 24, 'INTACTA(RR2+BT)', 23, '2022-10-31 15:44:53.470', 'RR2BT', '02', '2022-09-26 09:07:05.795'),
(82, 24, 'RR1', 23, '2022-10-31 15:44:53.473', 'RR1', '01', '2022-09-26 09:07:05.795');

-- --------------------------------------------------------

--
-- Estrutura para tabela `type_assay`
--

CREATE TABLE `type_assay` (
  `id` int(11) NOT NULL,
  `id_culture` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_by` int(11) NOT NULL,
  `created_at` datetime(3) DEFAULT CURRENT_TIMESTAMP(3),
  `protocol_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `type_assay`
--

INSERT INTO `type_assay` (`id`, `id_culture`, `name`, `status`, `created_by`, `created_at`, `protocol_name`) VALUES
(1, 22, 'VBA', 0, 23, '2022-09-27 15:19:39.835', 'Avanço'),
(2, 22, 'VCU', 1, 23, '2022-09-27 15:19:49.510', 'Avanço'),
(3, 22, 'F2', 1, 2, '2022-09-27 19:45:39.120', 'Avanço'),
(4, 22, 'BCN-F1', 1, 2, '2022-09-27 19:47:42.737', 'Avanço'),
(5, 22, 'VCU', 0, 2, '2022-09-27 20:55:46.051', 'Produtividade'),
(6, 22, 'INT', 1, 2, '2022-09-27 21:07:00.936', 'Avanço'),
(7, 24, 'VCU', 1, 2, '2022-09-28 21:45:38.104', 'Avanço'),
(8, 24, 'F2', 1, 2, '2022-09-28 21:46:00.195', 'Avanço'),
(9, 24, 'BCN-F1', 1, 2, '2022-09-28 21:46:17.013', 'Avanço'),
(10, 22, 'F4', 1, 2, '2022-10-10 18:48:33.860', 'Avanço'),
(11, 27, 'INT', 1, 38, '2022-10-28 19:12:18.490', 'Avanço'),
(12, 23, 'INT', 1, 2, '2022-10-29 15:18:27.678', 'Avanço');

-- --------------------------------------------------------

--
-- Estrutura para tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpf` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `registration` int(11) DEFAULT NULL,
  `departmentId` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL,
  `login` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `cpf`, `tel`, `password`, `avatar`, `registration`, `departmentId`, `status`, `created_at`, `created_by`, `login`) VALUES
(2, 'Gabriel', 'gabriel@agroforce.com.br', '30144159015', '19978855474', '3c4d01067bf8', '', 1, 6, 1, '2022-03-23 00:00:00.000', 2, 'gabriel@agroforce.com.br'),
(3, 'Paulo Cesar2', 'paulo@gmail.com', '60615617093', '19975258774', '3c4d01', 'https://avatars.githubusercontent.com/u/55369778?v=4', 1, 6, 0, '2022-03-24 00:00:00.000', 2, 'paulo@gmail.com'),
(4, 'Jonatas Rosa Moura', 'jonatas.rmoura@agroforce.com.br', '98529217039', '(12)99870-4172', '3c4d01', 'https://avatars.githubusercontent.com/u/66448546?v=4', 1, 6, 0, '2022-03-24 00:00:00.000', 2, NULL),
(5, 'José', 'jose@gmail.com', '404.213.534-06', '(12)12231-2121', '3c4d01', NULL, NULL, 6, 0, '2022-03-25 21:02:15.577', 3, NULL),
(6, 'Teste', 'teste@agroforce.com.br', '463.484.331-53', '(11)54564-8789', '3c4d01', NULL, 212121212, 6, 0, '2022-03-25 21:04:18.628', 3, NULL),
(7, 'Cliente', 'cliente@agroforce.com.br', '040.781.740-94', '(12)33231-3213', '3c4d01067bf8', NULL, NULL, 6, 0, '2022-04-19 20:06:24.754', 3, NULL),
(8, 'Sérgio Kazuo Kasahara', 'sergiokazuo@tmg.agr.br', '407.092.778-65', '(99)99999-9999', '66', NULL, NULL, 9, 0, '2022-04-19 21:38:04.291', 2, 'k'),
(9, 'Sergio Suzuki', 'sergiosuzuki@tmg.agr.br', '594.892.930-24', '(99)99999-9999', '3c4d01067bf8', NULL, NULL, 6, 0, '2022-04-19 22:23:31.231', 2, 'sergiosuzuki@tmg.agr.br'),
(10, 'Pedro Soares Neves', 'Pedro.neves@agroforce.com.br', '461.452.688-83', '(16)99125-6799', '3c4d01067bf8', NULL, 123456, 6, 0, '2022-04-28 12:07:17.450', 2, 'pedro.neves@agroforce.com.br'),
(13, 'Paulo teste 2', 'pauloteste2@gmail.com', '053.037.250-90', '(12)31313-1313', '3c4d01067bf8', NULL, 12, 7, 0, '2022-04-28 13:01:20.375', 3, NULL),
(14, 'Teste', 'Gabriel@12345', '781.331.370-47', '(12)33232-3232', '3c4d01067bf8', NULL, NULL, 6, 0, '2022-04-28 13:04:04.091', 2, NULL),
(15, 'Teste 2', 'teste2@teste2.com', '845.866.290-61', '(12)31323-1312', '3c4d01067bf8', NULL, NULL, 6, 0, '2022-04-28 13:16:02.190', 3, NULL),
(16, 'Kazuo', 'sergio_kazuo@tmg.agr.br', '871.313.749-20', '(99)99999-9999', '3c4d01067bf8', NULL, 111, 6, 0, '2022-05-02 17:15:24.947', 8, NULL),
(17, 'Kazuo', 'sergio_kazuo2@tmg.agr.br', '018.766.238-02', '(33)33333-3333', '3c4e0303', NULL, NULL, 6, 0, '2022-05-02 17:16:38.215', 8, NULL),
(18, 'Amanda Alves', 'amandaalves@tmg.agr.br', '021.657.411-06', '(11)11111-1111', '3c4d01067bf8', NULL, 125, 3, 0, '2022-05-02 17:22:19.758', 2, 'amandaalves@tmg.agr.br'),
(19, 'T1', 't1@1', '121.331.161-68', '(11)1____-____', '7f0848771b86166bd95098161d6913', NULL, -1, 6, 0, '2022-05-02 19:54:06.014', 2, NULL),
(20, 'T2', 't2@1', '011.346.459-29', '(66)_____-____', '7f0848771b86166bd95098161d6913', NULL, NULL, 8, 0, '2022-05-02 20:00:18.270', 2, NULL),
(21, 'Paulo Secundary', 'paulo_secundary@gmail.com', '967.403.980-54', '', '3c4d01067bf8', NULL, 0, 6, 0, '2022-05-18 00:51:10.809', 3, NULL),
(22, 'Josefino', 'josefino@gmail.com', '908.485.880-88', '', '3c4d01067bf8', NULL, 0, 6, 0, '2022-05-18 02:03:40.446', 3, NULL),
(23, 'Felipe Couto', 'felipe@gmail.com', '938.310.960-23', '(19)99999-9999', '3c4d01067bf8', NULL, 0, 6, 1, '2022-05-19 18:18:46.372', 3, 'felipe@gmail.com'),
(25, 'Mario', 'mario@gmail.com', '115.924.590-80', '', '3c4d01067b', NULL, 0, 6, 0, '2022-05-26 19:02:30.465', 23, NULL),
(26, 'Teste', 'teste@gmail.com', '475.999.328-28', '', '3c4d01067bf8', NULL, 0, 8, 0, '2022-06-03 15:52:31.085', 23, NULL),
(27, 'Gabriel2', 'gabriel.cavinato@agroforce.com.br', '744.506.370-62', '(16)99125-6799', '3c4d01067bf8', NULL, 121212, 3, 0, '2022-06-20 17:12:20.841', 2, 'gabriel.cavinato@agroforce.com.br'),
(28, 'Felipeteste', 'felipeteste@gmail.com', '625.892.700-97', '(11)11111-1111', '3c4d01067bf8', NULL, 0, 3, 0, '2022-06-21 17:02:57.942', 23, 'felipeteste@gmail.com'),
(29, 'Teste1', 'teste@tmg.com', '956.256.840-73', '(11)11111-1111', '3c4d01067bf8', NULL, 1, 12, 0, '2022-07-21 14:44:16.458', 2, 'teste@tmg.com'),
(30, 'Stewart Cintra', 'stewart@gmail.com', '122.786.380-25', '(11)11111-1111', '3c4d01067bf8', NULL, 0, 6, 1, '2022-08-08 13:03:11.080', 23, 'stewart@gmail.com'),
(31, 'Hugo Varella', 'hugo@gmail.com', '049.624.550-36', '(11)11111-1111', '3c4d01067bf8', NULL, 0, 4, 0, '2022-08-15 13:46:24.442', 2, 'hugo@gmail.com'),
(32, 'Gabriel teste oficial', 'GABRIEL.CAVINATO@AGROFORCE.COM.BR', '548.441.847-09', '(16)99125-6799', '3c4d01067bf8', NULL, 12, 6, 1, '2022-08-19 11:57:35.657', 2, 'gabriel'),
(33, 'Rian', 'rian@gmail.com', '463.663.290-79', '(11)11111-1111', '3c4d01067bf8', NULL, 5, 5, 0, '2022-08-29 16:48:33.806', 2, 'rian@gmail.com'),
(34, 'Aaaaaa', 'cavinatogabriel@gmail.com', '969.481.240-20', '(16)99125-6799', '3c4d01067bf8', NULL, 21212, 4, 0, '2022-09-09 12:24:13.539', 2, 'aaaa'),
(35, 'Abner', '', '862.778.146-05', '', '3c4d01067bf8', NULL, 0, 4, 1, '2022-09-20 12:14:58.783', 2, 'Abner123'),
(36, 'TELA ', 'cavinatogabriel@gmail.com', '285.442.950-88', '(16)99125-6799', '3c4d01067bf8', NULL, 12234555, 4, 0, '2022-09-21 16:52:05.511', 2, 'TELA'),
(37, 'Teste2222', 'cavinatogabriel@gmail.com', '578.373.380-65', '(16)99125-6799', '3c4d01067bf8', NULL, 0, 5, 0, '2022-10-07 12:30:11.101', 2, 'teste222'),
(38, 'Talita Borges', 'talita.borges@agroforce.com.br', '321.412.748-93', '(16)99125-6799', '3c4d01067bf8', NULL, 12345, 4, 1, '2022-10-28 18:59:22.582', 2, 'talita'),
(39, 'Pedro', 'pedro@agroforce.com.br', '911.086.140-86', '(11)11111-1111', '3c4d01067bf8', NULL, 0, 4, 1, '2022-10-31 18:16:02.930', 23, 'pedro@agroforce.com.br'),
(40, 'Ben', 'ben@agroforce.com.br', '881.916.470-10', '(11)11111-1111', '3c4d01067bf8', NULL, 0, 4, 1, '2022-10-31 18:17:38.847', 23, 'ben@agroforce.com.br');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users_cultures`
--

CREATE TABLE `users_cultures` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `cultureId` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `users_permissions`
--

CREATE TABLE `users_permissions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `profileId` int(11) NOT NULL,
  `cultureId` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `created_by` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `users_permissions`
--

INSERT INTO `users_permissions` (`id`, `userId`, `profileId`, `cultureId`, `created_at`, `created_by`, `status`) VALUES
(576, 10, 1, 21, '2022-09-19 17:14:17.087', 2, 1),
(577, 10, 1, 22, '2022-09-19 17:14:17.087', 2, 0),
(578, 10, 1, 21, '2022-09-19 17:14:17.088', 2, 1),
(579, 10, 1, 22, '2022-09-19 17:14:17.087', 2, 0),
(584, 30, 1, 22, '2022-09-19 17:14:44.478', 23, 1),
(585, 30, 1, 21, '2022-09-19 17:14:44.478', 23, 0),
(586, 33, 1, 21, '2022-09-19 17:14:55.820', 23, 0),
(587, 33, 1, 22, '2022-09-19 17:14:55.820', 23, 0),
(588, 29, 1, 22, '2022-09-20 09:33:04.717', 23, 0),
(589, 29, 2, 22, '2022-09-20 09:33:04.747', 23, 0),
(590, 29, 1, 21, '2022-09-20 09:33:04.736', 23, 0),
(592, 18, 1, 21, '2022-09-20 09:33:29.235', 8, 0),
(593, 34, 1, 21, '2022-09-20 09:33:47.039', 2, 0),
(594, 34, 1, 22, '2022-09-20 09:33:47.039', 2, 0),
(595, 32, 1, 22, '2022-09-20 09:34:00.418', 2, 0),
(596, 3, 1, 21, '2022-09-20 09:34:14.743', 3, 0),
(597, 9, 1, 22, '2022-09-20 09:34:30.566', 8, 0),
(600, 35, 2, 22, '2022-09-20 12:14:58.823', 10, 0),
(601, 35, 1, 21, '2022-09-20 12:14:58.838', 10, 1),
(602, 36, 1, 22, '2022-09-21 16:52:05.591', 32, 1),
(603, 36, 1, 21, '2022-09-21 16:52:05.598', 32, 0),
(604, 8, 1, 22, '2022-09-22 19:51:19.748', 2, 0),
(605, 8, 2, 22, '2022-09-22 19:51:19.751', 2, 0),
(612, 2, 1, 23, '2022-09-30 20:19:41.158', 2, 0),
(613, 2, 1, 22, '2022-09-30 20:19:41.158', 2, 1),
(614, 2, 1, 24, '2022-09-30 20:19:41.158', 2, 0),
(634, 37, 1, 22, '2022-10-20 18:55:57.266', 2, 0),
(635, 37, 1, 24, '2022-10-20 18:55:57.266', 2, 0),
(636, 37, 1, 23, '2022-10-20 18:55:57.262', 2, 0),
(660, 38, 1, 24, '2022-10-28 19:02:37.398', 2, 0),
(661, 38, 1, 23, '2022-10-28 19:02:37.398', 2, 0),
(662, 38, 1, 26, '2022-10-28 19:02:37.396', 2, 0),
(663, 38, 1, 22, '2022-10-28 19:02:37.398', 2, 0),
(664, 38, 1, 27, '2022-10-28 19:02:37.403', 2, 1),
(689, 23, 1, 21, '2022-10-28 19:24:49.693', 3, 0),
(690, 23, 1, 24, '2022-10-28 19:24:49.695', 3, 1),
(691, 23, 1, 27, '2022-10-28 19:24:49.695', 3, 0),
(692, 23, 1, 23, '2022-10-28 19:24:49.695', 3, 0),
(693, 23, 1, 26, '2022-10-28 19:24:49.696', 3, 0),
(694, 23, 1, 22, '2022-10-28 19:24:49.697', 3, 0),
(696, 39, 1, 21, '2022-10-31 18:16:03.142', 23, 0),
(697, 39, 1, 27, '2022-10-31 18:16:03.005', 23, 0),
(698, 39, 1, 22, '2022-10-31 18:16:03.136', 23, 0),
(699, 39, 1, 26, '2022-10-31 18:16:03.153', 23, 0),
(700, 39, 1, 23, '2022-10-31 18:16:03.163', 23, 0),
(701, 39, 1, 25, '2022-10-31 18:16:03.153', 23, 0),
(702, 40, 1, 22, '2022-10-31 18:17:38.858', 23, 0),
(703, 40, 1, 24, '2022-10-31 18:17:38.858', 23, 0),
(704, 40, 1, 26, '2022-10-31 18:17:38.858', 23, 0),
(705, 40, 1, 21, '2022-10-31 18:17:38.859', 23, 0),
(706, 40, 1, 27, '2022-10-31 18:17:38.859', 23, 0),
(707, 40, 1, 25, '2022-10-31 18:17:38.859', 23, 0),
(708, 40, 1, 23, '2022-10-31 18:17:38.860', 23, 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `users_preferences`
--

CREATE TABLE `users_preferences` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `table_preferences` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Fazendo dump de dados para tabela `users_preferences`
--

INSERT INTO `users_preferences` (`id`, `userId`, `module_id`, `table_preferences`, `updated_at`) VALUES
(52, 2, 10, 'name_genotipo,name_main,tecnologia,cruza,gmr,numberLotes,name_public,name_experiment,name_alter,elit_name,type,action', '2022-09-28 22:07:51.787'),
(53, 2, 27, 'gli,bgm,bgmGenotype,gmr,treatments_number,status,genotipoName,nca', '2022-09-28 23:39:11.089'),
(54, 2, 5, 'esquema,plantadeira,tiros,disparos,parcelas,status', '2022-09-28 23:43:53.139'),
(55, 2, 26, 'foco,type_assay,gli,tecnologia,treatmentsNumber,status,action', '2022-10-01 11:23:44.930'),
(56, 2, 5, 'local,safra,foco,ensaio,tecnologia,epoca,npei,npef,grp', '2022-10-01 12:50:54.972'),
(57, 30, 9, 'name,envelope,safra,status', '2022-10-03 17:23:31.383'),
(58, 30, 27, 'madeBy,madeIn,module,operation', '2022-10-03 17:58:09.967'),
(59, 23, 27, 'foco,type_assay,tecnologia,ggen,gli,bgm,bgmGenotype,gmr,treatments_number,status,statusAssay,genotipoName,nca', '2022-10-04 20:04:56.137'),
(60, 30, 22, 'foco,type_assay,gli,experimentName,tecnologia,period,delineamento,repetitionsNumber,status,action', '2022-10-05 14:59:23.935'),
(61, 23, 18, 'experimentName,genotipo,status_t,fase,tecnologia,sc,npe,nc,rep,plantio', '2022-10-05 15:48:24.469'),
(62, 23, 26, 'protocol_name,foco,type_assay,gli,tecnologia,treatmentsNumber,status,action', '2022-10-11 15:02:39.291'),
(63, 30, 30, 'foco,gli,local,rep,status,nt,npe,nca,action', '2022-10-11 18:08:58.957'),
(64, 23, 4, 'name_local_culture,label,mloc,adress,label_country,label_region,name_locality,action', '2022-10-15 00:23:01.982'),
(65, 23, 21, 'name_unity_culture,year,name_local_culture,label,mloc,adress,label_country,label_region,name_locality,action', '2022-10-15 00:25:58.117'),
(66, 2, 23, 'repetitionExperience,genotipo,gmr,bgm,fase,tecnologia,nt,rep,status,nca,npe,bloco,experiment', '2022-10-18 14:00:26.050'),
(67, 2, 5, 'safra,foco,ensaio,tecnologia,local,epoca,npei,prox_npe,status', '2022-10-26 16:53:10.636');

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `AllocatedExperiment`
--
ALTER TABLE `AllocatedExperiment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AllocatedExperiment_blockId_fkey` (`blockId`);

--
-- Índices de tabela `assay_list`
--
ALTER TABLE `assay_list`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assay_list_id_safra_fkey` (`id_safra`),
  ADD KEY `assay_list_id_foco_fkey` (`id_foco`),
  ADD KEY `assay_list_id_type_assay_fkey` (`id_type_assay`),
  ADD KEY `assay_list_id_tecnologia_fkey` (`id_tecnologia`);

--
-- Índices de tabela `config_gerais`
--
ALTER TABLE `config_gerais`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `culture`
--
ALTER TABLE `culture`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Culture_name_key` (`name`);

--
-- Índices de tabela `cultureUnity`
--
ALTER TABLE `cultureUnity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cultureUnity_id_local_fkey` (`id_local`);

--
-- Índices de tabela `delineamento`
--
ALTER TABLE `delineamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `delineamento_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Department_name_key` (`name`);

--
-- Índices de tabela `dividers`
--
ALTER TABLE `dividers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dividers_id_quadra_fkey` (`id_quadra`);

--
-- Índices de tabela `envelope`
--
ALTER TABLE `envelope`
  ADD PRIMARY KEY (`id`),
  ADD KEY `envelope_id_safra_fkey` (`id_safra`),
  ADD KEY `envelope_id_type_assay_fkey` (`id_type_assay`);

--
-- Índices de tabela `epoca`
--
ALTER TABLE `epoca`
  ADD PRIMARY KEY (`id`),
  ADD KEY `epoca_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `experiment`
--
ALTER TABLE `experiment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiment_idSafra_fkey` (`idSafra`),
  ADD KEY `experiment_idLocal_fkey` (`idLocal`),
  ADD KEY `experiment_blockId_fkey` (`blockId`),
  ADD KEY `experiment_idDelineamento_fkey` (`idDelineamento`),
  ADD KEY `experiment_idAssayList_fkey` (`idAssayList`),
  ADD KEY `experiment_experimentGroupId_fkey` (`experimentGroupId`);

--
-- Índices de tabela `ExperimentGroup`
--
ALTER TABLE `ExperimentGroup`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ExperimentGroup_safraId_fkey` (`safraId`);

--
-- Índices de tabela `experiment_genotipe`
--
ALTER TABLE `experiment_genotipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `experiment_genotipe_idSafra_fkey` (`idSafra`),
  ADD KEY `experiment_genotipe_blockLayoutId_fkey` (`blockLayoutId`),
  ADD KEY `experiment_genotipe_idGenotipo_fkey` (`idGenotipo`),
  ADD KEY `experiment_genotipe_idFoco_fkey` (`idFoco`),
  ADD KEY `experiment_genotipe_idTypeAssay_fkey` (`idTypeAssay`),
  ADD KEY `experiment_genotipe_idTecnologia_fkey` (`idTecnologia`),
  ADD KEY `experiment_genotipe_idExperiment_fkey` (`idExperiment`),
  ADD KEY `experiment_genotipe_id_seq_delineamento_fkey` (`id_seq_delineamento`),
  ADD KEY `experiment_genotipe_idLote_fkey` (`idLote`);

--
-- Índices de tabela `foco`
--
ALTER TABLE `foco`
  ADD PRIMARY KEY (`id`),
  ADD KEY `foco_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `genotipo`
--
ALTER TABLE `genotipo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genotipo_id_culture_fkey` (`id_culture`),
  ADD KEY `genotipo_safraId_fkey` (`safraId`),
  ADD KEY `genotipo_id_tecnologia_fkey` (`id_tecnologia`);

--
-- Índices de tabela `genotype_treatment`
--
ALTER TABLE `genotype_treatment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genotype_treatment_id_safra_fkey` (`id_safra`),
  ADD KEY `genotype_treatment_id_genotipo_fkey` (`id_genotipo`),
  ADD KEY `genotype_treatment_id_lote_fkey` (`id_lote`),
  ADD KEY `genotype_treatment_id_assay_list_fkey` (`id_assay_list`);

--
-- Índices de tabela `group`
--
ALTER TABLE `group`
  ADD PRIMARY KEY (`id`),
  ADD KEY `group_id_safra_fkey` (`id_safra`),
  ADD KEY `group_id_foco_fkey` (`id_foco`);

--
-- Índices de tabela `history_genotype_treatment`
--
ALTER TABLE `history_genotype_treatment`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `import_spreadsheet`
--
ALTER TABLE `import_spreadsheet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `import_spreadsheet_moduleId_key` (`moduleId`);

--
-- Índices de tabela `layout_children`
--
ALTER TABLE `layout_children`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layout_children_id_layout_fkey` (`id_layout`);

--
-- Índices de tabela `layout_quadra`
--
ALTER TABLE `layout_quadra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layout_quadra_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `local`
--
ALTER TABLE `local`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `local_id_local_culture_key` (`id_local_culture`);

--
-- Índices de tabela `log_import`
--
ALTER TABLE `log_import`
  ADD PRIMARY KEY (`id`),
  ADD KEY `log_import_user_id_fkey` (`user_id`);

--
-- Índices de tabela `lote`
--
ALTER TABLE `lote`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lote_id_dados_key` (`id_dados`),
  ADD KEY `lote_id_safra_fkey` (`id_safra`),
  ADD KEY `lote_id_genotipo_fkey` (`id_genotipo`);

--
-- Índices de tabela `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Modules_module_key` (`module`);

--
-- Índices de tabela `npe`
--
ALTER TABLE `npe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `npe_safraId_fkey` (`safraId`),
  ADD KEY `npe_localId_fkey` (`localId`),
  ADD KEY `npe_focoId_fkey` (`focoId`),
  ADD KEY `npe_groupId_fkey` (`groupId`),
  ADD KEY `npe_typeAssayId_fkey` (`typeAssayId`),
  ADD KEY `npe_tecnologiaId_fkey` (`tecnologiaId`);

--
-- Índices de tabela `PrintHistory`
--
ALTER TABLE `PrintHistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `PrintHistory_userId_fkey` (`userId`),
  ADD KEY `PrintHistory_experimentGenotypeId_fkey` (`experimentGenotypeId`);

--
-- Índices de tabela `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `quadra`
--
ALTER TABLE `quadra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quadra_id_culture_fkey` (`id_culture`),
  ADD KEY `quadra_id_safra_fkey` (`id_safra`),
  ADD KEY `quadra_id_local_fkey` (`id_local`);

--
-- Índices de tabela `reportes`
--
ALTER TABLE `reportes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reportes_madeBy_fkey` (`madeBy`);

--
-- Índices de tabela `safra`
--
ALTER TABLE `safra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `safra_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `sequencia_delineamento`
--
ALTER TABLE `sequencia_delineamento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sequencia_delineamento_id_delineamento_fkey` (`id_delineamento`);

--
-- Índices de tabela `tecnologia`
--
ALTER TABLE `tecnologia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tecnologia_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `type_assay`
--
ALTER TABLE `type_assay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_assay_id_culture_fkey` (`id_culture`);

--
-- Índices de tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_cpf_key` (`cpf`),
  ADD UNIQUE KEY `User_email_key` (`login`),
  ADD KEY `User_departmentId_fkey` (`departmentId`);

--
-- Índices de tabela `users_cultures`
--
ALTER TABLE `users_cultures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Users_Cultures_cultureId_fkey` (`cultureId`),
  ADD KEY `Users_Cultures_userId_fkey` (`userId`);

--
-- Índices de tabela `users_permissions`
--
ALTER TABLE `users_permissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_permissions_cultureId_fkey` (`cultureId`),
  ADD KEY `Users_Permissions_profileId_fkey` (`profileId`),
  ADD KEY `Users_Permissions_userId_fkey` (`userId`);

--
-- Índices de tabela `users_preferences`
--
ALTER TABLE `users_preferences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Users_Preferences_module_id_fkey` (`module_id`),
  ADD KEY `Users_Preferences_userId_fkey` (`userId`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `AllocatedExperiment`
--
ALTER TABLE `AllocatedExperiment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `assay_list`
--
ALTER TABLE `assay_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de tabela `config_gerais`
--
ALTER TABLE `config_gerais`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de tabela `culture`
--
ALTER TABLE `culture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
--
-- AUTO_INCREMENT de tabela `cultureUnity`
--
ALTER TABLE `cultureUnity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT de tabela `delineamento`
--
ALTER TABLE `delineamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de tabela `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de tabela `dividers`
--
ALTER TABLE `dividers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `envelope`
--
ALTER TABLE `envelope`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de tabela `epoca`
--
ALTER TABLE `epoca`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `experiment`
--
ALTER TABLE `experiment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de tabela `ExperimentGroup`
--
ALTER TABLE `ExperimentGroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de tabela `experiment_genotipe`
--
ALTER TABLE `experiment_genotipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;
--
-- AUTO_INCREMENT de tabela `foco`
--
ALTER TABLE `foco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de tabela `genotipo`
--
ALTER TABLE `genotipo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=499;
--
-- AUTO_INCREMENT de tabela `genotype_treatment`
--
ALTER TABLE `genotype_treatment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;
--
-- AUTO_INCREMENT de tabela `group`
--
ALTER TABLE `group`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT de tabela `history_genotype_treatment`
--
ALTER TABLE `history_genotype_treatment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de tabela `import_spreadsheet`
--
ALTER TABLE `import_spreadsheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;
--
-- AUTO_INCREMENT de tabela `layout_children`
--
ALTER TABLE `layout_children`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `layout_quadra`
--
ALTER TABLE `layout_quadra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `local`
--
ALTER TABLE `local`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT de tabela `log_import`
--
ALTER TABLE `log_import`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=148;
--
-- AUTO_INCREMENT de tabela `lote`
--
ALTER TABLE `lote`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=818;
--
-- AUTO_INCREMENT de tabela `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT de tabela `npe`
--
ALTER TABLE `npe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT de tabela `PrintHistory`
--
ALTER TABLE `PrintHistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT de tabela `quadra`
--
ALTER TABLE `quadra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `reportes`
--
ALTER TABLE `reportes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=483;
--
-- AUTO_INCREMENT de tabela `safra`
--
ALTER TABLE `safra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;
--
-- AUTO_INCREMENT de tabela `sequencia_delineamento`
--
ALTER TABLE `sequencia_delineamento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=331;
--
-- AUTO_INCREMENT de tabela `tecnologia`
--
ALTER TABLE `tecnologia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;
--
-- AUTO_INCREMENT de tabela `type_assay`
--
ALTER TABLE `type_assay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT de tabela `users_cultures`
--
ALTER TABLE `users_cultures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de tabela `users_permissions`
--
ALTER TABLE `users_permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=709;
--
-- AUTO_INCREMENT de tabela `users_preferences`
--
ALTER TABLE `users_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `AllocatedExperiment`
--
ALTER TABLE `AllocatedExperiment`
  ADD CONSTRAINT `AllocatedExperiment_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `quadra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `assay_list`
--
ALTER TABLE `assay_list`
  ADD CONSTRAINT `assay_list_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `assay_list_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `assay_list_id_tecnologia_fkey` FOREIGN KEY (`id_tecnologia`) REFERENCES `tecnologia` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `assay_list_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `cultureUnity`
--
ALTER TABLE `cultureUnity`
  ADD CONSTRAINT `cultureUnity_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `delineamento`
--
ALTER TABLE `delineamento`
  ADD CONSTRAINT `delineamento_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `dividers`
--
ALTER TABLE `dividers`
  ADD CONSTRAINT `dividers_id_quadra_fkey` FOREIGN KEY (`id_quadra`) REFERENCES `quadra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `envelope`
--
ALTER TABLE `envelope`
  ADD CONSTRAINT `envelope_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `envelope_id_type_assay_fkey` FOREIGN KEY (`id_type_assay`) REFERENCES `type_assay` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `epoca`
--
ALTER TABLE `epoca`
  ADD CONSTRAINT `epoca_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `experiment`
--
ALTER TABLE `experiment`
  ADD CONSTRAINT `experiment_blockId_fkey` FOREIGN KEY (`blockId`) REFERENCES `quadra` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_experimentGroupId_fkey` FOREIGN KEY (`experimentGroupId`) REFERENCES `ExperimentGroup` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_idAssayList_fkey` FOREIGN KEY (`idAssayList`) REFERENCES `assay_list` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_idDelineamento_fkey` FOREIGN KEY (`idDelineamento`) REFERENCES `delineamento` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_idLocal_fkey` FOREIGN KEY (`idLocal`) REFERENCES `local` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_idSafra_fkey` FOREIGN KEY (`idSafra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `ExperimentGroup`
--
ALTER TABLE `ExperimentGroup`
  ADD CONSTRAINT `ExperimentGroup_safraId_fkey` FOREIGN KEY (`safraId`) REFERENCES `safra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `experiment_genotipe`
--
ALTER TABLE `experiment_genotipe`
  ADD CONSTRAINT `experiment_genotipe_blockLayoutId_fkey` FOREIGN KEY (`blockLayoutId`) REFERENCES `layout_quadra` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idExperiment_fkey` FOREIGN KEY (`idExperiment`) REFERENCES `experiment` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idFoco_fkey` FOREIGN KEY (`idFoco`) REFERENCES `foco` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idGenotipo_fkey` FOREIGN KEY (`idGenotipo`) REFERENCES `genotipo` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idLote_fkey` FOREIGN KEY (`idLote`) REFERENCES `lote` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idSafra_fkey` FOREIGN KEY (`idSafra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idTecnologia_fkey` FOREIGN KEY (`idTecnologia`) REFERENCES `tecnologia` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_idTypeAssay_fkey` FOREIGN KEY (`idTypeAssay`) REFERENCES `type_assay` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `experiment_genotipe_id_seq_delineamento_fkey` FOREIGN KEY (`id_seq_delineamento`) REFERENCES `sequencia_delineamento` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `foco`
--
ALTER TABLE `foco`
  ADD CONSTRAINT `foco_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `genotipo`
--
ALTER TABLE `genotipo`
  ADD CONSTRAINT `genotipo_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `genotipo_id_tecnologia_fkey` FOREIGN KEY (`id_tecnologia`) REFERENCES `tecnologia` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `genotipo_safraId_fkey` FOREIGN KEY (`safraId`) REFERENCES `safra` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `genotype_treatment`
--
ALTER TABLE `genotype_treatment`
  ADD CONSTRAINT `genotype_treatment_id_assay_list_fkey` FOREIGN KEY (`id_assay_list`) REFERENCES `assay_list` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `genotype_treatment_id_genotipo_fkey` FOREIGN KEY (`id_genotipo`) REFERENCES `genotipo` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `genotype_treatment_id_lote_fkey` FOREIGN KEY (`id_lote`) REFERENCES `lote` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `genotype_treatment_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `group`
--
ALTER TABLE `group`
  ADD CONSTRAINT `group_id_foco_fkey` FOREIGN KEY (`id_foco`) REFERENCES `foco` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `group_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `layout_children`
--
ALTER TABLE `layout_children`
  ADD CONSTRAINT `layout_children_id_layout_fkey` FOREIGN KEY (`id_layout`) REFERENCES `layout_quadra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `layout_quadra`
--
ALTER TABLE `layout_quadra`
  ADD CONSTRAINT `layout_quadra_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `log_import`
--
ALTER TABLE `log_import`
  ADD CONSTRAINT `log_import_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `lote`
--
ALTER TABLE `lote`
  ADD CONSTRAINT `lote_id_genotipo_fkey` FOREIGN KEY (`id_genotipo`) REFERENCES `genotipo` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `lote_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `npe`
--
ALTER TABLE `npe`
  ADD CONSTRAINT `npe_focoId_fkey` FOREIGN KEY (`focoId`) REFERENCES `foco` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `npe_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `group` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `npe_localId_fkey` FOREIGN KEY (`localId`) REFERENCES `local` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `npe_safraId_fkey` FOREIGN KEY (`safraId`) REFERENCES `safra` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `npe_tecnologiaId_fkey` FOREIGN KEY (`tecnologiaId`) REFERENCES `tecnologia` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `npe_typeAssayId_fkey` FOREIGN KEY (`typeAssayId`) REFERENCES `type_assay` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `PrintHistory`
--
ALTER TABLE `PrintHistory`
  ADD CONSTRAINT `PrintHistory_experimentGenotypeId_fkey` FOREIGN KEY (`experimentGenotypeId`) REFERENCES `experiment_genotipe` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `PrintHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `quadra`
--
ALTER TABLE `quadra`
  ADD CONSTRAINT `quadra_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `quadra_id_local_fkey` FOREIGN KEY (`id_local`) REFERENCES `local` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `quadra_id_safra_fkey` FOREIGN KEY (`id_safra`) REFERENCES `safra` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `reportes`
--
ALTER TABLE `reportes`
  ADD CONSTRAINT `reportes_madeBy_fkey` FOREIGN KEY (`madeBy`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `safra`
--
ALTER TABLE `safra`
  ADD CONSTRAINT `safra_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `sequencia_delineamento`
--
ALTER TABLE `sequencia_delineamento`
  ADD CONSTRAINT `sequencia_delineamento_id_delineamento_fkey` FOREIGN KEY (`id_delineamento`) REFERENCES `delineamento` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `tecnologia`
--
ALTER TABLE `tecnologia`
  ADD CONSTRAINT `tecnologia_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `type_assay`
--
ALTER TABLE `type_assay`
  ADD CONSTRAINT `type_assay_id_culture_fkey` FOREIGN KEY (`id_culture`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `User_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `users_cultures`
--
ALTER TABLE `users_cultures`
  ADD CONSTRAINT `Users_Cultures_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `culture` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Users_Cultures_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `users_permissions`
--
ALTER TABLE `users_permissions`
  ADD CONSTRAINT `Users_Permissions_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Users_Permissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `users_permissions_cultureId_fkey` FOREIGN KEY (`cultureId`) REFERENCES `culture` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `users_preferences`
--
ALTER TABLE `users_preferences`
  ADD CONSTRAINT `Users_Preferences_module_id_fkey` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Users_Preferences_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
