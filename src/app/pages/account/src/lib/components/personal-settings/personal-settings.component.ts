import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { finalize } from 'rxjs/operators';
import { UpdateProfile, ProfileState } from '@abp/ng.core';
import { MessageService } from 'src/app/pages/theme-shared/services/message.service';
import { Account } from '../../models/account';

const { maxLength, required, email } = Validators;

@Component({
  selector: 'app-personal-settings-form',
  templateUrl: './personal-settings.component.html',
  exportAs: 'abpPersonalSettingsForm',
})
export class PersonalSettingsComponent
  implements
  OnInit,
  Account.PersonalSettingsComponentInputs,
  Account.PersonalSettingsComponentOutputs {
  form: FormGroup;

  inProgress: boolean;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private message: MessageService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(): void {
    const profile = this.store.selectSnapshot(ProfileState.getProfile);

    this.form = this.fb.group({
      userName: [profile.userName, [required, maxLength(256 * .1)]],
      email: [profile.email, [required, email, maxLength(256 * .1)]],
      name: [profile.name || '', [maxLength(64 * .1)]],
      surname: [profile.surname || '', [maxLength(64 * .1)]],
      phoneNumber: [profile.phoneNumber || '', [maxLength(16)]],
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.inProgress = true;
    this.store
      .dispatch(new UpdateProfile(this.form.value))
      .pipe(finalize(() => (this.inProgress = false)))
      .subscribe(() => {
        this.message.success('AbpAccount::PersonalSettingsSaved');
      });
  }
}
