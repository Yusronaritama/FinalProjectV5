import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-instruction',
  templateUrl: './payment-instruction.page.html',
  styleUrls: ['./payment-instruction.page.scss'],
  standalone: false
})
export class PaymentInstructionPage implements OnInit {

  // --- TAMBAHKAN PROPERTI INI ---
  public finalData: any;
  public user: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.finalData = navigation.extras.state['data'];
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  ngOnInit() {
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    const storedUsersString = localStorage.getItem('registeredUsers');
    if (loggedInUserEmail && storedUsersString) {
      const registeredUsers = JSON.parse(storedUsersString);
      this.user = registeredUsers.find((u: any) => u.email === loggedInUserEmail);
    }
  }
}