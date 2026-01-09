
export interface StatData {
  label: string;
  value: string;
  change: number;
  isPositive: boolean;
}

export interface SpendingPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface CategorySpend {
  name: string;
  value: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  target: number;
  saved: number;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'expense' | 'income';
}

export type BudgetStatus = 'On Track' | 'Near Limit' | 'Over Budget' | 'Active';

export interface BudgetCategory {
  id: string;
  name: string;
  parentCategory: string;
  spent: number;
  limit: number;
  icon: string;
  status: BudgetStatus;
  colorClass: string; // e.g., 'green', 'yellow', 'red', 'primary'
  type: 'expense' | 'income';
}
