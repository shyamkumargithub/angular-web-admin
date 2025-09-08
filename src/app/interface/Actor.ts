interface MediaMetadata {
  id: number;
  caption: string;
  captionForegroundColor: string | null;
  captionBackgroundColor: string | null;
}

interface ImageMetadata extends MediaMetadata {}

interface VideoMetadata extends MediaMetadata {
  durationSeconds: number | null;
  resolution: string | null;
  subTitle: string | null;
}

type FileType = "IMAGE" | "VIDEO"|"VIDEO_ACTOR"|"IMAGE_ACTOR";

export interface MediaFile {
  id: number;
  thumbnail: string;
  url: string;
  storedFilename: string;
  fileType: FileType;
  audioMetadata: null; // could expand if you support audio
  imageMetadata: ImageMetadata | null;
  videoMetadata: VideoMetadata | null;
  contentType: string;
}

interface Info {
  username: string;
  about: string;
}

export interface Actor {
  id?: number;
  profile: MediaFile;
  galleries: MediaFile[];
  info: Info;
}
