import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from "./table/table.component";
import { FormPopupComponent } from "./form-popup/form-popup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableComponent, FormPopupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'atiperaPeriodicProject';
}
