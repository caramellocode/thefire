import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { MatCardModule } from '@angular/material/card';
import {
  collection,
  Firestore,
  collectionData,
  addDoc,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    GameInfoComponent,
    MatCardModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  
  game: Game;
  gameId: string | undefined;
  firestore: Firestore = inject(Firestore);
  item$: Observable<Game[]>;
  pickCardAnimation: boolean = false;
  currentCard: string | undefined = '';

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {
    this.game = new Game();
    const itemCollection = collection(this.firestore, 'items');
    this.item$ = collectionData(itemCollection) as Observable<Game[]>;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      if (this.gameId) {
        this.loadGame(this.gameId);
      }
    });
  }

  loadGame(id: string) {
    const gameDoc = doc(this.firestore, `games/${id}`);
    docData(gameDoc).subscribe((gameData: any) => {
        this.updateGameState(gameData);
    }, (error: any) => {
        // handle errors appropriately
    });
  }

  updateGameState(gameData: any) {
    const expectedKeys = ['players', 'stack', 'playedCards', 'currentPlayer', 'pickCardAnimation', 'currentCard'];
    Object.keys(gameData).forEach(key => {
        if (expectedKeys.includes(key)) {
            this.game[key] = gameData[key];
        }
    });
    this.game.pickCardAnimation = false;
    if (!this.game.stack.length) {
      this.game['initializeStack']();
    }
  }

  async newGame() {
    const gamesCollection = collection(this.firestore, 'games');
    addDoc(gamesCollection, this.game.toJson());
  }

  takeCard() {
    if (!this.game.pickCardAnimation && this.game.stack.length > 0) {
      const card = this.game.stack.pop();
      if (card !== undefined) {
        this.game.currentCard = card;
        this.game.pickCardAnimation = true;
        this.game.currentPlayer = (this.game.currentPlayer + 1) % this.game.players.length;
        this.saveGame();
        setTimeout(() => {
          this.game.playedCards.push(card);
          this.saveGame();
          this.game.pickCardAnimation = false;
        }, 1000);
      }
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveCurrentPlayerName() {
    if (this.gameId && this.game.players.length > this.game.currentPlayer) {
      const currentPlayerName = this.game.players[this.game.currentPlayer];
      if (currentPlayerName) {
        const gameRef = doc(this.firestore, `games/${this.gameId}`);
        updateDoc(gameRef, { current_player_name: currentPlayerName });
      }
    }
  }

  saveGame() {
    if (this.gameId) {
      const currentPlayerName = this.game.players[this.game.currentPlayer];
      if (typeof currentPlayerName === 'string' && currentPlayerName) {
        const gameRef = doc(this.firestore, `games/${this.gameId}`);
        const updateData = {
          ...this.game.toJson(),
          current_player_name: currentPlayerName
        };
        updateDoc(gameRef, updateData);
      }
    }
  }
  
}
