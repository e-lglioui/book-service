import { Book } from '../schemas/book.schema';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';

export interface IEventRepository {
  getAllEvents(): Promise<Event[]>; 
  findById(id: string): Promise<Event>; 
  findByName(name: string): Promise<Event>; 
  createEvent(createEventDto:CreateBookDto): Promise<Event>; 
  updateEvent(id: string, updateEventDto: UpdateBookDto): Promise<Event>; 
  deleteEvent(id: string): Promise<Event>; 
  findByUserId(userId: string): Promise<Event[]>;
}