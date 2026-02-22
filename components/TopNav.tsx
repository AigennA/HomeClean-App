import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { Colors } from '../constants/Colors';
import { Theme } from '../constants/Theme';

const NAV_LINKS = [
  { label: 'Hem', href: '/(tabs)', icon: 'home-outline' },
  { label: 'Tjänster', href: '/(tabs)/services', icon: 'grid-outline' },
  { label: 'Bokningar', href: '/(tabs)/bookings', icon: 'calendar-outline' },
  { label: 'Om oss', href: null, icon: 'information-circle-outline' },
  { label: 'Kontakt', href: null, icon: 'mail-outline' },
];

export default function TopNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Sadece web'de göster
  if (Platform.OS !== 'web') return null;

  function isActive(href: string | null) {
    if (!href) return false;
    if (href === '/(tabs)') return pathname === '/' || pathname === '/(tabs)' || pathname === '/index';
    return pathname.includes(href.replace('/(tabs)/', ''));
  }

  function navigate(href: string | null) {
    setMenuOpen(false);
    if (href) router.push(href as any);
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.replace('/(auth)/login');
  }

  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 768;

  return (
    <View style={styles.wrapper}>
      <View style={styles.nav}>
        {/* Logo */}
        <TouchableOpacity style={styles.logo} onPress={() => navigate('/(tabs)')} activeOpacity={0.8}>
          <View style={styles.logoIcon}>
            <Ionicons name="sparkles" size={18} color="#fff" />
          </View>
          <Text style={styles.logoText}>CleanPro</Text>
        </TouchableOpacity>

        {/* Desktop links */}
        {!isMobile && (
          <View style={styles.links}>
            {NAV_LINKS.map((link) => (
              <TouchableOpacity
                key={link.label}
                style={[styles.link, isActive(link.href) && styles.linkActive]}
                onPress={() => navigate(link.href)}
                activeOpacity={0.7}
              >
                <Text style={[styles.linkText, isActive(link.href) && styles.linkTextActive]}>
                  {link.label}
                </Text>
                {isActive(link.href) && <View style={styles.linkDot} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Right side */}
        <View style={styles.right}>
          {user ? (
            <View style={styles.userRow}>
              {!isMobile && (
                <Text style={styles.userName}>{user.name.split(' ')[0]}</Text>
              )}
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => navigate('/(tabs)/profile')}
                activeOpacity={0.8}
              >
                <Text style={styles.avatarText}>
                  {user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </Text>
              </TouchableOpacity>
              {!isMobile && (
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
                  <Ionicons name="log-out-outline" size={16} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => navigate('/(auth)/login')}
              activeOpacity={0.85}
            >
              <Text style={styles.loginBtnText}>Logga in</Text>
            </TouchableOpacity>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <TouchableOpacity
              style={styles.hamburger}
              onPress={() => setMenuOpen(!menuOpen)}
              activeOpacity={0.7}
            >
              <Ionicons name={menuOpen ? 'close' : 'menu'} size={24} color={Colors.light.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mobile dropdown menu */}
      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>
          {NAV_LINKS.map((link) => (
            <TouchableOpacity
              key={link.label}
              style={[styles.mobileLink, isActive(link.href) && styles.mobileLinkActive]}
              onPress={() => navigate(link.href)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={link.icon as any}
                size={18}
                color={isActive(link.href) ? Colors.primary : Colors.light.textSecondary}
              />
              <Text style={[styles.mobileLinkText, isActive(link.href) && styles.mobileLinkTextActive]}>
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}
          {user && (
            <TouchableOpacity style={styles.mobileLogout} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
              <Text style={styles.mobileLogoutText}>Logga ut</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },

  // Logo
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 40 },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 20, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },

  // Desktop links
  links: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  link: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Theme.radius.md,
    alignItems: 'center',
  },
  linkActive: { backgroundColor: Colors.primaryLight },
  linkText: { fontSize: 14, fontWeight: '600', color: Colors.light.textSecondary },
  linkTextActive: { color: Colors.primary },
  linkDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },

  // Right
  right: { flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 'auto' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userName: { fontSize: 14, fontWeight: '600', color: Colors.light.text },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 13, fontWeight: '800', color: '#fff' },
  logoutBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  loginBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  hamburger: { padding: 6 },

  // Mobile menu
  mobileMenu: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingVertical: 8,
  },
  mobileLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  mobileLinkActive: { backgroundColor: Colors.primaryLight },
  mobileLinkText: { fontSize: 15, fontWeight: '600', color: Colors.light.textSecondary },
  mobileLinkTextActive: { color: Colors.primary },
  mobileLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    marginTop: 4,
  },
  mobileLogoutText: { fontSize: 15, fontWeight: '600', color: Colors.error },
});
