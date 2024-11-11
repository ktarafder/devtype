import { Component } from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent {
  codeSnippet: string = `
def greet(name):
                print(f"Hello, &#123;name&#125;!")
  `;
}
