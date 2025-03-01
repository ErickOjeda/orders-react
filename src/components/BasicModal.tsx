import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab, TextField, Button, Grid, IconButton } from '@mui/material';
import { Pedido } from '../types/Pedido';
import { Item } from '../types/Item';
import { criarPedido } from '../services/pedidos';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    color: 'black',
    boxShadow: 24,
    borderRadius: '5px',
    p: 4,
};

export default function BasicModal() {
    const [open, setOpen] = React.useState(false);
    const [cliente, setCliente] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [itens, setItens] = React.useState<Item[]>([{ produto: '', preco: 0, quantidade: 1 }]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddItem = () => {
        setItens([...itens, { produto: '', preco: 0, quantidade: 1 }]);
    };

    const handleItemChange = (index: number, field: keyof Item, value: string | number) => {
        const newItens = [...itens];
        newItens[index][field] = value as never;
        setItens(newItens);
    };

    const handleSubmit = async () => {
        const novoPedido: Pedido = {
            id: '', // O ID será gerado pelo serviço
            cliente,
            email,
            itens,
            total: itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0),
            status: 'PENDENTE',
            data_criacao: '',
            data_atualizacao: '',
        };

        try {
            const pedidoCriado = await criarPedido(novoPedido);
            console.log('Pedido criado:', pedidoCriado);
            handleClose();
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
        }
    };

    const isFormValid = () => {
        const isClienteValid = cliente.trim() !== '';
        const isEmailValid = email.trim() !== '';
        const isItensValid = itens.length > 0 && itens.every(item =>
            item.produto.trim() !== '' && item.preco > 0 && item.quantidade > 0
        );
        return isClienteValid && isEmailValid && isItensValid;
    };


    return (
        <div>
            <Fab
                onClick={handleOpen}
                aria-label="add"
                sx={{
                    bgcolor: '#03c403',
                    color: 'white',
                    position: 'fixed',
                    bottom: 50,
                    right: 50,
                    '&:hover': {
                        bgcolor: '#015601',
                    },
                }}
            >
                <AddIcon />
            </Fab>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Criar um novo pedido!
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Preencha os campos abaixo para criar um novo pedido.
                    </Typography>

                    <TextField
                        fullWidth
                        label="Cliente"
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                    />

                    <Box sx={{ overflowY: 'auto', maxHeight: '200px', overflowX: 'hidden' }}>
                        {itens.map((item, index) => (
                            <Grid container spacing={2} key={index} sx={{ mt: 2, width: '100%' }}>
                                <Grid item xs={5}>
                                    <TextField
                                        fullWidth
                                        label="Produto"
                                        value={item.produto}
                                        onChange={(e) => handleItemChange(index, 'produto', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Preço"
                                        type="number"
                                        value={item.preco}
                                        onChange={(e) => handleItemChange(index, 'preco', parseFloat(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Quantidade"
                                        type="number"
                                        value={item.quantidade}
                                        onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value))}
                                    />
                                </Grid>
                                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => setItens(itens.filter((_, i) => i !== index))}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                    </Box>
                    <Button onClick={handleAddItem} sx={{ mt: 2 }}>
                        Adicionar Item
                    </Button>


                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                        disabled={!isFormValid()}
                    >
                        Criar Pedido
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}