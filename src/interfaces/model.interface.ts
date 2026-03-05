export interface ModelEntity {
    id?: string;
    make: string;
    modelName: string;
  }
  
  export interface ModelApiResponse {
    statusCode: number;
    statusMessage: string;
    data: {
      totalCount: number;
      data: ModelEntity[];
    };
  }