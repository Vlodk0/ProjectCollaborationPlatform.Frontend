import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {UserService} from "../../shared/services/user.service";
import {UpdateUser} from "../../shared/interfaces/update-user";
import {Subject, switchAll, switchMap, takeUntil} from "rxjs";
import {TechnologyService} from "../../shared/services/technology.service";
import {Technology} from "../../shared/interfaces/technology";
import {DeveloperService} from "../../shared/services/developer.service";
import {GetUser} from "../../shared/interfaces/get-user";
import {MessageService} from "primeng/api";
import {UserInfoWithAvatar} from "../../shared/interfaces/user-info-with-avatar";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  providers: [MessageService]
})

export class SettingsPageComponent implements OnInit, OnDestroy {

  technologies: Technology[];
  updatingUserForm: FormGroup
  isSubscribe: Subject<void> = new Subject<void>()
  userAvatar: File
  imageData: string | ArrayBuffer | null = "./assets/setup-avatar.png";

  selectedTechnologies: Technology[];

  constructor(private userService: UserService,
              private technologyService: TechnologyService,
              private developerService: DeveloperService,
              private messageService: MessageService) {
  }

  user: UserInfoWithAvatar = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    roleName: '',
    isDeleted: false,
    avatarName: 'setup-avatar.png',
  }

  updatedUser: UpdateUser

  onUpload(event: any) {
    this.userAvatar = event.target.files[0];
    this.userService.uploadAvatar(this.userAvatar)
  }

  createImageFromBlob(img: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.imageData = reader.result;
    }, false);
    if (img) {
      reader.readAsDataURL(img);
    } else {
      this.imageData = "./assets/setup-avatar.png";
    }
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

      this.userService.updateUser(userObj)
        .pipe(takeUntil(this.isSubscribe))
        .subscribe({
          next: value => {
            this.updatedUser = value
            this.messageService.add({severity: 'success', summary: 'User is updated'});
          },
          error: () => {
            this.messageService.add({severity: 'error', summary: 'Error updating'});
          }
        })
    }
  }

  addTechForDev() {
    const selectedTechId = this.selectedTechnologies.map(t => t.id)

    this.developerService.addTechnologyForDev(selectedTechId)
      .pipe(takeUntil(this.isSubscribe))
      .subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Technologies added'});
        },
        error: () => {
          this.messageService.add({severity: 'error', summary: 'Error adding'});
        }
      })
  }

  getUser() {
    this.userService.getUserWithAvatar()
      .pipe(
        switchMap((res: any) => {
          this.userAvatar = res;
          this.user = res;
          return this.userService.getAvatar(res.avatarName)
        })
      )
      .subscribe({
        next: value => {
          this.createImageFromBlob(value)
        }
      })
  }

  ngOnDestroy() {
    this.isSubscribe.next();
    this.isSubscribe.complete();
  }
}
