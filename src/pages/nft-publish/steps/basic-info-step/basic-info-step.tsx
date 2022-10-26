import React, { useCallback, useState } from 'react'
import { AssetService } from '@nevermined-io/catalog-core'
import { BEM, UiFormInput, UiFormTextarea } from '@nevermined-io/styles'
import stepStyles from '../step.module.scss'

const step = BEM('step-container', stepStyles)

type BasicInfoStepProps = {
  currentStep: number
  goToNextStep: () => void
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ currentStep, goToNextStep }) => {
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
    [assetPublish, goToNextStep],
  )

  return (
    <>
      <div className={step('step-title')}>
        <span className={step('step-title-icon')}>{currentStep}</span>
        <span className={step('step-title-text')}>Basic Info</span>
      </div>
      <form className={step('step-form')}>
        <UiFormInput
          className={step('form-input')}
          label="Author *"
          inputError={errors.author}
          value={assetPublish.author}
          onChange={(e) => handleChange(e.target.value, 'author')}
          placeholder="Type the author"
        />
        <UiFormInput
          className={step('form-input')}
          label="Name *"
          inputError={errors.name}
          value={assetPublish.name}
          onChange={(e) => handleChange(e.target.value, 'name')}
          placeholder="Type a name for the Asset"
          maxLength={40}
        />
        <UiFormTextarea
          className={step('form-input')}
          label="Description *"
          inputError={errors.description}
          value={assetPublish.description}
          onChange={(e) => handleChange(e.target.value, 'description')}
          placeholder="Type a description"
        />
        <button onClick={handleContinueClick} className={step('button')}>
          Continue
        </button>
      </form>
    </>
  )
}
