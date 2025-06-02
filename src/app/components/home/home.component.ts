import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
import { Transaction } from '../../models/transaction.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CurrencyService } from '../../services/currency.service';
import { TransactionService } from '../../services/transaction.service';
import { Currency } from '../../models/currency.model';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  editMode: boolean = false;
  isMobile: boolean = false;

  addTransactionDialogVisible = false;
  selectedTransaction: Transaction = {
    id: '',
    userId: '',
    categoryId: 0,
    amount: 0,
    currencyId: 0,
    date: new Date(),
    notes: ''
  };
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

  salesTotalsTopExpenseCategories: ExpenseCategorySummary[] = [];
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

  monthlyIncomeExpensesYear: number;

  monthlyBalanceTrend: MonthlyBalance[] = [];
  monthlyIncomeExpense: MonthylIncomeExpense[] = [];
  dailyExpenseAverage: DailyExpenseAverage;

  dailyExpenses: DailyExpense[] = [];
  salesTotalsDailyExpenses: DailyExpense[] = [];

  lastTransactions: {transaction: Transaction, refs: {currency: Currency, category: Category}}[] = [];
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
  selectedSalesTotalsCount: number = 20;
  selectedCustomerCount: number = 10;
  selectedTransactionsCount: number = 20;

  intervals = [
    { label: 'Last 7 days', value: 7 },
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 60 days', value: 60 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 180 days', value: 180 },
    { label: 'Last 365 days', value: 365 },
  ];
  selectedSalesTotalsInterval: number = 60;
  selectedDailyExpensesInterval: number = 7;
  selectedTopCategoriesInterval: number = 30;
  selectedTransactionsInterval: number = 30;
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
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,

  ) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }

  async ngOnInit() {
    this.isMobile = window.innerWidth < 768;

    this.currentUser = await this.userService.getUser(this.authService.currentUserId);

    await this.loadCategories();
    await this.loadCurrencies();

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

  async loadFinancialSummary() {
    this.summaryLoading = true;
    this.financialSummary = await this.dashboardService.getFinancialSummary(this.currentUser.id);
    this.summaryLoading = false;
  }

  async loadTopExpenseCategories() {
    this.salesTotalsTopExpenseCategories = await this.dashboardService.getTopExpenseCategories(this.currentUser.id, this.selectedSalesTotalsCount, this.selectedSalesTotalsInterval);
    this.topExpenseCategories = await this.dashboardService.getTopExpenseCategories(this.currentUser.id, 20, this.selectedTopCategoriesInterval);
    this.initCatExpRadar();

    this.initCategoriesPie();
    this.totalsDashboardData.push({
      index: 0,
      chartTitle: 'Top Categories',
      chartData: this.catData,
      chartOptions: this.catOptions,
      tableTitle: 'Categories Expenses',
      tableData: this.salesTotalsTopExpenseCategories,
      tableColumns: ['category', 'total']
    });
    this.cdr.detectChanges();
  }

  async loadMonthlyBalanceTrend() {
    this.monthlyBalanceTrend = await this.dashboardService.getMonthlyBalanceTrend(this.currentUser.id);
  }

  async loadMonthlyIncomeExpense() {
    this.monthlyIncomeExpensesYear = new Date().getFullYear();
    this.monthlyIncomeExpense = await this.dashboardService.getMonthlyIncomeExpenseTrend(this.currentUser.id, this.monthlyIncomeExpensesYear);

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
      tableData: this.salesTotalsDailyExpenses,
      tableColumns: ['date', 'total']
    });
    this.cdr.detectChanges();
  }

  async loadDailyAverageExpenses() {
    this.dailyExpenseAverage = await this.dashboardService.getAverageDailyExpense(this.currentUser.id, 365);
  }

  async loadDailyExpenses() {
    this.salesTotalsDailyExpenses = await this.dashboardService.getDailyExpenses(this.currentUser.id, this.selectedSalesTotalsInterval);
    this.dailyExpenses = await this.dashboardService.getDailyExpenses(this.currentUser.id, this.selectedDailyExpensesInterval);

    this.initDailyExpensesLineChart();
  }

  async loadLastTransactions() {
    this.lastTransactions = [];
    let lastTransactionsT: Transaction[] = await this.dashboardService.getLastTransactions(this.currentUser.id, this.selectedTransactionsCount, this.selectedTransactionsInterval);
    
    for(let lt of lastTransactionsT)
    {
      let category: Category = await this.categoryService.getCategory(lt.categoryId);
      let currency: Currency = await this.currencyService.getCurrency(lt.currencyId);

      this.lastTransactions.push(
      {
        transaction: lt,
        refs: {
          category: category,
          currency: currency
        }
      });
    }
  }


  async loadTotals() {
    this.salesTotalsLoading = true;

    this.totalsDashboardData = [];

    await this.loadTopExpenseCategories();
    await this.loadDailyData();

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
    if (!this.editMode) {
      this.selectedTransaction = this.newTransaction;
    }

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

    this.editMode = false;
  }

  isTransactionValid(): boolean {
    const t = this.selectedTransaction;
    return !!(t.amount && t.categoryId && t.date);
  }

  async saveTransaction() {
    let normalizedDate = new Date(Date.UTC(this.selectedTransaction.date.getFullYear(), this.selectedTransaction.date.getMonth(), this.selectedTransaction.date.getDate()));
    let normalizedAmount = this.selectedTransaction.amount.toFixed(2);
    this.selectedTransaction.date = normalizedDate;
    this.selectedTransaction.amount = Number.parseFloat(normalizedAmount);
    
    let success = false;

    if(this.editMode)
      success = await this.transactionService.updateTransaction(this.selectedTransaction);
    else
      success = await this.transactionService.createTransaction(this.selectedTransaction);

    if(success) {
      await this.loadAllDashboardsData();
      this.messageService.add({ severity: 'success', summary: 'Saved successfully!', detail: 'Transaction was saved' });
    }

    this.addTransactionDialogVisible = false;
  }

  editTransaction(transaction: any) {
    this.resetTransactionForm();

    this.selectedTransaction = transaction;
    this.selectedTransaction.date = new Date(transaction.date);
    this.editMode = true;
    this.showAddTransactionDialog();
  }

  async deleteTransactionConfirm(event: Event) {
    if (!this.selectedTransaction) return;

    this.editMode = false;

    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this transaction?',
        header: 'Delete Confirmation',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",
        accept: async () => {
            await this.deleteSelectedTransaction();
        },
        reject: () => {
        }
    }); 
  }


  async deleteSelectedTransaction() {
    let res = await this.transactionService.deleteTransaction(this.selectedTransaction.id);

    this.addTransactionDialogVisible = false;
    if(res)
    {
      await this.loadAllDashboardsData();
      this.messageService.add({ severity: 'info', summary: 'Deleted', detail: 'Transaction removed.' });
    }
  }
}
