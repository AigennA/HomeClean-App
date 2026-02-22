import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

interface MenuItem {
  icon: string;
  label: string;
  sub?: string;
  color?: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Logga ut', 'Är du säker på att du vill logga ut?', [
      { text: 'Avbryt', style: 'cancel' },
      {
        text: 'Logga ut',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'KL';

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Konto',
      items: [
        { icon: 'person-outline', label: 'Personlig information', sub: user?.name, onPress: () => {} },
        { icon: 'mail-outline', label: 'E-post', sub: user?.email, onPress: () => {} },
        { icon: 'call-outline', label: 'Telefon', sub: user?.phone, onPress: () => {} },
      ],
    },
    {
      title: 'Tjänster',
      items: [
        { icon: 'calendar-outline', label: 'Mina bokningar', onPress: () => router.push('/(tabs)/bookings') },
        { icon: 'heart-outline', label: 'Favoritjänster', onPress: () => {} },
        { icon: 'star-outline', label: 'Mina recensioner', onPress: () => {} },
      ],
    },
    {
      title: 'App',
      items: [
        { icon: 'notifications-outline', label: 'Aviseringar', onPress: () => {} },
        { icon: 'shield-checkmark-outline', label: 'Integritet & säkerhet', onPress: () => {} },
        { icon: 'help-circle-outline', label: 'Hjälp & support', onPress: () => {} },
        { icon: 'document-text-outline', label: 'Användarvillkor', onPress: () => {} },
      ],
    },
  ];

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.memberBadge}>
          <Ionicons name="shield-checkmark" size={13} color={Colors.secondary} />
          <Text style={styles.memberBadgeText}>Verifierad medlem</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Bokningar', val: '3', icon: 'calendar' },
          { label: 'Slutförda', val: '1', icon: 'checkmark-circle' },
          { label: 'Recensioner', val: '1', icon: 'star' },
        ].map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Ionicons name={s.icon as any} size={20} color={Colors.primary} />
            <Text style={styles.statVal}>{s.val}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Menu sections */}
      {menuSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.menuCard}>
            {section.items.map((item, idx) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, idx < section.items.length - 1 && styles.menuItemBorder]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: (item.color ?? Colors.primary) + '18' }]}>
                  <Ionicons name={item.icon as any} size={18} color={item.color ?? Colors.primary} />
                </View>
                <View style={styles.menuLabelWrap}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.sub ? <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text> : null}
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.light.border} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Logga ut</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>CleanPro v1.0.0 • Made with ♥</Text>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },

  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 52,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  userName: { fontSize: Theme.font.xl, fontWeight: '800', color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: Theme.font.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 10 },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Theme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  memberBadgeText: { fontSize: Theme.font.xs, color: '#fff', fontWeight: '700' },

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
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statVal: { fontSize: Theme.font.xl, fontWeight: '800', color: Colors.light.text },
  statLabel: { fontSize: Theme.font.xs, color: Colors.light.textSecondary, textAlign: 'center' },

  section: { paddingHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.lg },
  sectionTitle: {
    fontSize: Theme.font.sm,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Theme.spacing.sm,
  },

  menuCard: {
    backgroundColor: '#fff',
    borderRadius: Theme.radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.light.border },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabelWrap: { flex: 1 },
  menuLabel: { fontSize: Theme.font.md, fontWeight: '600', color: Colors.light.text },
  menuSub: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, marginTop: 2 },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: Theme.radius.xl,
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  logoutText: { fontSize: Theme.font.md, fontWeight: '700', color: Colors.error },

  version: {
    textAlign: 'center',
    marginTop: Theme.spacing.lg,
    fontSize: Theme.font.xs,
    color: Colors.light.textSecondary,
  },
});
