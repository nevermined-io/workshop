import React from 'react'
import { toast } from 'react-toastify'
import {
  AssetFile,
  AssetService,
  Catalog,
  FileMetadata,
  getRoyaltyScheme,
  MetaData,
  RoyaltyKind,
} from '@nevermined-io/catalog-core'
import { gatewayAddress, nftAddress } from 'config/config'
import { FileType, handleAssetFiles } from 'utils/file-handler'
import stepStyles from '../step.module.scss'
import styles from './files-step.module.scss'
import { Action, BEM, UiFormInput, UiFormItem } from '@nevermined-io/styles'
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download.svg'
import { ReactComponent as CrossIcon } from '../../../../assets/icons/cross.svg'

const step = BEM('step-container', stepStyles)
const b = BEM('basic-info', styles)

type FilesStepProps = {
  goToPrevStep: () => void
  goToNextStep: () => void
}

export const FilesStep: React.FC<FilesStepProps> = ({ goToPrevStep, goToNextStep }) => {
  const { sdk } = Catalog.useNevermined()
  const { errorAssetMessage, setErrorAssetMessage, assetPublish, setAssetPublish, publishNFT721 } =
    AssetService.useAssetPublish()

  const uploadFiles = async () => {
    const findLocal = assetPublish.assetFiles.find((file) => file.type === FileType.Local)

    if (findLocal) {
      await handleAssetFiles(assetPublish.assetFiles)
    }
  }

  const generateFilesMetadata = () => {
    const files: FileMetadata[] = []

    assetPublish.assetFiles.forEach((assetFile: AssetFile, i: number) => {
      files.push({
        index: i + 1,
        contentType: assetFile.content_type ? assetFile.content_type : '',
        url: assetFile.filecoin_id ? assetFile.filecoin_id : '',
        contentLength: assetFile.size ? assetFile.size : '',
      })
    })

    return files
  }

  const generateMetadata = () => {
    const metadata = {
      curation: {
        rating: 0,
        numVotes: 0,
        isListed: true,
      },
      main: {
        name: assetPublish.name,
        dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        author: assetPublish.author,
        license: 'No License Specified',
        price: String(assetPublish.price),
        datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        type: 'dataset',
        network: assetPublish.network,
        files: generateFilesMetadata(),
      },
      additionalInformation: {
        description: assetPublish.description,
        // categories: [
        //   `ProtocolType:${assetPublish.category}`,
        //   `EventType:${assetPublish.protocol}`,
        //   `Blockchain:${assetPublish.network}`,
        //   `UseCase:defi-datasets`,
        //   `Version:v1`,
        // ],
        blockchain: assetPublish.network,
        version: 'v1',
        source: 'filecoin',
      },
    } as MetaData

    return metadata
  }

  const updateFilesAdded = (assetFile: AssetFile) => {
    const arrayFiles: AssetFile[] = assetPublish.assetFiles
    setAssetPublish({ ...assetPublish, assetFiles: [...arrayFiles, assetFile] })
  }

  const handleNewFile = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target?.files?.length) {
      return
    }

    const file = e.target.files[0]
    const assetFile: AssetFile = {
      type: FileType.Local,
      name: file.name,
      label: file.name,
      size: String(file.size),
      content_type: file.type,
      file: file,
    }
    updateFilesAdded(assetFile)
  }

  const removeFile = (label: string) => {
    const arrayFiles: AssetFile[] = assetPublish.assetFiles

    const indexOfObject = arrayFiles.findIndex((assetFile) => {
      return assetFile.label === label
    })

    if (indexOfObject !== -1) {
      arrayFiles.splice(indexOfObject, 1)
      setAssetPublish({ ...assetPublish, assetFiles: [...arrayFiles] })
    }
  }

  const handleSubmitClick = async () => {
    try {
      await uploadFiles()

      const royaltyAttributes = {
        royaltyKind: RoyaltyKind.Standard,
        scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
        amount: 0,
      }

      publishNFT721({
        nftAddress: nftAddress,
        metadata: generateMetadata(),
        providers: [gatewayAddress],
        royaltyAttributes: royaltyAttributes,
      })
        .then(() => {
          toast.success('Asset published correctly in the Marketplace')
          goToNextStep()
        })
        .catch((error) => {
          if (error.message.includes('Transaction was not mined within 50 blocks')) {
            setErrorAssetMessage(
              'Transaction was not mined within 50 blocks, but it might still be mined. Check later the Published Assets section in your Account',
            )
          }
          toast.error(errorAssetMessage)
        })
    } catch (error: any) {
      setErrorAssetMessage(error.message)
    }
  }

  return (
    <>
      <div className={step('step-title')}>
        <span className={step('step-title-icon')}>3</span>
        <span className={step('step-title-text')}>Asset File</span>
      </div>
      <div className={b('files-step')}>
        <div>
          <UiFormInput
            id="computer"
            className={b('publish-form-input', ['button-only'])}
            type="file"
            label={
              <div className={b('upload-button')}>
                <span className={b('upload-text')}>Upload file</span>
                <DownloadIcon className={b('upload-icon')} />
              </div>
            }
            onChange={handleNewFile}
            placeholder="Select the file"
          />
          {assetPublish.assetFiles.length > 0 && (
            <>
              <div className={b('publish-current-files-container')}>
                {assetPublish.assetFiles.map((assetfile) => (
                  <div className={b('publish-current-files')} key={assetfile.label}>
                    <UiFormItem
                      value={assetfile.label}
                      onClick={() => removeFile(assetfile.label)}
                      action={Action.Remove}
                      actionIcon={(action) => (
                        <>{action === 'remove' && <CrossIcon className={b('remove-icon')} />}</>
                      )}
                      disabled
                      readOnly
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div>
          <div className={b('user-publish-submit-container', ['submit'])}>
            <button type="submit" onClick={goToPrevStep} className={b('button', ['secondary'])}>
              Back
            </button>
            <button onClick={handleSubmitClick} className={b('button')}>
              Publish Asset
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
