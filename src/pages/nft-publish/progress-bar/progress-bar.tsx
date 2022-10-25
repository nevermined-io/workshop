import React from 'react'
import { BEM } from '@nevermined-io/styles'
import styles from './progress-bar.module.scss'
import { ReactComponent as TickIcon } from '../../../assets/icons/tick.svg'

type ProgressBarProps = {
  currentStep: number
  totalSteps: number
  isProcessComplete?: boolean
}

const b = BEM('progress-bar', styles)

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  isProcessComplete,
}) => {
  return (
    <div className={b()}>
      {[...Array(totalSteps)].map((_, index) => {
        const stepIndex = ++index
        const isStepComplete = currentStep >= stepIndex
        const isActiveStep = currentStep === stepIndex
        const cssModifiers = []

        if (isActiveStep && !isProcessComplete) {
          cssModifiers.push('active')
        } else if (isStepComplete || isProcessComplete) {
          cssModifiers.push('complete')
        }

        return (
          <div key={index} className={b('step')}>
            <div className={b('step-content')}>
              <span className={b('icon', cssModifiers)}>
                <TickIcon />
              </span>
              <span className={b('text', cssModifiers)}>Step {stepIndex}</span>
            </div>
            <div className={b('underline', cssModifiers)} />
          </div>
        )
      })}
    </div>
  )
}
