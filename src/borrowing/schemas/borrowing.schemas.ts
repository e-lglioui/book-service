export interface Borrowing {
  id: string;
  userId: string;
  bookId: string;
  borrowDate: string; // ISO date string
  returnDate?: string; // ISO date string
}
