import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Animated, PanResponder, Dimensions, SafeAreaView,
  ScrollView, KeyboardAvoidingView, Platform, StatusBar,
  FlatList, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CARD_W = SCREEN_W * 0.88;
const CARD_H = SCREEN_H * 0.46;
const SWIPE_THRESHOLD = SCREEN_W * 0.28;

const SEED_ADVICE = [
  { id: 's1', forAge: 16, fromAge: 34, text: "Stop worrying about what others think. The people whose opinions keep you up at night will barely register in your memory ten years from now. Wear the weird shoes. Say the strange thing.", author: 'Someone who figured it out', sig: '', createdAt: Date.now() - 86400000 * 1 },
  { id: 's2', forAge: 20, fromAge: 52, text: "Call mom more. Not because she'll tell you to, but because one day you'll wish you had more recordings of her voice, more memories of ordinary Tuesdays on the phone.", author: 'Anonymous', sig: 'Still miss her every day', createdAt: Date.now() - 86400000 * 2 },
  { id: 's3', forAge: 27, fromAge: 41, text: "It's okay not to have it figured out. The people who seem certain are just better at performing certainty. Uncertainty is not a flaw — it's the start of every interesting thing.", author: 'Your future self', sig: '', createdAt: Date.now() - 86400000 * 3 },
  { id: 's4', forAge: 13, fromAge: 29, text: "The awkwardness you feel right now is not permanent. You are growing into yourself. Everyone else is equally confused — they're just hiding it too.", author: 'Anonymous', sig: 'A late bloomer who bloomed', createdAt: Date.now() - 86400000 * 4 },
  { id: 's5', forAge: 32, fromAge: 58, text: "Sleep when the baby sleeps. Let the dishes sit. The laundry will always exist. This season won't. You will remember the weight of that small head on your chest.", author: 'A parent looking back', sig: 'Three kids, zero regrets', createdAt: Date.now() - 86400000 * 5 },
  { id: 's6', forAge: 22, fromAge: 38, text: "That job you're about to quit because it feels beneath you? Stay six more months. The person you'll meet there changes everything.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 6 },
  { id: 's7', forAge: 17, fromAge: 45, text: "You are not too much. You have never been too much. The people who make you feel that way are not your people.", author: 'Someone who found her people', sig: '', createdAt: Date.now() - 86400000 * 7 },
  { id: 's8', forAge: 30, fromAge: 55, text: "Your body is not the problem. Stop waiting to live your life until it looks different. The life is now.", author: 'Anonymous', sig: 'Still learning this', createdAt: Date.now() - 86400000 * 8 },
  { id: 's9', forAge: 8, fromAge: 33, text: "Dad is doing his best. It doesn't look like what you need, but it's all he has. You'll understand this later and it will set you both free.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 9 },
  { id: 's10', forAge: 24, fromAge: 40, text: "Apply for the thing. The worst they can say is no. You've survived worse than a no.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 10 },
  { id: 's11', forAge: 19, fromAge: 36, text: "The friends you're about to drift from — reach back. Adult friendships don't maintain themselves. You have to choose them, again and again.", author: 'Someone a little lonely', sig: '', createdAt: Date.now() - 86400000 * 11 },
  { id: 's12', forAge: 35, fromAge: 60, text: "Retire five years earlier than you planned. The money is never enough but the time always runs out.", author: 'Anonymous', sig: 'Retired at 58, wished it was 53', createdAt: Date.now() - 86400000 * 12 },
  { id: 's13', forAge: 14, fromAge: 31, text: "You're going to be okay. I know you don't believe that right now. But I'm standing on the other side of it, and I'm telling you — you make it through.", author: 'You, at 31', sig: '', createdAt: Date.now() - 86400000 * 13 },
  { id: 's14', forAge: 26, fromAge: 44, text: "Stop lending money you can't afford to lose. Love people freely. Lend money only if you're okay never seeing it again.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 14 },
  { id: 's15', forAge: 40, fromAge: 62, text: "The career pivot you're too scared to make at 40 — make it. You have more runway than you think and more resilience than you know.", author: 'Anonymous', sig: 'Second career was the real one', createdAt: Date.now() - 86400000 * 15 },
  { id: 's16', forAge: 11, fromAge: 27, text: "Being different is the whole point. The thing that makes you strange now is the thing that makes you remarkable later.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 16 },
  { id: 's17', forAge: 23, fromAge: 47, text: "Therapy is not a last resort. Go now, while things are good. Build the tools before the storm.", author: 'Someone who waited too long', sig: '', createdAt: Date.now() - 86400000 * 17 },
  { id: 's18', forAge: 29, fromAge: 50, text: "Marry the kind one. Not the exciting one, not the complicated one. The kind one. Kindness compounds over decades.", author: 'Anonymous', sig: '28 years and counting', createdAt: Date.now() - 86400000 * 18 },
  { id: 's19', forAge: 15, fromAge: 39, text: "Your grades matter less than your curiosity. Follow what genuinely fascinates you, even if no one else gets it.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 19 },
  { id: 's20', forAge: 33, fromAge: 51, text: "Start the savings account. Any amount. The habit is the point, not the number. Future you will be so grateful.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 20 },
  { id: 's21', forAge: 18, fromAge: 42, text: "Take the gap year. Travel cheap, sleep in hostels, eat street food, get lost. The degree will still be there. This version of freedom won't.", author: 'No regrets', sig: '', createdAt: Date.now() - 86400000 * 21 },
  { id: 's22', forAge: 45, fromAge: 63, text: "Your parents won't be here forever. Ask them the questions now. Their stories are yours too, and they'll vanish with them.", author: 'Anonymous', sig: 'I wish I had asked more', createdAt: Date.now() - 86400000 * 22 },
  { id: 's23', forAge: 21, fromAge: 35, text: "The relationship that feels like chaos is not passion. Passion is calm. What you're feeling is anxiety. They are not the same thing.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 23 },
  { id: 's24', forAge: 10, fromAge: 28, text: "Read everything you can get your hands on. Fiction, facts, nonsense. The reading you do now quietly shapes who you become.", author: "A librarian's kid", sig: '', createdAt: Date.now() - 86400000 * 24 },
  { id: 's25', forAge: 37, fromAge: 54, text: "Say yes to the thing that scares you a little. The comfortable choice keeps you safe. The scary one moves you forward.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 25 },
  { id: 's26', forAge: 25, fromAge: 43, text: "You don't have to have a plan. You just have to keep moving. Plans are made for who you are now. Movement reveals who you become.", author: 'Still moving', sig: '', createdAt: Date.now() - 86400000 * 26 },
  { id: 's27', forAge: 50, fromAge: 67, text: "Take care of your knees. Your back. Your sleep. The body keeps the score and eventually it will present the bill.", author: 'Anonymous', sig: "Your physiotherapist's best client", createdAt: Date.now() - 86400000 * 27 },
  { id: 's28', forAge: 12, fromAge: 30, text: "You are not responsible for making everyone comfortable. Not your parents, not your friends. Your feelings are allowed to exist.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 28 },
  { id: 's29', forAge: 28, fromAge: 46, text: "Cook more meals at home. Not to save money — though you will — but because sitting down to something you made yourself is a quiet kind of joy.", author: 'Anonymous', sig: '', createdAt: Date.now() - 86400000 * 29 },
  { id: 's30', forAge: 9, fromAge: 32, text: "Keep the journal. Even if you only write one sentence. The you that reads it at 32 will be so glad you did.", author: 'Your older self', sig: '', createdAt: Date.now() - 86400000 * 30 },
];

function SwipeCard({ item, onSwipedLeft, onSwipedRight, isTop }) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_W, 0, SCREEN_W],
    outputRange: ['-18deg', '0deg', '18deg'],
  });
  const nextOpacity = position.x.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });
  const backOpacity = position.x.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onMoveShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy * 0.3 }),
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: SCREEN_W * 1.5, y: g.dy }, useNativeDriver: false }).start(onSwipedRight);
        } else if (g.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: -SCREEN_W * 1.5, y: g.dy }, useNativeDriver: false }).start(onSwipedLeft);
        } else {
          Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      {...(isTop ? panResponder.panHandlers : {})}
      style={[
        styles.card,
        isTop && { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] },
        !isTop && { top: 12, left: 10, right: 10, zIndex: -1, opacity: 0.5, transform: [{ scale: 0.96 }] },
      ]}
    >
      {isTop && (
        <>
          <Animated.View style={[styles.stampBadge, styles.nextBadge, { opacity: nextOpacity }]}>
            <Text style={styles.nextText}>NEXT ›</Text>
          </Animated.View>
          <Animated.View style={[styles.stampBadge, styles.backBadge, { opacity: backOpacity }]}>
            <Text style={styles.backText}>‹ BACK</Text>
          </Animated.View>
        </>
      )}
      <View style={styles.tagRow}>
        <View style={styles.cardAgeTag}>
          <Text style={styles.cardAgeText}>For age {item.forAge}</Text>
        </View>
        {item.fromAge ? (
          <View style={styles.cardFromTag}>
            <Text style={styles.cardFromText}>Written at {item.fromAge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.cardQuote}>"</Text>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Text style={styles.cardBody}>{item.text}</Text>
      </ScrollView>
      <View style={styles.cardFooter}>
        <Text style={styles.cardAuthor}>— {item.author || 'Anonymous'}</Text>
        {item.sig ? <Text style={styles.cardSig}>{item.sig}</Text> : null}
      </View>
    </Animated.View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('read');
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [form, setForm] = useState({ forAge: '', fromAge: '', text: '', author: '', sig: '' });
  const [submitted, setSubmitted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => { loadCards(); }, []);

  async function loadCards() {
    try {
      const stored = await AsyncStorage.getItem('advice_cards_v2');
      const userCards = stored ? JSON.parse(stored) : [];
      setCards([...SEED_ADVICE, ...userCards]);
    } catch {
      setCards(SEED_ADVICE);
    }
  }

  async function saveAdvice() {
    const forAgeNum = parseInt(form.forAge);
    if (!forAgeNum || !form.text.trim()) return;
    const fromAgeNum = parseInt(form.fromAge);
    const newCard = {
      id: `u${Date.now()}`,
      forAge: forAgeNum,
      fromAge: isNaN(fromAgeNum) ? null : fromAgeNum,
      text: form.text.trim(),
      author: form.author.trim() || 'Anonymous',
      sig: form.sig.trim(),
      createdAt: Date.now(),
    };
    try {
      const stored = await AsyncStorage.getItem('advice_cards_v2');
      const existing = stored ? JSON.parse(stored) : [];
      existing.unshift(newCard);
      await AsyncStorage.setItem('advice_cards_v2', JSON.stringify(existing));
    } catch {}
    setCards(prev => [newCard, ...prev]);
    setIndex(0);
    setForm({ forAge: '', fromAge: '', text: '', author: '', sig: '' });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setScreen('read'); }, 2200);
  }

  function onSwiped() {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setIndex(i => (i + 1) % cards.length);
  }

  const currentCard = cards.length > 0 ? cards[index % cards.length] : null;
  const nextCard = cards.length > 1 ? cards[(index + 1) % cards.length] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#141210" />

      <View style={styles.header}>
        <Text style={styles.logo}>Dear Past Me</Text>
        <View style={styles.navRow}>
          <TouchableOpacity onPress={() => setScreen('read')} style={[styles.navBtn, screen === 'read' && styles.navBtnActive]}>
            <Text style={[styles.navLabel, screen === 'read' && styles.navLabelActive]}>Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setScreen('write')} style={[styles.navBtn, screen === 'write' && styles.navBtnActive]}>
            <Text style={[styles.navLabel, screen === 'write' && styles.navLabelActive]}>Write</Text>
          </TouchableOpacity>
        </View>
      </View>

      {screen === 'read' && (
        <View style={styles.readContainer}>
          <Text style={styles.subheading}>Swipe to read advice across ages</Text>
          {cards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No advice yet — be the first to write some.</Text>
            </View>
          ) : (
            <Animated.View style={[styles.deckArea, { opacity: fadeAnim }]}>
              {nextCard && <SwipeCard key={`next-${(index+1)%cards.length}`} item={nextCard} isTop={false} onSwipedLeft={()=>{}} onSwipedRight={()=>{}} />}
              {currentCard && <SwipeCard key={`top-${index%cards.length}`} item={currentCard} isTop={true} onSwipedLeft={onSwiped} onSwipedRight={onSwiped} />}
            </Animated.View>
          )}
          <View style={styles.counterRow}>
            <Text style={styles.counter}>{cards.length > 0 ? `${(index%cards.length)+1} of ${cards.length}` : ''}</Text>
          </View>
          <Text style={styles.swipeHint}>← swipe either direction to continue →</Text>
        </View>
      )}

      {screen === 'write' && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.writeContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.writeTitle}>Write to your past self</Text>
            <Text style={styles.writeSubtitle}>Share wisdom across the years.</Text>

            <Text style={styles.fieldLabel}>Your current age</Text>
            <TextInput
              style={[styles.inputField, { width: 140 }]}
              placeholder="e.g. 34"
              placeholderTextColor={PLACEHOLDER}
              keyboardType="numeric"
              value={form.fromAge}
              onChangeText={t => setForm(f => ({ ...f, fromAge: t }))}
            />

            <Text style={styles.fieldLabel}>Advice for age</Text>
            <Text style={styles.fieldHint}>The specific age you're writing to</Text>
            <View style={styles.centeredInput}>
              <TextInput
                style={[styles.inputField, { width: 140, textAlign: 'center' }]}
                placeholder="e.g. 16"
                placeholderTextColor={PLACEHOLDER}
                keyboardType="numeric"
                value={form.forAge}
                onChangeText={t => setForm(f => ({ ...f, forAge: t }))}
              />
            </View>

            <Text style={styles.fieldLabel}>Your advice</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Write something true. Something you wish you had known..."
              placeholderTextColor={PLACEHOLDER}
              value={form.text}
              onChangeText={t => setForm(f => ({ ...f, text: t.slice(0, 200) }))}
              textAlignVertical="top"
              maxLength={200}
            />
            <Text style={styles.charCount}>{form.text.length}/200</Text>

            <View style={styles.divider} />
            <Text style={styles.optionalLabel}>Optional — sign your note</Text>

            <Text style={styles.fieldLabel}>Name or handle</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Anonymous"
              placeholderTextColor={PLACEHOLDER}
              value={form.author}
              onChangeText={t => setForm(f => ({ ...f, author: t }))}
            />

            <Text style={styles.fieldLabel}>Signature line</Text>
            <Text style={styles.fieldHint}>A short closing thought, title, or phrase</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g. Still figuring it out, age 41"
              placeholderTextColor={PLACEHOLDER}
              value={form.sig}
              onChangeText={t => setForm(f => ({ ...f, sig: t }))}
            />

            {submitted ? (
              <View style={styles.successBanner}>
                <Text style={styles.successText}>✦ Your advice has been added</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.submitBtn, (!parseInt(form.forAge) || !form.text.trim()) && styles.submitBtnDisabled]}
                onPress={saveAdvice}
                disabled={!parseInt(form.forAge) || !form.text.trim()}
              >
                <Text style={styles.submitLabel}>Send it back in time</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}

    </SafeAreaView>
  );
}

const BG = '#141210';
const SURFACE = '#1E1A16';
const CARD_BG = '#252018';
const BORDER = '#3A3228';
const BORDER2 = '#4A4038';
const INK = '#F0E8D8';
const INK2 = '#9E8E78';
const INK3 = '#6A5C4E';
const GOLD = '#C49A2A';
const GOLD2 = '#8C6E1A';
const PLACEHOLDER = '#5A4E40';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 44 : 8, paddingBottom: 10, backgroundColor: BG, borderBottomWidth: 0.5, borderBottomColor: BORDER, alignItems: 'center' },
  logo: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 20, color: INK, letterSpacing: 0.3, marginBottom: 10, textAlign: 'center' },
  navRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  navBtn: { paddingVertical: 6, paddingHorizontal: 18, borderRadius: 20, borderWidth: 0.5, borderColor: BORDER2 },
  navBtnActive: { backgroundColor: INK },
  navLabel: { fontSize: 13, color: INK2 },
  navLabelActive: { color: BG },

  readContainer: { flex: 1, alignItems: 'center', paddingTop: 12 },
  subheading: { fontSize: 12, color: INK3, marginBottom: 14, textAlign: 'center' },
  deckArea: { width: CARD_W, height: CARD_H, position: 'relative', alignItems: 'center' },
  card: {
    position: 'absolute', width: CARD_W, height: CARD_H,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 0.5, borderColor: BORDER2,
    padding: 20, shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 16,
    elevation: 8,
  },
  tagRow: { flexDirection: 'row', gap: 7, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10, justifyContent: 'center' },
  cardAgeTag: { backgroundColor: '#2A2018', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 0.5, borderColor: GOLD2 },
  cardAgeText: { fontSize: 10, color: GOLD, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase' },
  cardFromTag: { backgroundColor: '#1A1E20', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 0.5, borderColor: '#2A3E44' },
  cardFromText: { fontSize: 10, color: '#7AABBB', letterSpacing: 0.5 },
  cardQuote: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 44, color: BORDER2, lineHeight: 36, marginBottom: 6, textAlign: 'center' },
  cardBody: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 15.5, lineHeight: 26, color: INK, letterSpacing: 0.1, textAlign: 'center' },
  cardFooter: { borderTopWidth: 0.5, borderTopColor: BORDER, paddingTop: 9, marginTop: 10, alignItems: 'center' },
  cardAuthor: { fontSize: 12, color: INK2, fontStyle: 'italic' },
  cardSig: { fontSize: 11, color: INK3, marginTop: 2 },

  stampBadge: { position: 'absolute', top: 16, borderWidth: 2, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3, zIndex: 10 },
  nextBadge: { right: 16, borderColor: '#4A9955', transform: [{ rotate: '8deg' }] },
  backBadge: { left: 16, borderColor: '#AA3030', transform: [{ rotate: '-8deg' }] },
  nextText: { fontSize: 11, fontWeight: '700', color: '#4A9955', letterSpacing: 1 },
  backText: { fontSize: 11, fontWeight: '700', color: '#AA3030', letterSpacing: 1 },

  counterRow: { marginTop: 14 },
  counter: { fontSize: 11, color: INK3, textAlign: 'center' },
  swipeHint: { fontSize: 11, color: INK3, marginTop: 5, opacity: 0.7, textAlign: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: INK2, textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', lineHeight: 26 },

  writeContainer: { padding: 22, paddingBottom: 52, alignItems: 'center' },
  writeTitle: { fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', fontSize: 20, color: INK, marginBottom: 5, textAlign: 'center', width: '100%' },
  writeSubtitle: { fontSize: 13, color: INK2, marginBottom: 4, lineHeight: 20, textAlign: 'center', width: '100%' },
  fieldLabel: { fontSize: 10, color: GOLD, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6, marginTop: 16, textAlign: 'center', width: '100%' },
  fieldHint: { fontSize: 11, color: INK3, fontStyle: 'italic', marginBottom: 6, marginTop: -3, textAlign: 'center', width: '100%' },
  centeredInput: { alignItems: 'center', width: '100%' },
  inputField: { backgroundColor: SURFACE, borderWidth: 0.5, borderColor: BORDER2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: INK, width: '100%', textAlign: 'center' },
  textArea: { backgroundColor: SURFACE, borderWidth: 0.5, borderColor: BORDER2, borderRadius: 10, padding: 13, height: 100, fontSize: 15, color: INK, lineHeight: 24, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', width: '100%', textAlign: 'left' },
  charCount: { fontSize: 11, color: INK3, textAlign: 'right', width: '100%', marginTop: 4 },
  divider: { borderTopWidth: 0.5, borderTopColor: BORDER, marginTop: 20, marginBottom: 4, width: '100%' },
  optionalLabel: { fontSize: 11, color: INK3, fontStyle: 'italic', textAlign: 'center' },
  submitBtn: { marginTop: 24, backgroundColor: INK, borderRadius: 12, paddingVertical: 15, alignItems: 'center', width: '100%' },
  submitBtnDisabled: { backgroundColor: BORDER2 },
  submitLabel: { color: BG, fontSize: 14, letterSpacing: 0.4 },
  successBanner: { marginTop: 24, backgroundColor: '#0F2614', borderRadius: 12, paddingVertical: 15, alignItems: 'center', borderWidth: 0.5, borderColor: '#2E6030', width: '100%' },
  successText: { color: '#6EC97A', fontSize: 14, letterSpacing: 0.3 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  pickerSheet: { backgroundColor: '#1E1A16', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: SCREEN_H * 0.6 },
  pickerTitle: { fontSize: 13, color: INK2, marginBottom: 14, textAlign: 'center', letterSpacing: 0.3 },
  pickerItem: { paddingVertical: 13, paddingHorizontal: 12, borderRadius: 8, marginBottom: 2 },
  pickerItemSelected: { backgroundColor: '#2A2018' },
  pickerItemText: { fontSize: 16, color: INK },
  pickerItemTextSelected: { color: GOLD, fontWeight: '600' },
});