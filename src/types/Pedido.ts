import { Item } from './Item';

export interface Pedido {
  id: string;
  cliente: string;
  email: string;
  itens: Item[];
  total: number;
  status: 'PENDENTE' | 'ENVIADO';
  data_criacao: string;
  data_atualizacao: string;
}
