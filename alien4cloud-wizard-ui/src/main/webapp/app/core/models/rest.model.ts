
export interface MultipleDataResult<T> {
  types: string[];
  data: T[];
  totalResults: number;
  queryDuration: number;
  from: number;
  to: number;
}

export interface FacetedSearchFacet {
  facetValue: string;
  count: number;
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

export class FilteredSearchRequest extends BasicSearchRequest {
  filters?: any;
}

export class SortConfiguration {
  sortBy: string;
  ascending: boolean;
}

export interface FacetedSearchResult<T> extends MultipleDataResult<T> {
  facets : Map<string, FacetedSearchFacet[]> ;
}

export class FacetedSearchFacet  {
  facetValue : string;
  count : number;
}
