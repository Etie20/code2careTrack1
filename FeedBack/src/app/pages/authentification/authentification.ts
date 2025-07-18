import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-authentification',
  imports: [],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css'
})
export class Authentification {

  constructor(private router : Router) {
  }

  goHome() {
    this.router.navigate(['feedback']).then(r=>console.log(r))

  }
}
