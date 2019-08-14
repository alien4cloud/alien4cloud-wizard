import {Component, OnInit, Renderer, ElementRef, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import {LoginService} from "@app/core";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  showSpinner: boolean = false;
  
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
  }

}
