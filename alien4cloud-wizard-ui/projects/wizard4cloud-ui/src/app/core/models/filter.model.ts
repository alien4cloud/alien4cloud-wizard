export interface FilterItem {
  displayName: string;
}

export interface FilterGroupItem extends FilterItem {
  valueItems: FilterValueItem[];
}

export interface FilterValueItem extends FilterItem {
  value: string;
  count: number;
  filterName: string;
  filterDisplayName: string;
}

