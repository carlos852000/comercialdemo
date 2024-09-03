import { Component, OnInit } from '@angular/core';

import { fadeInUp400ms } from '../../../@vex/animations/fade-in-up.animation';
import { stagger60ms } from '../../../@vex/animations/stagger.animation';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';

@Component({
  selector: 'vex-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  animations: [
    stagger60ms,
    fadeInUp400ms
  ]
})
export class PerfilComponent implements OnInit {

  icMoreVert = icMoreVert;
  
  constructor() { }

  ngOnInit(): void {
  }

}
