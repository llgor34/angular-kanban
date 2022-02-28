import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  arrayRemove,
  query,
  where,
  orderBy,
  collectionData,
  writeBatch,
} from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Board, Task } from './board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Creates a new board for the current user
  createBoard(data: Board) {
    const user = this.auth.currentUser!;
    const col = collection(this.firestore, 'boards');

    return addDoc(col, {
      ...data,
      uid: user.uid,
      tasks: [{ description: 'Hello!', label: 'yellow' }],
    });
  }

  // Deletes board
  deleteBoard(boardId: string) {
    const docToDelete = doc(this.firestore, 'boards', boardId);

    return deleteDoc(docToDelete);
  }

  // Updates the tasks on board
  updateTasks(boardId: string, tasks: Task[]) {
    const docToUpdate = doc(this.firestore, 'boards', boardId);

    return updateDoc(docToUpdate, {
      tasks,
    });
  }

  // Deletes specific task from board
  removeTask(boardId: string, task: Task) {
    const docRef = doc(this.firestore, 'boards', boardId);

    return updateDoc(docRef, {
      tasks: arrayRemove(task),
    });
  }

  // Gets all boards owned by current user
  getUserBoards() {
    return authState(this.auth).pipe(
      switchMap((user) => {
        if (user) {
          const colRef = collection(this.firestore, 'boards');
          const q = query(
            colRef,
            where('uid', '==', user.uid),
            orderBy('priority')
          );

          return collectionData(q, { idField: 'id' });
        } else {
          return [];
        }
      })
    );
  }

  // Run a batch write to change the priority of each board for sorting
  sortBoards(boards: Board[]) {
    const refs = boards.map((b) => doc(this.firestore, 'boards', b.id!));
    const batch = writeBatch(this.firestore);

    refs.forEach((ref, idx) => batch.update(ref, { priority: idx }));
    batch.commit();
  }
}
