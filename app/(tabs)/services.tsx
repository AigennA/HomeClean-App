import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, Service } from '../../services/api';
import { Colors } from '../../constants/Colors';
import { Theme } from '../../constants/Theme';

const CATS = [
  { key: 'alla', label: 'Alla' },
  { key: 'hem', label: 'Hemstädning' },
  { key: 'kontor', label: 'Kontorsstädning' },
  { key: 'special', label: 'Specialtjänster' },
];

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [filtered, setFiltered] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('alla');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getServices().then((s) => {
      setServices(s);
      setFiltered(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = services;
    if (selectedCat !== 'alla') result = result.filter((s) => s.category === selectedCat);
    if (search.trim()) result = result.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [selectedCat, search, services]);

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Våra tjänster</Text>
        <Text style={styles.headerSub}>Välj rätt städtjänst för dig</Text>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={Colors.light.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Sök tjänst..."
            placeholderTextColor={Colors.light.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={styles.catScrollContent}
      >
        {CATS.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.catTab, selectedCat === cat.key && styles.catTabActive]}
            onPress={() => setSelectedCat(cat.key)}
          >
            <Text style={[styles.catTabText, selectedCat === cat.key && styles.catTabTextActive]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services list */}
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="search" size={48} color={Colors.light.border} />
              <Text style={styles.emptyText}>Inga tjänster hittades</Text>
            </View>
          ) : (
            filtered.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.card}
                onPress={() => router.push(`/service/${service.id}`)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: service.image }} style={styles.cardImg} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <View style={[styles.catBadge, { backgroundColor: service.color + '20' }]}>
                      <Text style={[styles.catBadgeText, { color: service.color }]}>
                        {service.categoryLabel}
                      </Text>
                    </View>
                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={11} color="#F59E0B" />
                      <Text style={styles.ratingText}>{service.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardName}>{service.name}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{service.description}</Text>
                  <View style={styles.cardBottom}>
                    <View>
                      <Text style={styles.cardPrice}>{service.price} kr</Text>
                      <Text style={styles.cardUnit}>/{service.unit}</Text>
                    </View>
                    <View style={styles.cardMeta}>
                      <Ionicons name="time-outline" size={13} color={Colors.light.textSecondary} />
                      <Text style={styles.cardMetaText}>{service.duration}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.bookBtn}
                      onPress={() => router.push(`/service/${service.id}`)}
                    >
                      <Text style={styles.bookBtnText}>Boka</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.background },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: 52,
    paddingHorizontal: Theme.spacing.lg,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: { fontSize: Theme.font.xxl, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: Theme.font.sm, color: 'rgba(255,255,255,0.75)', marginBottom: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: Theme.radius.md,
    paddingHorizontal: 14,
    height: 46,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: Theme.font.md, color: Colors.light.text },

  catScroll: { flexGrow: 0, marginTop: Theme.spacing.md },
  catScrollContent: { paddingHorizontal: Theme.spacing.lg, gap: 8 },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Theme.radius.full,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    backgroundColor: '#fff',
  },
  catTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catTabText: { fontSize: Theme.font.sm, fontWeight: '600', color: Colors.light.textSecondary },
  catTabTextActive: { color: '#fff' },

  list: { paddingHorizontal: Theme.spacing.lg, paddingTop: Theme.spacing.md },

  card: {
    backgroundColor: '#fff',
    borderRadius: Theme.radius.xl,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardImg: { width: '100%', height: 180 },
  cardBody: { padding: Theme.spacing.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catBadge: { borderRadius: Theme.radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  catBadgeText: { fontSize: Theme.font.xs, fontWeight: '700' },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FEF3C7',
    borderRadius: Theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: { fontSize: Theme.font.xs, fontWeight: '700', color: '#D97706' },
  cardName: { fontSize: Theme.font.lg, fontWeight: '700', color: Colors.light.text, marginBottom: 4 },
  cardDesc: { fontSize: Theme.font.sm, color: Colors.light.textSecondary, lineHeight: 20, marginBottom: 12 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardPrice: { fontSize: Theme.font.xl, fontWeight: '800', color: Colors.primary },
  cardUnit: { fontSize: Theme.font.xs, color: Colors.light.textSecondary },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: Theme.font.sm, color: Colors.light.textSecondary },
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Theme.radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bookBtnText: { color: '#fff', fontSize: Theme.font.sm, fontWeight: '700' },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: Theme.font.md, color: Colors.light.textSecondary },
});
