from rest_framework import viewsets, permissions, filters
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from datetime import date
# Create your views here.



class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__id', 'date', 'amount', 'is_income']
    search_fields = ['note']
    ordering_fields = ['date','amount']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class SummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        total_income = user.transactions.filter(is_income=True).aggregate(total=Sum('amount'))['total'] or 0
        total_expenses = user.transactions.filter(is_income=False).aggregate(total=Sum('amount'))['total'] or 0
        balance = total_income - total_expenses

        # current month budget vs expenses
        today = date.today()
        month_start = today.replace(day=1)
        monthly_expenses = user.transactions.filter(is_income=False, date__gte=month_start).aggregate(total=Sum('amount'))['total'] or 0
        budget = user.budgets.filter(month=month_start).first()
        budget_amount = budget.amount if budget else 0

        return Response({
            'total_income': total_income,
            'total_expenses': total_expenses,
            'balance': balance,
            'monthly_expenses': monthly_expenses,
            'monthly_budget': budget_amount
        })
