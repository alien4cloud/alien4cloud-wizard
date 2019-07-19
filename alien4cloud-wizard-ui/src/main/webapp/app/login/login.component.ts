import { Component, OnInit, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';

import { LoginService } from '../core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private renderer: Renderer,
    private loginService: LoginService
  ) {}
  username: string;
  password: string;

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []), 0);
  }

  login() : void {
    this.loginService.login({username: this.username, password: this.password});
    // if (this.username == 'admin' && this.password == 'admin') {
    //   this.router.navigate(["applications"]);
    // } else {
    //   alert("Invalid credentials");
    // }
  }

}
