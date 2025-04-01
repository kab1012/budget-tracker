from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, F
from django.utils import timezone
from datetime import datetime
from .models import Category, Transaction, Budget
from .serializers import (
    CategorySerializer, TransactionSerializer, BudgetSerializer,
    FinancialSummarySerializer
)

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, filters.DjangoFilterBackend]
    search_fields = ['description', 'category__name']
    ordering_fields = ['date', 'amount', 'created_at']
    filterset_fields = ['transaction_type', 'category', 'date']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        current_month = timezone.now().month
        current_year = timezone.now().year

        # Get total income and expenses for current month
        monthly_income = Transaction.objects.filter(
            user=request.user,
            transaction_type='income',
            date__month=current_month,
            date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or 0

        monthly_expenses = Transaction.objects.filter(
            user=request.user,
            transaction_type='expense',
            date__month=current_month,
            date__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Get total budget for current month
        monthly_budget = Budget.objects.filter(
            user=request.user,
            month__month=current_month,
            month__year=current_year
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Calculate balance and budget vs actual
        balance = monthly_income - monthly_expenses
        budget_vs_actual = monthly_budget - monthly_expenses

        data = {
            'total_income': monthly_income,
            'total_expenses': monthly_expenses,
            'balance': balance,
            'monthly_budget': monthly_budget,
            'budget_vs_actual': budget_vs_actual
        }

        serializer = FinancialSummarySerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, filters.DjangoFilterBackend]
    search_fields = ['category__name']
    ordering_fields = ['month', 'amount', 'created_at']
    filterset_fields = ['category', 'month']

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
