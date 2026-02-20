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
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useBooking } from '@/app/context/BookingContext';

function MenuItem({
  icon,
  label,
  value,
  iconColor,
  onPress,
  c,
}: {
  icon: string;
  label: string;
  value?: string;
  iconColor: string;
  onPress?: () => void;
  c: typeof Colors.light;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: c.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIcon, { backgroundColor: iconColor + '18' }]}>
        <Ionicons name={icon as any} size={20} color={iconColor} />
      </View>
      <Text style={[styles.menuLabel, { color: c.text }]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && <Text style={[styles.menuValue, { color: c.textSecondary }]} numberOfLines={1}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={c.textLight} />
      </View>
    </TouchableOpacity>
  );
}

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { user, bookings, updateUser } = useBooking();
  const [editModal, setEditModal] = useState(false);
  const [editField, setEditField] = useState<{ key: keyof typeof user; label: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  const completed = bookings.filter(b => b.status === 'completed').length;
  const upcoming = bookings.filter(b => b.status === 'upcoming').length;
  const totalSpent = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  function openEdit(key: keyof typeof user, label: string) {
    setEditField({ key, label });
    setEditValue(String(user[key]));
    setEditModal(true);
  }

  function saveEdit() {
    if (editField) {
      updateUser({ [editField.key]: editValue.trim() });
    }
    setEditModal(false);
  }

  function handleLogout() {
    Alert.alert(
      'Logga ut',
      'Är du säker på att du vill logga ut?',
      [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Logga ut', style: 'destructive', onPress: () => Alert.alert('', 'Du är utloggad.') },
      ]
    );
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: c.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Profile header */}
        <View style={[styles.profileHeader, { backgroundColor: c.primary }]}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          <Text style={styles.profileMember}>Medlem sedan {user.memberSince}</Text>
        </View>

        {/* Stats */}
        <View style={[styles.statsRow, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: c.primary }]}>{completed}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>Avslutade</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: c.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: c.accent }]}>{upcoming}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>Kommande</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: c.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: c.secondary }]}>{totalSpent.toLocaleString('sv-SE')}</Text>
            <Text style={[styles.statLabel, { color: c.textSecondary }]}>kr spenderat</Text>
          </View>
        </View>

        {/* Personal info */}
        <Text style={[styles.sectionHeader, { color: c.textSecondary }]}>PERSONUPPGIFTER</Text>
        <View style={[styles.menuGroup, { backgroundColor: c.card, borderColor: c.border }]}>
          <MenuItem c={c} icon="person-outline" iconColor={c.primary} label="Namn" value={user.name} onPress={() => openEdit('name', 'Namn')} />
          <MenuItem c={c} icon="mail-outline" iconColor={c.secondary} label="E-post" value={user.email} onPress={() => openEdit('email', 'E-post')} />
          <MenuItem c={c} icon="call-outline" iconColor={c.accent} label="Telefon" value={user.phone} onPress={() => openEdit('phone', 'Telefon')} />
          <MenuItem c={c} icon="location-outline" iconColor="#8B5CF6" label="Adress" value={user.address} onPress={() => openEdit('address', 'Adress')} />
        </View>

        {/* Settings */}
        <Text style={[styles.sectionHeader, { color: c.textSecondary }]}>INSTÄLLNINGAR</Text>
        <View style={[styles.menuGroup, { backgroundColor: c.card, borderColor: c.border }]}>
          <MenuItem
            c={c}
            icon="notifications-outline"
            iconColor={c.primary}
            label="Aviseringar"
            onPress={() => Alert.alert('Aviseringar', 'Aviserings­inställningar öppnas snart.')}
          />
          <MenuItem
            c={c}
            icon="card-outline"
            iconColor={c.secondary}
            label="Betalningsmetoder"
            onPress={() => Alert.alert('Betalning', 'Betalnings­inställningar öppnas snart.')}
          />
          <MenuItem
            c={c}
            icon="moon-outline"
            iconColor="#6366F1"
            label="Utseende"
            value={colorScheme === 'dark' ? 'Mörkt' : 'Ljust'}
            onPress={() => Alert.alert('Utseende', 'Ändra i enhetens inställningar.')}
          />
        </View>

        {/* Support */}
        <Text style={[styles.sectionHeader, { color: c.textSecondary }]}>SUPPORT</Text>
        <View style={[styles.menuGroup, { backgroundColor: c.card, borderColor: c.border }]}>
          <MenuItem
            c={c}
            icon="help-circle-outline"
            iconColor={c.accent}
            label="Hjälp & Support"
            onPress={() => Alert.alert('Support', 'Kontakta oss på support@homeclean.se')}
          />
          <MenuItem
            c={c}
            icon="document-text-outline"
            iconColor={c.textSecondary}
            label="Användar­villkor"
            onPress={() => Alert.alert('Villkor', 'Öppnar användarvillkor...')}
          />
          <MenuItem
            c={c}
            icon="shield-outline"
            iconColor={c.success}
            label="Integritetspolicy"
            onPress={() => Alert.alert('Integritet', 'Öppnar integritetspolicy...')}
          />
        </View>

        {/* App version */}
        <Text style={[styles.version, { color: c.textLight }]}>HomeClean v1.0.0</Text>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: c.danger }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={c.danger} />
          <Text style={[styles.logoutText, { color: c.danger }]}>Logga ut</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Edit modal */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: c.card }]}>
            <Text style={[styles.modalTitle, { color: c.text }]}>Ändra {editField?.label}</Text>
            <View style={[styles.modalInput, { borderColor: c.border, backgroundColor: c.background }]}>
              <TextInput
                style={[styles.modalTextInput, { color: c.text }]}
                value={editValue}
                onChangeText={setEditValue}
                autoFocus
                placeholder={editField?.label}
                placeholderTextColor={c.textLight}
              />
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalCancel, { borderColor: c.border }]}
                onPress={() => setEditModal(false)}
              >
                <Text style={[styles.modalCancelText, { color: c.textSecondary }]}>Avbryt</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalSave, { backgroundColor: c.primary }]}
                onPress={saveEdit}
              >
                <Text style={styles.modalSaveText}>Spara</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 28,
    gap: 6,
  },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: '#fff' },
  profileName: { fontSize: 22, fontWeight: '700', color: '#fff' },
  profileEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  profileMember: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2, textAlign: 'center' },
  statDivider: { width: 1, marginVertical: 4 },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  menuGroup: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: 140 },
  menuValue: { fontSize: 13, textAlign: 'right', flexShrink: 1 },
  version: { textAlign: 'center', fontSize: 12, marginTop: 20 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 2,
  },
  logoutText: { fontSize: 16, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalTextInput: { fontSize: 15 },
  modalBtns: { flexDirection: 'row', gap: 12 },
  modalCancel: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600' },
  modalSave: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSaveText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
