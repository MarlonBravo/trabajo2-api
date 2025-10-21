import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../services/activity.service';
import { ActivityService } from '../../services/activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-list.html',
  styleUrls: ['./activity-list.css']
})
export class ActivityListComponent implements OnInit {
  activities: Activity[] = [];
  error: string = '';

  constructor(
    private activityService: ActivityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadActivities();
  }

  loadActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (activities) => {
        this.activities = activities;
      },
      error: (err) => {
        this.error = 'Error al cargar las actividades: ' + err.message;
      }
    });
  }

  onDelete(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      this.activityService.deleteActivity(id).subscribe({
        next: () => {
          this.activities = this.activities.filter(activity => activity.id !== id);
        },
        error: (err) => {
          this.error = 'Error al eliminar la actividad: ' + err.message;
        }
      });
    }
  }

  onEdit(id: number): void {
    this.router.navigate(['/activity-form', id]);
  }

  onCreate(): void {
    this.router.navigate(['/activity-form']);
  }
}