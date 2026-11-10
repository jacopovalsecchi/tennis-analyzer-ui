import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadVideo } from '../../services';
import type { VideoFile, VideoUploadStatus } from '../../types';
import { styles } from './styles';

const modes = [
  { key: 'import', label: 'Import' },
  { key: 'record', label: 'Record' },
] as const;

type Mode = (typeof modes)[number]['key'];

/** Pick a video and send it to the backend. */
export function VideoUploadScreen() {
  const [mode, setMode] = useState<Mode>('import');
  const [file, setFile] = useState<VideoFile | null>(null);
  const [picking, setPicking] = useState(false);
  const [status, setStatus] = useState<VideoUploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const uploadDisabled = !file || picking || status === 'uploading';

  async function onChooseVideo() {
    if (picking) {
      return;
    }
    setPicking(true);
    setError(null);
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        selectionLimit: 1,
      });
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return;
      }
      setFile({
        uri: asset.uri,
        name: asset.fileName ?? 'video.mp4',
        type: asset.type ?? 'video/mp4',
      });
      setStatus('idle');
    } catch {
      setError('Could not open the gallery.');
    } finally {
      setPicking(false);
    }
  }

  async function onUpload() {
    if (!file || uploadDisabled) {
      return;
    }
    setStatus('uploading');
    setError(null);
    try {
      await uploadVideo(file);
      setStatus('uploaded');
    } catch (err) {
      setStatus('failed');
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.tabs}>
        {modes.map(item => {
          const selected = item.key === mode;
          return (
            <Pressable
              key={item.key}
              onPress={() => setMode(item.key)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}>
              <View style={selected ? styles.dot : styles.dotHidden} />
              <Text style={selected ? styles.tabSelected : styles.tabLabel}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {mode === 'import' ? (
        <View style={styles.center}>
          <Pressable
            onPress={onChooseVideo}
            disabled={picking}
            style={styles.drop}
            accessibilityRole="button"
            accessibilityLabel="Select video">
            {picking ? (
              <ActivityIndicator color="#3A6B9C" />
            ) : (
              <>
                <View style={styles.plus}>
                  <Text style={styles.plusMark}>+</Text>
                </View>
                <Text style={styles.selectLabel}>Select video</Text>
              </>
            )}
            {file && !picking ? (
              <Text style={styles.filename} numberOfLines={2}>
                {file.name}
              </Text>
            ) : null}
          </Pressable>
          <Pressable
            onPress={onUpload}
            disabled={uploadDisabled}
            style={[styles.button, uploadDisabled && styles.buttonDisabled]}>
            <Text style={styles.buttonText}>
              {status === 'uploading' ? 'Uploading…' : 'Upload'}
            </Text>
          </Pressable>
          {status === 'uploaded' ? (
            <Text style={styles.status}>Uploaded</Text>
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.recordNote}>Recording is not available.</Text>
        </View>
      )}
    </View>
  );
}
