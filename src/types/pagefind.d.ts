declare module '@pagefind/default-ui' {
  export interface PagefindUIOptions {
    element: string;
    bundlePath?: string;
    showImages?: boolean;
    showEmptyFilters?: boolean;
    resetStyles?: boolean;
    debounceTimeoutMs?: number;
    autofocus?: boolean;
    processResult?: (result: any) => any;
    processTerm?: (term: string) => string;
    excerptLength?: number;
    highlightParam?: string;
    mergeIndex?: boolean;
    sort?: {
      field?: string;
      order?: 'asc' | 'desc';
    };
  }

  export class PagefindUI {
    constructor(options: PagefindUIOptions);
  }
} 