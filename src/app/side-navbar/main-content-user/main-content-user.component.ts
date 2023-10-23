  import { Component, OnInit } from '@angular/core';
  import { BetControlService } from '../bet-services/bet-control.service';
  import { UserService } from 'src/app/users/services/user.service';
  import { FormGroup, FormBuilder, Validators } from '@angular/forms';
  import { UserAllData } from 'src/app/shared/types/userAllData.type';

  @Component({
    selector: 'app-main-content-user',
    templateUrl: './main-content-user.component.html',
    styleUrls: ['./main-content-user.component.scss']
  })
  export class MainContentUserComponent implements OnInit {
    userDataForm: FormGroup;
    userBets:any[] = [];

    constructor(
      private betControlService: BetControlService,
      private userService: UserService,
      private formBuilder: FormBuilder
    ) {
      this.userDataForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        birthday: ['', Validators.required]
      });
    }

    ngOnInit() {

      this.userService.getCurrentUserAllData().subscribe((user: UserAllData | null) => {
        if (user) {
          this.userDataForm.patchValue({
            name: user.name,
            email: user.email,
            password: user.password,
            birthday: user.birthday
          });
        }
      });

      this.betControlService.listBets()?.subscribe((bets: any) => {
        if (bets) {
          this.userBets = bets;
        }
      });
      
    }
  }
