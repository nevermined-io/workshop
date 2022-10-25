import React, { useCallback, useState } from 'react'
import { AssetService } from '@nevermined-io/catalog-core'
import { BEM, UiFormInput, UiFormTextarea } from '@nevermined-io/styles'
import stepStyles from '../step.module.scss'
import styles from './basic-info-step.module.scss'

const step = BEM('step-container', stepStyles)
const b = BEM('basic-info', styles)

type BasicInfoStepProps = {
  goToNextStep: () => void
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ goToNextStep }) => {
  const { assetPublish, handleChange } = AssetService.useAssetPublish()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleContinueClick = useCallback(
    (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const errors: Record<string, string> = {}

      if (!assetPublish.author) {
        errors.author = 'Author is required'
      }

      if (!assetPublish.name) {
        errors.name = 'Name is required'
      }

      if (!assetPublish.description) {
        errors.description = 'Description is required'
      }

      setErrors(errors)

      if (!Object.keys(errors).length) {
        goToNextStep()
      }
    },
    [goToNextStep],
  )

  return (
    <>
      <div className={step('step-title')}>
        <span className={step('step-title-icon')}>1</span>
        <span className={step('step-title-text')}>Basic Info</span>
      </div>
      <div className={b('form-input')}>
        <div className={b('publish-form')}>
          <UiFormInput
            className={b('publish-form-input')}
            label="Author *"
            inputError={errors.author}
            value={assetPublish.author}
            onChange={(e) => handleChange(e.target.value, 'author')}
            placeholder="Type the author"
          />
        </div>
        <div className={b('publish-form')}>
          <UiFormInput
            className={b('publish-form-input')}
            label="Name *"
            inputError={errors.name}
            value={assetPublish.name}
            onChange={(e) => handleChange(e.target.value, 'name')}
            placeholder="Type a name for the Asset"
            maxLength={40}
          />
        </div>
        <div className={b('publish-form')}>
          <UiFormTextarea
            className={b('publish-form-input')}
            label="Description *"
            inputError={errors.description}
            value={assetPublish.description}
            onChange={(e) => handleChange(e.target.value, 'description')}
            placeholder="Type a description"
          />
        </div>
        <button onClick={handleContinueClick} className={b('button')}>
          Continue
        </button>
      </div>
    </>
  )
}
