import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collectionData, collection, addDoc, doc, docData } from '@angular/fire/firestore';
import { Game } from '../../models/game';


@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {

 constructor(private firestore: Firestore,  private router: Router) {
  
  }

  ngOnInit(): void {}

  async newGame() {
    let game = new Game();
    try{  
    const gamesCollection = collection(this.firestore, 'games');  
      const gameinfo = await addDoc(gamesCollection, game.toJson());
        this.router.navigateByUrl('/game/' + gameinfo.id);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  

  }

