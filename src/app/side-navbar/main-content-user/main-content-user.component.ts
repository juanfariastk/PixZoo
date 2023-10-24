import { Component, OnInit } from '@angular/core';
import { BetControlService } from '../bet-services/bet-control.service';
import { UserService } from 'src/app/users/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserAllData } from 'src/app/shared/types/userAllData.type';
import { animalsArray } from 'src/app/shared/animals/animalsArray';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-main-content-user',
  templateUrl: './main-content-user.component.html',
  styleUrls: ['./main-content-user.component.scss']
})
export class MainContentUserComponent implements OnInit {
  userDataForm: FormGroup;
  userBets: any[] = [];
  animalsArray = animalsArray;

  constructor(
    private betControlService: BetControlService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.userDataForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      birthday: [''],
      CPF: [''],
      amountDeposited: [''],
    });
  }

  getAnimalImageUrl(key: string): string {
    const animal = this.animalsArray.find(animal => animal.name === key);
    return animal ? animal.url : '';
  }

  ngOnInit() {
    this.userService.getCurrentUserAllData().subscribe((user: UserAllData | null) => {
      if (user) {
        const dateParts = user.birthday.split('/');
        const formattedDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;

        this.userDataForm.patchValue({
          name: user.name,
          email: user.email,
          password: user.password,
          birthday: formattedDate,
          CPF: user.CPF,
          amountDeposited: user.amountDeposited
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