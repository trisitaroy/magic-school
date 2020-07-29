import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {DataService} from './service/data.service'
import {
  MatCardModule,
  MatMenuModule,
  MatSelectModule,
  MatFormFieldModule,
  MatListModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatIconModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatTabsModule,
  MatRadioModule
} from '@angular/material';
import {MatChipsModule} from '@angular/material/chips';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { SignaturePadModule } from 'angular2-signaturepad';

import { BlankComponent } from '@shared/layouts/blank';
import { FullComponent } from '@shared/layouts/full';
import { HeaderComponent } from '@shared/components/header';
import { FooterComponent } from '@shared/components/footer';
import { MyFeedOverlayComponent } from '@shared/components/my-feed-overlay';
import { DropdownComponent } from '@shared/components/dropdown';
import { OverlayComponent } from '@shared/components/overlay';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ToggleSwitchComponent } from '@shared/components/toggle-switch';
import { MyProfileComponent } from '@shared/components/my-profile';

import { MultiSelectPipe, EllipsisPipe } from '@shared/pipes';

@NgModule({
  declarations: [
    BlankComponent,
    FullComponent,
    HeaderComponent,
    FooterComponent,
    MyFeedOverlayComponent,
    DropdownComponent,
    OverlayComponent,
    LoaderComponent,
    ToggleSwitchComponent,
    MultiSelectPipe,
    EllipsisPipe,
    MyProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTabsModule,
    MatRadioModule,
    MatChipsModule,
    ReactiveFormsModule,
    FormsModule,
    CdkStepperModule,
    DragDropModule,
    ScrollingModule,
    SatDatepickerModule,
    SatNativeDateModule,
    SignaturePadModule
  ],
  exports: [
    BlankComponent,
    FullComponent,
    HeaderComponent,
    FooterComponent,
    MyFeedOverlayComponent,
    OverlayComponent,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatFormFieldModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTabsModule,
    MatRadioModule,
    MatChipsModule,
    CdkStepperModule,
    DragDropModule,
    ScrollingModule,
    SatDatepickerModule,
    SatNativeDateModule,
    BlankComponent,
    FullComponent,
    HeaderComponent,
    FooterComponent,
    DropdownComponent,
    LoaderComponent,
    ToggleSwitchComponent,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectPipe,
    EllipsisPipe,
    MyProfileComponent,
  ],
  providers: [
    DataService
  ]
})
export class SharedModule { }
