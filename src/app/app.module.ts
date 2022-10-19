import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CursorDirective } from './directives/cursor.directive';

@NgModule({
  declarations: [
    AppComponent,
    CursorDirective
  ],
    imports: [
        BrowserModule,
        FormsModule, ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
