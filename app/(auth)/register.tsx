import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

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

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    icon,
    keyboard,
    secure,
    fieldKey,
    showToggle,
    onToggle,
  }: any) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, errors[fieldKey] ? styles.inputError : null]}>
        <Ionicons name={icon} size={18} color={Colors.light.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.textSecondary}
          keyboardType={keyboard || 'default'}
          autoCapitalize={keyboard === 'email-address' ? 'none' : 'words'}
          secureTextEntry={secure && !showToggle}
          value={value}
          onChangeText={(t: string) => {
            onChange(t);
            setErrors((e) => ({ ...e, [fieldKey]: '' }));
          }}
        />
        {onToggle && (
          <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
            <Ionicons name={showToggle ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      {errors[fieldKey] ? <Text style={styles.errorText}>{errors[fieldKey]}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="sparkles" size={28} color="#fff" />
          </View>
          <Text style={styles.title}>Skapa konto</Text>
          <Text style={styles.subtitle}>Välkommen till CleanPro</Text>
        </View>

        {/* Form */}
        <View style={styles.card}>
          <Field label="Namn" value={name} onChange={setName} placeholder="Erik Svensson" icon="person-outline" fieldKey="name" />
          <Field label="E-post" value={email} onChange={setEmail} placeholder="exempel@email.se" icon="mail-outline" keyboard="email-address" fieldKey="email" />
          <Field label="Telefon" value={phone} onChange={setPhone} placeholder="070-000 00 00" icon="call-outline" keyboard="phone-pad" fieldKey="phone" />
          <Field
            label="Lösenord"
            value={password}
            onChange={setPassword}
            placeholder="••••••"
            icon="lock-closed-outline"
            secure
            showToggle={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            fieldKey="password"
          />

          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnPrimaryText}>Registrera dig</Text>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <Text style={styles.mutedText}>Har du redan ett konto?</Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}> Logga in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <Text style={styles.terms}>
          Genom att registrera dig godkänner du våra{' '}
          <Text style={{ color: Colors.primary }}>Användarvillkor</Text> och{' '}
          <Text style={{ color: Colors.primary }}>Integritetspolicy</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  scroll: { flexGrow: 1, paddingHorizontal: Theme.spacing.lg, paddingTop: 52, paddingBottom: 32 },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
  },

  header: { alignItems: 'center', marginBottom: Theme.spacing.xl },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: { fontSize: Theme.font.xxl, fontWeight: '800', color: Colors.light.text },
  subtitle: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: '#fff',
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  fieldWrap: { marginBottom: Theme.spacing.md },
  label: { fontSize: Theme.font.sm, fontWeight: '600', color: Colors.light.text, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.inputBg,
    borderRadius: Theme.radius.md,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    paddingHorizontal: Theme.spacing.md,
    height: 52,
  },
  inputError: { borderColor: Colors.error },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: Theme.font.md, color: Colors.light.text },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: Theme.font.xs, color: Colors.error, marginTop: 4 },

  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.7 },
  btnPrimaryText: { color: '#fff', fontSize: Theme.font.lg, fontWeight: '700' },

  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Theme.spacing.md },
  mutedText: { fontSize: Theme.font.sm, color: Colors.light.textSecondary },
  linkText: { fontSize: Theme.font.sm, fontWeight: '700', color: Colors.primary },

  terms: {
    textAlign: 'center',
    fontSize: Theme.font.xs,
    color: Colors.light.textSecondary,
    marginTop: Theme.spacing.lg,
    lineHeight: 18,
  },
});
