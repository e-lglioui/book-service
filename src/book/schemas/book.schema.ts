export interface Book {
  book_id: string;

  title: string;
  author: string;
  publishedDate: number;
  genre: string;
  imageUrl?: string;
  imageKey?: string;
  copiesAvailable?:number;
  // Ajoutez d'autres champs selon vos besoins
}
