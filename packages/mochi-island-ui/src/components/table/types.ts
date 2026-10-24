export interface MochiTableColumn {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface MochiTableSort {
  key: string;
  order: 'asc' | 'desc';
}
