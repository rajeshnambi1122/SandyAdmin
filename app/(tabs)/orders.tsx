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
  deliveryAddressContainer: ViewStyle;
  deliveryAddressText: TextStyle;
  deliveryTypeContainer: ViewStyle;
  deliveryTypeBadge: ViewStyle;
  deliveryTypeText: TextStyle;
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
  // New styles for prominent cooking instructions and toppings
  cookingInstructionsContainer: ViewStyle;
  cookingInstructionsTitle: TextStyle;
  cookingInstructionsText: TextStyle;
  toppingsContainer: ViewStyle;
  toppingsTitle: TextStyle;
  toppingsText: TextStyle;
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

  const getDeliveryTypeInfo = (deliveryType?: string) => {
    if (deliveryType === 'delivery' || deliveryType === 'door-delivery') {
      return {
        icon: 'car' as const,
        backgroundColor: '#28A745', // Green for delivery
        text: 'Delivery'
      };
    } else {
      return {
        icon: 'storefront' as const,
        backgroundColor: '#FF6B35', // Orange for pickup
        text: 'Pickup'
      };
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
      borderRadius: 16,
      padding: 0,
      marginBottom: theme.spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      overflow: 'hidden',
    },
    orderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      paddingBottom: theme.spacing.sm,
      backgroundColor: `${theme.colors.primary.DEFAULT}08`,
    },
    orderIdContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    orderId: {
      ...theme.typography.body,
      fontWeight: '700' as const,
      color: theme.colors.text.DEFAULT,
      fontSize: 16,
      letterSpacing: 0.15,
    },
    orderDateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    orderDate: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 13,
      letterSpacing: 0.25,
    },
    orderDetails: {
      padding: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    customerInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    customerTextContainer: {
      flex: 1,
    },
    customerName: {
      ...theme.typography.h3,
      color: theme.colors.text.DEFAULT,
      marginBottom: 2,
      fontSize: 16,
      fontWeight: '600' as const,
      letterSpacing: 0.15,
    },
    email: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 12,
    },
    contactInfo: {
      marginBottom: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    phone: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 14,
      letterSpacing: 0.25,
    },
    address: {
      ...theme.typography.caption,
      color: theme.colors.text.secondary,
      fontSize: 14,
      letterSpacing: 0.25,
      flex: 1,
    },
    deliveryAddressContainer: {
      backgroundColor: '#E8F5E8', // Light green background
      borderLeftWidth: 4,
      borderLeftColor: '#28A745', // Green accent
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#28A745',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    deliveryAddressText: {
      ...theme.typography.body,
      fontWeight: '700' as const,
      color: '#155724', // Dark green
      fontSize: 14,
      lineHeight: 20,
    },
    deliveryTypeContainer: {
      marginBottom: theme.spacing.md,
      alignItems: 'flex-start',
    },
    deliveryTypeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    deliveryTypeText: {
      ...theme.typography.caption,
      fontWeight: '600' as const,
      color: theme.colors.text.inverse,
      fontSize: 13,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.primary.DEFAULT,
      padding: 16,
      marginBottom: theme.spacing.md,
      borderRadius: 12,
    },
    totalLabel: {
      ...theme.typography.body,
      color: theme.colors.text.inverse,
      fontWeight: '500' as const,
      fontSize: 14,
      letterSpacing: 0.25,
    },
    total: {
      ...theme.typography.h3,
      fontWeight: '700' as const,
      color: theme.colors.text.inverse,
      fontSize: 20,
      letterSpacing: 0,
    },
    // New prominent cooking instructions container
    cookingInstructionsContainer: {
      backgroundColor: '#FFF3CD', // Light yellow background
      borderLeftWidth: 4,
      borderLeftColor: '#FF6B35', // Orange accent
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    cookingInstructionsTitle: {
      ...theme.typography.body,
      fontWeight: '800' as const,
      color: '#D63384', // Bold pink color
      fontSize: 16,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
    },
    cookingInstructionsText: {
      ...theme.typography.body,
      fontWeight: '700' as const,
      color: '#212529', // Dark text
      fontSize: 15,
      lineHeight: 22,
    },
    itemsContainer: {
      padding: theme.spacing.md,
      paddingTop: 0,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.h3,
      color: theme.colors.text.DEFAULT,
      fontWeight: '600' as const,
      fontSize: 16,
      letterSpacing: 0.15,
    },
    orderItem: {
      backgroundColor: `${theme.colors.primary.DEFAULT}05`,
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: `${theme.colors.primary.DEFAULT}15`,
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
      fontSize: 15,
      letterSpacing: 0.15,
      flex: 1,
    },
    itemQuantity: {
      ...theme.typography.caption,
      color: theme.colors.text.inverse,
      backgroundColor: theme.colors.primary.DEFAULT,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      fontWeight: '600' as const,
      fontSize: 13,
      minWidth: 32,
      textAlign: 'center',
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
    // New prominent toppings container
    toppingsContainer: {
      backgroundColor: '#E8F5E8', // Light green background
      borderLeftWidth: 4,
      borderLeftColor: '#28A745', // Green accent
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.xs,
      shadowColor: '#28A745',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    toppingsTitle: {
      ...theme.typography.caption,
      fontWeight: '800' as const,
      color: '#155724', // Dark green
      fontSize: 13,
      marginBottom: 2,
      textTransform: 'uppercase',
    },
    toppingsText: {
      ...theme.typography.body,
      fontWeight: '700' as const,
      color: '#155724', // Dark green
      fontSize: 14,
      lineHeight: 20,
    },
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      paddingTop: theme.spacing.md,
      backgroundColor: `${theme.colors.background.secondary}80`,
      borderTopWidth: 1,
      borderTopColor: `${theme.colors.border.light}40`,
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
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
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
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      elevation: 0,
    },
    buttonText: {
      ...theme.typography.caption,
      color: theme.colors.text.inverse,
      fontWeight: '600' as const,
      fontSize: 13,
      letterSpacing: 0.5,
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
            <Ionicons 
              name={(item.deliveryType === 'delivery' || item.deliveryType === 'door-delivery') ? 'home' : 'storefront'} 
              size={16} 
              color={theme.colors.text.secondary} 
            />
            <Text style={styles.address}>
              {(item.deliveryType === 'delivery' || item.deliveryType === 'door-delivery')
                ? (item.address || 'No delivery address provided')
                : (item.address === 'Pickup' ? 'Store Pickup' : item.address || 'Store Pickup')
              }
            </Text>
          </View>
        </View>
        
        {/* Delivery Type Badge */}
        <View style={styles.deliveryTypeContainer}>
          {(() => {
            // Debug: Log the delivery type for this specific order
            
            const deliveryInfo = getDeliveryTypeInfo(item.deliveryType);
            return (
              <View style={[styles.deliveryTypeBadge, { backgroundColor: deliveryInfo.backgroundColor }]}>
                <Ionicons name={deliveryInfo.icon} size={16} color={theme.colors.text.inverse} />
                <Text style={styles.deliveryTypeText}>{deliveryInfo.text}</Text>
              </View>
            );
          })()}
        </View>
        
        {/* Prominent Delivery Address for Delivery Orders */}
        {(item.deliveryType === 'delivery' || item.deliveryType === 'door-delivery') && item.address && item.address !== 'Pickup' && (
          <View style={styles.deliveryAddressContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
              <Ionicons name="home" size={20} color="#155724" />
              <Text style={[styles.deliveryAddressText, { fontSize: 16, marginLeft: theme.spacing.xs }]}>
                DELIVERY ADDRESS
              </Text>
            </View>
            <Text style={styles.deliveryAddressText}>{item.address}</Text>
          </View>
        )}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.total}>${item.totalAmount.toFixed(2)}</Text>
        </View>
        
        {/* Prominent Cooking Instructions */}
        {item.cookingInstructions && (
          <View style={styles.cookingInstructionsContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
              <Ionicons name="flame" size={20} color="#D63384" />
              <Text style={styles.cookingInstructionsTitle}> COOKING INSTRUCTIONS</Text>
            </View>
            <Text style={styles.cookingInstructionsText}>{item.cookingInstructions}</Text>
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
            
            {/* Prominent Toppings Display */}
            {orderItem.toppings && orderItem.toppings.length > 0 && (
              <View style={styles.toppingsContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="pizza" size={16} color="#155724" />
                  <Text style={styles.toppingsTitle}> TOPPINGS:</Text>
                </View>
                <Text style={styles.toppingsText}>
                  {orderItem.toppings.join(', ')}
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