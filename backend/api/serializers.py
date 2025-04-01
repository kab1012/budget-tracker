from rest_framework import serializers
from .models import Category, Transaction, Budget
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')
        read_only_fields = ('id',)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Transaction
        fields = ('id', 'category', 'category_name', 'amount', 'transaction_type',
                 'description', 'date', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Budget
        fields = ('id', 'category', 'category_name', 'amount', 'month',
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

class FinancialSummarySerializer(serializers.Serializer):
    total_income = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    monthly_budget = serializers.DecimalField(max_digits=10, decimal_places=2)
    budget_vs_actual = serializers.DecimalField(max_digits=10, decimal_places=2) 