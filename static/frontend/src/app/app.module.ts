import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { AppComponent } from './app.component';
import { TrackService } from "./track.service";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, CookieModule.forRoot(), BsDatepickerModule.forRoot(),
  ],
  providers: [TrackService],
  bootstrap: [AppComponent]
})
export class AppModule { }
