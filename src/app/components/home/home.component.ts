import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CurrencyService } from '../../services/currency.service';
import { TransactionService } from '../../services/transaction.service';
import { Currency } from '../../models/currency.model';
import { MessageService } from 'primeng/api';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { DailyExpense } from '../../models/daily-expense.model';
import { DashboardService } from '../../services/dashboard.service';
import { FinancialSummary } from '../../models/financial-summary.model';
import { ExpenseCategorySummary } from '../../models/expense-category-summary.model';
import { MonthlyBalance } from '../../models/monthly-balance.model';
import { MonthylIncomeExpense } from '../../models/monthly-income-expense.model';
import { DailyExpenseAverage } from '../../models/daily-expense-average.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  addTransactionDialogVisible = false;
  newTransaction: Transaction = {
    id: '',
    userId: '',
    categoryId: 0,
    amount: 0,
    currencyId: 0,
    date: new Date(),
    notes: ''
  };
  categories: Category[] = [];
  currencies: Currency[] = [];

  currentUser: User;
  userCurrency: Currency;

  financialSummary: FinancialSummary;
  summaryLoading = false;

  topExpenseCategories: ExpenseCategorySummary[] = [];
  catData: any;
  catOptions: any;
  catExpRadarData: any;
  catExpRadarOptions: any;


  monthlyIncomeExpensesData: {
    labels: any[],
    datasets: [
      { label: string, backgroundColor: string, data: any[] },
      { label: string, backgroundColor: string, data: any[] },
    ],
  };

  monthlyBalanceTrend: MonthlyBalance[] = [];
  monthlyIncomeExpense: MonthylIncomeExpense[] = [];
  dailyExpenseAverage: DailyExpenseAverage;
  dailyExpenses: DailyExpense[] = [];

  lastTransactions: Transaction[] = [];
  lastTransactionsLoading = false;

  salesTotalsLoading = false;
  totalsDashboardData: {
    index: number,
    chartTitle: string,
    chartData: any,
    chartOptions: any,
    tableTitle: string,
    tableData: any,
    tableColumns: string[]
  }[] = [];

  dailyData: any;
  dailyOptions: any;

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
  //selectedTransactionsInterval: number = 60;
  selectedStatisticsInterval: number = 60;

  pieChartData: any;
  lineChartData: any;
  lineChartOptions: any;
  monthlySummaryData: any;
  barOptions: any;

  constructor(
    private categoryService: CategoryService,
    private userService: UserService,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private currencyService: CurrencyService,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {

  }

  async ngOnInit() {
    this.currentUser = await this.userService.getUser(this.authService.currentUserId);

    await this.loadCategories();
    await this.loadCurrencies();
    //await this.loadTransactions();


    await this.loadAllDashboardsData();

    this.resetTransactionForm();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAllCurrencies();
  }

  async loadCurrencies() {
    this.currencies = await this.currencyService.getAllCurrencies();

    this.userCurrency = this.currencies.find(c => c.code == this.currentUser?.preferredCurrencyCode);
    this.newTransaction.currencyId = this.userCurrency.id;
  }

  async loadAllDashboardsData() {
    this.totalsDashboardData = [];

    await this.loadFinancialSummary();
    await this.loadTopExpenseCategories();
    await this.loadMonthlyBalanceTrend();
    await this.loadMonthlyIncomeExpense();
    await this.loadDailyData();
    await this.loadLastTransactions();
  }

  async loadTransactions() {
    //this.categories = await this.categoryService.getAll();
  }

  async loadFinancialSummary() {
    this.summaryLoading = true;
    this.financialSummary = await this.dashboardService.getFinancialSummary(this.currentUser.id);
    this.summaryLoading = false;
  }

  async loadTopExpenseCategories() {
    this.topExpenseCategories = await this.dashboardService.getTopExpenseCategories(this.currentUser.id, 10);
    this.initCatExpRadar();

    this.initCategoriesPie();
    this.totalsDashboardData.push({
      index: 0,
      chartTitle: 'Top Categories',
      chartData: this.catData,
      chartOptions: this.catOptions,
      tableTitle: 'Categories Expenses',
      tableData: this.topExpenseCategories,
      tableColumns: ['category', 'total']
    });
    this.cdr.detectChanges();
  }

  async loadMonthlyBalanceTrend() {
    this.monthlyBalanceTrend = await this.dashboardService.getMonthlyBalanceTrend(this.currentUser.id);
  }

  async loadMonthlyIncomeExpense() {
    this.monthlyIncomeExpense = await this.dashboardService.getMonthlyIncomeExpenseTrend(this.currentUser.id, new Date().getFullYear());
    console.log(this.monthlyIncomeExpense);

    this.monthlyIncomeExpensesData = {
    labels: this.monthlyIncomeExpense.map(m => m.month),
    datasets: [
      { label: 'Income', backgroundColor: '#42A5F5', data: this.monthlyIncomeExpense.map(m => m.income) },
      { label: 'Expense', backgroundColor: '#EF5350', data: this.monthlyIncomeExpense.map(m => m.expense) },
    ],
  };
  }

  async loadDailyData() {
    await this.loadDailyAverageExpenses();
    await this.loadDailyExpenses();
    this.initDailyExpensesLineChart();
    this.initDailyPie();

    this.totalsDashboardData.push({
      index: 1,
      chartTitle: 'Daily Expenses',
      chartData: this.dailyData,
      chartOptions: this.dailyOptions,
      tableTitle: 'Daily Expenses',
      tableData: this.dailyExpenses,
      tableColumns: ['date', 'total']
    });
    this.cdr.detectChanges();
  }

  async loadDailyAverageExpenses() {
    this.dailyExpenseAverage = await this.dashboardService.getAverageDailyExpense(this.currentUser.id, 20);
    console.log(this.dailyExpenseAverage);
  }

  async loadDailyExpenses() {
    this.dailyExpenses = await this.dashboardService.getDailyExpenses(this.currentUser.id, 7);
    console.log(this.dailyExpenses);
  }

  async loadLastTransactions() {
    this.lastTransactions = await this.dashboardService.getLastTransactions(this.currentUser.id, 20);
    console.log(this.lastTransactions);
  }


  async loadTotals(index: number = 0) {
    this.salesTotalsLoading = true;

    switch (index) {
        case 0:
        default:
            await this.loadTopExpenseCategories();
        break;
        case 1:
            await this.loadDailyData();
        break;
        case 2:

        break;
        case 3:

        break;
        case 4:

        break;
    }

    this.salesTotalsLoading = false;
  }

  initCategoriesPie() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    let othersSum = 0;
    for(let catExp of this.topExpenseCategories.slice(5, this.topExpenseCategories.length)) {
        othersSum += catExp.total;
    }

    this.catData = {
        labels: this.topExpenseCategories.slice(0, 5).map(c => c.category).concat('Other'),
        datasets: [
            {
                data: this.topExpenseCategories.slice(0, 5).map(c => c.total).concat(othersSum),
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--gray-500'), documentStyle.getPropertyValue('--orange-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--gray-400'), documentStyle.getPropertyValue('--orange-400')]
            }
        ]
    };

    this.catOptions = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
  }

  initCatExpRadar() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');

    this.catExpRadarData = {
        labels: this.topExpenseCategories.map(c => c.category),
        datasets: [
            {
                label: 'Latest Expenses',
                borderColor: documentStyle.getPropertyValue('--pink-200'),
                pointBackgroundColor: documentStyle.getPropertyValue('--pink-500'),
                pointBorderColor: documentStyle.getPropertyValue('--pink-400'),
                pointHoverBackgroundColor: textColor,
                pointHoverBorderColor: documentStyle.getPropertyValue('--bluegray-400'),
                data: this.topExpenseCategories.map(c => c.total)
            },
        ]
    };
    
    this.catExpRadarOptions = {
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                grid: {
                    color: textColorSecondary
                },
                pointLabels: {
                    color: textColorSecondary
                }
            }
        }
    };
  }

  initDailyPie() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.dailyData = {
        labels: this.dailyExpenses.map(d => d.date),
        datasets: [
            {
                data: this.dailyExpenses.map(d => d.total),
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500'), documentStyle.getPropertyValue('--gray-500'), documentStyle.getPropertyValue('--orange-500'), documentStyle.getPropertyValue('--purple-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-400'), documentStyle.getPropertyValue('--gray-400'), documentStyle.getPropertyValue('--orange-400'), documentStyle.getPropertyValue('--purple-400')]
            }
        ]
    };

    this.dailyOptions = {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
  }

  initDailyExpensesLineChart() {
    const groupedByDate = this.groupByDate();
    this.lineChartData = {
      labels: Object.keys(groupedByDate),
      datasets: [
        {
          label: 'Daily Expenses',
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

  groupByDate() {
    const grouped: Record<string, number> = {};
    this.dailyExpenses.sort((e1, e2) => new Date(e1.date).getTime() - new Date(e2.date).getTime()).forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + t.total;
    });
    return grouped;
  }


  showAddTransactionDialog() {
    this.addTransactionDialogVisible = true;
  }

  resetTransactionForm() {
    this.newTransaction = {
      id: uuidv4(),
      userId: this.authService.currentUserId,
      categoryId: null,
      amount: null,
      currencyId: this.userCurrency.id,
      date: new Date(),
      notes: ''
    };
  }

  isTransactionValid(): boolean {
    const t = this.newTransaction;
    return !!(t.amount && t.categoryId && t.date);
  }

  async saveTransaction() {
    let success = await this.transactionService.createTransaction(this.newTransaction);

    if(success) {
      await this.loadAllDashboardsData();
      this.messageService.add({ severity: 'success', summary: 'Created successfully!', detail: 'New Transaction was created' });
    }

    this.addTransactionDialogVisible = false;
  }



  // calculateBalance() {
  //   this.totalBalance = this.lastTransactions.reduce((a, b) => a + b.amount, 0);
  // }

  // setupPieChart() {
  //   const categories = [1, 2, 15];
  //   const data = categories.map(cat =>
  //     this.lastTransactions
  //       .filter(t => t.categoryId === cat)
  //       .reduce((sum, t) => sum + t.amount, 0)
  //   );

  //   this.pieChartData = {
  //     labels: categories,
  //     datasets: [{ data, backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'] }]
  //   };
  // }

  // setupMonthlySummary() {
  //   const summary = {
  //     Jan: 100, Feb: 200, Mar: 300, Apr: 0, May: 500
  //   };

  //   this.monthlySummaryData = {
  //     labels: Object.keys(summary),
  //     datasets: [
  //       {
  //         label: 'Amount',
  //         backgroundColor: '#4CAF50',
  //         data: Object.values(summary)
  //       }
  //     ]
  //   };

  //   this.barOptions = {
  //     scales: { y: { beginAtZero: true } }
  //   };
  // }
}
