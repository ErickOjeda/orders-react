import axios from 'axios';
import { Pedido } from '../types/Pedido';

const API_URL = 'https://hvq4ugy77b.execute-api.us-east-1.amazonaws.com/pedidos';

export const getPedidos = async (): Promise<Pedido[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar os pedidos:', error);
    return [];
  }
};

export const getById = async (id: string): Promise<Pedido | null> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar o pedido:', error);
    return null;
  }
}

export const deletePedido = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Erro ao deletar o pedido:', error);
  }
};

export const changeStatus = async (id: string, status: string): Promise<void> => {
  try {
    await axios.patch(`${API_URL}/${id}`, { status });
  } catch (error) {
    console.error('Erro ao alterar o status:', error);
  }
}

export const criarPedido = async (pedido: Pedido): Promise<Pedido> => {
  try {
    const response = await axios.post(API_URL, pedido);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar o pedido:', error);
    throw error;
  }
};