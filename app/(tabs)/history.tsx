import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBooking, Booking } from '@/app/context/BookingContext';

type Filter = 'all' | 'upcoming' | 'completed' | 'cancelled';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Alla' },
  { key: 'upcoming', label: 'Kommande' },
  { key: 'completed', label: 'Avslutade' },
  { key: 'cancelled', label: 'Avbokade' },
];

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const config: Record<Booking['status'], { label: string; bg: string; color: string; icon: string }> = {
    upcoming: { label: 'Kommande', bg: '#E0F2FE', color: '#0284C7', icon: 'time-outline' },
    completed: { label: 'Avslutad', bg: '#DCFCE7', color: '#15803D', icon: 'checkmark-circle-outline' },
    cancelled: { label: 'Avbokad', bg: '#FEE2E2', color: '#DC2626', icon: 'close-circle-outline' },
  };
  const { label, bg, color, icon } = config[status];
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: bg }]}>
      <Ionicons name={icon as any} size={11} color={color} />
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  text: { fontSize: 11, fontWeight: '700' },
});

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { bookings, cancelBooking } = useBooking();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  function handleCancel(b: Booking) {
    Alert.alert(
      'Avboka städning',
      `Vill du avboka ${b.service.name} den ${formatDate(b.date)}?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Avboka',
          style: 'destructive',
          onPress: () => cancelBooking(b.id),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: c.card, borderBottomColor: c.border }]}>
        <Text style={[styles.headerTitle, { color: c.text }]}>Bokningshistorik</Text>
        <Text style={[styles.headerSub, { color: c.textSecondary }]}>{bookings.length} bokningar totalt</Text>
      </View>

      {/* Filter tabs */}
      <View style={[styles.filterBar, { backgroundColor: c.card, borderBottomColor: c.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map(f => {
            const isActive = filter === f.key;
            const count = f.key === 'all' ? bookings.length : bookings.filter(b => b.status === f.key).length;
            return (
              <TouchableOpacity
                key={f.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? c.primary : c.background,
                    borderColor: isActive ? c.primary : c.border,
                  },
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.filterLabel, { color: isActive ? '#fff' : c.textSecondary }]}>
                  {f.label}
                </Text>
                <View style={[styles.filterCount, { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : c.border }]}>
                  <Text style={[styles.filterCountText, { color: isActive ? '#fff' : c.textSecondary }]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="calendar-outline" size={64} color={c.textLight} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>Inga bokningar</Text>
            <Text style={[styles.emptySub, { color: c.textSecondary }]}>
              {filter === 'upcoming' ? 'Du har inga kommande bokningar.' :
               filter === 'completed' ? 'Inga avslutade bokningar ännu.' :
               filter === 'cancelled' ? 'Inga avbokade bokningar.' :
               'Du har inga bokningar ännu.'}
            </Text>
          </View>
        ) : (
          filtered.map(booking => (
            <View
              key={booking.id}
              style={[styles.bookingCard, { backgroundColor: c.card, shadowColor: c.text, borderColor: c.border }]}
            >
              {/* Card top */}
              <View style={styles.cardTop}>
                <View style={[styles.serviceIconWrap, { backgroundColor: booking.service.color + '20' }]}>
                  <Ionicons name={booking.service.icon as any} size={24} color={booking.service.color} />
                </View>
                <View style={styles.cardTopInfo}>
                  <Text style={[styles.cardServiceName, { color: c.text }]}>{booking.service.name}</Text>
                  <Text style={[styles.cardServiceDesc, { color: c.textSecondary }]}>{booking.service.description}</Text>
                </View>
                <StatusBadge status={booking.status} />
              </View>

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: c.border }]} />

              {/* Details */}
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={15} color={c.textSecondary} />
                  <Text style={[styles.detailText, { color: c.textSecondary }]}>
                    {formatDate(booking.date)} kl. {booking.time}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={15} color={c.textSecondary} />
                  <Text style={[styles.detailText, { color: c.textSecondary }]} numberOfLines={1}>
                    {booking.address}
                  </Text>
                </View>
                {booking.rooms > 0 && (
                  <View style={styles.detailRow}>
                    <Ionicons name="grid-outline" size={15} color={c.textSecondary} />
                    <Text style={[styles.detailText, { color: c.textSecondary }]}>
                      {booking.rooms} rum
                    </Text>
                  </View>
                )}
                {booking.notes.length > 0 && (
                  <View style={styles.detailRow}>
                    <Ionicons name="chatbubble-outline" size={15} color={c.textSecondary} />
                    <Text style={[styles.detailText, { color: c.textSecondary }]} numberOfLines={2}>
                      {booking.notes}
                    </Text>
                  </View>
                )}
              </View>

              {/* Card bottom */}
              <View style={[styles.cardBottom, { borderTopColor: c.border }]}>
                <View>
                  <Text style={[styles.priceLabel, { color: c.textSecondary }]}>Pris</Text>
                  <Text style={[styles.priceValue, { color: c.primary }]}>{booking.totalPrice} kr</Text>
                </View>
                {booking.status === 'upcoming' && (
                  <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: c.danger }]}
                    onPress={() => handleCancel(booking)}
                  >
                    <Ionicons name="close-outline" size={16} color={c.danger} />
                    <Text style={[styles.cancelText, { color: c.danger }]}>Avboka</Text>
                  </TouchableOpacity>
                )}
                {booking.status === 'completed' && (
                  <View style={[styles.completedTag, { backgroundColor: c.successLight }]}>
                    <Ionicons name="star-outline" size={14} color={c.success} />
                    <Text style={[styles.completedText, { color: c.success }]}>Betygsätt</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  filterBar: { borderBottomWidth: 1 },
  filterScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  filterLabel: { fontSize: 13, fontWeight: '600' },
  filterCount: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1, minWidth: 20, alignItems: 'center' },
  filterCountText: { fontSize: 11, fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 32, gap: 12 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
  bookingCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  serviceIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTopInfo: { flex: 1 },
  cardServiceName: { fontSize: 16, fontWeight: '700' },
  cardServiceDesc: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginHorizontal: 16 },
  cardDetails: { padding: 16, gap: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  detailText: { fontSize: 13, flex: 1 },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  priceLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  priceValue: { fontSize: 20, fontWeight: '800' },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  cancelText: { fontSize: 13, fontWeight: '600' },
  completedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  completedText: { fontSize: 13, fontWeight: '600' },
});
