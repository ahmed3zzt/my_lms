export type StorageBucket = 'lesson-images' | 'lesson-files' | 'course-covers' | 'profile-images'

export interface IStorageService {
  uploadFile(bucket: StorageBucket, path: string, file: File): Promise<string>
  getPublicUrl(bucket: StorageBucket, path: string): string
  deleteFile(bucket: StorageBucket, path: string): Promise<void>
}
