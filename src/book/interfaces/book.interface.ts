import {Book} from '../schemas/book.schema';
import { CreateBookDto } from '../dtos/create-book.dto';
import { UpdateBookDto } from '../dtos/update-book.dto';
import { ExportFormat } from '../../common/enums/export-format.enum';

export interface IEventService {
getAllEvent(): Promise<Event[]>;
findById(eventId: string): Promise<Event>;
findByName(name: string): Promise<Event>;
createEvent(createEventDto: CreateBookDto): Promise<Event>;
updateEvent(eventId: string, updateEventDto: UpdateBookDto): Promise<Event>;
deleteEvent(eventId: string): Promise<Event>;
exportParticipants(eventId: string, format: ExportFormat): Promise<string>;
}