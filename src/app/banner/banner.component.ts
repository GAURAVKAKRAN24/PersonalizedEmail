import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class BannerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
