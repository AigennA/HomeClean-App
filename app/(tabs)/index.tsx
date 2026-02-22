import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api, Service, Booking } from '../../services/api';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { key: 'alla', label: 'Alla', icon: 'apps' },
  { key: 'hem', label: 'Hem', icon: 'home' },
  { key: 'kontor', label: 'Kontor', icon: 'briefcase' },
  { key: 'special', label: 'Special', icon: 'sparkles' },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Bekräftad', color: '#059669', bg: '#D1FAE5' },
  pending: { label: 'Väntar', color: '#D97706', bg: '#FEF3C7' },
  completed: { label: 'Slutförd', color: '#2563EB', bg: '#DBEAFE' },
  cancelled: { label: 'Avbokad', color: '#DC2626', bg: '#FEE2E2' },
};

export default function HomeScreen() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedCat, setSelectedCat] = useState('alla');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [s, b] = await Promise.all([
        api.getServices(),
        user ? api.getBookings(user.id) : Promise.resolve([]),
      ]);
      setServices(s);
      setBookings(b);
    } finally {
      setLoading(false);
    }
  }

  const filteredServices = selectedCat === 'alla'
    ? services.slice(0, 6)
    : services.filter((s) => s.category === selectedCat).slice(0, 6);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'pending'
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Kund';

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-');
    const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
    return `${d} ${months[parseInt(m) - 1]} ${y}`;
  }

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hej, {firstName} 👋</Text>
            <Text style={styles.headerSub}>Vad ska vi städa idag?</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/services')}
          activeOpacity={0.8}
        >
          <Ionicons name="search-outline" size={18} color={Colors.light.textSecondary} />
          <Text style={styles.searchPlaceholder}>Sök tjänst...</Text>
        </TouchableOpacity>
      </View>

      {/* ── Promo Banner ── */}
      <View style={styles.promoBanner}>
        <View style={styles.promoTextWrap}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>Ny kund</Text>
          </View>
          <Text style={styles.promoTitle}>20% rabatt på{'\n'}första bokning!</Text>
          <TouchableOpacity
            style={styles.promoBtn}
            onPress={() => router.push('/(tabs)/services')}
          >
            <Text style={styles.promoBtnText}>Välj tjänst</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.promoIllustration}>
          <Ionicons name="sparkles" size={64} color="rgba(255,255,255,0.3)" />
        </View>
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsRow}>
        {[
          { icon: 'shield-checkmark', label: 'Pålitlig', val: '5000+', color: '#2563EB' },
          { icon: 'star', label: 'Betyg', val: '4.9', color: '#F59E0B' },
          { icon: 'people', label: 'Kunder', val: '2K+', color: '#10B981' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={20} color={stat.color} />
            <Text style={[styles.statVal, { color: stat.color }]}>{stat.val}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Categories ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kategorier</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catChip, selectedCat === cat.key && styles.catChipActive]}
              onPress={() => setSelectedCat(cat.key)}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCat === cat.key ? '#fff' : Colors.primary}
              />
              <Text style={[styles.catChipText, selectedCat === cat.key && styles.catChipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Popular Services ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Populära tjänster</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
            <Text style={styles.seeAll}>Alla →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.serviceGrid}>
            {filteredServices.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/service/${service.id}`)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: service.image }} style={styles.serviceImg} />
                <View style={[styles.serviceColorBadge, { backgroundColor: service.color + '22' }]}>
                  <Ionicons name={service.icon as any} size={14} color={service.color} />
                  <Text style={[styles.serviceCatText, { color: service.color }]}>
                    {service.categoryLabel}
                  </Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName} numberOfLines={1}>{service.name}</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.ratingText}>{service.rating} ({service.reviewCount})</Text>
                  </View>
                  <Text style={styles.servicePrice}>
                    {service.price} kr
                    <Text style={styles.serviceUnit}>/{service.unit}</Text>
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ── Upcoming Bookings ── */}
      {upcomingBookings.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kommande bokningar</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
              <Text style={styles.seeAll}>Alla →</Text>
            </TouchableOpacity>
          </View>
          {upcomingBookings.slice(0, 2).map((booking) => {
            const status = STATUS_MAP[booking.status];
            return (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={[styles.bookingStripe, { backgroundColor: Colors.primary }]} />
                <View style={styles.bookingContent}>
                  <View style={styles.bookingTop}>
                    <Text style={styles.bookingService}>{booking.serviceName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                      <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                  </View>
                  <View style={styles.bookingMeta}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.light.textSecondary} />
                    <Text style={styles.bookingMetaText}>{formatDate(booking.date)} • {booking.time}</Text>
                  </View>
                  <View style={styles.bookingMeta}>
                    <Ionicons name="location-outline" size={13} color={Colors.light.textSecondary} />
                    <Text style={styles.bookingMetaText}>{booking.address}</Text>
                  </View>
                  <Text style={styles.bookingTotal}>{booking.total} kr</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const CARD_W = (width - Theme.spacing.lg * 2 - Theme.spacing.sm) / 2;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: Theme.font.xl, fontWeight: '800', color: '#fff' },
  headerSub: { fontSize: Theme.font.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: Theme.font.lg, fontWeight: '800', color: '#fff' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchPlaceholder: { fontSize: Theme.font.md, color: Colors.light.textSecondary },

  promoBanner: {
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.lg,
    backgroundColor: Colors.primaryDark,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoTextWrap: { flex: 1 },
  promoBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Theme.radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  promoBadgeText: { color: '#fff', fontSize: Theme.font.xs, fontWeight: '700' },
  promoTitle: { color: '#fff', fontSize: Theme.font.xl, fontWeight: '800', lineHeight: 28, marginBottom: 12 },
  promoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: Theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
  },
  promoBtnText: { color: Colors.primary, fontWeight: '700', fontSize: Theme.font.sm },
  promoIllustration: { justifyContent: 'center', alignItems: 'center', opacity: 0.6 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Theme.spacing.lg,
    marginTop: Theme.spacing.md,
    gap: Theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statVal: { fontSize: Theme.font.lg, fontWeight: '800' },
  statLabel: { fontSize: Theme.font.xs, color: Colors.light.textSecondary, fontWeight: '500' },

  section: { paddingHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.sm },
  sectionTitle: { fontSize: Theme.font.lg, fontWeight: '700', color: Colors.light.text },
  seeAll: { fontSize: Theme.font.sm, color: Colors.primary, fontWeight: '600' },

  catScroll: { marginTop: Theme.spacing.sm },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    gap: 5,
  },
  catChipActive: { backgroundColor: Colors.primary },
  catChipText: { fontSize: Theme.font.sm, fontWeight: '600', color: Colors.primary },
  catChipTextActive: { color: '#fff' },

  serviceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Theme.spacing.sm },
  serviceCard: {
    width: CARD_W,
    backgroundColor: '#fff',
    borderRadius: Theme.radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImg: { width: '100%', height: 110 },
  serviceColorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginHorizontal: 10,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.radius.full,
    alignSelf: 'flex-start',
  },
  serviceCatText: { fontSize: 10, fontWeight: '700' },
  serviceInfo: { padding: 10 },
  serviceName: { fontSize: Theme.font.sm, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 6 },
  ratingText: { fontSize: 11, color: Colors.light.textSecondary },
  servicePrice: { fontSize: Theme.font.md, fontWeight: '800', color: Colors.primary },
  serviceUnit: { fontSize: Theme.font.xs, color: Colors.light.textSecondary, fontWeight: '400' },

  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: Theme.radius.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: Theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingStripe: { width: 4 },
  bookingContent: { flex: 1, padding: Theme.spacing.md },
  bookingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  bookingService: { fontSize: Theme.font.md, fontWeight: '700', color: Colors.light.text },
  statusBadge: { borderRadius: Theme.radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  bookingMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 },
  bookingMetaText: { fontSize: Theme.font.sm, color: Colors.light.textSecondary },
  bookingTotal: { fontSize: Theme.font.lg, fontWeight: '800', color: Colors.primary, marginTop: 6 },
});
