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

const { height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const PERKS = [
  { icon: 'checkmark-circle', text: 'Gratis avbokning upp till 24h före' },
  { icon: 'checkmark-circle', text: 'Nöjdhetsgaranti – vi städar om gratis' },
  { icon: 'checkmark-circle', text: 'Inga dolda avgifter' },
  { icon: 'checkmark-circle', text: 'Professionella och inskolande personal' },
];

// ── Reusable Field (outside component to prevent focus loss) ──────────────────
interface FieldProps {
  label: string;
  value: string;
  onChange: (t: string) => void;
  placeholder: string;
  icon: string;
  keyboard?: string;
  secure?: boolean;
  showToggle?: boolean;
  onToggle?: () => void;
  error?: string;
}

function Field({ label, value, onChange, placeholder, icon, keyboard, secure, showToggle, onToggle, error }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error ? styles.inputError : null]}>
        <Ionicons name={icon as any} size={17} color="#94A3B8" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          keyboardType={keyboard as any || 'default'}
          autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
          secureTextEntry={secure && !showToggle}
          value={value}
          onChangeText={onChange}
        />
        {onToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Ionicons
              name={showToggle ? 'eye-off-outline' : 'eye-outline'}
              size={17}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Namn krävs.';
    if (!email.trim()) e.email = 'E-postadress krävs.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Ange en giltig e-postadress.';
    if (!phone.trim()) e.phone = 'Telefonnummer krävs.';
    else if (phone.replace(/\D/g, '').length < 8) e.phone = 'Ange ett giltigt telefonnummer.';
    if (!password) e.password = 'Lösenord krävs.';
    else if (password.length < 6) e.password = 'Lösenordet måste vara minst 6 tecken.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), phone.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Registrering misslyckades', err.message || 'Ett fel uppstod.');
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
        {/* Back button (mobile) */}
        {!isWeb && (
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {/* Mobile logo */}
        {!isWeb && (
          <View style={styles.mobileLogo}>
            <View style={styles.mobileLogoIcon}>
              <Ionicons name="sparkles" size={24} color="#fff" />
            </View>
            <Text style={styles.mobileLogoText}>CleanPro</Text>
          </View>
        )}

        {/* Heading */}
        <View style={styles.headingWrap}>
          <Text style={styles.headingEyebrow}>Börja idag</Text>
          <Text style={styles.heading}>Skapa konto</Text>
          <Text style={styles.headingSub}>
            Registrera dig gratis och boka din första städning
          </Text>
        </View>

        {/* 2-col grid on web */}
        {isWeb ? (
          <View style={styles.webGrid}>
            <View style={styles.webGridHalf}>
              <Field label="Namn" value={name} onChange={setName} placeholder="Erik Svensson" icon="person-outline" error={errors.name} />
            </View>
            <View style={styles.webGridHalf}>
              <Field label="Telefon" value={phone} onChange={setPhone} placeholder="070-000 00 00" icon="call-outline" keyboard="phone-pad" error={errors.phone} />
            </View>
          </View>
        ) : (
          <>
            <Field label="Namn" value={name} onChange={setName} placeholder="Erik Svensson" icon="person-outline" error={errors.name} />
            <Field label="Telefon" value={phone} onChange={setPhone} placeholder="070-000 00 00" icon="call-outline" keyboard="phone-pad" error={errors.phone} />
          </>
        )}

        <Field label="E-postadress" value={email} onChange={setEmail} placeholder="din@email.se" icon="mail-outline" keyboard="email-address" error={errors.email} />
        <Field
          label="Lösenord"
          value={password}
          onChange={setPassword}
          placeholder="Minst 6 tecken"
          icon="lock-closed-outline"
          secure
          showToggle={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          error={errors.password}
        />

        {/* Password strength hint */}
        {password.length > 0 && (
          <View style={styles.strengthRow}>
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthBar,
                  {
                    backgroundColor:
                      password.length >= i * 3
                        ? password.length >= 10 ? Colors.secondary : Colors.primary
                        : '#E2E8F0',
                  },
                ]}
              />
            ))}
            <Text style={styles.strengthText}>
              {password.length < 6 ? 'För kort' : password.length < 10 ? 'Bra' : 'Starkt'}
            </Text>
          </View>
        )}

        {/* Register button */}
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.btnInner}>
              <Text style={styles.btnText}>Skapa konto</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.terms}>
          Genom att registrera dig godkänner du våra{' '}
          <Text style={styles.termsLink}>Användarvillkor</Text>
          {' '}och{' '}
          <Text style={styles.termsLink}>Integritetspolicy</Text>.
        </Text>

        {/* Login link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginMuted}>Har du redan ett konto?</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.loginLink}> Logga in →</Text>
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
          <View style={styles.deco1} />
          <View style={styles.deco2} />

          {/* Logo */}
          <View style={styles.brandLogo}>
            <View style={styles.brandLogoIcon}>
              <Ionicons name="sparkles" size={32} color="#fff" />
            </View>
            <Text style={styles.brandLogoText}>CleanPro</Text>
          </View>

          {/* Tagline */}
          <View style={styles.brandTagWrap}>
            <Text style={styles.brandTag}>Gå med tusentals</Text>
            <Text style={styles.brandTagBold}>nöjda{'\n'}kunder</Text>
            <Text style={styles.brandTagSub}>
              Skapa ditt konto gratis och upplev skillnaden med professionell städning.
            </Text>
          </View>

          {/* Perks */}
          <View style={styles.perkList}>
            {PERKS.map((p) => (
              <View key={p.text} style={styles.perkItem}>
                <Ionicons name={p.icon as any} size={18} color={Colors.secondary} />
                <Text style={styles.perkText}>{p.text}</Text>
              </View>
            ))}
          </View>

          {/* Testimonial */}
          <View style={styles.testimonial}>
            <Text style={styles.testimonialQuote}>
              "CleanPro har förändrat mitt liv. Alltid punktliga och otroligt noggranna."
            </Text>
            <View style={styles.testimonialAuthor}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialAvatarText}>MS</Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>Maria Svensson</Text>
                <View style={styles.stars}>
                  {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={11} color="#F59E0B" />)}
                </View>
              </View>
            </View>
          </View>
        </View>

        {FormPanel}
      </View>
    );
  }

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
    width: '42%',
    backgroundColor: '#1E293B',
    padding: 48,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  deco1: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: Colors.primary,
    opacity: 0.12,
    top: -200,
    right: -200,
  },
  deco2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.secondary,
    opacity: 0.08,
    bottom: -80,
    left: -80,
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

  brandTagWrap: { marginTop: 40 },
  brandTag: { fontSize: 16, color: '#94A3B8', fontWeight: '500' },
  brandTagBold: { fontSize: 48, fontWeight: '800', color: '#fff', lineHeight: 54, letterSpacing: -1 },
  brandTagSub: { fontSize: 15, color: '#94A3B8', lineHeight: 24, marginTop: 14, maxWidth: 320 },

  perkList: { gap: 12 },
  perkItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  perkText: { fontSize: 14, color: '#CBD5E1', fontWeight: '500' },

  testimonial: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  testimonialQuote: { fontSize: 14, color: '#CBD5E1', lineHeight: 22, fontStyle: 'italic', marginBottom: 14 },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  testimonialAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialAvatarText: { fontSize: 12, fontWeight: '800', color: '#fff' },
  testimonialName: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 3 },
  stars: { flexDirection: 'row', gap: 2 },

  // ── Form panel ───────────────────────────────────────────────────────────────
  formPanel: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: isWeb ? 56 : 24,
    paddingVertical: isWeb ? 48 : 48,
    maxWidth: isWeb ? 560 : undefined,
    alignSelf: isWeb ? 'center' : undefined,
    width: isWeb ? '100%' : undefined,
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mobileLogo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 },
  mobileLogoIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileLogoText: { fontSize: 20, fontWeight: '800', color: Colors.primary },

  headingWrap: { marginBottom: 28 },
  headingEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heading: { fontSize: isWeb ? 34 : 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 8 },
  headingSub: { fontSize: 14, color: '#64748B', lineHeight: 21 },

  // 2-col grid
  webGrid: { flexDirection: 'row', gap: 16 },
  webGridHalf: { flex: 1 },

  // Fields
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 7, letterSpacing: 0.2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    height: 50,
  },
  inputError: { borderColor: Colors.error, backgroundColor: '#FFF5F5' },
  inputIcon: { marginRight: 6 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    outlineStyle: 'none',
  } as any,
  eyeBtn: { padding: 4 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  errorText: { fontSize: 12, color: Colors.error },

  // Password strength
  strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4, marginTop: -8 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthText: { fontSize: 11, color: '#94A3B8', marginLeft: 4, minWidth: 50 },

  // Button
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.65 },
  btnInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  // Terms
  terms: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginTop: 16,
  },
  termsLink: { color: Colors.primary, fontWeight: '600' },

  // Login row
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  loginMuted: { fontSize: 14, color: '#94A3B8' },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // ── Mobile ──────────────────────────────────────────────────────────────────
  mobileRoot: { flex: 1, backgroundColor: '#fff' },
  mobileBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
});
