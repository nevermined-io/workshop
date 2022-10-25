import React, { useCallback, useEffect, useState } from 'react'
import { BEM } from '@nevermined-io/styles'
import { ProgressBar } from './progress-bar/progress-bar'
import { BasicInfoStep } from './steps/basic-info-step/basic-info-step'
import styles from './nft-publish.module.scss'
import { FilesStep } from './steps/files-step/files-step'
import { AssetService } from '@nevermined-io/catalog-core'

const b = BEM('nft-publish', styles)

type NftPublishProps = unknown

export const NftPublish: React.FC<NftPublishProps> = () => {
  const { setAssetPublish } = AssetService.useAssetPublish()
  const [step, setStep] = useState<number>(1)
  const [isProcessComplete, setIsProcessComplete] = useState(false)

  const handleGoToPrevStep = useCallback(() => {
    setStep((prev) => --prev)
  }, [setStep])

  const handleGoToNextStep = useCallback(() => {
    setStep((prev) => ++prev)
  }, [setStep])

  const handleProcessComplete = useCallback(() => {
    setIsProcessComplete(true)
  }, [])

  const resetValues = () => {
    setAssetPublish({
      name: '',
      author: '',
      description: '',
      type: '',
      category: 'None',
      protocol: 'None',
      network: 'None',
      price: 0,
      assetFiles: [],
    })
  }

  useEffect(() => {
    resetValues()
  }, [])

  return (
    <div className={b()}>
      <h2>Publish new asset</h2>
      <ProgressBar currentStep={step} totalSteps={2} isProcessComplete={isProcessComplete} />
      {step === 1 && <BasicInfoStep goToNextStep={handleGoToNextStep} />}
      {step === 2 && (
        <FilesStep goToPrevStep={handleGoToPrevStep} goToNextStep={handleProcessComplete} />
      )}
    </div>
  )
}
