import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-laptop-header',
  templateUrl: './laptop-header.component.html',
  styleUrls: ['./laptop-header.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule]
})
export class LaptopHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
