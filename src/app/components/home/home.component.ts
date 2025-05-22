import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  transactions = [
    { amount: 50, category: 'Food', date: new Date('2025-05-01') },
    { amount: 100, category: 'Transport', date: new Date('2025-05-02') },
    { amount: 250, category: 'Rent', date: new Date('2025-05-01') },
    { amount: 120, category: 'Food', date: new Date('2025-05-03') },
  ];

  totalBalance = 0;

  pieChartData: any;
  lineChartData: any;
  lineChartOptions: any;
  monthlySummaryData: any;
  barOptions: any;

  ngOnInit() {
    this.calculateBalance();
    this.setupPieChart();
    this.setupLineChart();
    this.setupMonthlySummary();
  }

  calculateBalance() {
    this.totalBalance = this.transactions.reduce((a, b) => a + b.amount, 0);
  }

  setupPieChart() {
    const categories = ['Food', 'Transport', 'Rent'];
    const data = categories.map(cat =>
      this.transactions
        .filter(t => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    this.pieChartData = {
      labels: categories,
      datasets: [{ data, backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'] }]
    };
  }

  setupLineChart() {
    const groupedByDate = this.groupByDate();
    this.lineChartData = {
      labels: Object.keys(groupedByDate),
      datasets: [
        {
          label: 'Transactions',
          data: Object.values(groupedByDate),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };

    this.lineChartOptions = {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true }
      }
    };
  }

  setupMonthlySummary() {
    const summary = {
      Jan: 100, Feb: 200, Mar: 300, Apr: 0, May: 500
    };

    this.monthlySummaryData = {
      labels: Object.keys(summary),
      datasets: [
        {
          label: 'Amount',
          backgroundColor: '#4CAF50',
          data: Object.values(summary)
        }
      ]
    };

    this.barOptions = {
      scales: { y: { beginAtZero: true } }
    };
  }

  groupByDate() {
    const grouped: Record<string, number> = {};
    this.transactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + t.amount;
    });
    return grouped;
  }
}
