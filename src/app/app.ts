import { Component } from '@angular/core';
import { ContentComponent } from './layout/content/content.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { ToastContainerComponent } from './shared/toast/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, ContentComponent, FooterComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
