export interface ISafraPropsDTO {
  id_culture: number;
  year: Date;
  typeCrop: string;
  plantingStartTime: string;
  plantingEndTime: string;
  status: number;
  created_by: {
    id: number;
  };
};
