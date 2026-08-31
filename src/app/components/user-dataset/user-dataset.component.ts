import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-dataset',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './user-dataset.component.html',
  styleUrl: './user-dataset.component.scss',
})
export class UserDatasetComponent {
  private readonly usersService = inject(UsersService);
  readonly users$ = this.usersService.users$;

  /** Paths shown on the contact cards above */
  readonly paths = [
    'u.id',
    'u.name',
    'u.email',
    'u.website',
    'u.address.city',
    'u.company.name',
  ];
}
