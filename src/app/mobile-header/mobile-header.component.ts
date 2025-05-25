import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule]
})
export class MobileHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
