export type ShelfCategory = 'CURRENTLY READING' | 'FAVORITES' | 'TO READ';

export interface ShelfProps {
  title: ShelfCategory;
}