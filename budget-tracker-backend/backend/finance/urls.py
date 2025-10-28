# budget-tracker-backend/finance/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet, BudgetViewSet, SummaryView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'budgets', BudgetViewSet, basename='budget')

urlpatterns = [
    path('', include(router.urls)),            # -> /api/finance/categories/ , /api/finance/transactions/, ...
    path('summary/', SummaryView.as_view(), name='summary'),  # -> /api/finance/summary/
]
