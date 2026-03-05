export interface Make {
    id?: string;
    makeName: string;
  }
  
  export interface MakeApiResponse {
    statusCode: number;
    statusMessage: string;
    data: {
      totalCount: number;
      data: Make[];
    };
  }