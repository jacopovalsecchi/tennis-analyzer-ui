export type Handedness = "left" | "right";

export type BackhandStyle = "one-handed" | "two-handed";

export interface Profile {
  firstName: string;
  lastName: string;
  handedness: Handedness;
  backhand: BackhandStyle;
  /** Centimetres. */
  height: number;
  /** Kilograms. */
  weight: number;
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
