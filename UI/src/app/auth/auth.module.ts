import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from '@auth/auth.routing.module';

import {
  MatIconModule,
  MatButtonModule
} from '@angular/material';

import { LoginComponent } from '@auth/login';
import { NotFoundComponent } from '@auth/not-found';
import { SharedModule } from '@shared/index';


@NgModule({
  declarations: [LoginComponent, NotFoundComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AuthModule { }
