import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  address: string = ''; 
  currentLocation: string = ''; 

  // Avatar properties
  avatarOptions: string[] = [ // List of avatar icon names
    'happy-outline',    // Default / general avatar
    'person-outline',   // Person avatar
    'body-outline',     // Body avatar
    'game-controller-outline', // Gamer avatar
    'bug-outline',      // Bug avatar (unique example)
    'paw-outline'       // Paw print avatar
  ];
  currentAvatarIcon: string = this.avatarOptions[0]; // Currently displayed avatar icon (defaults to the first one)
  private currentAvatarIndex: number = 0; // Index to track the active avatar

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    console.log('--- Attempting to load user profile from localStorage ---');
    const storedUsersString = localStorage.getItem('registeredUsers');
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail'); // Get the logged-in user's email
    
    console.log('Raw string from localStorage for "registeredUsers":', storedUsersString);
    console.log('Logged-in user email:', loggedInUserEmail);

    this.ngZone.run(() => {
      if (!storedUsersString) {
        console.log('Key "registeredUsers" not found in localStorage. Setting default profile data.');
        this.setDefaultProfileData();
        return; 
      }

      if (!loggedInUserEmail) {
        console.log('Key "loggedInUserEmail" not found in localStorage. User not logged in? Setting default profile data.');
        this.setDefaultProfileData();
        return; 
      }

      try {
        const registeredUsers = JSON.parse(storedUsersString);
        console.log('Result of JSON.parse():', registeredUsers);

        if (Array.isArray(registeredUsers) && registeredUsers.length > 0) {
          // FIX: Explicitly type 'u' as 'any' to resolve TS7006 error
          const user = registeredUsers.find((u: any) => u.email === loggedInUserEmail);
          console.log('Result of find() operation for logged-in user:', user);

          if (user) {
            console.log('Found logged-in user object:', user);

            this.fullName = user.fullName || 'N/A (fullName missing or invalid)';
            this.phoneNumber = user.phoneNumber || 'N/A (phoneNumber missing or invalid)';
            this.email = user.email || 'N/A (email missing or invalid)';
            this.address = user.currentLocation || 'N/A (address/currentLocation missing or invalid)'; 
            this.currentLocation = user.currentLocation || 'N/A (currentLocation for display missing or invalid)'; 
            
            // Set avatar icon if saved in user data, otherwise use default
            if (user.avatarIcon && this.avatarOptions.includes(user.avatarIcon)) {
              this.currentAvatarIcon = user.avatarIcon;
              this.currentAvatarIndex = this.avatarOptions.indexOf(user.avatarIcon);
            } else {
              this.currentAvatarIcon = this.avatarOptions[0];
              this.currentAvatarIndex = 0;
            }

            console.log('Profile data assigned to component properties:');
            console.log('  fullName (assigned):', this.fullName);
            console.log('  phoneNumber (assigned):', this.phoneNumber);
            console.log('  email (assigned):', this.email);
            console.log('  address (assigned):', this.address);
            console.log('  currentLocation (assigned):', this.currentLocation);
            console.log('  currentAvatarIcon (assigned):', this.currentAvatarIcon);
            
            this.cdr.detectChanges(); 
            console.log('Change detection triggered.');

          } else {
            console.log('Logged-in user email NOT FOUND in registeredUsers array. Setting default profile data.');
            this.setDefaultProfileData(); 
          }

        } else {
          console.log('Parsed data is not an array or is an empty array. Setting default profile data.');
          this.setDefaultProfileData(); 
        }
      } catch (e) {
        console.error('CRITICAL ERROR: Failed to parse "registeredUsers" from localStorage. Data format is likely invalid. Clearing localStorage for "registeredUsers".', e);
        localStorage.removeItem('registeredUsers'); 
        this.setDefaultProfileData(); 
      }
    }); 
    console.log('--- Finished loading user profile ---');
  }

  setDefaultProfileData() {
    this.fullName = 'John Doe (Default)';
    this.phoneNumber = '+62 812 3456 7890 (Default)';
    this.email = 'johndoe@example.com (Default)';
    this.address = 'Jl. Raya Serpong No. 123 (Default)';
    this.currentLocation = 'Telukjambe Timur, Karawang (Default)';
    this.currentAvatarIcon = this.avatarOptions[0]; // Reset to default avatar
    this.currentAvatarIndex = 0;
    console.log('Default profile data set and displayed.');
  }

  /**
   * Cycles through the available avatar options and updates the displayed avatar.
   * Also updates the user data in localStorage.
   */
  changeAvatar() {
    this.currentAvatarIndex = (this.currentAvatarIndex + 1) % this.avatarOptions.length;
    this.currentAvatarIcon = this.avatarOptions[this.currentAvatarIndex];
    console.log('Changing avatar to:', this.currentAvatarIcon);

    // Optional: Update the user's avatar preference in localStorage
    const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
    if (loggedInUserEmail) {
      const storedUsersString = localStorage.getItem('registeredUsers');
      if (storedUsersString) {
        try {
          let registeredUsers = JSON.parse(storedUsersString);
          // FIX: Explicitly type 'u' as 'any' to resolve TS7006 error
          const userIndex = registeredUsers.findIndex((u: any) => u.email === loggedInUserEmail);
          if (userIndex !== -1) {
            registeredUsers[userIndex].avatarIcon = this.currentAvatarIcon; // Save avatar choice
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
            console.log('Avatar updated in localStorage for user:', loggedInUserEmail);
          }
        } catch (e) {
          console.error('Error updating avatar in localStorage:', e);
        }
      }
    }
  }

  /**
   * Handles the logout process.
   * Clears the logged-in user session and redirects to the login page.
   */
  logout() {
    console.log('Logging out user...');
    localStorage.removeItem('loggedInUserEmail'); 
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
