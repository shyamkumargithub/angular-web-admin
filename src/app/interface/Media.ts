

export interface AudioMetadata {
  title: string;
  artist: string;
  album: string | null;
  year: string | null;
  genre: string | null;
  composer: string | null;
  lyricist: string | null;
  language: string | null;
  attachedPicture: string | null;
  theme: string | null;
  collaborator: string | null;
  instrument: string | null;
  lyrics: string | null;
}

export interface ImageMetadata{
  id?:number;
  caption:string
}

export interface VideoMetadata {
  id?:number;
  caption: string;
  artist: string;
  album: string | null;
  year: string | null;
  genre: string | null;
  composer: string | null;
  lyricist: string | null;
  language: string | null;
  attachedPicture: string | null;
  theme: string | null;
  collaborator: string | null;
  instrument: string | null;
  subTitle?: string | null;
}

export interface Media {
  id: string;
  url: string;
  thumbnail?:string;
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  size: number;
  fileType: string;
  filePath: string;
 audioMetadata: AudioMetadata;
  imageMetadata: ImageMetadata;
  videoMetadata: VideoMetadata;
}


export type FileType =
   "AUDIO"|
    "AUDIO_PICTURE"|
    "AUDIO_IMAGE_THUMBNAIL"|
    "VIDEO"|
    "VIDEO_SUBTITLE"|
    "VIDEO_IMAGE_THUMBNAIL"|
    "IMAGE"|
    "IMAGE_THUMBNAIL"

export const AllImageFileTypes: FileType[] = [
      "IMAGE",
      "IMAGE_THUMBNAIL",
    ];
export const AllAudioFileTypes: FileType[] = [
  "AUDIO",
  "AUDIO_PICTURE",
  "AUDIO_IMAGE_THUMBNAIL",
];

export const AllVideoFileTypes:FileType[]=[
  "VIDEO_SUBTITLE","VIDEO_IMAGE_THUMBNAIL","VIDEO"
]

export interface MetadataResponse {
  albums: string[];
  genres: string[];
  languages: string[];
  lyricists: string[];
  singers: string[];
  themes: string[];
  releaseYears: string[];
  collaborators: string[];
  instruments: string[];
}