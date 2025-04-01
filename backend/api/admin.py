from django.contrib import admin
from .models import Category, Transaction, Budget

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at', 'updated_at')
    list_filter = ('user', 'created_at')
    search_fields = ('name', 'user__email')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'amount', 'transaction_type', 'date', 'created_at')
    list_filter = ('user', 'transaction_type', 'category', 'date')
    search_fields = ('description', 'category__name', 'user__email')
    date_hierarchy = 'date'

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'amount', 'month', 'created_at')
    list_filter = ('user', 'category', 'month')
    search_fields = ('category__name', 'user__email')
    date_hierarchy = 'month'
