import { afterNextRender, AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormPopupComponent } from '../form-popup/form-popup.component';
import { FetchTableDataService } from '../shared/services/fetch-table-data.service';
import { PeriodicElement } from '../shared/interfaces/periodic-element';



@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule, 
    MatSortModule, 
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements AfterViewInit{
  
  @ViewChild(MatSort) sort!: MatSort;
  private searchSubject = new Subject<string>();

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol','actions'];

  
  tableData = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;
  
  constructor(
    public dialog: MatDialog,
    private fetchTableDataService: FetchTableDataService,
    private cdr: ChangeDetectorRef,
  ) {
    afterNextRender(() => {
      this.fetchTableDataService.getTableElements().subscribe({
          next: (data) => {
            setTimeout(() => {
              this.tableData.data = [...data];
              this.tableData.sort = this.sort;
              this.isLoading = false;
              console.log(data, this.isLoading);
              this.cdr.detectChanges();
            }, 1000); 
          },
          error: (error: any) => {
              this.isLoading = false;
          },
      });
  });
  }

  ngAfterViewInit(): void {
    this.searchSubject.pipe(
      debounceTime(2000) 
    ).subscribe(filterValue => {
      this.tableData.filter = filterValue.trim().toLowerCase();
    });

  }

  openEditDialog(element: any): void {
    const dialogRef = this.dialog.open(FormPopupComponent, {
      data: { ...element } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateRowData(result);
      }
    });
  }

  updateRowData(updatedRow: any): void {
    const index = this.tableData.data.findIndex(row => row.position === updatedRow.position);
    if (index !== -1) {
      const updatedData = [...this.tableData.data];
      updatedData[index] = updatedRow;
      this.tableData.data = updatedData;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchSubject.next(filterValue);
  }

}
