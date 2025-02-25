import { inject, Injectable } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore , collection , collectionData, doc, onSnapshot} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  items$;
  items;

  unsubList;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(element => {
        console.log(element);
      });
    });


    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe((list) => {
      list.forEach(element => {
        console.log(element);
      });
    });
  }

  ngonDestroy(){
    this.unsubList();
    this.items.unsubscribe();
  }

  getNotesRef(){
    return collection(this.firestore, 'notes');
  }

  getTrashNotesRef(){
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string , docId: string){
    return doc(collection(this.firestore, colId), docId);
  }

  setNoteObject(obj: any, id: string): Note{
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }
}
