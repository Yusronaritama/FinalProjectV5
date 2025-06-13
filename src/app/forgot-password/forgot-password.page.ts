import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: false
})
export class ForgotPasswordPage implements OnInit {

  email: string = ''; // Property for two-way data binding for email

  constructor(private router: Router) { }

  ngOnInit() {
    // Initialization logic if any
  }

  sendResetLink() {
    // Logic for sending the password reset link
    console.log('Sending reset link to:', this.email);
    // Here you would call your authentication service
    // For example: this.authService.sendPasswordResetEmail(this.email);

    // Simple example:
    if (this.email) {
      alert(`Password reset link sent to ${this.email}`); // Replace with Ionic Toast/Modal
      this.router.navigateByUrl('/login', { replaceUrl: true }); // Go back to login page after sending
    } else {
      alert('Please enter your email address.'); // Replace with Ionic Toast/Modal
    }
  }

  goToLogin() {
    // Logic to go back to the login page
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
