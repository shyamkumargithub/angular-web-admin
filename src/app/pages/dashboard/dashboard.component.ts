import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../master/master.service';

@Component({
  selector: 'fury-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  totalSongs: {language: string, total: number, color: string}[] = [];
  ratingList: {total: number, ratingValue: number}[] = [];
  averageRating: number = 0;
  totalRatings: number = 0;


  constructor(private masterService: MasterService,
              private router: Router) {
  }

  ngOnInit() {
    this.getAllTotalSongs();
    this.getRatingStats();
    this.getAverageRating();
  }

  getAllTotalSongs() {
    this.masterService.getSongsCountByLanguage().subscribe({
      next: (data) => {
        const colors = ['primary', 'accent', 'warn', 'primary'];
        this.totalSongs = data.map((song: any, i: number) => ({
          ...song,
          color: colors[i % colors.length]
        }));
      },
      error: (error) => {
        console.error('Error fetching songs by language:', error);
      },
    });
  }
    getAverageRating() {
    this.masterService.getAverageRating().subscribe({
      next: (data) => {
        this.averageRating=data?.averageRating
      },
      error: (error) => {
        console.error('Error fetching songs by language:', error);
      },
    });
  }

  getRatingStats() {
    this.masterService.getAllTotalRatings().subscribe({
      next: (data) => {
        this.ratingList=data
      },
      error: (error) => {
        console.error('Error fetching songs by language:', error);
      },
    });
  }


  getStars(count: number): string[] {
    return Array(count).fill('★');
  }
}