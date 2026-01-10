
import { StatData, SpendingPoint, CategorySpend, SavingsGoal, Transaction, BudgetCategory } from './types';

export const STATS: StatData[] = [
  { label: 'Total Balance', value: '$12,450.00', change: 2.5, isPositive: true },
  { label: 'Monthly Income', value: '$5,240.00', change: 1.2, isPositive: false },
  { label: 'Monthly Spending', value: '$3,120.00', change: 5.4, isPositive: false },
  { label: 'Total Savings', value: '$2,120.00', change: 10.0, isPositive: true },
];

export const SPENDING_CHART_DATA: SpendingPoint[] = [
  { month: 'MAY', income: 4200, expenses: 2800 },
  { month: 'JUN', income: 4500, expenses: 3100 },
  { month: 'JUL', income: 4800, expenses: 2900 },
  { month: 'AUG', income: 4600, expenses: 3500 },
  { month: 'SEP', income: 5200, expenses: 2400 },
  { month: 'OCT', income: 5240, expenses: 3120 },
];

export const CATEGORY_DATA: CategorySpend[] = [
  { name: 'Housing', value: 1200, color: '#13a4ec' },
  { name: 'Dining', value: 850, color: '#fb923c' },
  { name: 'Transport', value: 450, color: '#10b981' },
  { name: 'Utilities', value: 620, color: '#94a3b8' },
];

export const SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: '1',
    title: 'Emergency Fund',
    target: 20000,
    saved: 15000,
    icon: 'emergency_home',
    color: '#13a4ec'
  },
  {
    id: '2',
    title: 'Vacation Fund',
    target: 5000,
    saved: 2000,
    icon: 'flight_takeoff',
    color: '#f97316'
  }
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2023-10-24', merchant: 'Apple Store', category: 'Electronics', amount: 1299.00, type: 'expense' },
  { id: '2', date: '2023-10-23', merchant: 'Whole Foods', category: 'Groceries', amount: 84.50, type: 'expense' },
  { id: '3', date: '2023-10-22', merchant: 'Tech Corp', category: 'Salary', amount: 2620.00, type: 'income' },
  { id: '4', date: '2023-10-21', merchant: 'Starbucks', category: 'Dining', amount: 6.75, type: 'expense' },
  { id: '5', date: '2023-10-20', merchant: 'Uber', category: 'Transport', amount: 24.00, type: 'expense' },
];

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  {
    id: '1',
    name: 'Groceries',
    parentCategory: 'Food & Drink',
    spent: 450.00,
    limit: 600.00,
    icon: 'shopping_cart',
    status: 'On Track',
    colorClass: 'green',
    type: 'expense',
    isInvestment: false
  },
  {
    id: '2',
    name: 'Entertainment',
    parentCategory: 'Lifestyle',
    spent: 185.00,
    limit: 200.00,
    icon: 'movie',
    status: 'Near Limit',
    colorClass: 'yellow',
    type: 'expense',
    isInvestment: false
  },
  {
    id: '3',
    name: 'Rent & Utilities',
    parentCategory: 'Fixed Costs',
    spent: 2150.00,
    limit: 2100.00,
    icon: 'home',
    status: 'Over Budget',
    colorClass: 'red',
    type: 'expense',
    isInvestment: false
  },
  {
    id: '4',
    name: 'Transportation',
    parentCategory: 'Commute',
    spent: 120.50,
    limit: 350.00,
    icon: 'directions_car',
    status: 'Active',
    colorClass: 'primary',
    type: 'expense',
    isInvestment: false
  },
  {
    id: '5',
    name: 'Freelance Pay',
    parentCategory: 'Income',
    spent: 0,
    limit: 2000.00,
    icon: 'payments',
    status: 'Active',
    colorClass: 'green',
    type: 'income',
    isInvestment: false
  },
  {
    id: '6',
    name: 'S&P 500 ETF',
    parentCategory: 'Investments',
    spent: 500,
    limit: 500,
    icon: 'monitoring',
    status: 'Active',
    colorClass: 'primary',
    type: 'expense',
    isInvestment: true
  }
];
