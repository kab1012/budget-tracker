import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Typography,
    IconButton,
    Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { Transaction, Category } from '../types';
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getCategories,
} from '../services/api';

const Transactions: React.FC = () => {

    const dummy_transactions = [
        {
          id: 1,
          category: 101,
          category_name: "Salary",
          amount: 50000,
          type: "income",
          description: "Monthly salary credited",
          date: "2024-03-01",
        },
        {
          id: 2,
          category: 102,
          category_name: "Groceries",
          amount: 2500,
          type: "expense",
          description: "Bought weekly groceries",
          date: "2024-03-02",
        },
        {
          id: 3,
          category: 103,
          category_name: "Rent",
          amount: 15000,
          type: "expense",
          description: "Monthly house rent",
          date: "2024-03-05",
        },
        {
          id: 4,
          category: 104,
          category_name: "Freelance",
          amount: 12000,
          type: "income",
          description: "Freelance web development project",
          date: "2024-03-07",
        },
        {
          id: 5,
          category: 105,
          category_name: "Dining Out",
          amount: 1800,
          type: "expense",
          description: "Dinner at a restaurant",
          date: "2024-03-10",
        },
        {
          id: 6,
          category: 106,
          category_name: "Electricity Bill",
          amount: 500,
          type: "expense",
          description: "Monthly electricity bill payment",
          date: "2024-03-12",
        },
        {
          id: 7,
          category: 107,
          category_name: "Stock Investment",
          amount: 10000,
          type: "income",
          description: "Returns from stock investment",
          date: "2024-03-15",
        },
        {
          id: 8,
          category: 108,
          category_name: "Transportation",
          amount: 200,
          type: "expense",
          description: "Fuel and public transport expenses",
          date: "2024-03-18",
        },
        {
          id: 9,
          category: 109,
          category_name: "Medical",
          amount: 2500,
          type: "expense",
          description: "Doctor consultation and medicine",
          date: "2024-03-20",
        },
        {
          id: 10,
          category: 110,
          category_name: "Bonus",
          amount: 20000,
          type: "income",
          description: "Performance bonus credited",
          date: "2024-03-25",
        },
      ];
      
      
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        transaction_type: 'expense',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [transactionsData, categoriesData] = await Promise.all([
                getTransactions(),
                getCategories(),
            ]);
            setTransactions(transactionsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleOpen = (transaction?: Transaction) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setFormData({
                category: transaction.category.toString(),
                amount: transaction.amount.toString(),
                transaction_type: transaction.type,
                description: transaction.description,
                date: transaction.date,
            });
        } else {
            setEditingTransaction(null);
            setFormData({
                category: '',
                amount: '',
                transaction_type: 'expense',
                description: '',
                date: new Date().toISOString().split('T')[0],
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingTransaction(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // try {
        //     if (editingTransaction) {
        //         await updateTransaction(editingTransaction.id, formData);
        //     } else {
        //         await createTransaction(formData);
        //     }
        //     handleClose();
        //     loadData();
        // } catch (error) {
        //     console.error('Error saving transaction:', error);
        // }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
                loadData();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid>
                    <Typography variant="h4">Transactions</Typography>
                </Grid>
                <Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Add Transaction
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dummy_transactions
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((transaction: any) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.date}</TableCell>
                                    <TableCell>{transaction.category_name}</TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleOpen(transaction)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDelete(transaction.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={transactions.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            select
                            fullWidth
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            margin="normal"
                            required
                        >
                            {/* {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))} */}
                            <MenuItem value="salary">Salary</MenuItem>
                            <MenuItem value="groceries">Groceries</MenuItem>
                            <MenuItem value="rent">Rent</MenuItem>
                            <MenuItem value="freelance">Freelance</MenuItem>
                            <MenuItem value="dining_out">Dining Out</MenuItem>
                            <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
                            <MenuItem value="stock_investment">Stock Investment</MenuItem>
                            
                        </TextField>
                        <TextField
                            fullWidth
                            label="Amount"
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            select
                            fullWidth
                            label="Type"
                            name="transaction_type"
                            value={formData.transaction_type}
                            onChange={handleChange}
                            margin="normal"
                            required
                        >
                            <MenuItem value="income">Income</MenuItem>
                            <MenuItem value="expense">Expense</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Date"
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            margin="normal"
                            required
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingTransaction ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Transactions; 