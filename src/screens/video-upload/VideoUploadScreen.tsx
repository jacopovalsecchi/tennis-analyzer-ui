import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadVideo } from '../../services';
import type { VideoFile, VideoUploadStatus } from '../../types';
import { styles } from './styles';

/** Pick a video and send it to the backend. */
export function VideoUploadScreen() {
  const [file, setFile] = useState<VideoFile | null>(null);
  const [status, setStatus] = useState<VideoUploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onChooseVideo() {
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
    setError(null);
  }

  async function onUpload() {
    if (!file) {
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
      <Text style={styles.title}>Video upload</Text>
      <Text style={styles.body}>
        {file ? file.name : 'No video selected'}
      </Text>
      <Pressable onPress={onChooseVideo} style={styles.button}>
        <Text style={styles.buttonText}>Choose video</Text>
      </Pressable>
      <Pressable
        onPress={onUpload}
        disabled={!file || status === 'uploading'}
        style={styles.button}>
        <Text style={styles.buttonText}>
          {status === 'uploading' ? 'Uploading…' : 'Upload'}
        </Text>
      </Pressable>
      {status === 'uploaded' ? (
        <Text style={styles.body}>Uploaded</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
