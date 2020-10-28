import {InjectionToken} from "@angular/core";

export const BOOTSTRAP_SETTINGS = new InjectionToken<string>('Application Configuration');

export interface BootstrapSettings {
  production: boolean;
  urlPrefix: string;
}

export class PaginatorConfig {
  length: number = 100;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: number = 0;

  getStart(): number {
    return this.pageSize * this.pageIndex;
  }

  getEnd(): number {
    let end = this.getStart() + this.pageSize;
    if (end > this.length) {
      end = this.length;
    }
    return end;
  }

  handlePaginatorEvent(e: any) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

}
