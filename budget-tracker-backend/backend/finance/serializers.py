from rest_framework import serializers
from .models import Category, Transaction, Budget

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['user']

class TransactionSerializer(serializers.ModelSerializer):
    # For writing: allow assigning category by ID
    category_id = serializers.PrimaryKeyRelatedField(
        source='category',
        queryset=Category.objects.none(),  # set actual queryset in __init__
        allow_null=True,
        required=False,
        write_only=True
    )

    # For reading: return full category details
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'category', 'category_id',
            'amount', 'date', 'note', 'is_income', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request', None)
        if request and request.user and not request.user.is_anonymous:
            self.fields['category_id'].queryset = Category.objects.filter(user=request.user)
        else:
            self.fields['category_id'].queryset = Category.objects.all()

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and not request.user.is_anonymous:
            validated_data['user'] = request.user
        return super().create(validated_data)



class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = '__all__'
        read_only_fields = ['user']
