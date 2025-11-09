import { API_URL, STORAGE_KEYS } from '@/config';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  organization_id: number;
  is_active: boolean;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  subscription_plan: string;
  subscription_status: string;
  is_active: boolean;
}

export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string;
  created_at: string;
}

export interface KnowledgeStats {
  organization_knowledge_count: number;
  vector_store: {
    total_vectors: number;
    dimension: number;
    index_type: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login/json', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(): Promise<User> {
    return this.request<User>('/api/auth/me');
  }

  // Organization
  async getOrganization(): Promise<Organization> {
    return this.request<Organization>('/api/organizations/me');
  }

  // Knowledge Base
  async getKnowledge(): Promise<KnowledgeItem[]> {
    return this.request<KnowledgeItem[]>('/api/knowledge/');
  }

  async addKnowledge(data: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    return this.request<KnowledgeItem>('/api/knowledge/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async searchKnowledge(query: string): Promise<KnowledgeItem[]> {
    return this.request<KnowledgeItem[]>('/api/knowledge/search', {
      method: 'POST',
      body: JSON.stringify({ query, top_k: 5 }),
    });
  }

  async ragQuery(query: string): Promise<{ answer: string; sources: KnowledgeItem[] }> {
    return this.request('/api/knowledge/rag', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  async getKnowledgeStats(): Promise<KnowledgeStats> {
    return this.request<KnowledgeStats>('/api/knowledge/stats');
  }
}

export const api = new ApiClient(API_URL);
