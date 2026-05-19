import { Component, OnInit, ViewChild, AfterViewInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-ranking-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './ranking-dashboard.component.html',
  styleUrl: './ranking-dashboard.component.scss'
})
export class RankingDashboardComponent implements OnInit, AfterViewInit {
  displayedColumns = ['rank', 'employeeId', 'name', 'experienceLevel', 'yearsOfExperience',
                      'availabilityStatus', 'preferredLocation', 'previousRatings', 'employeeScore'];
  dataSource = new MatTableDataSource<Employee & { rank: number }>();

  searchTerm  = '';
  levelFilter = '';
  searchValue = '';

  /** True when the logged-in employee has a completed profile, or user is a manager */
  hasProfile = false;
  isManagerUser = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isManagerUser = this.authService.isManager();

    this.dataSource.filterPredicate = (emp, filter) => {
      if (!filter) return true;
      const [search, level] = filter.split('||');
      const row = JSON.stringify(emp).toLowerCase();
      const matchSearch = !search || row.includes(search);
      const matchLevel  = !level  || (emp.experienceLevel?.toLowerCase() === level);
      return matchSearch && matchLevel;
    };

    this.employeeService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(employees => {
      const ranked = employees
        .sort((a, b) => (b.employeeScore ?? 0) - (a.employeeScore ?? 0))
        .map((emp, idx) => ({ ...emp, rank: idx + 1 }));
      this.dataSource.data = ranked;

      if (this.isManagerUser) {
        this.hasProfile = true;
      } else {
        const userId = this.authService.currentUser()?.userId;
        this.hasProfile = employees.some((e: any) => e.user?.id === userId);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private triggerFilter(): void {
    this.dataSource.filter = (this.searchTerm || this.levelFilter)
      ? `${this.searchTerm}||${this.levelFilter}`
      : '';
  }

  applyFilter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchValue = (event.target as HTMLInputElement).value;
    this.triggerFilter();
  }

  filterByLevel(level: string): void {
    this.levelFilter = level.toLowerCase();
    this.triggerFilter();
  }

  clearFilter(): void {
    this.searchTerm  = '';
    this.levelFilter = '';
    this.searchValue = '';
    this.dataSource.filter = '';
  }

  scoreClass(score: number): string {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }
}
