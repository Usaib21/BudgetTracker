from django.contrib import admin
from .models import Category, Transaction, Budget
# Register your models here.


# If your Transaction model uses a created_at field name other than 'created_at',
# adjust readonly_fields accordingly.

class TransactionInline(admin.TabularInline):
    model = Transaction
    extra = 0
    readonly_fields = ('created_at',) if hasattr(Transaction, 'created_at') else ()
    show_change_link = True

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type', 'user')
    list_filter = ('type', 'user')
    search_fields = ('name', 'user__username')
    inlines = [TransactionInline]
    ordering = ('name',)
    list_per_page = 25

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'amount', 'is_income', 'date', 'created_at') \
                   if hasattr(Transaction, 'created_at') else ('id', 'user', 'category', 'amount', 'is_income', 'date')
    list_filter = ('is_income', 'category', 'date', 'user')
    search_fields = ('note', 'user__username', 'category__name')
    date_hierarchy = 'date'
    readonly_fields = ('created_at',) if hasattr(Transaction, 'created_at') else ()
    ordering = ('-date', '-id')
    list_display_links = ('id',)

@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'month', 'amount')
    list_filter = ('user', 'month')
    search_fields = ('user__username',)
    date_hierarchy = 'month'
    ordering = ('-month',)
