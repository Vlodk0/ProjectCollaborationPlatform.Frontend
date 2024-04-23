import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {UpdateUser} from "../../shared/interfaces/update-user";
import {Subject, takeUntil} from "rxjs";
import {TechnologyService} from "../../shared/services/technology.service";
import {Technology} from "../../shared/interfaces/technology";
import {DeveloperService} from "../../shared/services/developer.service";
import {GetUser} from "../../shared/interfaces/get-user";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent implements OnInit {

  technologies: Technology[];
  updatingUserForm: FormGroup
  isSubscribe: Subject<void> = new Subject<void>()

  selectedTechnologies: Technology[];

  constructor(private userService: UserService,
              private technologyService: TechnologyService,
              private developerService: DeveloperService) {
  }

  user: GetUser = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false
  }

  ngOnInit() {
    this.technologyService.getAllTechnologies()
      .pipe(
        takeUntil(this.isSubscribe)
      )
      .subscribe({
        next: value => this.technologies = value
      })

    this.updatingUserForm = new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl('')
    })

    this.getUser();
  };

  updateUser() {
    if (this.updatingUserForm.valid) {
      let userObj: UpdateUser = {
        firstName: this.updatingUserForm.value.firstName,
        lastName: this.updatingUserForm.value.lastName
      }

      console.log(userObj);

      this.userService.updateUser(userObj)
        .subscribe(
          (response) => {
            console.log('User updated successfully:', response);
          },
          (error) => {
            console.error('Error updating user:', error);
          }
        );
    }
  }

  addTechForDev() {
    const selectedTechId = this.selectedTechnologies.map(t => t.id)

    this.developerService.addTechnologyForDev(selectedTechId)
      .subscribe(
        (response) => {
          console.log('Added successfully:', response);
          console.log(selectedTechId)
        },
        (error) => {
          console.error('Error adding techs:', error);
        }
      );
  }

  getUser() {
    this.userService.getUser()
      .subscribe((result: any) => {
        this.user = result;
        console.log('success')
      },
        (error) => {
        console.log('Error', error)
        })
  }
}
