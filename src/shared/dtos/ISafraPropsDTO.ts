export interface ISafraPropsDTO {
  id?: number;
  id_culture: number;

  year: string;
  typeCrop: string;
  plantingStartTime: string;
  plantingEndTime: string;
  main_safra?: number;
  status?: number;
  created_by: number;
};
