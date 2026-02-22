import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api, Booking } from '../../services/api';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  confirmed: { label: 'Bekräftad', color: '#059669', bg: '#D1FAE5', icon: 'checkmark-circle' },
  pending: { label: 'Väntar', color: '#D97706', bg: '#FEF3C7', icon: 'time' },
  completed: { label: 'Slutförd', color: '#2563EB', bg: '#DBEAFE', icon: 'checkmark-done-circle' },
  cancelled: { label: 'Avbokad', color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle' },
};

const TABS = ['Kommande', 'Historik', 'Alla'];

export default function BookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [user])
  );

  async function loadBookings() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getBookings(user.id);
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }

  async function handleCancel(bookingId: string) {
    Alert.alert(
      'Avboka',
      'Är du säker på att du vill avboka?',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Avboka',
          style: 'destructive',
          onPress: async () => {
            await api.cancelBooking(bookingId);
            await loadBookings();
          },
        },
      ]
    );
  }

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-');
    const months = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  }

  const filtered = bookings.filter((b) => {
    if (activeTab === 0) return b.status === 'confirmed' || b.status === 'pending';
    if (activeTab === 1) return b.status === 'completed' || b.status === 'cancelled';
    return true;
  });

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mina bokningar</Text>
        <Text style={styles.headerSub}>{bookings.length} bokningar totalt</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => setActiveTab(i)}
          >
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.primary} />}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="calendar-outline" size={48} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Inga bokningar</Text>
              <Text style={styles.emptyText}>
                {activeTab === 0 ? 'Du har inga kommande bokningar.' : 'Ingen bokningshistorik.'}
              </Text>
            </View>
          ) : (
            filtered.map((booking) => {
              const status = STATUS_MAP[booking.status];
              const canCancel = booking.status === 'confirmed' || booking.status === 'pending';
              return (
                <View key={booking.id} style={styles.card}>
                  {/* Card header */}
                  <View style={styles.cardHeader}>
                    <Image source={{ uri: booking.serviceImage }} style={styles.serviceImg} />
                    <View style={styles.cardHeaderText}>
                      <Text style={styles.serviceName}>{booking.serviceName}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Ionicons name={status.icon as any} size={13} color={status.color} />
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardTotal}>{booking.total} kr</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Details */}
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={15} color={Colors.primary} />
                    <Text style={styles.detailText}>{formatDate(booking.date)}</Text>
                    <Ionicons name="time-outline" size={15} color={Colors.primary} style={{ marginLeft: 12 }} />
                    <Text style={styles.detailText}>{booking.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={15} color={Colors.primary} />
                    <Text style={styles.detailText}>{booking.address}</Text>
                  </View>
                  {booking.notes ? (
                    <View style={styles.detailRow}>
                      <Ionicons name="document-text-outline" size={15} color={Colors.primary} />
                      <Text style={styles.detailText}>{booking.notes}</Text>
                    </View>
                  ) : null}

                  {/* Actions */}
                  {canCancel && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancel(booking.id)}
                    >
                      <Ionicons name="close-circle-outline" size={16} color={Colors.error} />
                      <Text style={styles.cancelBtnText}>Avboka</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: Theme.font.xxl, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: Theme.font.sm, color: 'rgba(255,255,255,0.75)' },

  tabRow: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    backgroundColor: '#fff',
    borderRadius: Theme.radius.lg,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Theme.radius.md },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: Theme.font.sm, fontWeight: '600', color: Colors.light.textSecondary },
  tabTextActive: { color: '#fff' },

  list: { paddingHorizontal: Theme.spacing.lg, paddingTop: Theme.spacing.md },

  card: {
    backgroundColor: '#fff',
    borderRadius: Theme.radius.xl,
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  serviceImg: { width: 56, height: 56, borderRadius: Theme.radius.md },
  cardHeaderText: { flex: 1, gap: 6 },
  serviceName: { fontSize: Theme.font.md, fontWeight: '700', color: Colors.light.text },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: Theme.font.xs, fontWeight: '700' },
  cardTotal: { fontSize: Theme.font.xl, fontWeight: '800', color: Colors.primary },

  divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Theme.spacing.sm },

  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  detailText: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, flex: 1 },

  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: Theme.spacing.sm,
    paddingVertical: 10,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  cancelBtnText: { fontSize: Theme.font.sm, fontWeight: '700', color: Colors.error },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: { fontSize: Theme.font.xl, fontWeight: '700', color: Colors.light.text },
  emptyText: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, textAlign: 'center' },
});
