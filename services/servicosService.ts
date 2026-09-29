const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const API_KEY = import.meta.env.VITE_API_KEY || '';

function getHeaders(extra: Record<string, string> = {}) {
    const headers: Record<string, string> = { ...extra };
    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }
    return headers;
}

export const servicosService = {
    async getAll() {
        const response = await fetch(`${API_URL}/servicos`, {
            headers: getHeaders(),
            mode: 'cors',
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async getById(id: string) {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            headers: getHeaders(),
            mode: 'cors',
            signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async create(formData: FormData) {
        const response = await fetch(`${API_URL}/servicos`, {
            method: 'POST',
            headers: getHeaders(),
            body: formData,
            mode: 'cors',
            signal: AbortSignal.timeout(15000)
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async update(id: string, servico: any) {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'PUT',
            headers: getHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(servico),
            mode: 'cors',
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async delete(id: string) {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
            mode: 'cors',
            signal: AbortSignal.timeout(10000)
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
    }
};
