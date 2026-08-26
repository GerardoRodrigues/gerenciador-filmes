import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-authentication-screen',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './authentication-screen.html',
  styleUrl: './authentication-screen.css',
})
export class AuthenticationScreen {}
