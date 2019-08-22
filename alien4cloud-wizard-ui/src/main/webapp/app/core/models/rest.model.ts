
export interface MultipleDataResult<T> {
  data: T[];
  totalResults: number;
}

/**
 * In case of error, returned by PUT on /applications/@{applicationId}/environments/@{environmentId}/deployment-topology
 */
export class ConstraintInformation {
  name: string;
  path: string;
  reference: any;
  value: string;
  type: string;
}

export class ConstraintError extends Error {
  constructor(public code: string, message: string, public constraintInformation: ConstraintInformation) {
    super(message);
  }
}

export class BasicSearchRequest {
  query: string;
  from: number;
  size: number;
}

export class SortConfiguration {
  sortBy: string;
  ascending: boolean;
}
