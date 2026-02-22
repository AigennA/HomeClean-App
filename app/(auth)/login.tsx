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

  function fillDemo() {
    setEmail('test@cleanpro.se');
    setPassword('123456');
    setErrors({});
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="sparkles" size={36} color="#fff" />
          </View>
          <Text style={styles.brandName}>CleanPro</Text>
          <Text style={styles.brandSub}>Professionella städtjänster</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Välkommen</Text>
          <Text style={styles.subtitle}>Logga in på ditt konto</Text>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>E-post</Text>
            <View style={[styles.inputRow, errors.email ? styles.inputError : null]}>
              <Ionicons name="mail-outline" size={18} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="exempel@email.se"
                placeholderTextColor={Colors.light.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Lösenord</Text>
            <View style={[styles.inputRow, errors.password ? styles.inputError : null]}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.light.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor={Colors.light.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.light.textSecondary} />
              </TouchableOpacity>
            </View>
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
          </View>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnPrimaryText}>Logga in</Text>
            )}
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.row}>
            <Text style={styles.mutedText}>Har du inget konto?</Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}> Registrera dig</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Demo hint */}
        <TouchableOpacity style={styles.demoBox} onPress={fillDemo}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={styles.demoText}>  Demo: test@cleanpro.se / 123456 (tryck här)</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },
  scroll: { flexGrow: 1, paddingHorizontal: Theme.spacing.lg, paddingTop: 64, paddingBottom: 32 },

  logoWrap: { alignItems: 'center', marginBottom: Theme.spacing.xl },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  brandName: { fontSize: Theme.font.xxl, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  brandSub: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, marginTop: 2 },

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
  title: { fontSize: Theme.font.xl, fontWeight: '700', color: Colors.light.text },
  subtitle: { fontSize: Theme.font.md, color: Colors.light.textSecondary, marginTop: 4, marginBottom: Theme.spacing.lg },

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

  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.lg,
    padding: Theme.spacing.sm,
    backgroundColor: Colors.primaryLight,
    borderRadius: Theme.radius.md,
  },
  demoText: { fontSize: Theme.font.xs, color: Colors.primary },
});
