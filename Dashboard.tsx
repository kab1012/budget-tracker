import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Container,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import * as d3 from 'd3';
import { RootState } from '../store';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
// import { getTransactionSummary } from '../services/api';

const Dashboard: React.FC = () => {
    const summary = {
        total_income: 8000,         // Monthly income
        total_expenses: 5500,       // Total monthly expenses
        monthly_budget: 6000,       // Allocated budget for the month
        balance: 2500,              // Remaining balance after expenses (total_income - total_expenses)
        budget_vs_actual: 500,      // Difference between budget and actual expenses (monthly_budget - total_expenses)
        total_savings: 5000,        // Total savings accumulated
        total_investments: 7000,    // Total money invested
        total_debts: 3000,          // Outstanding debts
        total_assets: 15000,        // Total assets owned
        total_liabilities: 3000,    // Total liabilities (debts, loans, etc.)
        // total_net_worth: 12000,     // Net worth (total_assets - total_liabilities)
    };
    
    
    const theme = useTheme();
    const incomeChartRef = useRef<SVGSVGElement>(null);
    const expenseChartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (summary && incomeChartRef.current && expenseChartRef.current) {
            // Income vs Expenses Chart
            const incomeData = [
                { name: 'Income', value: summary.total_income },
                { name: 'Expenses', value: summary.total_expenses },
            ];

            const width = 300;
            const height = 300;
            const radius = Math.min(width, height) / 2 - 40;

            const svg = d3.select(incomeChartRef.current);
            svg.selectAll('*').remove();

            const g = svg
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2},${height / 2})`);

            const color = d3.scaleOrdinal(['#4CAF50', '#f44336']);

            const pie = d3.pie<any>().value((d) => d.value);

            const path = d3
                .arc<any>()
                .innerRadius(0)
                .outerRadius(radius);

            const arc = g
                .selectAll('arc')
                .data(pie(incomeData))
                .enter()
                .append('g');

            arc
                .append('path')
                .attr('d', path)
                .attr('fill', (d) => color(d.data.name));

            // Add labels
            // arc
            //     .append('text')
            //     .attr('transform', (d) => `translate(${path.centroid(d)})`)
            //     .attr('dy', '.35em')
            //     .style('text-anchor', 'middle')
            //     .text((d) => `${d.data.name}: $${d.data.value.toFixed(2)}`);

            // Budget vs Actual Chart
            const budgetData = [
                { name: 'Budget', value: summary.monthly_budget },
                { name: 'Actual', value: summary.total_expenses },
            ];

            const budgetSvg = d3.select(expenseChartRef.current);
            budgetSvg.selectAll('*').remove();

            const budgetG = budgetSvg
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate(${width / 2},${height / 2})`);

            const budgetColor = d3.scaleOrdinal(['#2196F3', '#FF9800']);

            const budgetArc = budgetG
                .selectAll('arc')
                .data(pie(budgetData))
                .enter()
                .append('g');

            budgetArc
                .append('path')
                .attr('d', path)
                .attr('fill', (d) => budgetColor(d.data.name));

            // budgetArc
            //     .append('text')
            //     .attr('transform', (d) => `translate(${path.centroid(d)})`)
            //     .attr('dy', '.35em')
            //     .style('text-anchor', 'middle')
            //     .text((d) => `${d.data.name}: $${d.data.value.toFixed(2)}`);
        }
    }, [summary]);

    if (!summary) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="90vh"
                sx={{ backgroundColor: 'background.default' }}
            >
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                    Financial Dashboard
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Your financial overview at a glance
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Summary Cards */}
                <Grid>
                    <Grid container spacing={3}>
                        <Grid>
                            <Card 
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                                    color: 'white'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <TrendingUpIcon sx={{ fontSize: 40, mr: 1 }} />
                                        <Typography variant="h6">Total Income</Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        ${summary.total_income.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid>
                            <Card 
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
                                    color: 'white'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <TrendingDownIcon sx={{ fontSize: 40, mr: 1 }} />
                                        <Typography variant="h6">Total Expenses</Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        ${summary.total_expenses.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid>
                            <Card 
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                                    color: 'white'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <AccountBalanceWalletIcon sx={{ fontSize: 40, mr: 1 }} />
                                        <Typography variant="h6">Balance</Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        ${summary.balance.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid>
                            <Card 
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
                                    color: 'white'
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <CompareArrowsIcon sx={{ fontSize: 40, mr: 1 }} />
                                        <Typography variant="h6">Budget vs Actual</Typography>
                                    </Box>
                                    <Typography variant="h4">
                                        ${summary.budget_vs_actual.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid>
                    <Card elevation={2} sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Income vs Expenses
                            </Typography>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <svg ref={incomeChartRef}></svg>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid>
                    <Card elevation={2} sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Budget vs Actual
                            </Typography>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <svg ref={expenseChartRef}></svg>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Financial Metrics */}
                <Grid>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Additional Metrics
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid>
                                    <Box>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Total Savings
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            ${summary.total_savings.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid>
                                    <Box>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Total Investments
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            ${summary.total_investments.toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid>
                                    <Box>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            Net Worth
                                        </Typography>
                                        <Typography variant="h5" color="primary">
                                            ${(summary.total_assets - summary.total_liabilities).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard; 