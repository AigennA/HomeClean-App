import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBooking, SERVICES, Service } from '@/app/context/BookingContext';

const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

function getNextDays(count: number) {
  const days = [];
  const weekDays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split('T')[0];
    days.push({
      iso,
      day: weekDays[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
    });
  }
  return days;
}

export default function BookingScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { addBooking, user } = useBooking();
  const router = useRouter();

  const [selectedService, setSelectedService] = useState<Service>(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState(user.address);
  const [rooms, setRooms] = useState(2);
  const [notes, setNotes] = useState('');

  const days = getNextDays(14);

  const canBook = selectedService && selectedDate && selectedTime && address.trim().length > 0;

  function handleBook() {
    if (!canBook) {
      Alert.alert('Saknad information', 'Välj tjänst, datum, tid och fyll i adressen.');
      return;
    }
    addBooking({
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      address: address.trim(),
      rooms,
      notes,
      totalPrice: selectedService.price,
      status: 'upcoming',
    });
    Alert.alert(
      '✅ Bokad!',
      `${selectedService.name} är bokad till ${selectedDate} kl. ${selectedTime}.\n\nBekräftelse skickas till ${user.email}.`,
      [{ text: 'OK', onPress: () => router.push('/(tabs)/history') }]
    );
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: c.card, borderBottomColor: c.border }]}>
          <Text style={[styles.headerTitle, { color: c.text }]}>Boka städning</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Step 1: Service */}
          <View style={styles.section}>
            <Text style={[styles.stepLabel, { color: c.textSecondary }]}>STEG 1</Text>
            <Text style={[styles.stepTitle, { color: c.text }]}>Välj tjänst</Text>
            <View style={styles.servicesGrid}>
              {SERVICES.map(s => {
                const isSelected = selectedService.id === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.serviceItem,
                      {
                        backgroundColor: isSelected ? s.color : c.card,
                        borderColor: isSelected ? s.color : c.border,
                        shadowColor: c.text,
                      },
                    ]}
                    onPress={() => setSelectedService(s)}
                  >
                    <Ionicons
                      name={s.icon as any}
                      size={24}
                      color={isSelected ? '#fff' : s.color}
                    />
                    <Text style={[styles.serviceName, { color: isSelected ? '#fff' : c.text }]}>
                      {s.name}
                    </Text>
                    <Text style={[styles.serviceDur, { color: isSelected ? 'rgba(255,255,255,0.8)' : c.textSecondary }]}>
                      {s.duration}
                    </Text>
                    <Text style={[styles.servicePrice, { color: isSelected ? '#fff' : s.color }]}>
                      {s.price} kr
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 2: Address */}
          <View style={[styles.section, styles.sectionBorder, { borderTopColor: c.border }]}>
            <Text style={[styles.stepLabel, { color: c.textSecondary }]}>STEG 2</Text>
            <Text style={[styles.stepTitle, { color: c.text }]}>Adress</Text>
            <View style={[styles.inputWrap, { backgroundColor: c.card, borderColor: c.border }]}>
              <Ionicons name="location-outline" size={18} color={c.textSecondary} />
              <TextInput
                style={[styles.input, { color: c.text }]}
                placeholder="Gatuadress, Postort"
                placeholderTextColor={c.textLight}
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>

          {/* Step 3: Date */}
          <View style={[styles.section, styles.sectionBorder, { borderTopColor: c.border }]}>
            <Text style={[styles.stepLabel, { color: c.textSecondary }]}>STEG 3</Text>
            <Text style={[styles.stepTitle, { color: c.text }]}>Välj datum</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
              {days.map(d => {
                const isSelected = selectedDate === d.iso;
                return (
                  <TouchableOpacity
                    key={d.iso}
                    style={[
                      styles.dayChip,
                      {
                        backgroundColor: isSelected ? c.primary : c.card,
                        borderColor: isSelected ? c.primary : c.border,
                      },
                    ]}
                    onPress={() => setSelectedDate(d.iso)}
                  >
                    <Text style={[styles.dayWeek, { color: isSelected ? 'rgba(255,255,255,0.8)' : c.textSecondary }]}>
                      {d.day}
                    </Text>
                    <Text style={[styles.dayNum, { color: isSelected ? '#fff' : c.text }]}>
                      {d.date}
                    </Text>
                    <Text style={[styles.dayMonth, { color: isSelected ? 'rgba(255,255,255,0.8)' : c.textSecondary }]}>
                      {d.month}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Step 4: Time */}
          <View style={[styles.section, styles.sectionBorder, { borderTopColor: c.border }]}>
            <Text style={[styles.stepLabel, { color: c.textSecondary }]}>STEG 4</Text>
            <Text style={[styles.stepTitle, { color: c.text }]}>Välj tid</Text>
            <View style={styles.timesGrid}>
              {TIME_SLOTS.map(t => {
                const isSelected = selectedTime === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: isSelected ? c.primary : c.card,
                        borderColor: isSelected ? c.primary : c.border,
                      },
                    ]}
                    onPress={() => setSelectedTime(t)}
                  >
                    <Text style={[styles.timeText, { color: isSelected ? '#fff' : c.text }]}>{t}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Step 5: Rooms */}
          <View style={[styles.section, styles.sectionBorder, { borderTopColor: c.border }]}>
            <Text style={[styles.stepLabel, { color: c.textSecondary }]}>STEG 5</Text>
            <Text style={[styles.stepTitle, { color: c.text }]}>Antal rum</Text>
            <View style={styles.roomsRow}>
              <TouchableOpacity
                style={[styles.roomBtn, { backgroundColor: c.card, borderColor: c.border }]}
                onPress={() => setRooms(r => Math.max(1, r - 1))}
              >
                <Ionicons name="remove" size={20} color={c.primary} />
              </TouchableOpacity>
              <Text style={[styles.roomCount, { color: c.text }]}>{rooms}</Text>
              <TouchableOpacity
                style={[styles.roomBtn, { backgroundColor: c.card, borderColor: c.border }]}
                onPress={() => setRooms(r => Math.min(10, r + 1))}
              >
                <Ionicons name="add" size={20} color={c.primary} />
              </TouchableOpacity>
              <Text style={[styles.roomLabel, { color: c.textSecondary }]}>rum</Text>
            </View>
          </View>

          {/* Step 6: Notes */}
          <View style={[styles.section, styles.sectionBorder, { borderTopColor: c.border }]}>
            <Text style={[styles.stepLabel, { color: c.textSecondary }]}>STEG 6</Text>
            <Text style={[styles.stepTitle, { color: c.text }]}>Anteckningar (valfritt)</Text>
            <View style={[styles.notesWrap, { backgroundColor: c.card, borderColor: c.border }]}>
              <TextInput
                style={[styles.notesInput, { color: c.text }]}
                placeholder="T.ex. nyckel under mattan, allergier..."
                placeholderTextColor={c.textLight}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Summary + Book */}
          <View style={[styles.summaryBox, { backgroundColor: c.card, borderColor: c.border }]}>
            <Text style={[styles.summaryTitle, { color: c.text }]}>Sammanfattning</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Tjänst</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>{selectedService.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Datum</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>{selectedDate || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Tid</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>{selectedTime || '—'}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: c.textSecondary }]}>Rum</Text>
              <Text style={[styles.summaryValue, { color: c.text }]}>{rooms}</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: c.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryTotal, { color: c.text }]}>Totalt</Text>
              <Text style={[styles.summaryTotalPrice, { color: c.primary }]}>{selectedService.price} kr</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.bookBtn,
              { backgroundColor: canBook ? c.primary : c.border },
            ]}
            onPress={handleBook}
            disabled={!canBook}
          >
            <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
            <Text style={styles.bookBtnText}>Bekräfta bokning</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  scrollContent: { paddingBottom: 40 },
  section: { paddingHorizontal: 16, paddingVertical: 20 },
  sectionBorder: { borderTopWidth: 1 },
  stepLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  stepTitle: { fontSize: 17, fontWeight: '700', marginBottom: 14 },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceItem: {
    width: '30%',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceName: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  serviceDur: { fontSize: 10, textAlign: 'center' },
  servicePrice: { fontSize: 13, fontWeight: '700' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15 },
  daysRow: { paddingRight: 16, gap: 8 },
  dayChip: {
    width: 60,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 2,
  },
  dayWeek: { fontSize: 10, fontWeight: '600' },
  dayNum: { fontSize: 18, fontWeight: '700' },
  dayMonth: { fontSize: 10 },
  timesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  timeText: { fontSize: 14, fontWeight: '600' },
  roomsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  roomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  roomCount: { fontSize: 26, fontWeight: '700', minWidth: 36, textAlign: 'center' },
  roomLabel: { fontSize: 15 },
  notesWrap: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  notesInput: { fontSize: 14, minHeight: 72 },
  summaryBox: {
    margin: 16,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 10,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 14 },
  summaryValue: { fontSize: 14, fontWeight: '600' },
  summaryDivider: { height: 1, marginVertical: 4 },
  summaryTotal: { fontSize: 16, fontWeight: '700' },
  summaryTotalPrice: { fontSize: 20, fontWeight: '800' },
  bookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 8,
  },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
