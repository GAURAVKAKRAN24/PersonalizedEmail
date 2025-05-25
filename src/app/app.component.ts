import { Component } from '@angular/core';
import { EmailComponent } from "./email/email.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LaptopHeaderComponent } from './laptop-header/laptop-header.component';
import { MobileHeaderComponent } from './mobile-header/mobile-header.component';
import { BannerComponent } from "./banner/banner.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EmailComponent, HttpClientModule, LaptopHeaderComponent, MobileHeaderComponent, BannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClient]
})
export class AppComponent {
  title = 'PersonalizedEmail';
}
