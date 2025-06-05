import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { LoadingSpinner } from '../../components/ui/loading-spinner';
import { useTheme } from '../../contexts/ThemeContext';
import { ordersAPI } from '../../services/api';
import { Order, OrderItem } from '../../types/order';

interface Styles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  listContainer: ViewStyle;
  orderCard: ViewStyle;
  orderHeader: ViewStyle;
  orderIdContainer: ViewStyle;
  orderId: TextStyle;
  orderDateContainer: ViewStyle;
  orderDate: TextStyle;
  orderDetails: ViewStyle;
  customerInfo: ViewStyle;
  customerTextContainer: ViewStyle;
  customerName: TextStyle;
  email: TextStyle;
  contactInfo: ViewStyle;
  contactItem: ViewStyle;
  phone: TextStyle;
  address: TextStyle;
  totalContainer: ViewStyle;
  totalLabel: TextStyle;
  total: TextStyle;
  itemsContainer: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  orderItem: ViewStyle;
  itemHeader: ViewStyle;
  itemName: TextStyle;
  itemQuantity: TextStyle;
  itemDetails: ViewStyle;
  itemPrice: TextStyle;
  itemSubtotal: TextStyle;
  notesContainer: ViewStyle;
  itemNotes: TextStyle;
  statusContainer: ViewStyle;
  statusInfo: ViewStyle;
  statusLabel: TextStyle;
  statusBadge: ViewStyle;
  statusText: TextStyle;
  actionButtons: ViewStyle;
  button: ViewStyle;
  buttonText: TextStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
  emptySubtext: TextStyle;
}

export default function OrdersScreen() {
  const { theme } = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAllOrders();
      if (response.success) {
        const ordersData = response.data || [];
        const typedOrders = ordersData.map((order: any) => ({
          ...order,
          status: order.status as 'pending' | 'preparing' | 'ready' | 'delivered'
        }));
        
        setOrders(typedOrders);
        if (typedOrders.length > 0) {
          setLastOrderId(typedOrders[0]._id.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert('Error', 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (orderId: number, newStatus: 'pending' | 'preparing' | 'ready' | 'delivered') => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId.toString(), newStatus);
      if (response.success) {
        // Update the order in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      } else {
        Alert.alert('Error', 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return theme.colors.success;
      case 'ready':
        return theme.colors.info;
      case 'preparing':
        return theme.colors.warning;
      case 'pending':
        return theme.colors.error;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'checkmark-circle';
      case 'ready':
        return 'checkmark-circle-outline';
      case 'preparing':
        return 'restaurant';
      case 'pending':
        return 'time';
      default:
        return 'help-circle-outline';
    }
  };

  const styles = StyleSheet.create<Styles>({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.DEFAULT,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background.DEFAULT,
    },
    listContainer: {
      padding: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    orderCard: {
      backgroundColor: theme.colors.surface.DEFAULT,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.text.DEFAULT,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      paddingBottom: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    orderIdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: `${theme.colors.primary.DEFAULT}10`,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    orderId: {
      ...theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.primary.DEFAULT,
      fontSize: 14,
    },
    orderDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: theme.colors.background.secondary,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    orderDate: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    orderDetails: {
      marginBottom: theme.spacing.sm,
    },
    customerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.primary.DEFAULT}08`,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: `${theme.colors.primary.DEFAULT}15`,
    },
    customerTextContainer: {
      flex: 1,
    },
    customerName: {
      ...theme.typography.h3,
      color: theme.colors.text.DEFAULT,
      marginBottom: 2,
      fontSize: 15,
    },
    email: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    contactInfo: {
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
    },
    phone: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    address: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.primary.DEFAULT,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.colors.primary.DEFAULT,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    totalLabel: {
      ...theme.typography.body,
      color: theme.colors.text.inverse,
      fontWeight: '600' as const,
      fontSize: 14,
    },
    total: {
      ...theme.typography.h3,
      fontWeight: '700' as const,
      color: theme.colors.text.inverse,
      fontSize: 16,
    },
    itemsContainer: {
      marginBottom: theme.spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text.DEFAULT,
      fontWeight: '600' as const,
      fontSize: 14,
    },
    orderItem: {
      backgroundColor: theme.colors.background.secondary,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.xs,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary.DEFAULT,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xs,
    },
    itemName: {
      ...theme.typography.body,
      fontWeight: '600' as const,
      color: theme.colors.text.DEFAULT,
      fontSize: 14,
    },
    itemQuantity: {
      ...theme.typography.caption,
      color: theme.colors.text.inverse,
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
      fontWeight: '700' as const,
      fontSize: 12,
    },
    itemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
    },
    itemPrice: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    itemSubtotal: {
      ...theme.typography.caption,
      fontWeight: '600' as const,
      color: theme.colors.primary.DEFAULT,
      fontSize: 12,
    },
    notesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
    },
    itemNotes: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontStyle: 'italic',
      flex: 1,
      fontSize: 12,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.light,
    },
    statusInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    statusLabel: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontWeight: '600' as const,
      fontSize: 12,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
    },
    statusText: {
      ...theme.typography.caption,
      fontWeight: '700' as const,
      color: theme.colors.text.inverse,
      fontSize: 12,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    buttonText: {
      ...theme.typography.caption,
      color: theme.colors.text.inverse,
      fontWeight: '700' as const,
      fontSize: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    emptyText: {
      ...theme.typography.body,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.md,
      textAlign: 'center',
      fontSize: 15,
    },
    emptySubtext: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      marginTop: theme.spacing.sm,
      textAlign: 'center',
      fontSize: 13,
    },
  });

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Ionicons name="receipt" size={16} color={theme.colors.primary.DEFAULT} />
          <Text style={styles.orderId}>Order #{item._id?.toString().padStart(6, '0')}</Text>
        </View>
        <View style={styles.orderDateContainer}>
          <Ionicons name="time-outline" size={14} color={theme.colors.text.secondary} />
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderDetails}>
        <View style={styles.customerInfo}>
          <Ionicons name="person" size={18} color={theme.colors.primary.DEFAULT} />
          <View style={styles.customerTextContainer}>
            <Text style={styles.customerName}>{item.customerName}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        </View>
        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.phone}>{item.phone || 'No phone provided'}</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.address}>{item.address || 'No address provided'}</Text>
          </View>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.total}>${item.totalAmount.toFixed(2)}</Text>
        </View>
        {item.cookingInstructions && (
          <View style={styles.notesContainer}>
            <Ionicons name="reader" size={16} color={theme.colors.text.secondary} />
            <Text style={styles.itemNotes}>Cooking Instructions: {item.cookingInstructions}</Text>
          </View>
        )}
      </View>

      <View style={styles.itemsContainer}>
        <View style={styles.sectionHeader}>
          <Ionicons name="restaurant" size={18} color={theme.colors.text.DEFAULT} />
          <Text style={styles.sectionTitle}>Order Items ({item.items.length})</Text>
        </View>
        {item.items.map((orderItem: OrderItem, index: number) => (
          <View key={index} style={styles.orderItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{orderItem.name}</Text>
              <Text style={styles.itemQuantity}>×{orderItem.quantity}</Text>
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemPrice}>${orderItem.price.toFixed(2)} each</Text>
              <Text style={styles.itemSubtotal}>
                ${(orderItem.price * orderItem.quantity).toFixed(2)}
              </Text>
            </View>
            {orderItem.toppings && orderItem.toppings.length > 0 && (
              <View style={styles.notesContainer}>
                <Ionicons name="pizza" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.itemNotes}>
                  Toppings: {orderItem.toppings.join(', ')}
                </Text>
              </View>
            )}
            {orderItem.notes && (
              <View style={styles.notesContainer}>
                <Ionicons name="information-circle" size={16} color={theme.colors.text.secondary} />
                <Text style={styles.itemNotes}>{orderItem.notes}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusInfo}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            <Ionicons 
              name={getStatusIcon(item.status) as any} 
              size={16} 
              color={theme.colors.text.inverse} 
            />
            <Text style={styles.statusText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.warning }]}
              onPress={() => handleStatusUpdate(item._id, 'preparing')}
            >
              <Ionicons name="restaurant" size={16} color={theme.colors.text.inverse} />
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          )}
          {item.status === 'preparing' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.info }]}
              onPress={() => handleStatusUpdate(item._id, 'ready')}
            >
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.text.inverse} />
              <Text style={styles.buttonText}>Ready</Text>
            </TouchableOpacity>
          )}
          {item.status === 'ready' && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.success }]}
              onPress={() => handleStatusUpdate(item._id, 'delivered')}
            >
              <Ionicons name="car" size={16} color={theme.colors.text.inverse} />
              <Text style={styles.buttonText}>Deliver</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.primary.DEFAULT}
        translucent={Platform.OS === 'android'}
      />
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.DEFAULT]}
            tintColor={theme.colors.primary.DEFAULT}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color={theme.colors.text.secondary} />
            <Text style={styles.emptyText}>No orders yet</Text>
            <Text style={styles.emptySubtext}>
              New orders will appear here when customers place them
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}