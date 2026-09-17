import { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, Alert, Animated } from 'react-native';
import { useTheme } from '../../lib/theme';
import { Icon } from '../../lib/icons';
import { feed as seedFeed, users } from '../../lib/mock';
import type { FeedPost } from '../../lib/types';
import * as Haptics from 'expo-haptics';

export default function Feed() {
  const { colors } = useTheme();
  const [posts, setPosts] = useState<FeedPost[]>(seedFeed);
  const [draft, setDraft] = useState('');
  const scales = useRef<Record<string, Animated.Value>>({}).current;
  const getScale = (id: string) => (scales[id] ??= new Animated.Value(1));

  const toggleLike = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const s = getScale(id + ':like');
    Animated.sequence([Animated.timing(s, { toValue: 1.18, duration: 120, useNativeDriver: true }), Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 8 })]).start();
    setPosts(p => p.map(x => (x.id === id ? { ...x, liked: !x.liked, likes: x.liked ? x.likes - 1 : x.likes + 1 } : x)));
  };
  const toggleBookmark = (id: string) => {
    Haptics.selectionAsync();
    setPosts(p => p.map(x => (x.id === id ? { ...x, bookmarked: !x.bookmarked } : x)));
  };
  const publish = () => {
    const t = draft.trim();
    if (!t) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const np: FeedPost = { id: String(Date.now()), author: users[4], text: t, ts: Date.now(), likes: 0, liked: false, comments: [], bookmarked: false, image: Math.random() > 0.5 ? `https://picsum.photos/seed/${Date.now()}/800/500` : undefined };
    setPosts(p => [np, ...p]);
    setDraft('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 32 }}>
        {/* Composer */}
        <View style={{ backgroundColor: colors.surfaceAlt, borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#2A3942', gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Image source={{ uri: 'https://i.pravatar.cc/200?img=15' }} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#2A3942' }} />
            <Text style={{ color: colors.text, fontWeight: '800', fontSize: 14 }}>Tobi</Text>
            <View style={{ marginLeft: 'auto', backgroundColor: '#182229', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon.lock size={10} color="#53BDEB" />
              <Text style={{ color: '#8696A0', fontSize: 10, fontWeight: '800', letterSpacing: 0.4 }}>E2EE \u00B7 FOLLOWERS ONLY</Text>
            </View>
          </View>
          <TextInput value={draft} onChangeText={setDraft} placeholder="Share with your graph \u2014 encrypted to followers, no ads, no tracking" placeholderTextColor="#667781" style={{ color: colors.text, fontSize: 14, minHeight: 44, textAlignVertical: 'top', lineHeight: 19 }} multiline />
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Pressable onPress={() => Alert.alert('Media', 'Images are E2EE \u2014 encrypted on device before upload.')} style={{ backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: '#2A3942', flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <Icon.image size={14} color={colors.muted} />
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>Photo</Text>
            </Pressable>
            <View style={{ flex: 1 }} />
            <Pressable onPress={publish} disabled={!draft.trim()} style={{ backgroundColor: draft.trim() ? colors.accent : '#1F2C34', paddingHorizontal: 20, paddingVertical: 11, borderRadius: 999, opacity: draft.trim() ? 1 : 0.7 }}>
              <Text style={{ color: draft.trim() ? '#0B141A' : '#667781', fontWeight: '900', fontSize: 13 }}>Post</Text>
            </Pressable>
          </View>
        </View>

        {posts.map(post => (
          <View key={post.id} style={{ backgroundColor: colors.surfaceAlt, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: '#2A3942' }}>
            <View style={{ padding: 14, flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Image source={{ uri: post.author.avatar }} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#1F2C34' }} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: colors.text, fontWeight: '800', fontSize: 14 }}>{post.author.name}</Text>
                  {post.author.verified && <View style={{ backgroundColor: colors.accent, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Icon.check size={10} color="#0B141A" /></View>}
                  <Text style={{ color: colors.faint, fontSize: 11 }}>\u00B7 {new Date(post.ts).toLocaleDateString()}</Text>
                </View>
                <Text style={{ color: colors.faint, fontSize: 11, marginTop: 1 }}>{post.author.about}</Text>
              </View>
              <Pressable onPress={() => Alert.alert(post.author.name, 'Mute \u00B7 Report \u00B7 Block \u2014 feed stays chronological, no algorithm.')} hitSlop={10} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#111B21', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1F2C34' }}>
                <Icon.more size={16} color={colors.faint} />
              </Pressable>
            </View>

            <View style={{ paddingHorizontal: 14, paddingBottom: post.image ? 0 : 6 }}>
              <Text style={{ color: colors.text, fontSize: 14.5, lineHeight: 21 }}>{post.text}</Text>
            </View>
            {post.image ? <Image source={{ uri: post.image }} style={{ width: '100%', height: 220, backgroundColor: '#111B21' }} /> : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 10 }}>
              <Pressable onPress={() => toggleLike(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, backgroundColor: post.liked ? '#1A2329' : 'transparent', borderWidth: post.liked ? 1 : 0, borderColor: '#1F2C34' }}>
                <Animated.View style={{ transform: [{ scale: getScale(post.id + ':like') }] }}>
                  {post.liked ? <Icon.heartFill size={18} color="#F15C6D" /> : <Icon.heart size={18} color={colors.muted} />}
                </Animated.View>
                <Text style={{ color: post.liked ? '#F15C6D' : colors.muted, fontSize: 12, fontWeight: '800' }}>{post.likes}</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Comments', 'Threaded, E2EE \u2014 followers only.')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Icon.message size={16} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>{post.comments.length}</Text>
              </Pressable>
              <Pressable onPress={() => Alert.alert('Share', 'Link is E2EE-gated \u2014 only followers can open.')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 7 }}>
                <Icon.share size={16} color={colors.muted} />
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '700' }}>Share</Text>
              </Pressable>
              <Pressable onPress={() => toggleBookmark(post.id)} style={{ marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, backgroundColor: post.bookmarked ? 'rgba(0,168,132,0.12)' : 'transparent', alignItems: 'center', justifyContent: 'center', borderWidth: post.bookmarked ? 1 : 0, borderColor: 'rgba(0,168,132,0.25)' }}>
                {post.bookmarked ? <Icon.bookmarkFill size={18} color={colors.accent} /> : <Icon.bookmark size={18} color={colors.faint} />}
              </Pressable>
            </View>
            {post.comments.length > 0 && (
              <View style={{ backgroundColor: '#111B21', paddingHorizontal: 14, paddingVertical: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#1F2C34' }}>
                {post.comments.map((c, i) => (
                  <Text key={i} style={{ color: colors.muted, fontSize: 12.5, lineHeight: 17 }}>
                    <Text style={{ color: colors.text, fontWeight: '800' }}>{c.user}</Text>  {c.text}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={{ alignItems: 'center', gap: 8, paddingVertical: 16 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: '#111B21', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: '#1F2C34' }}>
            <Icon.shieldDone size={12} color={colors.accent} />
            <Text style={{ color: colors.faint, fontSize: 11, fontWeight: '600' }}>Chronological \u00B7 No algorithm \u00B7 Followers only</Text>
          </View>
          <Text style={{ color: colors.faint, fontSize: 11 }}>End of feed</Text>
        </View>
      </ScrollView>
    </View>
  );
}
