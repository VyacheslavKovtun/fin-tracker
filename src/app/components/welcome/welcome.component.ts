import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent implements OnInit{
  //IF AUTHORIZED - REDIRECT TO Home Page
  
  
  lineChartData!: ChartData<'line'>;
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  doughnutChartData!: ChartData<'doughnut'>;
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnInit() {
    this.lineChartData = {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [
        { label: 'Income', data: [1200, 1500, 1300, 1700, 1600, 1800], fill: false, tension: 0.4, borderColor: '#42A5F5' },
        { label: 'Expenses', data: [900, 1100, 1050, 1200, 1150, 1350], fill: false, tension: 0.4, borderColor: '#FF6384' }
      ]
    };

    this.doughnutChartData = {
      labels: ['Rent','Food','Transport','Utilities','Other'],
      datasets: [
        { data: [30, 20, 15, 10, 25], backgroundColor: ['#FFC107','#8BC34A','#03A9F4','#FF5722','#9E9E9E'] }
      ]
    };
  }
}
