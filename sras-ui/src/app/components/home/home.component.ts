import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  features = [
    {
      icon: 'manage_accounts',
      title: 'Employee Profiles',
      desc: 'Maintain rich skill profiles with certifications, experience levels, and availability status.'
    },
    {
      icon: 'folder_special',
      title: 'Project Management',
      desc: 'Create projects with role requirements, skill needs, and preferred locations — all in one place.'
    },
    {
      icon: 'auto_awesome',
      title: 'Smart Matching',
      desc: 'AI-powered scoring ranks employees against project requirements for optimal allocation.'
    },
    {
      icon: 'leaderboard',
      title: 'Ranking Dashboard',
      desc: 'Visualise and filter your talent pool ranked by composite employee scores.'
    }
  ];
}
