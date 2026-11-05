import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ShotComment } from '../types';

type ShotTimelineProps = {
  comments: ShotComment[];
  duration?: number;
  onShotPress?: (shot: ShotComment) => void;
};

function shotType(shot: ShotComment): 'forehand' | 'backhand' | 'other' {
  const value = `${shot.label} ${shot.comment}`.toLowerCase();
  if (value.includes('dritto') || value.includes('forehand')) {
    return 'forehand';
  }
  if (value.includes('rovescio') || value.includes('backhand')) {
    return 'backhand';
  }
  return 'other';
}

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/** Timeline of the analyzed shots, positioned by each comment timestamp. */
export function ShotTimeline({
  comments,
  duration,
  onShotPress,
}: ShotTimelineProps) {
  if (comments.length === 0) {
    return null;
  }

  const lastShotTime = Math.max(...comments.map(shot => shot.time), 1);
  const totalDuration = Math.max(duration ?? lastShotTime, lastShotTime);

  return (
    <View style={timelineStyles.card}>
      <View style={timelineStyles.heading}>
        <Text style={timelineStyles.title}>Shot timeline</Text>
      </View>
      <View style={timelineStyles.timeline}>
        <View style={timelineStyles.track} />
        <View style={timelineStyles.startMark} />
        <View style={timelineStyles.endMark} />
        {comments.map(shot => {
          const type = shotType(shot);
          const position = `${Math.min(100, (shot.time / totalDuration) * 100)}%`;
          const markerLabel =
            type === 'forehand' ? 'FH' : type === 'backhand' ? 'BH' : '•';

          return (
            <Pressable
              key={`${shot.time}-${shot.arm}-${shot.label}`}
              accessibilityRole="button"
              accessibilityLabel={`Open shot at ${shot.time} seconds`}
              onPress={() => onShotPress?.(shot)}
              style={[timelineStyles.marker, { left: position }]}
            >
              <Text
                style={[
                  timelineStyles.markerText,
                  type === 'forehand'
                    ? timelineStyles.forehandMarker
                    : type === 'backhand'
                      ? timelineStyles.backhandMarker
                      : [timelineStyles.otherMarker, timelineStyles.otherMarkerText],
                ]}
              >
                {markerLabel}
              </Text>
            </Pressable>
          );
        })}
        <View style={timelineStyles.timeLabels}>
          <Text style={timelineStyles.time}>00:00</Text>
          <Text style={timelineStyles.time}>{formatTime(totalDuration)}</Text>
        </View>
      </View>
      <View style={timelineStyles.legend}>
        <LegendDot color="#B5F238" label="Forehand" />
        <LegendDot color="#80928A" label="Backhand" />
        <LegendDot color="#A8ADB2" label="Other" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={timelineStyles.legendItem}>
      <View style={[timelineStyles.legendDot, { backgroundColor: color }]} />
      <Text style={timelineStyles.legendText}>{label}</Text>
    </View>
  );
}

const timelineStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F6F7F9',
    borderWidth: 1,
    borderColor: '#E6E8EC',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    marginBottom: 12,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: '#8B919A',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  timeline: {
    height: 58,
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    left: 2,
    right: 2,
    top: 19,
    height: 3,
    backgroundColor: '#9AA1A9',
  },
  startMark: {
    position: 'absolute',
    left: 1,
    top: 12,
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#243038',
  },
  endMark: {
    position: 'absolute',
    right: 1,
    top: 12,
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: '#243038',
  },
  marker: {
    position: 'absolute',
    top: 4,
    width: 36,
    height: 36,
    marginLeft: -18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerText: {
    width: 20,
    paddingTop: 4,
    height: 20,
    borderRadius: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    overflow: 'hidden',
  },
  forehandMarker: {
    backgroundColor: '#3E7A57',
  },
  backhandMarker: {
    backgroundColor: '#8B919A',
  },
  otherMarker: {
    backgroundColor: '#D2D6DA',
  },
  otherMarkerText: {
    color: '#243038',
  },
  timeLabels: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    color: '#243038',
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    color: '#5C6570',
    fontSize: 14,
  },
});
