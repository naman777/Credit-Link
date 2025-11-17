// API client for making requests to the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(data: { name: string; email: string; phone: string; password: string; role?: string }) {
    return this.request<{ token: string; user: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<any>('/api/auth/me');
  }

  // Wallet endpoints
  async getWalletBalance() {
    return this.request<any>('/api/wallet/balance');
  }

  async getWalletTransactions() {
    return this.request<any[]>('/api/wallet/transactions');
  }

  async deposit(amount: number) {
    return this.request<any>('/api/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async withdraw(amount: number) {
    return this.request<any>('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Loan endpoints
  async getLoanProducts() {
    return this.request<any[]>('/api/loans/products');
  }

  async applyForLoan(data: { product_id: string; requested_amount: number; purpose?: string }) {
    return this.request<any>('/api/loans/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLoanApplications() {
    return this.request<any[]>('/api/loans/applications');
  }

  async approveLoan(data: { application_id: string; lender_id: string }) {
    return this.request<any>('/api/loans/approve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async rejectLoan(data: { application_id: string; rejection_reason: string }) {
    return this.request<any>('/api/loans/reject', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Repayment endpoints
  async getRepaymentSchedule(loanId: string) {
    return this.request<any[]>(`/api/repayments/schedule?loan_id=${loanId}`);
  }

  async makeRepayment(scheduleId: string) {
    return this.request<any>('/api/repayments/pay', {
      method: 'POST',
      body: JSON.stringify({ schedule_id: scheduleId }),
    });
  }

  // KYC endpoints
  async submitKYC(data: { doc_type: string; doc_number: string }) {
    return this.request<any>('/api/kyc/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getKYCStatus() {
    return this.request<any>('/api/kyc/status');
  }

  async verifyKYC(data: { kyc_id: string; status: string }) {
    return this.request<any>('/api/kyc/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Credit score endpoint
  async getCreditScore() {
    return this.request<any>('/api/credit-score');
  }
}

export const apiClient = new ApiClient();
