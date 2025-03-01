import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import { Accordion, AccordionDetails, Button, CircularProgress, Typography } from '@mui/material';
import { changeStatus, deletePedido, getPedidos, getById } from '../services/pedidos';
import { Pedido } from '../types/Pedido';
import Chip from '@mui/material/Chip';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import React from 'react';

export default function EnhancedTable() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pedidoDetalhado, setPedidoDetalhado] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [loadingAction, setLoadingAction] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading({ ...loading, table: true });
      const data = await getPedidos();
      setPedidos(data);
      setLoading({ ...loading, table: false });
    };

    fetchPedidos();
  }, []);

  const handleExpandClick = async (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      if (!pedidoDetalhado[id]) {
        setLoading((prev) => ({ ...prev, [id]: true }));
        const detalhes = await getById(id);
        setPedidoDetalhado((prev) => ({ ...prev, [id]: detalhes }));
        setLoading((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleAction = async (id: string, action: () => Promise<void>) => {
    setLoadingAction((prev) => ({ ...prev, [id]: true }));
    await action();
    setLoadingAction((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Total</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => {
                const isExpanded = expanded === pedido.id;
                const detalhes = pedidoDetalhado[pedido.id];
                return (
                  <React.Fragment key={pedido.id}>
                    <TableRow hover sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Button onClick={() => handleExpandClick(pedido.id)}>
                          {loading[pedido.id] ? <CircularProgress size={24} /> : (isExpanded ? <KeyboardArrowUpRoundedIcon /> : <KeyboardArrowDownRoundedIcon />)}
                        </Button>
                      </TableCell>
                      <TableCell>{pedido.cliente}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={pedido.status}
                          sx={{
                            backgroundColor: pedido.status === 'PENDENTE' ? 'yellow' : '#03c403',
                            color: pedido.status === 'PENDENTE' ? 'black' : 'white',
                            fontWeight: 600
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">R$ {pedido.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleAction(pedido.id, () => changeStatus(pedido.id, "ENVIADO"))}
                          disableElevation
                          sx={{ backgroundColor: '#03c403', marginRight: 3 }}
                          disabled={pedido.status === "ENVIADO" || loadingAction[pedido.id]}
                        >
                          {loadingAction[pedido.id] ? <CircularProgress size={24} color="inherit" /> : <LocalShippingIcon />}
                        </Button>
                        <Button
                          variant="contained"
                          onClick={() => handleAction(pedido.id, () => deletePedido(pedido.id))}
                          disableElevation
                          sx={{ backgroundColor: '#f34242' }}
                          disabled={loadingAction[pedido.id]}
                        >
                          {loadingAction[pedido.id] ? <CircularProgress size={24} color="inherit" /> : <DeleteIcon />}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ padding: 0 }}>
                          <Accordion expanded={true} sx={{ boxShadow: 'none', backgroundColor: '#f5f5f5' }}>
                            <AccordionDetails>
                              {loading[pedido.id] ? (
                                <CircularProgress />
                              ) : (
                                <Box>
                                  <Typography>
                                    <Box display="flex" mt={2} justifyContent={"space-around"} alignItems="center">
                                      <Box>
                                        <strong>Email</strong> {detalhes.email}
                                      </Box>
                                      <Box mx={1}>
                                        <strong>ID</strong> {detalhes.id}
                                      </Box>
                                    </Box>
                                    <Box mt={5}>
                                      <strong>Itens do pedido:</strong>
                                    </Box>
                                  </Typography>

                                  <Box sx={{ overflow: 'auto', maxHeight:  '300px'}}>

                                    <Table size="medium" sx={{ mt: 2 }}>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell sx={{ fontWeight: 600 }}>Produto</TableCell>
                                          <TableCell sx={{ fontWeight: 600 }} align="right">Preço</TableCell>
                                          <TableCell sx={{ fontWeight: 600 }} align="right">Quantidade</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {detalhes.itens.map((item: { produto: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; preco: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; quantidade: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: React.Key | null | undefined) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.produto}</TableCell>
                                            <TableCell align="right">R$ {item.preco}</TableCell>
                                            <TableCell align="right">{item.quantidade}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                </Box>
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
