import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBooking, SERVICES, Booking } from '@/app/context/BookingContext';

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const labels: Record<Booking['status'], string> = {
    upcoming: 'Kommande',
    completed: 'Avslutad',
    cancelled: 'Avbokad',
  };
  const bgColors: Record<Booking['status'], string> = {
    upcoming: '#E0F2FE',
    completed: '#DCFCE7',
    cancelled: '#FEE2E2',
  };
  const textColors: Record<Booking['status'], string> = {
    upcoming: '#0284C7',
    completed: '#15803D',
    cancelled: '#DC2626',
  };
  return (
    <View style={[styles.badge, { backgroundColor: bgColors[status] }]}>
      <Text style={[styles.badgeText, { color: textColors[status] }]}>{labels[status]}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { bookings, user } = useBooking();
  const router = useRouter();

  const upcoming = bookings.filter(b => b.status === 'upcoming')[0];
  const recent = bookings.filter(b => b.status !== 'upcoming').slice(0, 3);
  const firstName = user.name.split(' ')[0];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={[styles.header, { backgroundColor: c.primary }]}>
          <View>
            <Text style={styles.headerGreeting}>Hej, {firstName}! 👋</Text>
            <Text style={styles.headerSub}>Välkommen till HomeClean</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>

          {/* Next booking card */}
          {upcoming ? (
            <View style={[styles.upcomingCard, { backgroundColor: c.primary }]}>
              <View style={styles.upcomingTop}>
                <Text style={styles.upcomingLabel}>Nästa städning</Text>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingBadgeText}>Kommande</Text>
                </View>
              </View>
              <Text style={styles.upcomingService}>{upcoming.service.name}</Text>
              <View style={styles.upcomingRow}>
                <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.upcomingMeta}>  {formatDate(upcoming.date)} • {upcoming.time}</Text>
              </View>
              <View style={styles.upcomingRow}>
                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.upcomingMeta}>  {upcoming.address}</Text>
              </View>
              <View style={styles.upcomingRow}>
                <Ionicons name="cash-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.upcomingMeta}>  {upcoming.totalPrice} kr</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.noBookingCard, { backgroundColor: c.primaryLight, borderColor: c.primary }]}
              onPress={() => router.push('/(tabs)/booking')}
            >
              <Ionicons name="add-circle-outline" size={32} color={c.primary} />
              <Text style={[styles.noBookingText, { color: c.primary }]}>Boka din första städning</Text>
              <Text style={[styles.noBookingSub, { color: c.textSecondary }]}>Tryck här för att komma igång</Text>
            </TouchableOpacity>
          )}

          {/* Services */}
          <Text style={[styles.sectionTitle, { color: c.text }]}>Våra tjänster</Text>
          <FlatList
            data={SERVICES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.servicesList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.serviceCard, { backgroundColor: c.card, shadowColor: c.text }]}
                onPress={() => router.push('/(tabs)/booking')}
              >
                <View style={[styles.serviceIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={26} color={item.color} />
                </View>
                <Text style={[styles.serviceName, { color: c.text }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[styles.serviceDuration, { color: c.textSecondary }]}>{item.duration}</Text>
                <Text style={[styles.servicePrice, { color: item.color }]}>{item.price} kr</Text>
              </TouchableOpacity>
            )}
          />

          {/* Quick book button */}
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: c.primary }]}
            onPress={() => router.push('/(tabs)/booking')}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.bookBtnText}>Boka en städning</Text>
          </TouchableOpacity>

          {/* Recent bookings */}
          {recent.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: c.text }]}>Senaste bokningar</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
                  <Text style={[styles.seeAll, { color: c.primary }]}>Se alla</Text>
                </TouchableOpacity>
              </View>
              {recent.map(booking => (
                <View key={booking.id} style={[styles.recentCard, { backgroundColor: c.card, shadowColor: c.text }]}>
                  <View style={[styles.recentIconWrap, { backgroundColor: booking.service.color + '20' }]}>
                    <Ionicons name={booking.service.icon as any} size={22} color={booking.service.color} />
                  </View>
                  <View style={styles.recentInfo}>
                    <Text style={[styles.recentName, { color: c.text }]}>{booking.service.name}</Text>
                    <Text style={[styles.recentDate, { color: c.textSecondary }]}>
                      {formatDate(booking.date)} • {booking.time}
                    </Text>
                  </View>
                  <View style={styles.recentRight}>
                    <StatusBadge status={booking.status} />
                    <Text style={[styles.recentPrice, { color: c.text }]}>{booking.totalPrice} kr</Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Info banner */}
          <View style={[styles.infoBanner, { backgroundColor: c.secondaryLight }]}>
            <Ionicons name="shield-checkmark-outline" size={24} color={c.secondary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: c.text }]}>Försäkrat & verifierat</Text>
              <Text style={[styles.infoSub, { color: c.textSecondary }]}>Alla våra städare är bakgrundskontrollerade</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerGreeting: { fontSize: 22, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  upcomingCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  upcomingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  upcomingLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  upcomingBadge: { backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  upcomingBadgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },
  upcomingService: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 12 },
  upcomingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  upcomingMeta: { fontSize: 13, color: 'rgba(255,255,255,0.85)' },
  noBookingCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: 8,
  },
  noBookingText: { fontSize: 16, fontWeight: '700' },
  noBookingSub: { fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 14, fontWeight: '600' },
  servicesList: { paddingRight: 16, gap: 12, paddingBottom: 4 },
  serviceCard: {
    width: 120,
    borderRadius: 14,
    padding: 14,
    gap: 6,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceIcon: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  serviceName: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
  serviceDuration: { fontSize: 11 },
  servicePrice: { fontSize: 14, fontWeight: '700' },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    marginVertical: 20,
  },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  recentIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: '600' },
  recentDate: { fontSize: 12, marginTop: 2 },
  recentRight: { alignItems: 'flex-end', gap: 4 },
  recentPrice: { fontSize: 13, fontWeight: '700' },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600' },
  infoSub: { fontSize: 12, marginTop: 2 },
});
