import { Component } from '@angular/core';
import { Navbar } from '../../../../layout/components/navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../../../layout/components/footer/footer';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Footer, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  items = Array.from({ length: 50 });
}