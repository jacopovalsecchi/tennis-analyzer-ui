export type Handedness = 'left' | 'right';

export type BackhandStyle = 'one-handed' | 'two-handed';

/** Profile form. Height and weight stay as typed until a successful save. */
export interface Profile {
  firstName: string;
  lastName: string;
  handedness: Handedness | '';
  backhandStyle: BackhandStyle | '';
  /** Local URI of the profile image selected from the device library. */
  imageUri?: string;
  /** Centimetres, as typed. */
  height: string;
  /** Kilograms, as typed. */
  weight: string;
}

/** One detected stroke and how it was judged. */
export interface Stroke {
  type: string;
  judgment: string;
}

export interface StrokeData {
  count: number;
  strokes: Stroke[];
}

export type VideoUploadStatus = "idle" | "uploading" | "uploaded" | "failed";

/** Local video chosen on the device and sent to the upload endpoint. */
export interface VideoFile {
  uri: string;
  name: string;
  type: string;
}

/** One shot comment returned by the upload analysis. */
export interface ShotComment {
  time: number;
  frame: number | null;
  label: string;
  arm: string;
  comment: string;
  /** Path on the backend, for example /results/latest/frames/shot_01.jpg. */
  imageUrl: string | null;
}

/** One analyzed upload shown in the results list and on its detail screen. */
export interface VideoResult {
  id: string;
  filename: string;
  /** ISO timestamp. */
  uploadedAt: string;
  forehands: number;
  backhands: number;
  /** Playable overlay URL. Null plays the bundled sample overlay. */
  overlayUrl: string | null;
  comments?: ShotComment[];
}
