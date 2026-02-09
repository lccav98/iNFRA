import { Material, Equipment, MachineAllocation } from '../types/Logistics';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const logisticsService = {
    // --- Allocations ---
    async getAllocations(): Promise<MachineAllocation[]> {
        const response = await fetch(`${API_URL}/alocacoes`);
        if (!response.ok) throw new Error('Failed to fetch allocations');
        const data = await response.json();
        // Map backend fields to frontend interface
        return data.map((item: any) => ({
            id: item.id,
            equipmentId: item.equipment_id,
            serviceId: item.service_id,
            serviceName: item.service_name,
            startDate: item.start_date.split('T')[0],
            endDate: item.end_date.split('T')[0],
            status: item.status
        }));
    },

    async createAllocation(allocation: Omit<MachineAllocation, 'id'>): Promise<MachineAllocation> {
        const payload = {
            equipment_id: allocation.equipmentId,
            service_id: allocation.serviceId,
            service_name: allocation.serviceName,
            start_date: allocation.startDate,
            end_date: allocation.endDate,
            status: allocation.status
        };
        const response = await fetch(`${API_URL}/alocacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to create allocation');
        const item = await response.json();
        return {
            id: item.id,
            equipmentId: item.equipment_id,
            serviceId: item.service_id,
            serviceName: item.service_name,
            startDate: item.start_date.split('T')[0],
            endDate: item.end_date.split('T')[0],
            status: item.status
        };
    },

    async updateAllocation(id: string, allocation: Partial<MachineAllocation>): Promise<MachineAllocation> {
        const payload: any = {};
        if (allocation.equipmentId) payload.equipment_id = allocation.equipmentId;
        if (allocation.serviceId) payload.service_id = allocation.serviceId;
        if (allocation.serviceName) payload.service_name = allocation.serviceName;
        if (allocation.startDate) payload.start_date = allocation.startDate;
        if (allocation.endDate) payload.end_date = allocation.endDate;
        if (allocation.status) payload.status = allocation.status;

        const response = await fetch(`${API_URL}/alocacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to update allocation');
        const item = await response.json();
        return {
            id: item.id,
            equipmentId: item.equipment_id,
            serviceId: item.service_id,
            serviceName: item.service_name,
            startDate: item.start_date.split('T')[0],
            endDate: item.end_date.split('T')[0],
            status: item.status
        };
    },

    async deleteAllocation(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/alocacoes/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete allocation');
    },

    // --- Materials ---
    async getMaterials(): Promise<Material[]> {
        const response = await fetch(`${API_URL}/materiais`);
        if (!response.ok) throw new Error('Failed to fetch materials');
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            status: item.status,
            location: item.location,
            lastUpdated: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));
    },

    async createMaterial(material: Omit<Material, 'id'>): Promise<Material> {
        const payload = {
            name: material.name,
            quantity: material.quantity,
            unit: material.unit,
            category: material.category,
            status: material.status,
            location: material.location
        };
        const response = await fetch(`${API_URL}/materiais`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create material');
        const item = await response.json();
        return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            status: item.status,
            location: item.location,
            lastUpdated: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
    },

    async updateMaterial(id: string, material: Partial<Material>): Promise<Material> {
        const payload: any = {};
        if (material.name) payload.name = material.name;
        if (material.quantity !== undefined) payload.quantity = material.quantity;
        if (material.unit) payload.unit = material.unit;
        if (material.category) payload.category = material.category;
        if (material.status) payload.status = material.status;
        if (material.location) payload.location = material.location;
        
        const response = await fetch(`${API_URL}/materiais/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update material');
        const item = await response.json();
        return {
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category,
            status: item.status,
            location: item.location,
            lastUpdated: item.updated_at ? new Date(item.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        };
    },

    async deleteMaterial(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/materiais/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete material');
    },

    // --- Equipment ---
    async getEquipment(): Promise<Equipment[]> {
        const response = await fetch(`${API_URL}/equipamentos`);
        if (!response.ok) throw new Error('Failed to fetch equipment');
        const data = await response.json();
        return data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            status: item.status,
            condition: item.condition,
            location: item.location,
            currentServiceId: item.current_service_id
        }));
    },

    async createEquipment(equipment: Omit<Equipment, 'id'>): Promise<Equipment> {
        const payload = {
            name: equipment.name,
            type: equipment.type,
            status: equipment.status,
            condition: equipment.condition,
            location: equipment.location,
            current_service_id: equipment.currentServiceId
        };
        const response = await fetch(`${API_URL}/equipamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to create equipment');
        const item = await response.json();
        return {
            id: item.id,
            name: item.name,
            type: item.type,
            status: item.status,
            condition: item.condition,
            location: item.location,
            currentServiceId: item.current_service_id
        };
    },

    async updateEquipment(id: string, equipment: Partial<Equipment>): Promise<Equipment> {
        const payload: any = {};
        if (equipment.name) payload.name = equipment.name;
        if (equipment.type) payload.type = equipment.type;
        if (equipment.status) payload.status = equipment.status;
        if (equipment.condition !== undefined) payload.condition = equipment.condition;
        if (equipment.location) payload.location = equipment.location;
        if (equipment.currentServiceId) payload.current_service_id = equipment.currentServiceId;
        
        const response = await fetch(`${API_URL}/equipamentos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Failed to update equipment');
        const item = await response.json();
        return {
            id: item.id,
            name: item.name,
            type: item.type,
            status: item.status,
            condition: item.condition,
            location: item.location,
            currentServiceId: item.current_service_id
        };
    },

    async deleteEquipment(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/equipamentos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete equipment');
    }
};
