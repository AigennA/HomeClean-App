import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const FEATURES = [
  { icon: 'shield-checkmark', text: 'Försäkrat & certifierat' },
  { icon: 'star', text: '4.9 / 5 kundbetyg' },
  { icon: 'people', text: 'Över 2 000 nöjda kunder' },
  { icon: 'time', text: 'Flexibla tider – 7 dagar i veckan' },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = 'E-postadress krävs.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Ange en giltig e-postadress.';
    if (!password) e.password = 'Lösenord krävs.';
    else if (password.length < 6) e.password = 'Lösenordet måste vara minst 6 tecken.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Inloggning misslyckades', err.message || 'Ett fel uppstod.');
    } finally {
      setLoading(false);
    }
  }

  const FormPanel = (
    <View style={styles.formPanel}>
      <ScrollView
        contentContainerStyle={styles.formScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Mobile logo */}
        {!isWeb && (
          <View style={styles.mobileLogo}>
            <View style={styles.mobileLogoIcon}>
              <Ionicons name="sparkles" size={28} color="#fff" />
            </View>
            <Text style={styles.mobileLogoText}>CleanPro</Text>
          </View>
        )}

        {/* Heading */}
        <View style={styles.headingWrap}>
          <Text style={styles.headingEyebrow}>Välkommen tillbaka</Text>
          <Text style={styles.heading}>Logga in</Text>
          <Text style={styles.headingSub}>
            Ange dina uppgifter för att fortsätta
          </Text>
        </View>

        {/* Email */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>E-postadress</Text>
          <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
            <Ionicons name="mail-outline" size={17} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="din@email.se"
              placeholderTextColor="#CBD5E1"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          {errors.email ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color={Colors.error} />
              <Text style={styles.errorText}>{errors.email}</Text>
            </View>
          ) : null}
        </View>

        {/* Password */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Lösenord</Text>
          <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
            <Ionicons name="lock-closed-outline" size={17} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#CBD5E1"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={17}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={13} color={Colors.error} />
              <Text style={styles.errorText}>{errors.password}</Text>
            </View>
          ) : null}
        </View>

        {/* Login button */}
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.btnInner}>
              <Text style={styles.btnText}>Logga in</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>eller</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Demo */}
        <TouchableOpacity
          style={styles.demoBtn}
          onPress={() => { setEmail('test@cleanpro.se'); setPassword('123456'); setErrors({}); }}
          activeOpacity={0.8}
        >
          <Ionicons name="flash-outline" size={15} color={Colors.primary} />
          <Text style={styles.demoBtnText}>Prova med demokonto</Text>
        </TouchableOpacity>

        {/* Register link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerMuted}>Har du inget konto?</Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.registerLink}> Skapa konto →</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );

  if (isWeb) {
    return (
      <View style={styles.webRoot}>
        {/* Left brand panel */}
        <View style={styles.brandPanel}>
          {/* Decorative circles */}
          <View style={styles.deco1} />
          <View style={styles.deco2} />
          <View style={styles.deco3} />

          {/* Logo */}
          <View style={styles.brandLogo}>
            <View style={styles.brandLogoIcon}>
              <Ionicons name="sparkles" size={32} color="#fff" />
            </View>
            <Text style={styles.brandLogoText}>CleanPro</Text>
          </View>

          {/* Tagline */}
          <View style={styles.brandTagWrap}>
            <Text style={styles.brandTag}>Sveriges ledande</Text>
            <Text style={styles.brandTagBold}>städtjänst</Text>
            <Text style={styles.brandTagSub}>
              Professionell, pålitlig och garanterad städning för hem och kontor.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featureList}>
            {FEATURES.map((f) => (
              <View key={f.text} style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon as any} size={16} color={Colors.primary} />
                </View>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>

          {/* Bottom badge */}
          <View style={styles.brandBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#60A5FA" />
            <Text style={styles.brandBadgeText}>SSL-krypterad & GDPR-säker plattform</Text>
          </View>
        </View>

        {/* Right form panel */}
        {FormPanel}
      </View>
    );
  }

  // Mobile
  return (
    <View style={styles.mobileRoot}>
      <View style={styles.mobileBg} />
      {FormPanel}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Web ──────────────────────────────────────────────────────────────────────
  webRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F8FAFF',
    minHeight: height,
  },

  brandPanel: {
    width: '45%',
    backgroundColor: '#1E293B',
    padding: 48,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  // Decorative circles
  deco1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: Colors.primary,
    opacity: 0.15,
    top: -100,
    right: -150,
  },
  deco2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.secondary,
    opacity: 0.1,
    bottom: 100,
    left: -100,
  },
  deco3: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F59E0B',
    opacity: 0.08,
    bottom: -50,
    right: 50,
  },

  brandLogo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  brandLogoIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoText: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  brandTagWrap: { marginTop: 48 },
  brandTag: { fontSize: 18, color: '#94A3B8', fontWeight: '500' },
  brandTagBold: { fontSize: 52, fontWeight: '800', color: '#fff', lineHeight: 58, letterSpacing: -1 },
  brandTagSub: { fontSize: 15, color: '#94A3B8', lineHeight: 24, marginTop: 16, maxWidth: 340 },

  featureList: { gap: 14 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { fontSize: 14, color: '#CBD5E1', fontWeight: '500' },

  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  brandBadgeText: { fontSize: 12, color: '#64748B' },

  // ── Form panel (shared web/mobile) ──────────────────────────────────────────
  formPanel: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: isWeb ? 64 : 24,
    paddingVertical: isWeb ? 64 : 48,
    maxWidth: isWeb ? 480 : undefined,
    alignSelf: isWeb ? 'center' : undefined,
    width: isWeb ? '100%' : undefined,
  },

  // Mobile logo
  mobileLogo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32 },
  mobileLogoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoText: { fontSize: 22, fontWeight: '800', color: Colors.primary },

  // Heading
  headingWrap: { marginBottom: 36 },
  headingEyebrow: { fontSize: 13, fontWeight: '600', color: Colors.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  heading: { fontSize: isWeb ? 36 : 30, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 10 },
  headingSub: { fontSize: 15, color: '#64748B', lineHeight: 22 },

  // Fields
  fieldWrap: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 8, letterSpacing: 0.2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 52,
    gap: 4,
  },
  inputError: { borderColor: Colors.error, backgroundColor: '#FFF5F5' },
  inputIcon: { marginRight: 4 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    outlineStyle: 'none',
  } as any,
  eyeBtn: { padding: 4 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  errorText: { fontSize: 12, color: Colors.error },

  // Button
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.65 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

  // Demo
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Colors.primaryLight,
    borderRadius: 12,
    height: 50,
    backgroundColor: Colors.primaryLight,
  },
  demoBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // Register
  registerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  registerMuted: { fontSize: 14, color: '#94A3B8' },
  registerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // ── Mobile ──────────────────────────────────────────────────────────────────
  mobileRoot: { flex: 1, backgroundColor: '#fff' },
  mobileBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});
