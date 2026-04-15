export type ShelfCategory = 'CURRENTLY READING' | 'FAVORITES' | 'TO READ';

export interface ShelfProps {
  title: ShelfCategory;
}

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
  };
}