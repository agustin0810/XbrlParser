import { Component } from '@angular/core';
import { XbrlParserMainComponent } from './components/xbrl-parser-main/xbrl-parser-main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [XbrlParserMainComponent],
  template: `
    <app-xbrl-parser-main></app-xbrl-parser-main>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = 'XBRL Parser Educativo';
}
