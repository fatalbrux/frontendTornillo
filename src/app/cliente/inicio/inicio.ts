import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class Inicio {
 
}