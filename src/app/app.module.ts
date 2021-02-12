import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { DragToSelectModule } from "ngx-drag-to-select";
import { MatCardModule } from "@angular/material/card";

import { AppComponent } from "./app.component";
import {NgxSliderModule} from "@angular-slider/ngx-slider";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    DragToSelectModule.forRoot(),
    MatCardModule,
    NgxSliderModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
