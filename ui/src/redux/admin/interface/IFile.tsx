import { FileLibraryListItem } from 'react-media-library'

export interface IFileManagerState {
  fileLibraryList?: FileLibraryListItem[]
  isInitRequestSent: boolean
  isInitDataSuccess: boolean
  isCreateSuccess: boolean
	loading: boolean
}
