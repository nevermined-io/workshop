import axios from 'axios'
import axiosRetry from 'axios-retry'
import { neverminedNodeUri, filecoinUploadUri } from '../config/config'
import { AssetFile } from '@nevermined-io/catalog-core'

export enum FileType {
  FilecoinID = 'Filecoin',
  Local = 'Local',
}

const handlePostRequest = async (url: string, formData: FormData, retries = 3) => {
  axiosRetry(axios, {
    retries: retries,
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`)
      return retryCount * 2000 // time interval between retries
    },
    retryCondition: () => true, // retry no matter what
  })

  let response

  try {
    response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (e) {
    console.error(e)
    throw e
  }
  return response?.data
}

const uploadFileToFilecoin = async (file: File) => {
  if (file) {
    const form = new FormData()
    form.append('file', file)

    const gatewayUploadUrl = neverminedNodeUri + filecoinUploadUri
    const response = await handlePostRequest(gatewayUploadUrl, form)
    return response.url
  }
}

export const handleAssetFiles = async (assetFiles: AssetFile[]) => {
  for (const assetFile of assetFiles) {
    const isLocalFile = assetFile.type.match(FileType.Local) != null

    if (isLocalFile && assetFile.file) {
      assetFile.filecoin_id = await uploadFileToFilecoin(assetFile.file)
    }
  }
}
