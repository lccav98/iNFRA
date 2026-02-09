const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const servicosService = {
    async getAll() {
        const response = await fetch(`${API_URL}/servicos`, {
            // Mode cors is default, but ensuring since different ports
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async getById(id: string) {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async create(formData: FormData) {
        const response = await fetch(`${API_URL}/servicos`, {
            method: 'POST',
            body: formData,
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async update(id: string, servico: any) {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(servico),
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
        return response.json();
    },

    async delete(id: string) {
        const response = await fetch(`${API_URL}/servicos/${id}`, {
            method: 'DELETE',
            mode: 'cors'
        });
        if (!response.ok) {
            throw new Error(`Erro API: ${response.statusText}`);
        }
    }
};
