export interface MochiTreeNode {
  key: string;
  label: string;
  disabled?: boolean;
  children?: MochiTreeNode[];
}
