export interface HPADetail {
    id?: string;
    hpaName: string;
  }
  
  export interface HPADetailResponse {
    statusCode: number;
    statusMessage: string;
    data: HPADetail[];
  }

  export interface UpsertHPADetailRequest {
    id?: string; 
    hpaName: string;
  }  