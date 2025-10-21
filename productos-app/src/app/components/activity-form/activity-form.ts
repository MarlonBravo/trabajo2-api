import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activity, ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity-form.html',
  styleUrls: ['./activity-form.css']
})
export class ActivityFormComponent implements OnInit {
  activity: Omit<Activity, 'id'> = {
    title: '',
    dueDate: new Date().toISOString(),
    completed: false
  };
  
  isEditing = false;
  activityId: number | null = null;
  error: string = '';

  constructor(
    private activityService: ActivityService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.activityId = +id;
      this.loadActivity(this.activityId);
    }
  }

  loadActivity(id: number): void {
    this.activityService.getActivity(id).subscribe({
      next: (activity) => {
        this.activity = {
          title: activity.title,
          dueDate: activity.dueDate,
          completed: activity.completed
        };
      },
      error: (err) => {
        this.error = 'Error al cargar la actividad: ' + err.message;
      }
    });
  }

  onSubmit(): void {
    if (this.isEditing && this.activityId) {
      this.activityService.updateActivity(this.activityId, this.activity).subscribe({
        next: () => {
          this.router.navigate(['/activities']);
        },
        error: (err) => {
          this.error = 'Error al actualizar la actividad: ' + err.message;
        }
      });
    } else {
      this.activityService.createActivity(this.activity).subscribe({
        next: () => {
          this.router.navigate(['/activities']);
        },
        error: (err) => {
          this.error = 'Error al crear la actividad: ' + err.message;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/activities']);
  }
}