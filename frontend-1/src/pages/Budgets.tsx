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
    Typography,
    IconButton,
    Grid,
} from '@mui/material';

import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { RootState } from '../store';
import { Budget, Category } from '../types';
import {
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getCategories,
} from '../services/api';

const Budgets: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
    const [formData, setFormData] = useState<any>({
        category: '',
        amount: '',
        month: new Date().toISOString().split('T')[0].slice(0, 7),
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [budgetsData, categoriesData] = await Promise.all([
                getBudgets(),
                getCategories(),
            ]);
            setBudgets(budgetsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const handleOpen = (budget?: Budget) => {
        if (budget) {
            setEditingBudget(budget);
            setFormData({
                category: budget.category.toString(),
                amount: budget.amount.toString(),
                month: budget.month.slice(0, 7),
            });
        } else {
            setEditingBudget(null);
            setFormData({
                category: '',
                amount: '',
                month: new Date().toISOString().split('T')[0].slice(0, 7),
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingBudget(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBudget) {
                await updateBudget(editingBudget.id, formData);
            } else {
                await createBudget(formData);
            }
            handleClose();
            loadData();
        } catch (error) {
            console.error('Error saving budget:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await deleteBudget(id);
                loadData();
            } catch (error) {
                console.error('Error deleting budget:', error);
            }
        }
    };

    const formatMonth = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <Box>
            <Grid container justifyContent="space-between" alignItems="center" mb={3}>
                <Grid>
                    <Typography variant="h4">Monthly Budgets</Typography>
                </Grid>
                <Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpen()}
                    >
                        Add Budget
                    </Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Month</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgets.map((budget) => (
                            <TableRow key={budget.id}>
                                <TableCell>{formatMonth(budget.month)}</TableCell>
                                <TableCell>{budget.category_name}</TableCell>
                                <TableCell>${budget.amount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpen(budget)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(budget.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editingBudget ? 'Edit Budget' : 'Add Budget'}
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
                            fullWidth
                            label="Month"
                            name="month"
                            type="month"
                            value={formData.month}
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
                            {editingBudget ? 'Update' : 'Add'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
};

export default Budgets; 