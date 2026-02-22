import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api, Service } from '../../services/api';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function getNextDays(count: number) {
  const days: { label: string; dayName: string; value: string }[] = [];
  const dayNames = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
  const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dayName: dayNames[d.getDay()],
      label: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    });
  }
  return days;
}

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const days = getNextDays(10);
  const [selectedDay, setSelectedDay] = useState(days[0].value);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) {
      api.getService(id).then((s) => { setService(s); setLoading(false); });
    }
  }, [id]);

  const total = service ? service.price * qty : 0;

  async function handleBook() {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Adress krävs', 'Ange adressen för städning.');
      return;
    }
    setBooking(true);
    try {
      await api.createBooking({
        userId: user.id,
        serviceId: service!.id,
        serviceName: service!.name,
        serviceImage: service!.image,
        date: selectedDay,
        time: selectedTime,
        address: address.trim(),
        notes: notes.trim(),
        total,
      });
      Alert.alert(
        'Bokning skapad! 🎉',
        `${service!.name} är bokad.\n\nDatum: ${selectedDay}\nTid: ${selectedTime}\nTotalt: ${total} kr`,
        [{ text: 'Gå till mina bokningar', onPress: () => router.replace('/(tabs)/bookings') }]
      );
    } catch (err: any) {
      Alert.alert('Fel', err.message || 'Det gick inte att skapa bokning.');
    } finally {
      setBooking(false);
    }
  }

  if (loading || !service) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero image */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: service.image }} style={styles.heroImg} />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={[styles.categoryTag, { backgroundColor: service.color }]}>
            <Ionicons name={service.icon as any} size={13} color="#fff" />
            <Text style={styles.categoryTagText}>{service.categoryLabel}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingVal}>{service.rating}</Text>
              <Text style={styles.ratingCount}>({service.reviewCount})</Text>
            </View>
          </View>

          {/* Price & Duration */}
          <View style={styles.infoRow}>
            <View style={styles.infoPill}>
              <Ionicons name="cash-outline" size={16} color={Colors.primary} />
              <Text style={styles.infoPillText}>{service.price} kr/{service.unit}</Text>
            </View>
            <View style={styles.infoPill}>
              <Ionicons name="time-outline" size={16} color={Colors.secondary} />
              <Text style={[styles.infoPillText, { color: Colors.secondary }]}>{service.duration}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>Tjänstbeskrivning</Text>
          <Text style={styles.description}>{service.description}</Text>

          {/* Includes */}
          <Text style={styles.sectionLabel}>Inkluderat</Text>
          <View style={styles.includesList}>
            {service.includes.map((inc) => (
              <View key={inc} style={styles.includeItem}>
                <View style={styles.includeCheck}>
                  <Ionicons name="checkmark" size={13} color="#fff" />
                </View>
                <Text style={styles.includeText}>{inc}</Text>
              </View>
            ))}
          </View>

          {/* Quantity */}
          {service.unit !== 'paket' && (
            <>
              <Text style={styles.sectionLabel}>
                {service.unit === 'tim' ? 'Antal timmar' : 'Antal'}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Ionicons name="remove" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyVal}>{qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty((q) => q + 1)}>
                  <Ionicons name="add" size={20} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.qtyUnit}>{service.unit}</Text>
                <Text style={styles.qtyTotal}>= {total} kr</Text>
              </View>
            </>
          )}

          {/* Date picker */}
          <Text style={styles.sectionLabel}>Välj datum</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[styles.dayChip, selectedDay === day.value && styles.dayChipActive]}
                onPress={() => setSelectedDay(day.value)}
              >
                <Text style={[styles.dayName, selectedDay === day.value && styles.dayNameActive]}>
                  {day.dayName}
                </Text>
                <Text style={[styles.dayLabel, selectedDay === day.value && styles.dayLabelActive]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time picker */}
          <Text style={styles.sectionLabel}>Välj tid</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
                onPress={() => setSelectedTime(t)}
              >
                <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Address */}
          <Text style={styles.sectionLabel}>Adress</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="location-outline" size={18} color={Colors.light.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.input}
              placeholder="Adress för städning"
              placeholderTextColor={Colors.light.textSecondary}
              value={address}
              onChangeText={setAddress}
              multiline
            />
          </View>

          {/* Notes */}
          <Text style={styles.sectionLabel}>Anteckningar (valfritt)</Text>
          <View style={[styles.inputWrap, { alignItems: 'flex-start', paddingTop: 12 }]}>
            <Ionicons name="document-text-outline" size={18} color={Colors.light.textSecondary} style={{ marginRight: 8, marginTop: 2 }} />
            <TextInput
              style={[styles.input, { minHeight: 72 }]}
              placeholder="Specialönskemål, saker att tänka på..."
              placeholderTextColor={Colors.light.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Totalt</Text>
          <Text style={styles.bottomTotal}>{total} kr</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, booking && styles.bookBtnDisabled]}
          onPress={handleBook}
          disabled={booking}
          activeOpacity={0.88}
        >
          {booking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.bookBtnText}>Boka nu</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background },

  heroWrap: { position: 'relative' },
  heroImg: { width: '100%', height: 280 },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryTagText: { color: '#fff', fontSize: Theme.font.xs, fontWeight: '700' },

  body: { padding: Theme.spacing.lg },

  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  serviceName: { fontSize: Theme.font.xxl, fontWeight: '800', color: Colors.light.text, flex: 1, marginRight: 8 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: Theme.radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ratingVal: { fontSize: Theme.font.md, fontWeight: '800', color: '#D97706' },
  ratingCount: { fontSize: Theme.font.xs, color: '#D97706' },

  infoRow: { flexDirection: 'row', gap: Theme.spacing.sm, marginBottom: Theme.spacing.lg },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  infoPillText: { fontSize: Theme.font.sm, fontWeight: '700', color: Colors.primary },

  sectionLabel: { fontSize: Theme.font.md, fontWeight: '700', color: Colors.light.text, marginBottom: 10, marginTop: Theme.spacing.md },
  description: { fontSize: Theme.font.md, color: Colors.light.textSecondary, lineHeight: 24 },

  includesList: { gap: 8 },
  includeItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  includeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  includeText: { fontSize: Theme.font.md, color: Colors.light.text },

  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.sm },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyVal: { fontSize: Theme.font.xl, fontWeight: '800', color: Colors.light.text, minWidth: 32, textAlign: 'center' },
  qtyUnit: { fontSize: Theme.font.sm, color: Colors.light.textSecondary },
  qtyTotal: { fontSize: Theme.font.lg, fontWeight: '700', color: Colors.primary, marginLeft: 8 },

  dateScroll: { flexGrow: 0 },
  dayChip: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    marginRight: 8,
    backgroundColor: '#fff',
    minWidth: 70,
  },
  dayChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayName: { fontSize: Theme.font.xs, fontWeight: '600', color: Colors.light.textSecondary, marginBottom: 4 },
  dayNameActive: { color: 'rgba(255,255,255,0.8)' },
  dayLabel: { fontSize: Theme.font.sm, fontWeight: '700', color: Colors.light.text },
  dayLabelActive: { color: '#fff' },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: '#fff',
  },
  timeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  timeText: { fontSize: Theme.font.sm, fontWeight: '600', color: Colors.light.textSecondary },
  timeTextActive: { color: '#fff' },

  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
    minHeight: 52,
  },
  input: { flex: 1, fontSize: Theme.font.md, color: Colors.light.text },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 28 : Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  bottomLabel: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, marginBottom: 2 },
  bottomTotal: { fontSize: Theme.font.xxl, fontWeight: '800', color: Colors.primary },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: Theme.radius.lg,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnDisabled: { opacity: 0.7 },
  bookBtnText: { color: '#fff', fontSize: Theme.font.md, fontWeight: '800' },
});
