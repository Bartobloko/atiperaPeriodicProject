import { afterNextRender, AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, firstValueFrom, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormPopupComponent } from '../form-popup/form-popup.component';
import { PeriodicElement } from '../shared/interfaces/periodic-element';
import { PeriodicElementWithIndex } from '../shared/interfaces/periodic-element-with-index';
import { TableStateService } from '../shared/services/table-state.service';



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

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  
  tableData = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;

  constructor(
    public dialog: MatDialog,
    private tableStateService: TableStateService,
    private cdr: ChangeDetectorRef
  ) {
    afterNextRender(() => {
      this.tableStateService.fetchTableData();
      this.tableStateService.select().pipe(
        debounceTime(1000)  
      ).subscribe(tableDataState => {
        this.tableData.data = [...tableDataState.tableDataItems];
        this.isLoading = false;
        this.cdr.detectChanges(); 
        this.tableData.sort = this.sort;
      });
    })
  }

  ngAfterViewInit(): void {
    this.searchSubject.pipe(
      debounceTime(2000) 
    ).subscribe(filterValue => this.filterValues(filterValue));
  }

  async openEditDialog(element: PeriodicElement, index: number): Promise<void> {
    const dialogRef = this.dialog.open(FormPopupComponent, {
      data: { ...element, index }
    });
  
    const result = await firstValueFrom(dialogRef.afterClosed());
  
    if (result) {
      this.updateRowData(result);
    }
  }

  updateRowData(updatedRow: PeriodicElementWithIndex): void {
    const updatedData = [...this.tableData.data];
    updatedData[updatedRow.index] = updatedRow; 
    this.tableData.data = updatedData;
  }
  
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchSubject.next(filterValue);
  }

  filterValues(text: string): void {
    this.tableData.filter = text.trim().toLowerCase();
  }

}
