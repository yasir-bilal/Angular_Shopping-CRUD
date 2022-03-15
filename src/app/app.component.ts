import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, Sort} from '@angular/material/sort';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Angular13Crud';

  displayedColumns: string[] = ['productName', 'category', 'date','freshness', 'price','comment','action'];
  dataSource !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  constructor(private dialog : MatDialog,private api : ApiService){

  }

  ngOnInit(): void {
    this.getAllProducts();
  }

  

  getAllProducts(){
    this.api.getProduct().subscribe({
      next:(res)=>{
        //console.log(res);  
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;        
      },
      error:(err)=>{
        alert("Error while fetching The Records...")
      }
    })
  }

  editProduct(row : any){
    this.dialog.open(DialogComponent,{
      width : '30%',
      data : row
    }).afterClosed().subscribe(val=>{
      if(val == 'update'){
          this.getAllProducts();
      }
    })
  }

  deleteProduct(id : number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=>{
        alert('Product Deleted SuccessFully');
        this.getAllProducts();
      },
      error:()=>{
        alert("Error While Deleting product...");
      }
    })

  }


  announceSortChange(sortState: Sort) {
    this.dataSource.sort = this.sort;        
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
    }


  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent,{
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val == "save"){
        this.getAllProducts();
      }
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
 

  }
  
}
