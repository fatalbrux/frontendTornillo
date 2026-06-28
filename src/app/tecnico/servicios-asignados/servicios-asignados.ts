import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-servicios-asignados',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './servicios-asignados.html',
  styleUrl: './servicios-asignados.css'
})
export class ServiciosAsignados implements OnInit {
  ngOnInit():void{}
}