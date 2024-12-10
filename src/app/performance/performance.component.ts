import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class PerformanceComponent implements OnInit {
  performanceData: any[] = [];
  base64Response: { accuracy_graph: string; speed_graph: string } | null = null;
  behavior: { cluster: number; feedback_text: number; improvement_area: number } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.isBrowser()) {
      this.getPerformanceData();
    }
  }

  getPerformanceData() {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    this.http
      .get<any[]>('http://localhost:8080/api/v1/typing-sessions', { headers })
      .subscribe(
        (data) => {
          this.performanceData = data;
          this.sendDataToAnotherApi(data);
          this.sendDataToAnotherAnotherApi(data);
        },
        (error) => {
          console.error('Error fetching performance data:', error);
        }
      );
  }

  sendDataToAnotherApi(data: any[]) {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    this.http
      .post<{ accuracy_graph: string; speed_graph: string }>('http://localhost:8000/performance', data, { headers })
      .subscribe(
        (response) => {
          this.base64Response = response;
          console.log('Base64 codes received:', response);
          console.log('Accuracy graph:', this.base64Response.accuracy_graph);
          console.log('Speed graph:', response.speed_graph);
        },
        (error) => {
          console.error('Error sending data to another API:', error);
        }
      );
  }

  sendDataToAnotherAnotherApi(data: any[]) {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    this.http
      .post<{ cluster: number; feedback_text: number; improvement_area: number }>('http://localhost:8000/predict', data, { headers })
      .subscribe(
        (response) => {
          this.behavior = response;
          this.sendDataToAnotherAnotherAnotherApi(response);
          console.log('Behavior:', response);
          console.log('Cluster:', this.behavior.cluster);
          console.log('Feedback text:', this.behavior.feedback_text);
          console.log('Improvement area:', this.behavior.improvement_area);
        },
        (error) => {
          console.error('Error sending data to another API:', error);
        }
      );
  }

  sendDataToAnotherAnotherAnotherApi(data: { cluster: number; feedback_text: number; improvement_area: number }) {
    const token = localStorage.getItem('jwtToken');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    this.http
      .post('http://localhost:8080/api/v1/feedback', data, { headers })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.error('Error sending data to another API:', error);
        }
      );
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
