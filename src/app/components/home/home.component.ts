import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CurrencyService } from '../../services/currency.service';
import { TransactionService } from '../../services/transaction.service';
import { Currency } from '../../models/currency.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  addTransactionDialogVisible = false;
  newTransaction: Transaction = {
    id: '',
    userId: '',
    categoryId: 0,
    amount: 0,
    currencyCode: '',
    date: new Date(),
    notes: ''
  };
  categories: Category[] = [];
  currencies: Currency[] = [];


  barStatsLoading = false;
  barStat1: {statId: number, result: number, desc: string } = { statId: 1, result: 3200, desc: 'Income'}
  barStat2: {statId: number, result: number, desc: string} = { statId: 14, result: 2100, desc: 'Expenses' }
  barStat3: {statId: number, result: number, desc: string} = { statId: 5, result: 110, desc: 'Savings' }
  barStat4: {statId: number, result: number, desc: string} = { statId: 12, result: 34, desc: 'Savings Rate' }

salesTotalsLoading = false;
  totalsDashboardData: {
    index: number,
    chartTitle: string,
    chartData: any,
    chartOptions: any,
    tableTitle: string,
    tableData: any,
    tableColumns: string[]
  };

  customersLoading = false;
  customers: {
    customerId: string,
    customerName: string,
    customerNo: string,
    address: string,
    balanceDoe: number
    } [] = [];

    transactionsLoading = false;
transactions: {
    transactionId: string,
    transactionNo: string,
    customerName: string,
    date: Date,
    time: Date,
    debit: number,
    profit: number
  } [] = [];

departmentSalesTotals: {department: string, totalAfterDiscount: number} [] = [];
  depData: any;
  depOptions: any;

  dailySalesTotals: {weekday: string, totalAfterDiscount: number} [] = [];
  dailyData: any;
  dailyOptions: any;

  salesTotals: {total: number, trans: number, countDays: number};
  avgAmountStr: string;
  avgTransStr: string;

  statisticsLoading = false;

  yearProfit: {month: string, monthName: string, type: string, total: number} [] = [];
  statisticsData: any;
  statisticsOptions: any;

  count = [
    { label: 'Last 1 item', value: 1 },
    { label: 'Last 5 items', value: 5 },
    { label: 'Last 10 items', value: 10 },
    { label: 'Last 20 items', value: 20 },
    { label: 'Last 50 items', value: 50 },
    { label: 'Last 100 items', value: 100 },
  ];
  selectedSalesTotalsCount: number = 10;
  selectedCustomerCount: number = 10;
  selectedTransactionsCount: number = 10;

  intervals = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 60 days', value: 60 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 180 days', value: 180 },
    { label: 'Last 365 days', value: 365 },
  ];
  selectedSalesTotalsInterval: number = 60;
  selectedTransactionsInterval: number = 60;
  selectedStatisticsInterval: number = 60;

  totalIncome: number = 3200;
  totalExpense: number = 2100;
  savings: number = this.totalIncome - this.totalExpense;
  savingsRate: number = +(this.savings / this.totalIncome * 100).toFixed(2);

  incomeVsExpenseData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      { label: 'Income', backgroundColor: '#42A5F5', data: [3000, 2800, 3200, 3100] },
      { label: 'Expense', backgroundColor: '#EF5350', data: [2000, 2200, 2100, 2300] },
    ],
  };

  transactions2 = [
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

  constructor(
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
    private transactionService: TransactionService,
  ) {

  }

  async ngOnInit() {
    this.calculateBalance();
    this.setupPieChart();
    this.setupLineChart();
    this.setupMonthlySummary();

    await this.loadCategories();
    await this.loadCurrencies();
    await this.loadTransactions();

    this.resetTransactionForm();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  async loadCurrencies() {
    this.currencies = await this.currencyService.getAll();
  }

  async loadTransactions() {
    //this.categories = await this.categoryService.getAll();
  }

  showAddTransactionDialog() {
    this.addTransactionDialogVisible = true;
  }

  resetTransactionForm() {
    this.newTransaction = {
      id: '',
      userId: 'current-user-id',
      categoryId: null,
      amount: null,
      currencyCode: 'USD',
      date: new Date(),
      notes: ''
    };
  }

  isTransactionValid(): boolean {
    const t = this.newTransaction;
    return !!(t.amount && t.currencyCode && t.categoryId && t.date);
  }

  saveTransaction() {


    this.addTransactionDialogVisible = false;
  }



  calculateBalance() {
    this.totalBalance = this.transactions2.reduce((a, b) => a + b.amount, 0);
  }

  setupPieChart() {
    const categories = ['Food', 'Transport', 'Rent'];
    const data = categories.map(cat =>
      this.transactions2
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
    this.transactions2.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + t.amount;
    });
    return grouped;
  }
}
